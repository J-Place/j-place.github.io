// Drives every [data-event-rank] card (partials/EventRank.njk): fills its
// inputs from event-rank.js, presets them from the card's data attributes,
// and fetches and draws one set of rankings per submit. Needs
// /js/lib/event-rank.js loaded first.
(function () {
  'use strict';

  var ER = window.UsmsEventRank;
  if (!ER) return;

  function options(select, values, label) {
    var current = select.value;
    select.innerHTML = values.map(function (v) {
      return '<option value="' + v + '">' + (label ? label(v) : v) + '</option>';
    }).join('');
    if (values.map(String).indexOf(current) >= 0) select.value = current;
  }

  function set(select, value) {
    if (value == null || value === '') return;
    var v = String(value);
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === v) { select.value = v; return; }
    }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function linked(textValue, url) {
    return url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(textValue) + '</a>' : esc(textValue);
  }

  function init(card) {
    var form = card.querySelector('[data-event-rank-form]');
    var f = form.elements;
    var status = card.querySelector('[data-event-rank-status]');
    var results = card.querySelector('[data-event-rank-results]');
    var rows = card.querySelector('[data-event-rank-rows]');
    var caption = card.querySelector('[data-event-rank-caption]');
    var link = card.querySelector('[data-event-rank-link]');
    var latest = 0;

    options(f.season, ER.seasons());
    options(f.course, ER.COURSES);
    options(f.stroke, ER.STROKES);
    options(f.ageGroup, ER.AGE_GROUPS, function (a) { return a === 18 ? '18–24' : a + '–' + ER.highAge(a); });
    options(f.howMany, ER.HOW_MANY);

    function syncDistances() {
      options(f.distance, ER.distances(f.course.value));
    }

    function apply(q) {
      set(f.season, q.season);
      set(f.course, q.course);
      syncDistances();
      set(f.gender, /^f|^w/i.test(q.gender || '') ? 'Women' : q.gender ? 'Men' : null);
      set(f.stroke, q.stroke);
      set(f.distance, q.distance);
      if (q.ageGroup) set(f.ageGroup, ER.AGE_GROUPS.filter(function (a) { return a <= +q.ageGroup; }).pop());
      set(f.howMany, q.howMany);
    }

    function query() {
      return {
        season: f.season.value,
        course: f.course.value,
        gender: f.gender.value,
        stroke: f.stroke.value,
        distance: f.distance.value,
        ageGroup: f.ageGroup.value,
        howMany: f.howMany.value
      };
    }

    function load() {
      var q = query();
      var id = ++latest;
      link.href = ER.permalink(q);
      status.textContent = 'Loading rankings…';
      card.classList.add('is-loading');
      ER.fetch(q).then(function (result) {
        if (id !== latest) return;
        caption.textContent = result.title;
        rows.innerHTML = result.rows.map(function (r) {
          return '<tr><td>' + r.place + '</td><td>' + esc(r.name) + '</td><td>' + r.age + '</td>' +
            '<td class="event-rank__time">' + linked(r.time, r.swimUrl) + '</td>' +
            '<td><abbr title="' + esc(r.clubName) + '">' + esc(r.club) + '</abbr></td>' +
            '<td>' + linked(r.meet, r.meetUrl) + '</td></tr>';
        }).join('');
        results.hidden = !result.rows.length;
        status.textContent = result.rows.length ? '' : 'No times reported for this event yet.';
      }, function (err) {
        if (id !== latest) return;
        results.hidden = true;
        status.textContent = err.blocked
          ? 'Live rankings can’t load on this site yet. Use “View on usms.org” to see this event there.'
          : 'Rankings didn’t load (' + err.message + '). Try again, or view them on usms.org.';
      }).then(function () {
        if (id === latest) card.classList.remove('is-loading');
      });
    }

    var d = card.dataset;
    syncDistances();
    apply({
      season: d.season, course: d.course, gender: d.gender, stroke: d.stroke,
      distance: d.distance, ageGroup: d.ageGroup, howMany: d.howMany
    });
    link.href = ER.permalink(query());

    f.course.addEventListener('change', syncDistances);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      load();
    });
    card.addEventListener('eventrank:set', function (e) {
      apply(e.detail || {});
      load();
    });
    if ('autoload' in d) load();
  }

  document.querySelectorAll('[data-event-rank]').forEach(init);
})();
