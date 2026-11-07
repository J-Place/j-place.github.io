// FLOG mockup: the one file that knows where Fitness Log data comes from.
//
// Every function returns a Promise, the way a call to an API does, and takes
// and returns the Fitness Log's own field names (EntryID, Date, RawDistance,
// RawDistanceUnit, RawDistanceCourse, DistanceYards, DurationMinutes, Details,
// plus the optional Intensity, Calories and Stroke). The pages (app.js) only
// ever call these functions.
//
// Stage 1 (now): answers from the synthetic seed (seed-data.js), with each
// visitor's changes kept in their own browser (localStorage, per persona).
// Stage 2: each function becomes a fetch() to our own API (/api/flog/...,
// docs/api/flog.openapi.yaml), and nothing else changes. In production,
// Bonfire replaces this file with however their FLOG serves its data.
//
// A failed call rejects with { status, problems }, as the API's 400s will.
window.FlogApi = (function () {
  'use strict';

  var COURSES = ['SCY', 'SCM', 'LCM', 'OW', 'Other'];
  var UNITS = ['Y', 'M', 'mi'];
  var VIEWS = ['week', 'month'];
  var YARDS_PER = { Y: 1, M: 1 / 0.9144, mi: 1760 };
  var DEFAULT_PREFERENCES = {
    WorkoutsPublic: 0,
    MeasurementsPublic: 0,
    UserDefaultView: 'week',
    UserDefaultCourse: 'SCY',
    UserDefaultDistance: 'Y'
  };
  // A short wait, so the pages' loading states get used as they will be
  var LATENCY_MS = 120;

  var swimmer = null;
  var empty = false;
  var state = null;

  // ---------- Dates (plain calendar dates, never shifted by time zones) ----------

  function parseDate(s) {
    var p = s.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function today() {
    return isoDate(new Date());
  }
  function daysBetween(a, b) {
    return Math.round((parseDate(b) - parseDate(a)) / 864e5);
  }
  function addDays(s, n) {
    var d = parseDate(s);
    d.setDate(d.getDate() + n);
    return isoDate(d);
  }

  // ---------- State ----------

  function storageKey() {
    return 'flog.v1.' + swimmer + (empty ? '.empty' : '');
  }

  // The seed, its dates moved forward so its latest swim is yesterday
  function fromSeed() {
    var seed = window.FLOG_SEED || { anchor: today(), swimmers: {} };
    var mine = empty ? null : seed.swimmers[swimmer];
    if (!mine) return { preferences: Object.assign({}, DEFAULT_PREFERENCES), entries: [], prior: null, firstLogDate: null };
    var shift = daysBetween(seed.anchor, today());
    return {
      preferences: Object.assign({}, DEFAULT_PREFERENCES, mine.preferences),
      entries: mine.entries.map(function (e) { return Object.assign({}, e, { Date: addDays(e.Date, shift) }); }),
      prior: mine.prior || null,
      firstLogDate: mine.firstLogDate || null
    };
  }

  function load() {
    if (state) return state;
    try {
      state = JSON.parse(localStorage.getItem(storageKey()));
    } catch (e) {}
    if (!state) state = fromSeed();
    return state;
  }

  function save() {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(state));
    } catch (e) {}
  }

  function answer(value) {
    var copy = value == null ? value : JSON.parse(JSON.stringify(value));
    return new Promise(function (resolve) { setTimeout(function () { resolve(copy); }, LATENCY_MS); });
  }

  function fail(status, problems) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () { reject({ status: status, problems: problems }); }, LATENCY_MS);
    });
  }

  function byDateDesc(a, b) {
    return a.Date < b.Date ? 1 : a.Date > b.Date ? -1 : b.EntryID - a.EntryID;
  }

  // ---------- Validation (moves to the server in Stage 2) ----------

  function isNumber(v) {
    return typeof v === 'number' && isFinite(v);
  }

  // Returns the problems with an entry, each { field, message }; empty when valid
  function entryProblems(e) {
    var problems = [];
    var add = function (field, message) { problems.push({ field: field, message: message }); };
    if (typeof e.Date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(e.Date)) add('Date', 'Enter the date of your swim.');
    else if (e.Date > today()) add('Date', 'The date can’t be in the future.');
    if (COURSES.indexOf(e.RawDistanceCourse) < 0) add('RawDistanceCourse', 'Choose where you swam.');
    if (!isNumber(e.RawDistance) || e.RawDistance <= 0) add('RawDistance', 'Enter how far you swam.');
    else if (e.RawDistance * (YARDS_PER[e.RawDistanceUnit] || 1) > 100000) add('RawDistance', 'That’s more than 100,000 yards. Check the distance and unit.');
    if (UNITS.indexOf(e.RawDistanceUnit) < 0) add('RawDistanceUnit', 'Choose yards, meters or miles.');
    if (!isNumber(e.DurationMinutes) || e.DurationMinutes < 1 || e.DurationMinutes > 1440 || Math.round(e.DurationMinutes) !== e.DurationMinutes) add('DurationMinutes', 'Enter your time in whole minutes, 1 to 1440.');
    if (e.Details != null && typeof e.Details !== 'string') add('Details', 'Comments must be text.');
    if (e.Intensity != null && (!isNumber(e.Intensity) || e.Intensity < 1 || e.Intensity > 10 || Math.round(e.Intensity) !== e.Intensity)) add('Intensity', 'Intensity is 1 to 10.');
    if (e.Calories != null && (!isNumber(e.Calories) || e.Calories < 0 || e.Calories > 20000)) add('Calories', 'Calories must be a number from 0 to 20,000.');
    if (e.Stroke != null && typeof e.Stroke !== 'string') add('Stroke', 'Stroke must be text.');
    return problems;
  }

  // Keeps only the fields an entry has, and works out DistanceYards
  function cleanEntry(input) {
    var e = {
      Date: input.Date,
      RawDistance: input.RawDistance,
      RawDistanceUnit: input.RawDistanceUnit,
      RawDistanceCourse: input.RawDistanceCourse,
      DurationMinutes: input.DurationMinutes,
      Details: input.Details || ''
    };
    ['Intensity', 'Calories', 'Stroke'].forEach(function (k) {
      if (input[k] != null && input[k] !== '') e[k] = input[k];
    });
    return e;
  }

  // ---------- Totals ----------

  function sum(entries) {
    return entries.reduce(function (t, e) {
      t.NumSessions += 1;
      t.TotalMinutes += e.DurationMinutes;
      t.TotalYards += e.DistanceYards;
      return t;
    }, { NumSessions: 0, TotalMinutes: 0, TotalYards: 0 });
  }

  // ---------- The calls ----------

  return {
    // Who's asking, before any call: the persona, and whether to show the
    // first-time (empty) state. In production the login says who's asking.
    use: function (swimmerId, options) {
      swimmer = swimmerId;
      empty = !!(options && options.empty);
      state = null;
    },

    // Swims from `from` to `to` (YYYY-MM-DD, both included), oldest first.
    // Optional `course` filter. GET /api/flog/entries?from=&to=[&course=]
    getEntries: function (q) {
      var entries = load().entries.filter(function (e) {
        return e.Date >= q.from && e.Date <= q.to && (!q.course || e.RawDistanceCourse === q.course);
      });
      entries.sort(function (a, b) { return byDateDesc(b, a); });
      return answer(entries);
    },

    // The list view: newest first, `limit` swims before the `before` date
    // (not included), never splitting a day across pages.
    // GET /api/flog/entries?limit=&before=
    getEntriesPage: function (q) {
      var limit = q.limit || 20;
      var all = load().entries.filter(function (e) { return !q.before || e.Date < q.before; }).sort(byDateDesc);
      var page = all.slice(0, limit);
      var last = page.length ? page[page.length - 1].Date : null;
      while (page.length < all.length && all[page.length].Date === last) page.push(all[page.length]);
      return answer({ entries: page, hasMore: page.length < all.length, nextBefore: last });
    },

    // One swim. GET /api/flog/entries/{EntryID}
    getEntry: function (id) {
      var e = load().entries.filter(function (x) { return x.EntryID === Number(id); })[0];
      return e ? answer(e) : fail(404, [{ field: null, message: 'We couldn’t find that swim.' }]);
    },

    // Logs a new swim (no EntryID) or changes one (with EntryID). The data
    // source sets EntryID and DistanceYards. POST /api/flog/entries,
    // PUT /api/flog/entries/{EntryID}
    saveEntry: function (input) {
      var s = load();
      var entry = cleanEntry(input);
      var problems = entryProblems(entry);
      if (problems.length) return fail(400, problems);
      entry.DistanceYards = Math.round(entry.RawDistance * YARDS_PER[entry.RawDistanceUnit] * 100) / 100;
      if (input.EntryID != null) {
        var i = s.entries.map(function (x) { return x.EntryID; }).indexOf(Number(input.EntryID));
        if (i < 0) return fail(404, [{ field: null, message: 'We couldn’t find that swim.' }]);
        entry.EntryID = s.entries[i].EntryID;
        s.entries[i] = entry;
      } else {
        entry.EntryID = s.entries.reduce(function (max, x) { return Math.max(max, x.EntryID); }, 0) + 1;
        s.entries.push(entry);
      }
      save();
      return answer(entry);
    },

    // DELETE /api/flog/entries/{EntryID}
    deleteEntry: function (id) {
      var s = load();
      var before = s.entries.length;
      s.entries = s.entries.filter(function (x) { return x.EntryID !== Number(id); });
      if (s.entries.length === before) return fail(404, [{ field: null, message: 'We couldn’t find that swim.' }]);
      save();
      return answer(null);
    },

    // The month and year `date` falls in, and lifetime, each
    // { NumSessions, TotalMinutes, TotalYards }, plus firstLogDate.
    // GET /api/flog/totals?date=
    getTotals: function (date) {
      var s = load();
      var d = date || today();
      var lifetime = sum(s.entries);
      if (s.prior) {
        lifetime.NumSessions += s.prior.NumSessions;
        lifetime.TotalMinutes += s.prior.TotalMinutes;
        lifetime.TotalYards += s.prior.TotalYards;
      }
      var first = s.firstLogDate || s.entries.map(function (e) { return e.Date; }).sort()[0] || null;
      return answer({
        month: sum(s.entries.filter(function (e) { return e.Date.slice(0, 7) === d.slice(0, 7) && e.Date <= d; })),
        year: sum(s.entries.filter(function (e) { return e.Date.slice(0, 4) === d.slice(0, 4) && e.Date <= d; })),
        lifetime: lifetime,
        firstLogDate: first
      });
    },

    // GET /api/flog/preferences
    getPreferences: function () {
      return answer(load().preferences);
    },

    // PUT /api/flog/preferences
    savePreferences: function (input) {
      var p = {
        WorkoutsPublic: input.WorkoutsPublic ? 1 : 0,
        MeasurementsPublic: input.MeasurementsPublic ? 1 : 0,
        UserDefaultView: input.UserDefaultView,
        UserDefaultCourse: input.UserDefaultCourse,
        UserDefaultDistance: input.UserDefaultDistance
      };
      var problems = [];
      if (VIEWS.indexOf(p.UserDefaultView) < 0) problems.push({ field: 'UserDefaultView', message: 'Choose week or month.' });
      if (COURSES.indexOf(p.UserDefaultCourse) < 0) problems.push({ field: 'UserDefaultCourse', message: 'Choose a course.' });
      if (UNITS.indexOf(p.UserDefaultDistance) < 0) problems.push({ field: 'UserDefaultDistance', message: 'Choose yards, meters or miles.' });
      if (problems.length) return fail(400, problems);
      load().preferences = p;
      save();
      return answer(p);
    },

    // Back to the seed data. POST /api/flog/reset (mockup only)
    reset: function () {
      try {
        localStorage.removeItem(storageKey());
      } catch (e) {}
      state = null;
      return answer(null);
    }
  };
})();
