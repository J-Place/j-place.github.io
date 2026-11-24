// FLOG mockup: the pages. Each repeated thing has one render function that
// takes data and returns its HTML (renderWorkout, renderDay, renderWeek,
// renderMonth, renderTotals, renderWorkoutForm, renderEvents,
// renderPreferences):
// each is meant to become one React component. Data only ever comes from
// flog-api.js (window.FlogApi), in the Fitness Log's own field names.
(function () {
  'use strict';

  var root = document.querySelector('[data-flog-page]');
  if (!root) return;
  var app = root.querySelector('[data-flog-app]');
  var PAGE = root.getAttribute('data-flog-page');
  // FLOG's own URL, from the page (snapshots rewrite it)
  var ROOT = root.getAttribute('data-flog-root');
  var params = new URLSearchParams(location.search);
  var api = window.FlogApi;

  // ---------- Who's visiting (the ?user= persona, as current-user.js) ----------

  var USERS = {};
  try {
    USERS = JSON.parse(document.getElementById('site-users-data').textContent).users;
  } catch (e) {}
  function swimmerId() {
    var id = params.get('user');
    try {
      if (!(id && USERS[id])) id = sessionStorage.getItem('activeUser');
    } catch (e) {}
    return id && USERS[id] ? id : root.getAttribute('data-default-persona');
  }
  var SWIMMER = swimmerId();
  var USER = USERS[SWIMMER] || {};
  var EMPTY = params.get('empty') === '1';
  api.use(SWIMMER, { empty: EMPTY });

  // ---------- Words ----------

  var COURSES = [
    { id: 'SCY', label: 'SCY', name: 'Short course yards' },
    { id: 'SCM', label: 'SCM', name: 'Short course meters' },
    { id: 'LCM', label: 'LCM', name: 'Long course meters' },
    { id: 'OW', label: 'Open water', name: 'Open water' },
    { id: 'Other', label: 'Other', name: 'Other' }
  ];
  var UNITS = [
    { id: 'Y', label: 'yd', name: 'Yards' },
    { id: 'M', label: 'm', name: 'Meters' },
    { id: 'mi', label: 'mi', name: 'Miles' },
    { id: 'km', label: 'km', name: 'Kilometers' }
  ];
  // Totals' unit (UserDefaultDistance): a swimmer's, so no km
  var TOTALS_UNITS = UNITS.slice(0, 3);
  // The legacy FLOG's activities, by its own ids (ActivityType), Swimming
  // first and the rest A to Z, as api/flog/core.mjs. `units`: the distance
  // units an activity offers (its distance is optional); none, time only.
  var SWIMMING = 1;
  // icon: its Lucide icon (Icons.njk's act- symbols), for the month on phones
  var ACTIVITIES = [
    { id: 1, name: 'Swimming', icon: 'waves' },
    { id: 25, name: 'Barre', icon: 'music-2' },
    { id: 19, name: 'Canoeing', units: ['M', 'km', 'mi'], icon: 'sailboat' },
    { id: 18, name: 'Cross-Country Skiing', units: ['mi', 'km'], icon: 'snowflake' },
    { id: 5, name: 'Cycling', units: ['mi', 'km'], icon: 'bike' },
    { id: 12, name: 'Dancing', icon: 'music' },
    { id: 17, name: 'Downhill Skiing', icon: 'mountain-snow' },
    { id: 13, name: 'Elliptical', icon: 'orbit' },
    { id: 24, name: 'Hiking', units: ['mi', 'km'], icon: 'mountain' },
    { id: 20, name: 'Kayaking', units: ['M', 'km', 'mi'], icon: 'sailboat' },
    { id: 15, name: 'Lawn Mowing', icon: 'sprout' },
    { id: 9, name: 'Other', icon: 'activity' },
    { id: 8, name: 'Pilates', icon: 'accessibility' },
    { id: 22, name: 'Rowing', units: ['M', 'km', 'mi'], icon: 'ship' },
    { id: 3, name: 'Running', units: ['mi', 'km'], icon: 'footprints' },
    { id: 16, name: 'Snowshoeing', units: ['mi', 'km'], icon: 'trees' },
    { id: 6, name: 'Spinning', icon: 'disc-3' },
    { id: 14, name: 'Stairs', icon: 'chevrons-up' },
    { id: 21, name: 'Stand-Up Paddleboarding', units: ['M', 'km', 'mi'], icon: 'sailboat' },
    { id: 23, name: 'Steps', icon: 'step-forward' },
    { id: 4, name: 'Walking', units: ['mi', 'km'], icon: 'person-standing' },
    { id: 2, name: 'Weights', icon: 'dumbbell' },
    { id: 7, name: 'Yoga', icon: 'flower-2' }
  ];
  function activityOf(id) {
    return ACTIVITIES.filter(function (a) { return a.id === id; })[0] || ACTIVITIES[0];
  }
  // An entry without an ActivityType is a swim (it was logged before
  // other activities, or by another tool)
  function isSwim(e) {
    return (e.ActivityType == null ? SWIMMING : e.ActivityType) === SWIMMING;
  }
  var STROKES = ['Free', 'Back', 'Breast', 'Fly', 'IM', 'Mixed'];
  var INTENSITY_WORDS = { 1: 'Very easy', 2: 'Very easy', 3: 'Easy', 4: 'Easy', 5: 'Moderate', 6: 'Moderate', 7: 'Hard', 8: 'Hard', 9: 'Very hard', 10: 'Max' };
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function courseOf(id) {
    return COURSES.filter(function (c) { return c.id === id; })[0] || { id: id, label: id, name: id };
  }
  function unitOf(id) {
    return UNITS.filter(function (u) { return u.id === id; })[0] || UNITS[0];
  }

  // ---------- Helpers ----------

  // Swimmers type their own comments: never put them into HTML unescaped
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function icon(name, cls) {
    return '<svg class="flog-icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#flog-i-' + name + '"></use></svg>';
  }

  // Dates are plain calendar dates ('2026-10-28'), built as local dates so a
  // time zone never moves one to the day before
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
  function addDays(s, n) {
    var d = parseDate(s);
    d.setDate(d.getDate() + n);
    return isoDate(d);
  }
  function validDate(s) {
    return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && isoDate(parseDate(s)) === s;
  }
  function weekStart(s) {
    return addDays(s, -parseDate(s).getDay()); // weeks start on Sunday
  }
  function monthStart(s) {
    return s.slice(0, 8) + '01';
  }
  function monthEnd(s) {
    var d = parseDate(monthStart(s));
    return isoDate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  }
  function addMonths(s, n) {
    var d = parseDate(monthStart(s));
    return isoDate(new Date(d.getFullYear(), d.getMonth() + n, 1));
  }
  function shortDate(s) {
    var d = parseDate(s);
    return MONTH_NAMES[d.getMonth()].slice(0, 3) + ' ' + d.getDate();
  }
  function longDate(s) {
    var d = parseDate(s);
    return DAY_NAMES[d.getDay()] + ', ' + MONTH_NAMES[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function monthLabel(s) {
    var d = parseDate(s);
    return MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear();
  }
  function weekLabel(start) {
    var end = addDays(start, 6);
    var a = parseDate(start);
    var b = parseDate(end);
    if (a.getFullYear() !== b.getFullYear()) return shortDate(start) + ', ' + a.getFullYear() + ' – ' + shortDate(end) + ', ' + b.getFullYear();
    if (a.getMonth() !== b.getMonth()) return shortDate(start) + ' – ' + shortDate(end) + ', ' + b.getFullYear();
    return shortDate(start) + ' – ' + b.getDate() + ', ' + b.getFullYear();
  }

  function number(n, digits) {
    return n.toLocaleString('en-US', { minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 });
  }

  // Distances: totals and summaries in the swimmer's Totals default unit
  // (UserDefaultDistance), from DistanceYards; each workout in the unit it
  // was logged in (formatRaw)
  function distanceIn(yards, unit) {
    if (unit === 'M') return yards * 0.9144;
    if (unit === 'mi') return yards / 1760;
    if (unit === 'km') return yards * 0.0009144;
    return yards;
  }
  function distanceText(n, unit) {
    return unit === 'mi' || unit === 'km' ? number(n, n >= 100 ? 1 : 2).replace(/\.?0+$/, '') : number(Math.round(n));
  }
  function formatDistance(yards, unit, options) {
    var text = distanceText(distanceIn(yards, unit), unit);
    return options && options.bare ? text : text + ' ' + unitOf(unit).label;
  }
  function formatRaw(e) {
    return e.RawDistance != null ? distanceText(e.RawDistance, e.RawDistanceUnit) + ' ' + unitOf(e.RawDistanceUnit).label : '';
  }

  function formatDuration(minutes) {
    var h = Math.floor(minutes / 60);
    var m = Math.round(minutes % 60);
    if (h >= 100) return number(Math.round(minutes / 60)) + ' h';
    if (!h) return m + ' min';
    return m ? h + ' h ' + m + ' min' : h + ' h';
  }

  // Swims and their distance; other workouts counted apart (their
  // distances are other sports'); time for all
  function totalOf(entries) {
    return entries.reduce(function (t, e) {
      if (isSwim(e)) {
        t.swims += 1;
        t.yards += e.DistanceYards;
      } else {
        t.other += 1;
      }
      t.minutes += e.DurationMinutes;
      return t;
    }, { swims: 0, yards: 0, other: 0, minutes: 0 });
  }
  function plural(n, one, many) {
    return number(n) + ' ' + (n === 1 ? one : many);
  }

  function summaryText(entries, prefs, period) {
    var t = totalOf(entries);
    if (!t.swims && !t.other) return 'No workouts ' + period;
    var parts = [];
    if (t.swims) parts.push(plural(t.swims, 'swim', 'swims'), formatDistance(t.yards, prefs.UserDefaultDistance));
    if (t.other) parts.push(plural(t.other, 'other workout', 'other workouts'));
    parts.push(formatDuration(t.minutes));
    return parts.join(' · ');
  }

  function homeUrl(view, date) {
    var q = [];
    if (view) q.push('view=' + view);
    if (date) q.push('date=' + date);
    if (EMPTY) q.push('empty=1');
    return ROOT + (q.length ? '?' + q.join('&') : '');
  }
  function pageUrl(page, query) {
    var q = Object.keys(query || {}).map(function (k) { return k + '=' + encodeURIComponent(query[k]); });
    if (EMPTY) q.push('empty=1');
    return ROOT + page + '/' + (q.length ? '?' + q.join('&') : '');
  }

  // A message for the next page ("Swim logged."), shown once
  function setFlash(text) {
    try {
      sessionStorage.setItem('flog.flash', text);
    } catch (e) {}
  }
  function takeFlash() {
    var text = null;
    try {
      text = sessionStorage.getItem('flog.flash');
      sessionStorage.removeItem('flog.flash');
    } catch (e) {}
    return text;
  }

  // ---------- Render functions ----------

  // One workout: on the calendar, on a day. A swim leads with its distance
  // and course; another activity with its name and any distance.
  function renderWorkout(w) {
    var swim = isSwim(w);
    var course = courseOf(w.RawDistanceCourse);
    var meta = [];
    meta.push(esc(formatDuration(w.DurationMinutes)));
    if (w.Intensity) meta.push('Intensity ' + w.Intensity + ' <span class="flog-swim__word">' + esc(INTENSITY_WORDS[w.Intensity]) + '</span>');
    if (w.Stroke) meta.push(esc(w.Stroke));
    if (w.HeartRate) meta.push('Avg ' + number(w.HeartRate) + ' bpm');
    if (w.Weight) meta.push(esc(String(w.Weight)) + ' lb');
    if (w.Calories != null) meta.push(number(w.Calories) + ' cal');
    var top = swim
      ? '<span class="flog-swim__distance">' + esc(formatRaw(w)) + '</span>' +
        '<span class="flog-swim__course" title="' + esc(course.name) + '">' + esc(course.id === 'OW' ? 'OW' : course.label) + '</span>'
      : '<span class="flog-swim__distance">' + esc(activityOf(w.ActivityType).name) + '</span>' +
        (w.RawDistance != null ? '<span class="flog-swim__amount">' + esc(formatRaw(w)) + '</span>' : '');
    return '<li class="flog-swim' + (swim ? '' : ' flog-swim--other') + '">' +
      '<a class="flog-swim__link" href="' + pageUrl('edit-swim', { id: w.EntryID }) + '">' +
        '<span class="flog-swim__top">' + top + icon('pencil', 'flog-swim__edit') + '</span>' +
        '<span class="flog-swim__meta">' + meta.join('<span aria-hidden="true"> · </span>') + '</span>' +
        (w.Details ? '<span class="flog-swim__details">' + esc(w.Details) + '</span>' : '') +
        '<span class="visually-hidden">Edit this activity</span>' +
      '</a>' +
    '</li>';
  }

  // One day: its workouts, or a way to log one
  function renderDay(date, workouts, options) {
    var isToday = date === today();
    var past = date <= today();
    var heading = options && options.long
      ? '<h3 class="flog-day__title">' + esc(longDate(date)) + (isToday ? ' <span class="flog-badge">Today</span>' : '') + '</h3>'
      : '<h3 class="flog-day__title"><span class="flog-day__name">' + DAY_NAMES[parseDate(date).getDay()].slice(0, 3) + '</span> <span class="flog-day__date">' + esc(shortDate(date)) + '</span>' + (isToday ? ' <span class="flog-badge">Today</span>' : '') + '</h3>';
    var body = workouts.length
      ? '<ul class="flog-day__swims">' + workouts.map(renderWorkout).join('') + '</ul>'
      : '<p class="flog-day__none">' + (past ? 'No activity' : '') + '</p>';
    var add = past
      ? '<a class="flog-day__add" href="' + pageUrl('log-swim', { date: date }) + '">' + icon('plus') + 'Log an activity' + '<span class="visually-hidden"> on ' + esc(longDate(date)) + '</span></a>'
      : '';
    return '<li class="flog-day' + (isToday ? ' is-today' : '') + (workouts.length ? ' has-swims' : '') + (past ? '' : ' is-future') + '">' +
      '<div class="flog-day__head">' + heading + add + '</div>' + body +
    '</li>';
  }

  function workoutsOn(entries, date) {
    return entries.filter(function (e) { return e.Date === date; });
  }

  // A week, Sunday to Saturday
  function renderWeek(start, entries) {
    var days = [];
    for (var i = 0; i < 7; i++) {
      var date = addDays(start, i);
      days.push(renderDay(date, workoutsOn(entries, date)));
    }
    return '<ol class="flog-week">' + days.join('') + '</ol>';
  }

  // A month as a calendar; pick a day to see its workouts below. Each
  // swim's distance is in the Totals default unit; another workout is a dot.
  // A month cell's amount: a swim in the Totals unit, another activity in
  // its own; null when it has no distance. { number: '3,000', unit: 'yd' }
  function monthAmount(w, unit) {
    if (isSwim(w)) return { number: formatDistance(w.DistanceYards, unit, { bare: true }), unit: unitOf(unit).label };
    if (w.RawDistance == null || !w.RawDistance) return null;
    return { number: distanceText(w.RawDistance, w.RawDistanceUnit), unit: unitOf(w.RawDistanceUnit).label };
  }

  function renderMonth(anyDay, entries, prefs, selected) {
    var first = monthStart(anyDay);
    var last = monthEnd(anyDay);
    var lead = parseDate(first).getDay();
    var unit = prefs.UserDefaultDistance;
    var cells = [];
    for (var i = 0; i < lead; i++) cells.push('<td class="flog-month__blank"></td>');
    for (var date = first; date <= last; date = addDays(date, 1)) {
      var workouts = workoutsOn(entries, date);
      var said = workouts.map(function (w) {
        var amount = monthAmount(w, unit);
        return activityOf(w.ActivityType || SWIMMING).name + (amount ? ' ' + amount.number + ' ' + amount.unit : '');
      });
      var label = longDate(date) + ', ' + (said.length ? said.join(', ') : 'no activity');
      cells.push('<td>' +
        '<button type="button" class="flog-month__day' + (date === today() ? ' is-today' : '') + (workouts.length ? ' has-swims' : '') + '" data-day="' + date + '" aria-pressed="' + (date === selected) + '" aria-label="' + esc(label) + '"' + (date > today() ? ' disabled' : '') + '>' +
          '<span class="flog-month__num">' + parseDate(date).getDate() + '</span>' +
          // Each activity, stacked: its name then its distance (since
          // 2026-11-23; on phones its icon for the name). Swims in the
          // Totals unit, others in their own; time-only ones by name alone
          (workouts.length ? '<span class="flog-month__dists">' + workouts.map(function (w) {
            var a = activityOf(w.ActivityType || SWIMMING);
            var amount = monthAmount(w, unit);
            return '<span class="flog-month__dist' + (isSwim(w) ? '' : ' flog-month__dist--other') + '">' +
              icon('act-' + a.icon, 'flog-month__icon') +
              '<span class="flog-month__name">' + esc(a.name) + '</span>' +
              (amount ? '<span class="flog-month__amount">' + esc(amount.number) + (isSwim(w) ? '' : '<span class="flog-month__unit"> ' + esc(amount.unit) + '</span>') + '</span>' : '') +
            '</span>';
          }).join('') + '</span>' : '') +
        '</button>' +
      '</td>');
    }
    while (cells.length % 7) cells.push('<td class="flog-month__blank"></td>');
    var rows = [];
    for (var r = 0; r < cells.length; r += 7) rows.push('<tr>' + cells.slice(r, r + 7).join('') + '</tr>');
    var head = DAY_NAMES.map(function (d) { return '<th scope="col" abbr="' + d + '">' + d.slice(0, 1) + '<span class="flog-month__dow-rest">' + d.slice(1, 3) + '</span></th>'; }).join('');
    var pick = selected && selected >= first && selected <= last ? selected : null;
    return '<table class="flog-month">' +
        '<caption class="visually-hidden">' + esc(monthLabel(first)) + '. Swim distances in ' + esc(unitOf(unit).name.toLowerCase()) + '. Choose a day to see its workouts.</caption>' +
        '<thead><tr>' + head + '</tr></thead><tbody>' + rows.join('') + '</tbody>' +
      '</table>' +
      (pick ? '<ul class="flog-week flog-month__picked" aria-live="polite">' + renderDay(pick, workoutsOn(entries, pick), { long: true }) + '</ul>' : '');
  }

  // This month, this year, lifetime: swims only, or all workouts (swims
  // and other workouts, side by side)
  function renderTotals(totals, prefs, show) {
    var unit = prefs.UserDefaultDistance;
    var all = show === 'all';
    var d = parseDate(today());
    var periods = [
      { key: 'month', title: 'This month', sub: MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear() },
      { key: 'year', title: 'This year', sub: String(d.getFullYear()) },
      { key: 'lifetime', title: 'Lifetime', sub: totals.firstLogDate ? 'Since ' + MONTH_NAMES[parseDate(totals.firstLogDate).getMonth()] + ' ' + parseDate(totals.firstLogDate).getDate() + ', ' + parseDate(totals.firstLogDate).getFullYear() : 'No workouts yet' }
    ];
    return '<div class="flog-seg flog-totals__show" role="group" aria-label="Show totals for">' +
        '<button type="button" data-show="swims" aria-pressed="' + !all + '">Swims</button>' +
        '<button type="button" data-show="all" aria-pressed="' + all + '">All workouts</button>' +
      '</div>' +
      '<ul class="flog-totals">' + periods.map(function (p) {
        var t = totals[p.key];
        var other = t.Other || { NumSessions: 0, TotalMinutes: 0 };
        var stats = all
          ? '<div><dt>Swims</dt><dd>' + number(t.NumSessions) + '</dd></div>' +
            '<div><dt>Other workouts</dt><dd>' + number(other.NumSessions) + '</dd></div>' +
            '<div><dt>Time</dt><dd>' + esc(formatDuration(t.TotalMinutes + other.TotalMinutes)) + '</dd></div>'
          : '<div><dt>Swims</dt><dd>' + number(t.NumSessions) + '</dd></div>' +
            '<div><dt>Time</dt><dd>' + esc(formatDuration(t.TotalMinutes)) + '</dd></div>' +
            '<div><dt>Average swim</dt><dd>' + (t.NumSessions ? esc(formatDistance(t.TotalYards / t.NumSessions, unit)) : '–') + '</dd></div>';
        return '<li class="flog-total">' +
          '<h2 class="flog-total__title">' + esc(p.title) + ' <span class="flog-total__sub">' + esc(p.sub) + '</span></h2>' +
          (all
            ? '<p class="flog-total__distance">' + number(t.NumSessions + other.NumSessions) + ' <span class="flog-total__unit">' + (t.NumSessions + other.NumSessions === 1 ? 'workout' : 'workouts') + '</span></p>'
            : '<p class="flog-total__distance">' + esc(formatDistance(t.TotalYards, unit, { bare: true })) + ' <span class="flog-total__unit">' + esc(unitOf(unit).name.toLowerCase()) + ' swum</span></p>') +
          '<dl class="flog-total__stats">' + stats + '</dl>' +
        '</li>';
      }).join('') + '</ul>';
  }

  // The virtual events: Go the Distance (a yearly goal in miles that this
  // year's swims count toward) and the Virtual Championships. Signed up:
  // where you stand; not: what it is and a way in.
  // Events (since 2026-11-23): this year's virtual events, each with Sign up,
  // Remove yourself (after a confirm) and Re-enter, then past years'
  // results, the latest five and Show more. view: GET /events' { events, past }.
  var PAST_SHOWN = 5;
  var EVENT_PITCH = {
    gtd: function (year) { return 'Set your own distance goal for ' + year + ' and watch your logged swims add up toward it.'; },
    nile: function (year, e) { return 'Swim the length of the Nile, ' + number(e.GoalMiles) + ' miles, in ' + year + '.'; },
    atlantic: function (year, e) { return 'Swim across the Atlantic, ' + number(e.GoalMiles) + ' miles, in ' + year + '.'; },
    world: function (year, e) { return 'Swim around the world, ' + number(e.GoalMiles) + ' miles, in ' + year + '.'; },
    vc: function () { return 'Swim the championship events in your own pool or open water during the event window, then submit your results to see how you place.'; }
  };

  function renderEvent(e, year) {
    var distance = e.GoalMiles !== undefined;
    var miles = distance ? e.YearYards / 1760 : 0;
    var body;
    if (e.SignedUp) {
      body = '<p class="flog-event__status">' + icon('check-circle') + 'You’re signed up for ' + year + '.</p>';
      if (distance) {
        var share = Math.min(1, miles / e.GoalMiles);
        body += '<p class="flog-event__progress"><strong>' + esc(distanceText(miles, 'mi')) + '</strong> of ' + number(e.GoalMiles) + ' miles</p>' +
          '<div class="flog-meter" role="img" aria-label="' + Math.round(share * 100) + '% of your goal"><span class="flog-meter__fill" style="width: ' + (share * 100).toFixed(1) + '%"></span></div>' +
          '<p class="flog-event__note">Every swim you log this year counts, pool and open water.</p>';
      } else {
        body += '<p class="flog-event__note">Swim your events in your own pool or open water during the event window, then submit your results.</p>';
      }
      body += '<p class="flog-event__actions"><button type="button" class="flog-btn flog-btn--quiet flog-btn--small" data-remove="' + e.EventID + '">Remove yourself</button></p>' +
        '<div class="flog-confirm" data-confirm="' + e.EventID + '" role="group" aria-labelledby="flog-confirm-' + e.EventID + '" hidden>' +
          '<h3 class="flog-confirm__title" id="flog-confirm-' + e.EventID + '" tabindex="-1">Remove yourself from ' + esc(e.Name) + '?</h3>' +
          '<p class="flog-confirm__text">Your swims stay in your log, and you can re-enter any time this year.</p>' +
          '<div class="flog-actions">' +
            '<button type="button" class="flog-btn flog-btn--danger-solid" data-event="' + e.EventID + '" data-signed-up="false">Remove me</button>' +
            '<button type="button" class="flog-btn flog-btn--quiet" data-keep="' + e.EventID + '">Keep me in</button>' +
          '</div>' +
        '</div>';
    } else {
      var verb = e.Removed ? 'Re-enter' : 'Sign up';
      body = (e.Removed ? '<p class="flog-event__status flog-event__status--out">You removed yourself from this event.</p>' : '') +
        '<p class="flog-event__pitch">' + EVENT_PITCH[e.EventID](year, e) +
          (distance ? ' Every swim you log counts, pool and open water' + (miles ? ': you’ve swum ' + esc(distanceText(miles, 'mi')) + ' miles this year already.' : '.') : '') +
        '</p>';
      body += e.EventID === 'gtd'
        ? '<form class="flog-event__join" data-event-form="gtd"' + (e.Removed ? ' data-reenter' : '') + ' novalidate>' +
            '<div class="flog-field">' +
              '<label class="flog-label" for="flog-GoalMiles">Your goal <span class="flog-label__note">(miles)</span></label>' +
              '<input class="flog-input flog-input--number" type="number" inputmode="numeric" min="1" max="5000" step="1" id="flog-GoalMiles" name="GoalMiles" value="' + (e.GoalMiles || 100) + '" required aria-describedby="flog-error-GoalMiles">' +
              fieldError('GoalMiles') +
            '</div>' +
            '<button type="submit" class="flog-btn flog-btn--primary">' + verb + '</button>' +
          '</form>'
        : '<p class="flog-event__actions"><button type="button" class="flog-btn flog-btn--primary" data-event="' + e.EventID + '" data-signed-up="true"' + (e.Removed ? ' data-reenter' : '') + '>' + verb + '</button></p>';
    }
    return '<li class="flog-card flog-event' + (e.SignedUp ? ' is-in' : '') + '" data-event-card="' + e.EventID + '">' +
      '<h2 class="flog-card__title">' + icon('flag') + esc(e.Name) + '</h2>' + body + '</li>';
  }

  // A past year's result: Go the Distance and the challenges by miles
  // against the goal; the Virtual Championships as taking part
  function renderPastEvent(p, i) {
    var result = p.GoalMiles
      ? esc(distanceText(p.Miles || 0, 'mi')) + ' of ' + number(p.GoalMiles) + ' miles' +
        ((p.Miles || 0) >= p.GoalMiles ? ' <span class="flog-past__met">' + icon('check-circle') + 'Goal met</span>' : '')
      : 'Took part';
    return '<li class="flog-past__item"' + (i >= PAST_SHOWN ? ' data-past-more hidden' : '') + '>' +
      '<span class="flog-past__year">' + p.Year + '</span>' +
      '<span class="flog-past__name">' + esc(p.Name) + '</span>' +
      '<span class="flog-past__result">' + result + '</span>' +
    '</li>';
  }

  function renderEvents(view) {
    var list = view.events || [];
    var past = view.past || [];
    var year = parseDate(today()).getFullYear();
    var none = !list.some(function (e) { return e.SignedUp; });
    var more = past.length - PAST_SHOWN;
    return (none ? '<p class="flog-events__lead">You’re not signed up for a virtual event yet. Join one and swim it on your own schedule.</p>' : '') +
      '<div class="flog-errors" data-errors tabindex="-1" hidden></div>' +
      '<ul class="flog-events">' + list.map(function (e) { return renderEvent(e, year); }).join('') + '</ul>' +
      (past.length
        ? '<section class="flog-card flog-past" aria-labelledby="flog-past-title">' +
            '<h2 class="flog-card__title" id="flog-past-title">Past events</h2>' +
            '<ul class="flog-past__list">' + past.map(renderPastEvent).join('') + '</ul>' +
            (more > 0 ? '<p class="flog-past__more"><button type="button" class="flog-btn flog-btn--quiet flog-btn--small" data-past-show aria-expanded="false">Show ' + more + ' more</button></p>' : '') +
          '</section>'
        : '');
  }

  // A set of choices that look like buttons (radio inputs underneath)
  function choices(name, options, value, extraClass) {
    return '<div class="flog-choices' + (extraClass ? ' ' + extraClass : '') + '">' + options.map(function (o) {
      var id = 'flog-' + name + '-' + o.id;
      return '<input type="radio" class="flog-choices__input" id="' + id + '" name="' + name + '" value="' + esc(o.id) + '"' + (String(value) === String(o.id) ? ' checked' : '') + '>' +
        '<label class="flog-choices__option" for="' + id + '"' + (o.title ? ' title="' + esc(o.title) + '"' : '') + '>' + esc(o.label) + '</label>';
    }).join('') + '</div>';
  }

  // A select drawn as Race Tools' are: a white track with the choice in a
  // blue pill. The pill is a span over the select's hidden text; the change
  // listener below keeps its text in step. options: [{ id, label }]
  // With no options (a time-only activity's unit, its field hidden) it's
  // empty, so the form still draws
  function select(name, options, value, describedBy) {
    var chosen = options.filter(function (o) { return String(o.id) === String(value); })[0] || options[0] || { id: '', label: '' };
    return '<div class="flog-select">' +
      '<select class="flog-select__input" id="flog-' + name + '" name="' + name + '"' + (describedBy ? ' aria-describedby="' + describedBy + '"' : '') + '>' +
        options.map(function (o) {
          return '<option value="' + esc(o.id) + '"' + (o === chosen ? ' selected' : '') + '>' + esc(o.label) + '</option>';
        }).join('') +
      '</select>' +
      '<span class="flog-select__value" aria-hidden="true">' + esc(chosen.label) + '</span>' +
    '</div>';
  }

  // How hard a swim felt, 1 to 10, as Race Tools' Pace and calories slider:
  // a track shaded light blue to red. Not rated: faded, with no thumb, and
  // clicking or dragging on it rates; × clears. wireSlider keeps it in step.
  function slider(name, value, describedBy) {
    return '<div class="flog-slider' + (value ? '' : ' is-unrated') + '" data-slider>' +
      '<span class="flog-slider__end" aria-hidden="true">1</span>' +
      '<input type="range" class="flog-slider__input" id="flog-' + name + '" name="' + name + '" min="1" max="10" step="1" value="' + esc(value || 5) + '"' + (describedBy ? ' aria-describedby="' + describedBy + '"' : '') + '>' +
      '<span class="flog-slider__end" aria-hidden="true">10</span>' +
      '<button type="button" class="flog-slider__clear" data-slider-clear aria-label="Clear intensity"' + (value ? '' : ' hidden') + '>' + icon('x') + '</button>' +
    '</div>';
  }

  // Each rating's shade (tokens.css), for the thumb's ring
  var INTENSITY_SHADES = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5 };

  // The slider's behaviour; onChange(value) gets '' when it's cleared.
  // The mouse wheel steps it while it's focused (one step a notch,
  // trackpads one per 30px), as on Race Tools.
  function wireSlider(el, onChange) {
    var range = el.querySelector('input');
    var clear = el.querySelector('[data-slider-clear]');
    var value = el.classList.contains('is-unrated') ? '' : range.value;
    function set(v) {
      value = v;
      el.classList.toggle('is-unrated', !v);
      clear.hidden = !v;
      if (v) range.value = v;
      el.style.setProperty('--flog-slider-now', v ? 'var(--flog-intensity-' + INTENSITY_SHADES[v] + ')' : 'transparent');
      range.setAttribute('aria-valuetext', v ? v + ', ' + INTENSITY_WORDS[v] : 'Not rated');
      onChange(v);
    }
    range.addEventListener('input', function () { set(range.value); });
    // A click on the unrated track where the thumb already sits fires no input
    range.addEventListener('pointerup', function () { set(range.value); });
    clear.addEventListener('click', function () {
      set('');
      range.focus();
    });
    var spin = 0;
    range.addEventListener('wheel', function (e) {
      if (range !== document.activeElement) return;
      e.preventDefault();
      spin += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : -e.deltaY;
      if (Math.abs(spin) < 30) return;
      var now = Number(value) || (spin > 0 ? 0 : 11);
      set(String(Math.min(10, Math.max(1, now + (spin > 0 ? 1 : -1)))));
      spin = 0;
    }, { passive: false });
    set(value);
  }

  document.addEventListener('change', function (e) {
    if (!e.target.matches || !e.target.matches('.flog-select__input')) return;
    var sel = e.target;
    sel.parentNode.querySelector('.flog-select__value').textContent = sel.options[sel.selectedIndex].text;
  });

  function fieldError(name) {
    return '<p class="flog-field__error" id="flog-error-' + name + '" hidden></p>';
  }

  // Log an activity, or edit one (with Delete). Activity first; a swim has a
  // course, a stroke and a distance, another activity maybe a distance
  // (wireWorkoutForm shows and hides them as the activity changes)
  function renderWorkoutForm(entry, prefs, mode) {
    var editing = mode === 'edit';
    var activity = activityOf(entry.ActivityType == null ? SWIMMING : entry.ActivityType);
    var swim = activity.id === SWIMMING;
    var optional = ' <span class="flog-label__note">(optional)</span>';
    return '<form class="flog-form" novalidate data-swim-form>' +
      '<div class="flog-errors" data-errors tabindex="-1" hidden></div>' +
      '<div class="flog-card">' +
        // Activity and date, side by side
        '<div class="flog-row flog-row--fields">' +
          '<div class="flog-field">' +
            '<label class="flog-label" for="flog-ActivityType">Activity</label>' +
            select('ActivityType', ACTIVITIES.map(function (a) { return { id: a.id, label: a.name }; }), activity.id, 'flog-error-ActivityType') +
            fieldError('ActivityType') +
          '</div>' +
          '<div class="flog-field">' +
            '<label class="flog-label" for="flog-Date">Date</label>' +
            '<input class="flog-input flog-input--date" type="date" id="flog-Date" name="Date" value="' + esc(entry.Date || '') + '" max="' + today() + '" required aria-describedby="flog-error-Date">' +
            fieldError('Date') +
          '</div>' +
        '</div>' +
        // Course, main stroke and distance, side by side (wrapping on phones)
        '<div class="flog-row flog-row--fields">' +
          '<div class="flog-field" data-swim-only' + (swim ? '' : ' hidden') + '>' +
            '<label class="flog-label" for="flog-RawDistanceCourse">Course</label>' +
            select('RawDistanceCourse', COURSES.map(function (c) { return { id: c.id, label: c.id }; }), entry.RawDistanceCourse || prefs.UserDefaultCourse, 'flog-error-RawDistanceCourse') +
            fieldError('RawDistanceCourse') +
          '</div>' +
          '<div class="flog-field" data-swim-only' + (swim ? '' : ' hidden') + '>' +
            '<label class="flog-label" for="flog-Stroke">Main stroke' + optional + '</label>' +
            select('Stroke', [{ id: '', label: '–' }].concat(STROKES.map(function (st) { return { id: st, label: st }; })), entry.Stroke || '') +
          '</div>' +
          '<div class="flog-field flog-field--distance" data-distance' + (swim || activity.units ? '' : ' hidden') + '>' +
            '<label class="flog-label" for="flog-RawDistance">Distance<span data-distance-note>' + (swim ? '' : optional) + '</span></label>' +
            '<div class="flog-row">' +
              '<input class="flog-input flog-input--number" type="number" inputmode="decimal" min="0" step="any" id="flog-RawDistance" name="RawDistance" value="' + esc(entry.RawDistance != null ? entry.RawDistance : '') + '" aria-describedby="flog-error-RawDistance">' +
              '<label class="visually-hidden" for="flog-RawDistanceUnit">Unit</label>' +
              select('RawDistanceUnit', unitOptions(activity.id, entry.RawDistanceCourse || prefs.UserDefaultCourse), entry.RawDistanceUnit, 'flog-error-RawDistanceUnit') +
            '</div>' +
            fieldError('RawDistance') +
            fieldError('RawDistanceUnit') +
          '</div>' +
        '</div>' +
        // Time and intensity, side by side
        '<div class="flog-row flog-row--fields">' +
          '<div class="flog-field">' +
            '<label class="flog-label" for="flog-DurationMinutes">Time <span class="flog-label__note">(minutes)</span></label>' +
            '<div class="flog-row">' +
              '<input class="flog-input flog-input--number" type="number" inputmode="numeric" min="1" max="1440" step="1" id="flog-DurationMinutes" name="DurationMinutes" value="' + esc(entry.DurationMinutes != null ? entry.DurationMinutes : '') + '" required aria-describedby="flog-duration-as flog-error-DurationMinutes">' +
              '<span class="flog-hint flog-hint--inline" id="flog-duration-as" data-duration-as></span>' +
            '</div>' +
            fieldError('DurationMinutes') +
          '</div>' +
          '<div class="flog-field">' +
            '<label class="flog-label" for="flog-Intensity">Intensity <span class="flog-label__note" data-intensity-word></span></label>' +
            slider('Intensity', entry.Intensity, 'flog-error-Intensity') +
            fieldError('Intensity') +
          '</div>' +
        '</div>' +
        // Heart rate and weight (on the entry since 2026-11-18; the legacy
        // FLOG logged them on their own)
        '<div class="flog-row flog-row--fields">' +
          '<div class="flog-field">' +
            '<label class="flog-label" for="flog-HeartRate">Avg heart rate <span class="flog-label__note">(bpm, optional)</span></label>' +
            '<input class="flog-input flog-input--number flog-input--short" type="number" inputmode="numeric" min="30" max="250" step="1" id="flog-HeartRate" name="HeartRate" value="' + esc(entry.HeartRate != null ? entry.HeartRate : '') + '" aria-describedby="flog-error-HeartRate">' +
            fieldError('HeartRate') +
          '</div>' +
          '<div class="flog-field">' +
            '<label class="flog-label" for="flog-Weight">Weight <span class="flog-label__note">(lb, optional)</span></label>' +
            '<input class="flog-input flog-input--number flog-input--short" type="number" inputmode="decimal" min="50" max="700" step="0.1" id="flog-Weight" name="Weight" value="' + esc(entry.Weight != null ? entry.Weight : '') + '" aria-describedby="flog-error-Weight">' +
            fieldError('Weight') +
          '</div>' +
        '</div>' +
        '<div class="flog-field">' +
          '<label class="flog-label" for="flog-Details">Comments</label>' +
          '<textarea class="flog-input flog-input--text" id="flog-Details" name="Details" rows="3">' + esc(entry.Details || '') + '</textarea>' +
        '</div>' +
      '</div>' +
      '<div class="flog-actions" data-actions>' +
        '<button type="submit" class="flog-btn flog-btn--primary">' + icon('check') + (editing ? 'Save changes' : 'Log activity') + '</button>' +
        '<a class="flog-btn flog-btn--quiet" href="' + homeUrl(null, entry.Date) + '">Cancel</a>' +
        (editing ? '<button type="button" class="flog-btn flog-btn--danger flog-actions__delete" data-delete>' + icon('trash') + 'Delete</button>' : '') +
      '</div>' +
      (editing
        ? '<div class="flog-confirm" data-confirm role="group" aria-labelledby="flog-confirm-title" hidden>' +
            '<h2 class="flog-confirm__title" id="flog-confirm-title" tabindex="-1">Delete this activity?</h2>' +
            '<p class="flog-confirm__text">' + esc(workoutName(entry)) + ' on ' + esc(longDate(entry.Date)) + '. This can’t be undone.</p>' +
            '<div class="flog-actions">' +
              '<button type="button" class="flog-btn flog-btn--danger-solid" data-confirm-delete>' + icon('trash') + 'Delete activity</button>' +
              '<button type="button" class="flog-btn flog-btn--quiet" data-keep>Keep it</button>' +
            '</div>' +
          '</div>'
        : '') +
    '</form>';
  }

  // A workout in a few words: "1,650 yd swim", "Running, 5 mi", "Yoga"
  function workoutName(w) {
    if (isSwim(w)) return formatRaw(w) + ' swim';
    return activityOf(w.ActivityType).name + (w.RawDistance != null ? ', ' + formatRaw(w) : '');
  }

  // The swimmer's settings. Each default says what it sets: a new
  // workout's course, the unit totals are shown in, the calendar's view.
  // Preferences (since 2026-11-23): each question stacked, its label then its
  // control, in the legacy FLOG's words. Save is off until something
  // changes and takes you to the calendar; Cancel goes back to it unsaved.
  // Heart rate and weight sharing is off the page (MeasurementsPublic is
  // kept as it was).
  function renderPreferences(prefs) {
    return '<form class="flog-form flog-prefs" novalidate data-preferences-form>' +
      '<div class="flog-errors" data-errors tabindex="-1" hidden></div>' +
      '<div class="flog-card">' +
        '<h2 class="flog-card__title">Sharing</h2>' +
        '<div class="flog-check">' +
          '<input type="checkbox" class="flog-check__input" id="flog-WorkoutsPublic" name="WorkoutsPublic"' + (prefs.WorkoutsPublic ? ' checked' : '') + '>' +
          '<label class="flog-check__label" for="flog-WorkoutsPublic">Make my workouts public</label>' +
        '</div>' +
      '</div>' +
      '<div class="flog-card">' +
        '<h2 class="flog-card__title">Defaults</h2>' +
        '<fieldset class="flog-field flog-prefs__field">' +
          '<legend class="flog-label">Enter my swim distances mostly in this unit of measure <span class="flog-prefs__note">(you may change this for individual workouts)</span></legend>' +
          choices('UserDefaultDistance', TOTALS_UNITS.map(function (u) { return { id: u.id, label: u.name }; }), prefs.UserDefaultDistance) +
        '</fieldset>' +
        '<div class="flog-field flog-prefs__field">' +
          '<label class="flog-label" for="flog-UserDefaultCourse">My swim workouts are mostly done in this course <span class="flog-prefs__note">(you may change this for individual workouts)</span></label>' +
          select('UserDefaultCourse', COURSES.map(function (c) { return { id: c.id, label: c.id }; }), prefs.UserDefaultCourse) +
        '</div>' +
        '<fieldset class="flog-field flog-prefs__field">' +
          '<legend class="flog-label">Calendar default view</legend>' +
          choices('UserDefaultView', [{ id: 'week', label: 'Week' }, { id: 'month', label: 'Month' }], prefs.UserDefaultView) +
        '</fieldset>' +
      '</div>' +
      '<div class="flog-actions">' +
        '<button type="submit" class="flog-btn flog-btn--primary" data-save disabled>' + icon('check') + 'Save preferences</button>' +
        '<a class="flog-btn flog-btn--quiet" href="' + homeUrl() + '">Cancel</a>' +
        '<p class="flog-status" role="status" data-status></p>' +
      '</div>' +
    '</form>';
  }

  // ---------- States the pages share ----------

  function renderMessage(title, text, action) {
    return '<div class="flog-card flog-message">' +
      '<h2 class="flog-message__title">' + esc(title) + '</h2>' +
      '<p>' + text + '</p>' +
      (action ? '<p>' + action + '</p>' : '') +
    '</div>';
  }

  function showLoading(el) {
    el.setAttribute('aria-busy', 'true');
    el.innerHTML = '<p class="flog-loading">Loading…</p>';
  }

  function showError(el, retry) {
    el.removeAttribute('aria-busy');
    el.innerHTML = renderMessage('We couldn’t load your Fitness Log', 'Check your connection and try again.', '<button type="button" class="flog-btn flog-btn--primary" data-retry>Try again</button>');
    el.querySelector('[data-retry]').addEventListener('click', retry);
  }

  function done(el, html) {
    el.removeAttribute('aria-busy');
    el.innerHTML = html;
  }

  // Shows what's wrong: a summary at the top linking to each field, and a
  // message under the field itself
  function showProblems(form, problems) {
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    form.querySelectorAll('.flog-field__error').forEach(function (el) { el.hidden = true; el.textContent = ''; });
    var box = form.querySelector('[data-errors]');
    if (!problems.length) {
      box.hidden = true;
      return;
    }
    box.innerHTML = '<h2 class="flog-errors__title">' + (form.matches('[data-swim-form]') ? 'Check your activity' : 'Check these') + '</h2><ul>' + problems.map(function (p) {
      var target = p.field && form.querySelector('[name="' + p.field + '"]');
      return '<li>' + (target ? '<a href="#' + target.id + '">' + esc(p.message) + '</a>' : esc(p.message)) + '</li>';
    }).join('') + '</ul>';
    box.hidden = false;
    problems.forEach(function (p) {
      if (!p.field) return;
      var msg = form.querySelector('#flog-error-' + p.field);
      if (msg) {
        msg.textContent = p.message;
        msg.hidden = false;
      }
      form.querySelectorAll('[name="' + p.field + '"]').forEach(function (el) { el.setAttribute('aria-invalid', 'true'); });
    });
    box.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var el = form.querySelector(a.getAttribute('href'));
        if (el) el.focus();
      });
    });
    box.focus();
  }

  // ---------- Pages ----------

  // Home: the calendar, a week or a month
  function home() {
    var view = params.get('view');
    var date = validDate(params.get('date')) ? params.get('date') : today();
    var prefs;
    var selected = null;
    var monthEntries = [];
    var flash = takeFlash();

    function load() {
      showLoading(app);
      // Events can't stop the calendar: if they don't load, no nudge
      var events = api.getEvents().catch(function () { return null; });
      Promise.all([api.getPreferences(), api.getTotals(today()), events]).then(function (r) {
        prefs = r[0];
        if (['week', 'month'].indexOf(view) < 0) view = prefs.UserDefaultView || 'week';
        var lifetime = r[1].lifetime;
        var firstTime = !lifetime.NumSessions && !(lifetime.Other && lifetime.Other.NumSessions);
        // Not in a virtual event: a nudge toward Events
        var notIn = r[2] && !r[2].events.some(function (e) { return e.SignedUp; });
        done(app,
          (flash ? '<p class="flog-flash" role="status">' + icon('check-circle') + esc(flash) + '</p>' : '') +
          (firstTime ? renderMessage('Welcome to your Fitness Log', 'Log each workout to see your weeks, months and totals add up. It only takes a few seconds after practice.', '<a class="flog-btn flog-btn--primary" href="' + pageUrl('log-swim') + '">' + icon('plus') + 'Log your first activity</a>') : '') +
          (notIn && !firstTime ? '<p class="flog-nudge">' + icon('flag') + '<span>Make your swims count: join a virtual event, from Go the Distance to Swim the Nile. <a href="' + pageUrl('events') + '">See events</a></span></p>' : '') +
          '<div class="flog-toolbar">' +
            '<div class="flog-seg" role="group" aria-label="Show your workouts by">' +
              ['week', 'month'].map(function (v) {
                return '<button type="button" data-view="' + v + '" aria-pressed="' + (v === view) + '">' + icon('calendar') + v.charAt(0).toUpperCase() + v.slice(1) + '</button>';
              }).join('') +
            '</div>' +
            '<div class="flog-pager">' +
              '<button type="button" class="flog-icon-btn" data-step="-1">' + icon('chevron-left') + '<span class="visually-hidden" data-step-label>Previous</span></button>' +
              '<h2 class="flog-pager__label" data-label aria-live="polite"></h2>' +
              '<button type="button" class="flog-icon-btn" data-step="1">' + icon('chevron-right') + '<span class="visually-hidden" data-step-label>Next</span></button>' +
              '<button type="button" class="flog-btn flog-btn--quiet flog-btn--small" data-today>Today</button>' +
            '</div>' +
          '</div>' +
          '<p class="flog-summary" data-summary></p>' +
          '<div class="flog-body" data-body></div>');
        app.querySelector('.flog-toolbar').addEventListener('click', onToolbar);
        app.querySelector('[data-body]').addEventListener('click', onBody);
        draw();
      }, function () { showError(app, load); });
    }

    // The view and date go in the page's own URL, so it can be bookmarked
    function setUrl() {
      var q = new URLSearchParams(location.search);
      q.set('view', view);
      q.set('date', date);
      history.replaceState(null, '', location.pathname + '?' + q.toString());
    }

    function range() {
      if (view === 'week') return { from: weekStart(date), to: addDays(weekStart(date), 6) };
      return { from: monthStart(date), to: monthEnd(date) };
    }

    function draw() {
      setUrl();
      app.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view)); });
      var label = app.querySelector('[data-label]');
      var summary = app.querySelector('[data-summary]');
      var body = app.querySelector('[data-body]');
      var r = range();
      label.textContent = view === 'week' ? weekLabel(r.from) : monthLabel(r.from);
      app.querySelectorAll('[data-step-label]').forEach(function (s, i) { s.textContent = (i ? 'Next ' : 'Previous ') + view; });
      app.querySelector('[data-step="1"]').disabled = addDays(r.to, 1) > today();
      showLoading(body);
      summary.textContent = '';
      api.getEntries(r).then(function (entries) {
        summary.textContent = summaryText(entries, prefs, view === 'week' ? 'this week' : 'this month');
        if (view === 'week') {
          done(body, renderWeek(r.from, entries));
        } else {
          monthEntries = entries;
          if (!selected || selected < r.from || selected > r.to) selected = today() >= r.from && today() <= r.to ? today() : null;
          done(body, renderMonth(r.from, entries, prefs, selected));
        }
      }, function () { showError(body, draw); });
    }

    function onToolbar(e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-view')) {
        view = b.getAttribute('data-view');
      } else if (b.hasAttribute('data-step')) {
        var step = Number(b.getAttribute('data-step'));
        date = view === 'week' ? addDays(date, 7 * step) : addMonths(date, step);
        if (view === 'month') selected = null;
      } else if (b.hasAttribute('data-today')) {
        date = today();
        selected = today();
      } else {
        return;
      }
      draw();
    }

    function onBody(e) {
      var day = e.target.closest('[data-day]');
      if (day) {
        selected = day.getAttribute('data-day');
        var body = app.querySelector('[data-body]');
        body.innerHTML = renderMonth(monthStart(date), monthEntries, prefs, selected);
        body.querySelector('[data-day="' + selected + '"]').focus();
      }
    }

    load();
  }

  // Reads the workout form into a FLOG entry: a swim's course, stroke and
  // distance; another activity's distance only if it has one and it's given
  function readWorkoutForm(form) {
    var f = form.elements;
    var num = function (v) { return v === '' ? null : Number(v); };
    var activity = Number(f.ActivityType.value);
    var entry = {
      Date: f.Date.value,
      ActivityType: activity,
      DurationMinutes: num(f.DurationMinutes.value.trim()),
      Details: f.Details.value.trim(),
      Intensity: form.querySelector('[data-slider]').classList.contains('is-unrated') ? null : num(f.Intensity.value),
      HeartRate: num(f.HeartRate.value.trim()),
      Weight: num(f.Weight.value.trim())
    };
    var distance = num(f.RawDistance.value.trim());
    if (activity === SWIMMING) {
      entry.RawDistanceCourse = f.RawDistanceCourse.value;
      entry.RawDistance = distance;
      entry.RawDistanceUnit = f.RawDistanceUnit.value;
      entry.Stroke = f.Stroke.value || null;
    } else if (activityOf(activity).units && distance != null) {
      entry.RawDistance = distance;
      entry.RawDistanceUnit = f.RawDistanceUnit.value;
    }
    return entry;
  }

  // The units on offer: a pool swim's own (one: yards for SCY, meters for
  // SCM and LCM), any swimming unit in open water or Other, and another
  // activity's own (api/flog/core.mjs checks the same)
  var COURSE_UNITS = { SCY: ['Y'], SCM: ['M'], LCM: ['M'], OW: ['Y', 'M', 'mi'], Other: ['Y', 'M', 'mi'] };
  function unitOptions(activity, course) {
    var ids = activity === SWIMMING ? COURSE_UNITS[course] || COURSE_UNITS.Other : activityOf(activity).units || [];
    return ids.map(function (id) { return { id: id, label: unitOf(id).label }; });
  }

  // The unit a new choice starts in: a pool's own; open water and Other in
  // the swimmer's Totals unit; another activity in its first
  function unitFor(activity, course, prefs) {
    var ids = unitOptions(activity, course).map(function (o) { return o.id; });
    if (activity === SWIMMING && ids.length > 1 && ids.indexOf(prefs.UserDefaultDistance) >= 0) return prefs.UserDefaultDistance;
    return ids[0];
  }

  // The form's behaviour, for Log and Edit
  // `entry`: the workout being edited (null when logging a new one)
  function wireSwimForm(form, prefs, entry) {
    var entryId = entry ? entry.EntryID : null;
    var unitTouched = entryId != null;
    var durationAs = form.querySelector('[data-duration-as]');
    var word = form.querySelector('[data-intensity-word]');
    function showDuration() {
      var m = Number(form.elements.DurationMinutes.value);
      durationAs.textContent = m >= 60 && m <= 1440 ? '= ' + formatDuration(m) : '';
    }
    // The unit's options for the activity and course. The unit stays if the
    // swimmer chose it and it's still on offer; otherwise it's the new one's.
    function setUnits() {
      var activity = Number(form.elements.ActivityType.value);
      var unit = form.elements.RawDistanceUnit;
      var options = unitOptions(activity, form.elements.RawDistanceCourse.value);
      if (!options.length) return;
      var keep = unitTouched && options.some(function (o) { return o.id === unit.value; });
      var value = keep ? unit.value : unitFor(activity, form.elements.RawDistanceCourse.value, prefs);
      unit.innerHTML = options.map(function (o) {
        return '<option value="' + esc(o.id) + '">' + esc(o.label) + '</option>';
      }).join('');
      unit.value = value;
      unit.parentNode.querySelector('.flog-select__value').textContent = unit.options[unit.selectedIndex].text;
      // One unit: nothing to choose, so it reads as plain text
      unit.disabled = options.length === 1;
      unit.parentNode.classList.toggle('is-fixed', options.length === 1);
    }
    // A swim: course, stroke and a required distance. Another activity:
    // an optional distance if it has one.
    function setActivity() {
      var activity = Number(form.elements.ActivityType.value);
      var swim = activity === SWIMMING;
      form.querySelectorAll('[data-swim-only]').forEach(function (el) { el.hidden = !swim; });
      form.querySelector('[data-distance]').hidden = !swim && !activityOf(activity).units;
      form.querySelector('[data-distance-note]').innerHTML = swim ? '' : ' <span class="flog-label__note">(optional)</span>';
      form.elements.RawDistance.required = swim;
      setUnits();
    }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'RawDistanceUnit') unitTouched = true;
      if (e.target.name === 'ActivityType') {
        unitTouched = false;
        setActivity();
      }
      if (e.target.name === 'RawDistanceCourse') setUnits();
    });
    setActivity();
    form.elements.DurationMinutes.addEventListener('input', showDuration);
    // Its word goes in the label, as on Race Tools
    wireSlider(form.querySelector('[data-slider]'), function (v) {
      word.textContent = v ? '· ' + INTENSITY_WORDS[v] : '(optional)';
    });
    showDuration();

    var saving = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (saving) return;
      var input = readWorkoutForm(form);
      if (entryId != null) input.EntryID = entryId;
      // The form doesn't ask for calories; an edit keeps the workout's own
      if (entry && entry.Calories != null) input.Calories = entry.Calories;
      saving = true;
      api.saveEntry(input).then(function (saved) {
        setFlash((entryId != null ? 'Saved: ' : 'Logged: ') + workoutName(saved) + ' on ' + shortDate(saved.Date) + '.');
        location.href = homeUrl(null, saved.Date);
      }, function (err) {
        saving = false;
        showProblems(form, (err && err.problems) || [{ field: null, message: 'We couldn’t save your activity. Try again.' }]);
      });
    });

    if (entryId == null) return;
    var actions = form.querySelector('[data-actions]');
    var confirm = form.querySelector('[data-confirm]');
    form.querySelector('[data-delete]').addEventListener('click', function () {
      actions.hidden = true;
      confirm.hidden = false;
      confirm.querySelector('#flog-confirm-title').focus();
    });
    form.querySelector('[data-keep]').addEventListener('click', function () {
      confirm.hidden = true;
      actions.hidden = false;
      form.querySelector('[data-delete]').focus();
    });
    form.querySelector('[data-confirm-delete]').addEventListener('click', function (e) {
      var date = form.elements.Date.defaultValue;
      e.currentTarget.disabled = true;
      api.deleteEntry(entryId).then(function () {
        setFlash('Activity deleted.');
        location.href = homeUrl(null, date);
      }, function (err) {
        e.currentTarget.disabled = false;
        showProblems(form, (err && err.problems) || [{ field: null, message: 'We couldn’t delete your activity. Try again.' }]);
      });
    });
  }

  function logSwim() {
    function load() {
      showLoading(app);
      api.getPreferences().then(function (prefs) {
        var date = params.get('date');
        if (!validDate(date) || date > today()) date = today();
        var entry = { Date: date, ActivityType: SWIMMING, RawDistanceCourse: prefs.UserDefaultCourse, RawDistanceUnit: unitFor(SWIMMING, prefs.UserDefaultCourse, prefs) };
        done(app, renderWorkoutForm(entry, prefs, 'new'));
        wireSwimForm(app.querySelector('[data-swim-form]'), prefs, null);
      }, function () { showError(app, load); });
    }
    load();
  }

  function editSwim() {
    var id = params.get('id');
    function load() {
      showLoading(app);
      Promise.all([api.getPreferences(), api.getEntry(id)]).then(function (r) {
        done(app, renderWorkoutForm(r[1], r[0], 'edit'));
        wireSwimForm(app.querySelector('[data-swim-form]'), r[0], r[1]);
      }, function (err) {
        if (err && err.status === 404) {
          done(app, renderMessage('We couldn’t find that activity', 'It may have been deleted.', '<a class="flog-btn flog-btn--primary" href="' + homeUrl() + '">Back to your Fitness Log</a>'));
        } else {
          showError(app, load);
        }
      }).catch(function (err) {
        // The form failed to draw: say so, never leave "Loading…"
        if (window.console) console.error(err);
        showError(app, load);
      });
    }
    load();
  }

  // Totals: swims, or all workouts (?show=all, kept in the URL)
  function totals() {
    var show = params.get('show') === 'all' ? 'all' : 'swims';
    function load() {
      showLoading(app);
      Promise.all([api.getPreferences(), api.getTotals(today())]).then(function (r) {
        function draw() {
          done(app, renderTotals(r[1], r[0], show));
          var q = new URLSearchParams(location.search);
          if (show === 'all') q.set('show', 'all');
          else q.delete('show');
          history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q.toString() : ''));
        }
        draw();
        app.addEventListener('click', function (e) {
          var b = e.target.closest('[data-show]');
          if (!b || b.getAttribute('data-show') === show) return;
          show = b.getAttribute('data-show');
          draw();
          app.querySelector('[data-show="' + show + '"]').focus();
        });
      }, function () { showError(app, load); });
    }
    load();
  }

  // Events: the virtual events, signed up, removed or neither. Signing up
  // here is the mockup's; in production it's the event's registration.
  function events() {
    function load() {
      showLoading(app);
      api.getEvents().then(draw, function () { showError(app, load); });
    }
    function draw(view) {
      done(app, renderEvents(view));
    }
    function save(id, value, flash) {
      api.saveEvent(id, value).then(function () {
        return api.getEvents();
      }).then(function (view) {
        draw(view);
        var title = app.querySelector('[data-event-card="' + id + '"] .flog-card__title');
        title.setAttribute('tabindex', '-1');
        title.insertAdjacentHTML('afterend', '<p class="flog-flash" role="status">' + icon('check-circle') + esc(flash) + '</p>');
        title.focus();
      }, function (err) {
        showProblems(app, (err && err.problems) || [{ field: null, message: 'We couldn’t save that. Try again.' }]);
      });
    }
    app.addEventListener('click', function (e) {
      var t = e.target;
      // Remove yourself: confirm first
      var remove = t.closest('[data-remove]');
      if (remove) {
        var confirm = app.querySelector('[data-confirm="' + remove.getAttribute('data-remove') + '"]');
        remove.hidden = true;
        confirm.hidden = false;
        confirm.querySelector('.flog-confirm__title').focus();
        return;
      }
      var keep = t.closest('[data-keep]');
      if (keep) {
        var id = keep.getAttribute('data-keep');
        app.querySelector('[data-confirm="' + id + '"]').hidden = true;
        var again = app.querySelector('[data-remove="' + id + '"]');
        again.hidden = false;
        again.focus();
        return;
      }
      var show = t.closest('[data-past-show]');
      if (show) {
        app.querySelectorAll('[data-past-more]').forEach(function (li) { li.hidden = false; });
        show.parentNode.remove();
        var first = app.querySelector('[data-past-more]');
        if (first) { first.setAttribute('tabindex', '-1'); first.focus(); }
        return;
      }
      var b = t.closest('[data-event]');
      if (!b) return;
      var join = b.getAttribute('data-signed-up') === 'true';
      b.disabled = true;
      save(b.getAttribute('data-event'), { SignedUp: join }, join ? (b.hasAttribute('data-reenter') ? 'You’re back in.' : 'You’re signed up.') : 'Removed. Your swims stay in your log.');
    });
    app.addEventListener('submit', function (e) {
      var form = e.target.closest('[data-event-form]');
      if (!form) return;
      e.preventDefault();
      var goal = Number(form.elements.GoalMiles.value);
      save(form.getAttribute('data-event-form'), { SignedUp: true, GoalMiles: goal }, (form.hasAttribute('data-reenter') ? 'You’re back in.' : 'You’re signed up.') + ' Every swim you log this year counts.');
    });
    load();
  }

  function preferences() {
    function load() {
      showLoading(app);
      api.getPreferences().then(function (prefs) {
        done(app, renderPreferences(prefs));
        var form = app.querySelector('[data-preferences-form]');
        var saveButton = form.querySelector('[data-save]');
        var checked = function (name) {
          var el = form.querySelector('[name="' + name + '"]:checked');
          return el ? el.value : null;
        };
        var values = function () {
          return {
            WorkoutsPublic: form.elements.WorkoutsPublic.checked,
            // Not on the page since 2026-11-23: kept as it was
            MeasurementsPublic: !!prefs.MeasurementsPublic,
            UserDefaultDistance: checked('UserDefaultDistance'),
            UserDefaultCourse: form.elements.UserDefaultCourse.value,
            UserDefaultView: checked('UserDefaultView')
          };
        };
        // Save is on only while something differs from what's saved
        var saved = JSON.stringify(values());
        var sync = function () { saveButton.disabled = JSON.stringify(values()) === saved; };
        form.addEventListener('change', sync);
        form.addEventListener('input', sync);
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (saveButton.disabled) return;
          saveButton.disabled = true;
          api.savePreferences(values()).then(function () {
            setFlash('Preferences saved.');
            window.location.href = homeUrl();
          }, function (err) {
            sync();
            showProblems(form, (err && err.problems) || [{ field: null, message: 'We couldn’t save your preferences. Try again.' }]);
          });
        });
      }, function () { showError(app, load); });
    }
    load();
  }

  // ---------- Start ----------

  // FLOG is for members: logged out, or not a member, there's nothing to show
  if (!USER.loggedIn) {
    root.classList.add('is-guest');
    done(app, renderMessage('Log in to see your Fitness Log', 'Your Fitness Log keeps every workout you log, with weekly, monthly and lifetime totals.', '<a class="flog-btn flog-btn--primary" href="/account/myusmslogin/">Log in</a>'));
    return;
  }
  if (!USER.membershipTier) {
    root.classList.add('is-guest');
    done(app, renderMessage('The Fitness Log is for U.S. Masters Swimming members', 'Members log every workout and see their weekly, monthly and lifetime totals.', '<a class="flog-btn flog-btn--primary" href="/join-usms/membership-comparison.html">Join U.S. Masters Swimming</a>'));
    return;
  }

  ({ home: home, 'log-swim': logSwim, 'edit-swim': editSwim, totals: totals, events: events, preferences: preferences })[PAGE]();
})();
