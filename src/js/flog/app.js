// FLOG mockup: the pages. Each repeated thing has one render function that
// takes data and returns its HTML (renderSwim, renderDay, renderWeek,
// renderMonth, renderTotals, renderSwimForm, renderPreferences):
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

  // One swim: on the calendar, on a day
  function renderSwim(swim, prefs) {
    var course = courseOf(swim.RawDistanceCourse);
    var meta = [];
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
          // Each swim's distance, stacked
          (swims.length ? '<span class="flog-month__dists">' + swims.map(function (s) {
            return '<span class="flog-month__dist">' + esc(formatDistance(s.DistanceYards, prefs.UserDefaultDistance, { bare: true })) + '</span>';
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
        '<caption class="visually-hidden">' + esc(monthLabel(first)) + '. Distances in ' + esc(unitOf(prefs.UserDefaultDistance).name.toLowerCase()) + '. Choose a day to see its swims.</caption>' +
        '<thead><tr>' + head + '</tr></thead><tbody>' + rows.join('') + '</tbody>' +
      '</table>' +
      (pick ? '<ul class="flog-week flog-month__picked" aria-live="polite">' + renderDay(pick, swimsOn(entries, pick), prefs, { long: true }) + '</ul>' : '');
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

  // A select drawn as Race Tools' are: a white track with the choice in a
  // blue pill. The pill is a span over the select's hidden text; the change
  // listener below keeps its text in step. options: [{ id, label }]
  function select(name, options, value, describedBy) {
    var chosen = options.filter(function (o) { return String(o.id) === String(value); })[0] || options[0];
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
        // Course, main stroke and distance, side by side (wrapping on phones)
        '<div class="flog-row flog-row--fields">' +
          '<div class="flog-field">' +
            '<label class="flog-label" for="flog-RawDistanceCourse">Course</label>' +
            select('RawDistanceCourse', COURSES.map(function (c) { return { id: c.id, label: c.id }; }), entry.RawDistanceCourse, 'flog-error-RawDistanceCourse') +
            fieldError('RawDistanceCourse') +
          '</div>' +
          '<div class="flog-field">' +
            '<label class="flog-label" for="flog-Stroke">Main stroke <span class="flog-label__note">(optional)</span></label>' +
            select('Stroke', [{ id: '', label: '–' }].concat(STROKES.map(function (st) { return { id: st, label: st }; })), entry.Stroke || '') +
          '</div>' +
          '<div class="flog-field flog-field--distance">' +
            '<label class="flog-label" for="flog-RawDistance">Distance</label>' +
            '<div class="flog-row">' +
              '<input class="flog-input flog-input--number" type="number" inputmode="decimal" min="0" step="any" id="flog-RawDistance" name="RawDistance" value="' + esc(entry.RawDistance != null ? entry.RawDistance : '') + '" required aria-describedby="flog-error-RawDistance">' +
              '<label class="visually-hidden" for="flog-RawDistanceUnit">Unit</label>' +
              select('RawDistanceUnit', unitOptions(entry.RawDistanceCourse, entry.RawDistanceUnit), entry.RawDistanceUnit) +
            '</div>' +
            fieldError('RawDistance') +
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
        '<div class="flog-field">' +
          '<label class="flog-label" for="flog-Details">Comments</label>' +
          '<textarea class="flog-input flog-input--text" id="flog-Details" name="Details" rows="3">' + esc(entry.Details || '') + '</textarea>' +
        '</div>' +
      '</div>' +
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
      '</div>' +
      '<div class="flog-card">' +
        '<h2 class="flog-card__title">Defaults</h2>' +
        '<fieldset class="flog-field">' +
          '<legend class="flog-label">Distance unit</legend>' +
          choices('UserDefaultDistance', UNITS.map(function (u) { return { id: u.id, label: u.name }; }), prefs.UserDefaultDistance) +
          '<p class="flog-hint">Your log and totals show distances in this unit. Open water and Other swims start in it too.</p>' +
        '</fieldset>' +
        // A select, as on Log a swim
        '<div class="flog-field">' +
          '<label class="flog-label" for="flog-UserDefaultCourse">Course</label>' +
          select('UserDefaultCourse', COURSES.map(function (c) { return { id: c.id, label: c.id }; }), prefs.UserDefaultCourse, 'flog-hint-UserDefaultCourse') +
          '<p class="flog-hint" id="flog-hint-UserDefaultCourse">Where a new swim starts.</p>' +
        '</div>' +
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
      Promise.all([api.getPreferences(), api.getTotals(today())]).then(function (r) {
        prefs = r[0];
        if (['week', 'month'].indexOf(view) < 0) view = prefs.UserDefaultView || 'week';
        var firstTime = !r[1].lifetime.NumSessions;
        done(app,
          (flash ? '<p class="flog-flash" role="status">' + icon('check-circle') + esc(flash) + '</p>' : '') +
          (firstTime ? renderMessage('Welcome to your Fitness Log', 'Log each swim to see your weeks, months and totals add up. It only takes a few seconds after practice.', '<a class="flog-btn flog-btn--primary" href="' + pageUrl('log-swim') + '">' + icon('plus') + 'Log your first swim</a>') : '') +
          '<div class="flog-toolbar">' +
            '<div class="flog-seg" role="group" aria-label="Show your swims by">' +
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
          done(body, renderWeek(r.from, entries, prefs));
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

  // Reads the swim form into a FLOG entry
  function readSwimForm(form) {
    var f = form.elements;
    var num = function (v) { return v === '' ? null : Number(v); };
    return {
      Date: f.Date.value,
      RawDistanceCourse: f.RawDistanceCourse.value,
      RawDistance: num(f.RawDistance.value.trim()),
      RawDistanceUnit: f.RawDistanceUnit.value,
      DurationMinutes: num(f.DurationMinutes.value.trim()),
      Details: f.Details.value.trim(),
      Intensity: form.querySelector('[data-slider]').classList.contains('is-unrated') ? null : num(f.Intensity.value),
      Stroke: f.Stroke.value || null
    };
  }

  // The units each course offers: a pool's own, or miles; open water and
  // Other, any. `keep`: a swim's saved unit, still offered if the course
  // wouldn't, so editing it never changes it unasked.
  var COURSE_UNITS = { SCY: ['Y', 'mi'], SCM: ['M', 'mi'], LCM: ['M', 'mi'] };
  function unitOptions(course, keep) {
    var ids = COURSE_UNITS[course];
    return UNITS.filter(function (u) { return !ids || ids.indexOf(u.id) >= 0 || u.id === keep; })
      .map(function (u) { return { id: u.id, label: u.label }; });
  }

  // A pool course says its own unit; open water and Other use the swimmer's
  function unitFor(course, prefs) {
    if (course === 'SCY') return 'Y';
    if (course === 'SCM' || course === 'LCM') return 'M';
    return prefs.UserDefaultDistance || 'Y';
  }

  // The form's behaviour, for Log and Edit
  // `entry`: the swim being edited (null when logging a new one)
  function wireSwimForm(form, prefs, entry) {
    var entryId = entry ? entry.EntryID : null;
    var unitTouched = entryId != null;
    var durationAs = form.querySelector('[data-duration-as]');
    var word = form.querySelector('[data-intensity-word]');
    function showDuration() {
      var m = Number(form.elements.DurationMinutes.value);
      durationAs.textContent = m >= 60 && m <= 1440 ? '= ' + formatDuration(m) : '';
    }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'RawDistanceUnit') unitTouched = true;
      // A new course: only its units. The unit stays if the swimmer chose it
      // and the course offers it; otherwise it's the course's own.
      if (e.target.name === 'RawDistanceCourse') {
        var unit = form.elements.RawDistanceUnit;
        var options = unitOptions(e.target.value);
        var keep = unitTouched && options.some(function (o) { return o.id === unit.value; });
        var value = keep ? unit.value : unitFor(e.target.value, prefs);
        unit.innerHTML = options.map(function (o) {
          return '<option value="' + esc(o.id) + '">' + esc(o.label) + '</option>';
        }).join('');
        unit.value = value;
        unit.parentNode.querySelector('.flog-select__value').textContent = unit.options[unit.selectedIndex].text;
      }
    });
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
      var input = readSwimForm(form);
      if (entryId != null) input.EntryID = entryId;
      // The form doesn't ask for calories; an edit keeps the swim's own
      if (entry && entry.Calories != null) input.Calories = entry.Calories;
      saving = true;
      api.saveEntry(input).then(function (saved) {
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
        wireSwimForm(app.querySelector('[data-swim-form]'), r[0], r[1]);
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
    function load() {
      showLoading(app);
      api.getPreferences().then(function (prefs) {
        done(app, renderPreferences(prefs));
        var form = app.querySelector('[data-preferences-form]');
        var status = form.querySelector('[data-status]');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var checked = function (name) {
            var el = form.querySelector('[name="' + name + '"]:checked');
            return el ? el.value : null;
          };
          status.textContent = '';
          api.savePreferences({
            WorkoutsPublic: form.elements.WorkoutsPublic.checked,
            // Not on the page (since 2026-11-12), so it's sent back unchanged
            MeasurementsPublic: prefs.MeasurementsPublic,
            UserDefaultDistance: checked('UserDefaultDistance'),
            UserDefaultCourse: form.elements.UserDefaultCourse.value,
            UserDefaultView: checked('UserDefaultView')
          }).then(function () {
            showProblems(form, []);
            status.innerHTML = icon('check-circle') + 'Preferences saved.';
          }, function (err) {
            showProblems(form, (err && err.problems) || [{ field: null, message: 'We couldn’t save your preferences. Try again.' }]);
          });
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
