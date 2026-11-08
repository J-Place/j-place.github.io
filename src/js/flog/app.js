// FLOG mockup: the pages. Each repeated thing has one render function that
// takes data and returns its HTML (renderSwim, renderDay, renderWeek,
// renderMonth, renderList, renderTotals, renderSwimForm, renderPreferences):
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
    { id: 'mi', label: 'mi', name: 'Miles' }
  ];
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

  // The one place distances are shown: always in the swimmer's own unit
  // (UserDefaultDistance), from DistanceYards
  function distanceIn(yards, unit) {
    if (unit === 'M') return yards * 0.9144;
    if (unit === 'mi') return yards / 1760;
    return yards;
  }
  function formatDistance(yards, unit, options) {
    var n = distanceIn(yards, unit);
    var text = unit === 'mi' ? number(n, n >= 100 ? 1 : 2).replace(/\.?0+$/, '') : number(Math.round(n));
    return options && options.bare ? text : text + ' ' + unitOf(unit).label;
  }

  function formatDuration(minutes) {
    var h = Math.floor(minutes / 60);
    var m = Math.round(minutes % 60);
    if (h >= 100) return number(Math.round(minutes / 60)) + ' h';
    if (!h) return m + ' min';
    return m ? h + ' h ' + m + ' min' : h + ' h';
  }

  function totalOf(entries) {
    return entries.reduce(function (t, e) {
      t.swims += 1;
      t.yards += e.DistanceYards;
      t.minutes += e.DurationMinutes;
      return t;
    }, { swims: 0, yards: 0, minutes: 0 });
  }

  function summaryText(entries, prefs, period) {
    var t = totalOf(entries);
    if (!t.swims) return 'No swims ' + period;
    return number(t.swims) + (t.swims === 1 ? ' swim' : ' swims') + ' · ' + formatDistance(t.yards, prefs.UserDefaultDistance) + ' · ' + formatDuration(t.minutes);
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

  // One swim: on the calendar, in the list, on a day
  function renderSwim(swim, prefs, options) {
    var showDate = options && options.showDate;
    var course = courseOf(swim.RawDistanceCourse);
    var meta = [];
    if (showDate) meta.push(esc(shortDate(swim.Date)));
    meta.push(esc(formatDuration(swim.DurationMinutes)));
    if (swim.Intensity) meta.push('Intensity ' + swim.Intensity + ' <span class="flog-swim__word">' + esc(INTENSITY_WORDS[swim.Intensity]) + '</span>');
    if (swim.Stroke) meta.push(esc(swim.Stroke));
    if (swim.Calories != null) meta.push(number(swim.Calories) + ' cal');
    return '<li class="flog-swim">' +
      '<a class="flog-swim__link" href="' + pageUrl('edit-swim', { id: swim.EntryID }) + '">' +
        '<span class="flog-swim__top">' +
          '<span class="flog-swim__distance">' + esc(formatDistance(swim.DistanceYards, prefs.UserDefaultDistance)) + '</span>' +
          '<span class="flog-swim__course" title="' + esc(course.name) + '">' + esc(course.id === 'OW' ? 'OW' : course.label) + '</span>' +
          icon('pencil', 'flog-swim__edit') +
        '</span>' +
        '<span class="flog-swim__meta">' + meta.join('<span aria-hidden="true"> · </span>') + '</span>' +
        (swim.Details ? '<span class="flog-swim__details">' + esc(swim.Details) + '</span>' : '') +
        '<span class="visually-hidden">Edit this swim</span>' +
      '</a>' +
    '</li>';
  }

  // One day: its swims, or a way to log one
  function renderDay(date, swims, prefs, options) {
    var isToday = date === today();
    var past = date <= today();
    var heading = options && options.long
      ? '<h3 class="flog-day__title">' + esc(longDate(date)) + (isToday ? ' <span class="flog-badge">Today</span>' : '') + '</h3>'
      : '<h3 class="flog-day__title"><span class="flog-day__name">' + DAY_NAMES[parseDate(date).getDay()].slice(0, 3) + '</span> <span class="flog-day__date">' + esc(shortDate(date)) + '</span>' + (isToday ? ' <span class="flog-badge">Today</span>' : '') + '</h3>';
    var body = swims.length
      ? '<ul class="flog-day__swims">' + swims.map(function (s) { return renderSwim(s, prefs); }).join('') + '</ul>'
      : '<p class="flog-day__none">' + (past ? 'No swim' : '') + '</p>';
    var add = past
      ? '<a class="flog-day__add" href="' + pageUrl('log-swim', { date: date }) + '">' + icon('plus') + (swims.length ? 'Add another' : 'Log a swim') + '<span class="visually-hidden"> on ' + esc(longDate(date)) + '</span></a>'
      : '';
    return '<li class="flog-day' + (isToday ? ' is-today' : '') + (swims.length ? ' has-swims' : '') + (past ? '' : ' is-future') + '">' +
      '<div class="flog-day__head">' + heading + add + '</div>' + body +
    '</li>';
  }

  function swimsOn(entries, date) {
    return entries.filter(function (e) { return e.Date === date; });
  }

  // A week, Sunday to Saturday
  function renderWeek(start, entries, prefs) {
    var days = [];
    for (var i = 0; i < 7; i++) {
      var date = addDays(start, i);
      days.push(renderDay(date, swimsOn(entries, date), prefs));
    }
    return '<ol class="flog-week">' + days.join('') + '</ol>';
  }

  // A month as a calendar; pick a day to see its swims below
  function renderMonth(anyDay, entries, prefs, selected) {
    var first = monthStart(anyDay);
    var last = monthEnd(anyDay);
    var lead = parseDate(first).getDay();
    var cells = [];
    for (var i = 0; i < lead; i++) cells.push('<td class="flog-month__blank"></td>');
    for (var date = first; date <= last; date = addDays(date, 1)) {
      var swims = swimsOn(entries, date);
      var t = totalOf(swims);
      var label = longDate(date) + (swims.length ? ', ' + swims.length + (swims.length === 1 ? ' swim, ' : ' swims, ') + formatDistance(t.yards, prefs.UserDefaultDistance) : ', no swims');
      cells.push('<td>' +
        '<button type="button" class="flog-month__day' + (date === today() ? ' is-today' : '') + (swims.length ? ' has-swims' : '') + '" data-day="' + date + '" aria-pressed="' + (date === selected) + '" aria-label="' + esc(label) + '"' + (date > today() ? ' disabled' : '') + '>' +
          '<span class="flog-month__num">' + parseDate(date).getDate() + '</span>' +
          (swims.length ? '<span class="flog-month__dist">' + esc(formatDistance(t.yards, prefs.UserDefaultDistance, { bare: true })) + '</span>' : '') +
          (swims.length > 1 ? '<span class="flog-month__count">×' + swims.length + '</span>' : '') +
        '</button>' +
      '</td>');
    }
    while (cells.length % 7) cells.push('<td class="flog-month__blank"></td>');
    var rows = [];
    for (var r = 0; r < cells.length; r += 7) rows.push('<tr>' + cells.slice(r, r + 7).join('') + '</tr>');
    var head = DAY_NAMES.map(function (d) { return '<th scope="col" abbr="' + d + '">' + d.slice(0, 1) + '<span class="flog-month__dow-rest">' + d.slice(1, 3) + '</span></th>'; }).join('');
    var pick = selected && selected >= first && selected <= last ? selected : null;
    return '<table class="flog-month">' +
        '<caption class="visually-hidden">' + esc(monthLabel(first)) + '. Distances in ' + esc(unitOf(prefs.UserDefaultDistance).name.toLowerCase()) + '. Choose a day to see its swims.</caption>' +
        '<thead><tr>' + head + '</tr></thead><tbody>' + rows.join('') + '</tbody>' +
      '</table>' +
      (pick ? '<ul class="flog-week flog-month__picked" aria-live="polite">' + renderDay(pick, swimsOn(entries, pick), prefs, { long: true }) + '</ul>' : '');
  }

  // Every swim, newest first, under a heading for each month
  function renderList(entries, prefs) {
    var html = '';
    var month = null;
    var open = false;
    entries.forEach(function (e) {
      if (e.Date.slice(0, 7) !== month) {
        if (open) html += '</ul>';
        month = e.Date.slice(0, 7);
        html += '<h3 class="flog-list__month">' + esc(monthLabel(e.Date)) + '</h3><ul class="flog-list">';
        open = true;
      }
      html += renderSwim(e, prefs, { showDate: true });
    });
    return html + (open ? '</ul>' : '');
  }

  // This month, this year, lifetime
  function renderTotals(totals, prefs) {
    var unit = prefs.UserDefaultDistance;
    var d = parseDate(today());
    var periods = [
      { key: 'month', title: 'This month', sub: MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear() },
      { key: 'year', title: 'This year', sub: String(d.getFullYear()) },
      { key: 'lifetime', title: 'Lifetime', sub: totals.firstLogDate ? 'Since ' + MONTH_NAMES[parseDate(totals.firstLogDate).getMonth()] + ' ' + parseDate(totals.firstLogDate).getDate() + ', ' + parseDate(totals.firstLogDate).getFullYear() : 'No swims yet' }
    ];
    return '<ul class="flog-totals">' + periods.map(function (p) {
      var t = totals[p.key];
      return '<li class="flog-total">' +
        '<h2 class="flog-total__title">' + esc(p.title) + ' <span class="flog-total__sub">' + esc(p.sub) + '</span></h2>' +
        '<p class="flog-total__distance">' + esc(formatDistance(t.TotalYards, unit, { bare: true })) + ' <span class="flog-total__unit">' + esc(unitOf(unit).name.toLowerCase()) + '</span></p>' +
        '<dl class="flog-total__stats">' +
          '<div><dt>Swims</dt><dd>' + number(t.NumSessions) + '</dd></div>' +
          '<div><dt>Time</dt><dd>' + esc(formatDuration(t.TotalMinutes)) + '</dd></div>' +
          '<div><dt>Average swim</dt><dd>' + (t.NumSessions ? esc(formatDistance(t.TotalYards / t.NumSessions, unit)) : '–') + '</dd></div>' +
        '</dl>' +
      '</li>';
    }).join('') + '</ul>';
  }

  // A set of choices that look like buttons (radio inputs underneath)
  function choices(name, options, value, extraClass) {
    return '<div class="flog-choices' + (extraClass ? ' ' + extraClass : '') + '">' + options.map(function (o) {
      var id = 'flog-' + name + '-' + o.id;
      return '<input type="radio" class="flog-choices__input" id="' + id + '" name="' + name + '" value="' + esc(o.id) + '"' + (String(value) === String(o.id) ? ' checked' : '') + '>' +
        '<label class="flog-choices__option" for="' + id + '"' + (o.title ? ' title="' + esc(o.title) + '"' : '') + '>' + esc(o.label) + '</label>';
    }).join('') + '</div>';
  }

  function fieldError(name) {
    return '<p class="flog-field__error" id="flog-error-' + name + '" hidden></p>';
  }

  // Log a swim, or edit one (with Delete)
  function renderSwimForm(entry, prefs, mode) {
    var editing = mode === 'edit';
    return '<form class="flog-form" novalidate data-swim-form>' +
      '<div class="flog-errors" data-errors tabindex="-1" hidden></div>' +
      '<div class="flog-card">' +
        '<div class="flog-field">' +
          '<label class="flog-label" for="flog-Date">Date</label>' +
          '<input class="flog-input flog-input--date" type="date" id="flog-Date" name="Date" value="' + esc(entry.Date || '') + '" max="' + today() + '" required aria-describedby="flog-error-Date">' +
          fieldError('Date') +
        '</div>' +
        '<fieldset class="flog-field" aria-describedby="flog-error-RawDistanceCourse">' +
          '<legend class="flog-label">Course</legend>' +
          choices('RawDistanceCourse', COURSES.map(function (c) { return { id: c.id, label: c.label, title: c.name }; }), entry.RawDistanceCourse, 'flog-choices--wrap') +
          '<p class="flog-hint">SCY short course yards · SCM short course meters · LCM long course meters</p>' +
          fieldError('RawDistanceCourse') +
        '</fieldset>' +
        '<div class="flog-field flog-field--distance">' +
          '<label class="flog-label" for="flog-RawDistance">Distance</label>' +
          '<div class="flog-row">' +
            '<input class="flog-input flog-input--number" type="number" inputmode="decimal" min="0" step="any" id="flog-RawDistance" name="RawDistance" value="' + esc(entry.RawDistance != null ? entry.RawDistance : '') + '" required aria-describedby="flog-error-RawDistance">' +
            '<fieldset class="flog-unit"><legend class="visually-hidden">Unit</legend>' +
              choices('RawDistanceUnit', UNITS.map(function (u) { return { id: u.id, label: u.label, title: u.name }; }), entry.RawDistanceUnit) +
            '</fieldset>' +
          '</div>' +
          fieldError('RawDistance') +
        '</div>' +
        '<div class="flog-field">' +
          '<label class="flog-label" for="flog-DurationMinutes">Time <span class="flog-label__note">(minutes)</span></label>' +
          '<div class="flog-row">' +
            '<input class="flog-input flog-input--number" type="number" inputmode="numeric" min="1" max="1440" step="1" id="flog-DurationMinutes" name="DurationMinutes" value="' + esc(entry.DurationMinutes != null ? entry.DurationMinutes : '') + '" required aria-describedby="flog-duration-as flog-error-DurationMinutes">' +
            '<span class="flog-hint flog-hint--inline" id="flog-duration-as" data-duration-as></span>' +
          '</div>' +
          fieldError('DurationMinutes') +
        '</div>' +
        '<div class="flog-field">' +
          '<label class="flog-label" for="flog-Details">Comments</label>' +
          '<textarea class="flog-input flog-input--text" id="flog-Details" name="Details" rows="3">' + esc(entry.Details || '') + '</textarea>' +
        '</div>' +
      '</div>' +
      '<fieldset class="flog-card flog-optional">' +
        '<legend class="flog-optional__title">More about this swim <span class="flog-label__note">(optional)</span></legend>' +
        '<fieldset class="flog-field" aria-describedby="flog-intensity-word flog-error-Intensity">' +
          '<legend class="flog-label">Intensity <span class="flog-label__note">(how hard it felt, 1 to 10)</span></legend>' +
          choices('Intensity', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return { id: n, label: String(n), title: INTENSITY_WORDS[n] }; }), entry.Intensity, 'flog-choices--scale') +
          '<p class="flog-hint"><span id="flog-intensity-word" data-intensity-word></span> <button type="button" class="flog-link" data-clear-intensity>Clear</button></p>' +
          fieldError('Intensity') +
        '</fieldset>' +
        '<div class="flog-row flog-row--fields">' +
          '<div class="flog-field">' +
            '<label class="flog-label" for="flog-Stroke">Main stroke</label>' +
            '<select class="flog-input flog-input--select" id="flog-Stroke" name="Stroke">' +
              '<option value="">–</option>' + STROKES.map(function (s) { return '<option' + (entry.Stroke === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
            '</select>' +
          '</div>' +
          '<div class="flog-field">' +
            '<label class="flog-label" for="flog-Calories">Calories</label>' +
            '<input class="flog-input flog-input--number" type="number" inputmode="numeric" min="0" step="1" id="flog-Calories" name="Calories" value="' + esc(entry.Calories != null ? entry.Calories : '') + '" aria-describedby="flog-error-Calories">' +
            fieldError('Calories') +
          '</div>' +
        '</div>' +
      '</fieldset>' +
      '<div class="flog-actions" data-actions>' +
        '<button type="submit" class="flog-btn flog-btn--primary">' + icon('check') + (editing ? 'Save changes' : 'Log swim') + '</button>' +
        '<a class="flog-btn flog-btn--quiet" href="' + homeUrl(null, entry.Date) + '">Cancel</a>' +
        (editing ? '<button type="button" class="flog-btn flog-btn--danger flog-actions__delete" data-delete>' + icon('trash') + 'Delete</button>' : '') +
      '</div>' +
      (editing
        ? '<div class="flog-confirm" data-confirm role="group" aria-labelledby="flog-confirm-title" hidden>' +
            '<h2 class="flog-confirm__title" id="flog-confirm-title" tabindex="-1">Delete this swim?</h2>' +
            '<p class="flog-confirm__text">' + esc(formatDistance(entry.DistanceYards, prefs.UserDefaultDistance)) + ' on ' + esc(longDate(entry.Date)) + '. This can’t be undone.</p>' +
            '<div class="flog-actions">' +
              '<button type="button" class="flog-btn flog-btn--danger-solid" data-confirm-delete>' + icon('trash') + 'Delete swim</button>' +
              '<button type="button" class="flog-btn flog-btn--quiet" data-keep>Keep it</button>' +
            '</div>' +
          '</div>'
        : '') +
    '</form>';
  }

  // The swimmer's settings
  function renderPreferences(prefs) {
    return '<form class="flog-form" novalidate data-preferences-form>' +
      '<div class="flog-errors" data-errors tabindex="-1" hidden></div>' +
      '<div class="flog-card">' +
        '<h2 class="flog-card__title">Sharing</h2>' +
        '<div class="flog-check">' +
          '<input type="checkbox" class="flog-check__input" id="flog-WorkoutsPublic" name="WorkoutsPublic"' + (prefs.WorkoutsPublic ? ' checked' : '') + '>' +
          '<label class="flog-check__label" for="flog-WorkoutsPublic">Make my workouts public</label>' +
        '</div>' +
        '<div class="flog-check">' +
          '<input type="checkbox" class="flog-check__input" id="flog-MeasurementsPublic" name="MeasurementsPublic"' + (prefs.MeasurementsPublic ? ' checked' : '') + '>' +
          '<label class="flog-check__label" for="flog-MeasurementsPublic">Make my measurements public</label>' +
        '</div>' +
      '</div>' +
      '<div class="flog-card">' +
        '<h2 class="flog-card__title">Defaults</h2>' +
        '<fieldset class="flog-field">' +
          '<legend class="flog-label">Distance unit</legend>' +
          choices('UserDefaultDistance', UNITS.map(function (u) { return { id: u.id, label: u.name }; }), prefs.UserDefaultDistance) +
          '<p class="flog-hint">Your log and totals show distances in this unit. Open water and Other swims start in it too.</p>' +
        '</fieldset>' +
        '<fieldset class="flog-field">' +
          '<legend class="flog-label">Course</legend>' +
          choices('UserDefaultCourse', COURSES.map(function (c) { return { id: c.id, label: c.label, title: c.name }; }), prefs.UserDefaultCourse, 'flog-choices--wrap') +
          '<p class="flog-hint">Where a new swim starts.</p>' +
        '</fieldset>' +
        '<fieldset class="flog-field">' +
          '<legend class="flog-label">Calendar view</legend>' +
          choices('UserDefaultView', [{ id: 'week', label: 'Week' }, { id: 'month', label: 'Month' }], prefs.UserDefaultView) +
        '</fieldset>' +
      '</div>' +
      '<div class="flog-actions">' +
        '<button type="submit" class="flog-btn flog-btn--primary">' + icon('check') + 'Save preferences</button>' +
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
    box.innerHTML = '<h2 class="flog-errors__title">Check your swim</h2><ul>' + problems.map(function (p) {
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

  // Home: the calendar (week or month) or the list
  function home() {
    var view = params.get('view');
    var date = validDate(params.get('date')) ? params.get('date') : today();
    var prefs;
    var selected = null;
    var monthEntries = [];
    var list = null;
    var flash = takeFlash();

    function load() {
      showLoading(app);
      Promise.all([api.getPreferences(), api.getTotals(today())]).then(function (r) {
        prefs = r[0];
        if (['week', 'month', 'list'].indexOf(view) < 0) view = prefs.UserDefaultView || 'week';
        var firstTime = !r[1].lifetime.NumSessions;
        done(app,
          (flash ? '<p class="flog-flash" role="status">' + icon('check-circle') + esc(flash) + '</p>' : '') +
          (firstTime ? renderMessage('Welcome to your Fitness Log', 'Log each swim to see your weeks, months and totals add up. It only takes a few seconds after practice.', '<a class="flog-btn flog-btn--primary" href="' + pageUrl('log-swim') + '">' + icon('plus') + 'Log your first swim</a>') : '') +
          '<div class="flog-toolbar">' +
            '<div class="flog-seg" role="group" aria-label="Show your swims by">' +
              ['week', 'month', 'list'].map(function (v) {
                return '<button type="button" data-view="' + v + '" aria-pressed="' + (v === view) + '">' + icon(v === 'list' ? 'list' : 'calendar') + v.charAt(0).toUpperCase() + v.slice(1) + '</button>';
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
      if (view === 'list') q.delete('date');
      else q.set('date', date);
      history.replaceState(null, '', location.pathname + '?' + q.toString());
    }

    function range() {
      if (view === 'week') return { from: weekStart(date), to: addDays(weekStart(date), 6) };
      return { from: monthStart(date), to: monthEnd(date) };
    }

    function draw() {
      setUrl();
      app.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view)); });
      var pager = app.querySelector('.flog-pager');
      var label = app.querySelector('[data-label]');
      var summary = app.querySelector('[data-summary]');
      var body = app.querySelector('[data-body]');
      pager.classList.toggle('is-list', view === 'list');
      if (view === 'list') {
        label.textContent = 'All swims, newest first';
        summary.textContent = '';
        list = { entries: [], hasMore: false, nextBefore: null };
        showLoading(body);
        more(body);
        return;
      }
      var r = range();
      label.textContent = view === 'week' ? weekLabel(r.from) : monthLabel(r.from);
      app.querySelectorAll('[data-step-label]').forEach(function (s, i) { s.textContent = (i ? 'Next ' : 'Previous ') + view; });
      app.querySelector('[data-step="1"]').disabled = addDays(r.to, 1) > today();
      showLoading(body);
      summary.textContent = '';
      api.getEntries(r).then(function (entries) {
        summary.textContent = summaryText(entries, prefs, view === 'week' ? 'this week' : 'this month');
        if (view === 'week') {
          done(body, renderWeek(r.from, entries, prefs));
        } else {
          monthEntries = entries;
          if (!selected || selected < r.from || selected > r.to) selected = today() >= r.from && today() <= r.to ? today() : null;
          done(body, renderMonth(r.from, entries, prefs, selected));
        }
      }, function () { showError(body, draw); });
    }

    // The list: the next page of older swims
    function more(body) {
      api.getEntriesPage({ limit: 20, before: list.nextBefore }).then(function (page) {
        list.entries = list.entries.concat(page.entries);
        list.hasMore = page.hasMore;
        list.nextBefore = page.nextBefore;
        done(body, (list.entries.length ? renderList(list.entries, prefs) : '<p class="flog-day__none">No swims yet.</p>') +
          (list.hasMore ? '<p class="flog-more"><button type="button" class="flog-btn flog-btn--quiet" data-more>Show older swims</button></p>' : ''));
      }, function () { showError(body, function () { more(body); }); });
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
        return;
      }
      if (e.target.closest('[data-more]')) {
        var moreBody = app.querySelector('[data-body]');
        var button = e.target.closest('[data-more]');
        button.disabled = true;
        button.textContent = 'Loading…';
        more(moreBody);
      }
    }

    load();
  }

  // Reads the swim form into a FLOG entry
  function readSwimForm(form) {
    var f = form.elements;
    var num = function (v) { return v === '' ? null : Number(v); };
    var checked = function (name) {
      var el = form.querySelector('[name="' + name + '"]:checked');
      return el ? el.value : null;
    };
    return {
      Date: f.Date.value,
      RawDistanceCourse: checked('RawDistanceCourse'),
      RawDistance: num(f.RawDistance.value.trim()),
      RawDistanceUnit: checked('RawDistanceUnit'),
      DurationMinutes: num(f.DurationMinutes.value.trim()),
      Details: f.Details.value.trim(),
      Intensity: num(checked('Intensity') || ''),
      Stroke: f.Stroke.value || null,
      Calories: num(f.Calories.value.trim())
    };
  }

  // A pool course says its own unit; open water and Other use the swimmer's
  function unitFor(course, prefs) {
    if (course === 'SCY') return 'Y';
    if (course === 'SCM' || course === 'LCM') return 'M';
    return prefs.UserDefaultDistance || 'Y';
  }

  // The form's behaviour, for Log and Edit
  function wireSwimForm(form, prefs, entryId) {
    var unitTouched = entryId != null;
    var durationAs = form.querySelector('[data-duration-as]');
    var word = form.querySelector('[data-intensity-word]');
    function showDuration() {
      var m = Number(form.elements.DurationMinutes.value);
      durationAs.textContent = m >= 60 && m <= 1440 ? '= ' + formatDuration(m) : '';
    }
    function showIntensity() {
      var el = form.querySelector('[name="Intensity"]:checked');
      word.textContent = el ? el.value + ': ' + INTENSITY_WORDS[el.value] : 'Not rated';
      form.querySelector('[data-clear-intensity]').hidden = !el;
    }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'RawDistanceUnit') unitTouched = true;
      if (e.target.name === 'RawDistanceCourse' && !unitTouched) {
        var unit = form.querySelector('[name="RawDistanceUnit"][value="' + unitFor(e.target.value, prefs) + '"]');
        if (unit) unit.checked = true;
      }
      if (e.target.name === 'Intensity') showIntensity();
    });
    form.elements.DurationMinutes.addEventListener('input', showDuration);
    form.querySelector('[data-clear-intensity]').addEventListener('click', function () {
      var el = form.querySelector('[name="Intensity"]:checked');
      if (el) el.checked = false;
      showIntensity();
      form.querySelector('[name="Intensity"]').focus();
    });
    showDuration();
    showIntensity();

    var saving = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (saving) return;
      var entry = readSwimForm(form);
      if (entryId != null) entry.EntryID = entryId;
      saving = true;
      api.saveEntry(entry).then(function (saved) {
        setFlash((entryId != null ? 'Swim saved: ' : 'Swim logged: ') + formatDistance(saved.DistanceYards, prefs.UserDefaultDistance) + ' on ' + shortDate(saved.Date) + '.');
        location.href = homeUrl(null, saved.Date);
      }, function (err) {
        saving = false;
        showProblems(form, (err && err.problems) || [{ field: null, message: 'We couldn’t save your swim. Try again.' }]);
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
        setFlash('Swim deleted.');
        location.href = homeUrl(null, date);
      }, function (err) {
        e.currentTarget.disabled = false;
        showProblems(form, (err && err.problems) || [{ field: null, message: 'We couldn’t delete your swim. Try again.' }]);
      });
    });
  }

  function logSwim() {
    function load() {
      showLoading(app);
      api.getPreferences().then(function (prefs) {
        var date = params.get('date');
        if (!validDate(date) || date > today()) date = today();
        var entry = { Date: date, RawDistanceCourse: prefs.UserDefaultCourse, RawDistanceUnit: unitFor(prefs.UserDefaultCourse, prefs) };
        done(app, renderSwimForm(entry, prefs, 'new'));
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
        done(app, renderSwimForm(r[1], r[0], 'edit'));
        wireSwimForm(app.querySelector('[data-swim-form]'), r[0], r[1].EntryID);
      }, function (err) {
        if (err && err.status === 404) {
          done(app, renderMessage('We couldn’t find that swim', 'It may have been deleted.', '<a class="flog-btn flog-btn--primary" href="' + homeUrl() + '">Back to your Fitness Log</a>'));
        } else {
          showError(app, load);
        }
      });
    }
    load();
  }

  function totals() {
    function load() {
      showLoading(app);
      Promise.all([api.getPreferences(), api.getTotals(today())]).then(function (r) {
        done(app, renderTotals(r[1], r[0]));
      }, function () { showError(app, load); });
    }
    load();
  }

  function preferences() {
    function load(message) {
      showLoading(app);
      api.getPreferences().then(function (prefs) {
        done(app, renderPreferences(prefs) +
          '<div class="flog-card flog-demo">' +
            '<h2 class="flog-card__title">Demo data</h2>' +
            '<p>This mockup starts every swimmer from sample swims and keeps your changes for this browser. Reset to start over.</p>' +
            '<p><button type="button" class="flog-btn flog-btn--quiet" data-reset>Reset demo data</button></p>' +
          '</div>');
        var form = app.querySelector('[data-preferences-form]');
        var status = form.querySelector('[data-status]');
        if (message) status.textContent = message;
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var checked = function (name) {
            var el = form.querySelector('[name="' + name + '"]:checked');
            return el ? el.value : null;
          };
          status.textContent = '';
          api.savePreferences({
            WorkoutsPublic: form.elements.WorkoutsPublic.checked,
            MeasurementsPublic: form.elements.MeasurementsPublic.checked,
            UserDefaultDistance: checked('UserDefaultDistance'),
            UserDefaultCourse: checked('UserDefaultCourse'),
            UserDefaultView: checked('UserDefaultView')
          }).then(function () {
            showProblems(form, []);
            status.innerHTML = icon('check-circle') + 'Preferences saved.';
          }, function (err) {
            showProblems(form, (err && err.problems) || [{ field: null, message: 'We couldn’t save your preferences. Try again.' }]);
          });
        });
        app.querySelector('[data-reset]').addEventListener('click', function () {
          api.reset().then(function () { load('Demo data reset: your swims and preferences are back to the samples.'); });
        });
      }, function () { showError(app, load); });
    }
    load();
  }

  // ---------- Start ----------

  var who = root.querySelector('[data-flog-who]');
  if (who && USER.firstName) who.textContent = USER.firstName + ' ' + USER.lastName;

  // FLOG is for members: logged out, or not a member, there's nothing to show
  if (!USER.loggedIn) {
    root.classList.add('is-guest');
    done(app, renderMessage('Log in to see your Fitness Log', 'Your Fitness Log keeps every swim you log, with weekly, monthly and lifetime totals.', '<a class="flog-btn flog-btn--primary" href="/account/myusmslogin/">Log in</a>'));
    return;
  }
  if (!USER.membershipTier) {
    root.classList.add('is-guest');
    done(app, renderMessage('The Fitness Log is for U.S. Masters Swimming members', 'Members log every swim and see their weekly, monthly and lifetime totals.', '<a class="flog-btn flog-btn--primary" href="/join-usms/membership-comparison.html">Join U.S. Masters Swimming</a>'));
    return;
  }

  ({ home: home, 'log-swim': logSwim, 'edit-swim': editSwim, totals: totals, preferences: preferences })[PAGE]();
})();
