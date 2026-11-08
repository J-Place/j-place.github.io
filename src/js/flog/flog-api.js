// FLOG mockup: the one file that knows where Fitness Log data comes from.
//
// Every function returns a Promise and takes and returns the Fitness Log's
// own field names (EntryID, Date, RawDistance, RawDistanceUnit,
// RawDistanceCourse, DistanceYards, DurationMinutes, Details, plus the
// optional Intensity, Calories and Stroke). The pages (app.js) only ever
// call these functions.
//
// Each is one call to our FLOG API (docs/api/flog.openapi.yaml): the dev
// server and Netlify answer /api/flog/ on the same site; the GitHub Pages
// copy calls the Netlify one. In production, Bonfire replaces this file with
// however their FLOG serves its data, and the pages don't change.
//
// A failed call rejects with { status, problems: [{ field, message }] },
// the API's own error body (status 0 when it couldn't be reached).
window.FlogApi = (function () {
  'use strict';

  var NETLIFY = 'https://usms-mockup.netlify.app';
  var BASE = (location.hostname === 'j-place.github.io' ? NETLIFY : '') + '/api/flog';

  var swimmer = null;
  var empty = false;

  // Each browser gets its own copy of the sample data on the server, under
  // a random id it keeps (in production, the login says who's asking)
  function visitorId() {
    var id = null;
    try {
      id = localStorage.getItem('flog.visitor');
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('flog.visitor', id);
      }
    } catch (e) {
      id = id || 'visitor-' + Math.random().toString(36).slice(2, 12);
    }
    return id;
  }

  function call(method, path, body) {
    var headers = { 'X-Flog-Swimmer': swimmer, 'X-Flog-Visitor': visitorId() };
    if (empty) headers['X-Flog-Empty'] = '1';
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    return fetch(BASE + path, {
      method: method,
      headers: headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    }).then(function (res) {
      if (res.status === 204) return null;
      return res.json().catch(function () { return null; }).then(function (data) {
        if (res.ok) return data;
        throw { status: res.status, problems: (data && data.problems) || [{ field: null, message: 'Something went wrong. Try again.' }] };
      });
    }, function () {
      throw { status: 0, problems: [{ field: null, message: 'We couldn’t reach the Fitness Log. Check your connection and try again.' }] };
    });
  }

  function query(params) {
    var q = Object.keys(params).filter(function (k) { return params[k] != null && params[k] !== ''; })
      .map(function (k) { return k + '=' + encodeURIComponent(params[k]); });
    return q.length ? '?' + q.join('&') : '';
  }

  return {
    // Who's asking, before any call: the persona, and whether to show the
    // first-time (empty) state
    use: function (swimmerId, options) {
      swimmer = swimmerId;
      empty = !!(options && options.empty);
    },

    // Swims from `from` to `to` (YYYY-MM-DD, both included), oldest first.
    // GET /api/flog/entries?from=&to=[&course=]
    getEntries: function (q) {
      return call('GET', '/entries' + query({ from: q.from, to: q.to, course: q.course }));
    },

    // The list: newest first, `limit` swims before `before` (not included),
    // never splitting a day. GET /api/flog/entries?limit=&before=
    getEntriesPage: function (q) {
      return call('GET', '/entries' + query({ limit: q.limit || 20, before: q.before }));
    },

    // GET /api/flog/entries/{EntryID}
    getEntry: function (id) {
      return call('GET', '/entries/' + encodeURIComponent(id));
    },

    // Logs a swim (no EntryID) or changes one. The API sets EntryID and
    // DistanceYards. POST /api/flog/entries, PUT /api/flog/entries/{EntryID}
    saveEntry: function (entry) {
      return entry.EntryID != null
        ? call('PUT', '/entries/' + encodeURIComponent(entry.EntryID), entry)
        : call('POST', '/entries', entry);
    },

    // DELETE /api/flog/entries/{EntryID}
    deleteEntry: function (id) {
      return call('DELETE', '/entries/' + encodeURIComponent(id));
    },

    // The month and year `date` falls in, and lifetime, each
    // { NumSessions, TotalMinutes, TotalYards }, plus firstLogDate.
    // GET /api/flog/totals?date=
    getTotals: function (date) {
      return call('GET', '/totals' + query({ date: date }));
    },

    // GET /api/flog/preferences
    getPreferences: function () {
      return call('GET', '/preferences');
    },

    // PUT /api/flog/preferences
    savePreferences: function (prefs) {
      return call('PUT', '/preferences', prefs);
    },

    // Back to the sample data. POST /api/flog/reset (mockup only)
    reset: function () {
      return call('POST', '/reset');
    }
  };
})();
