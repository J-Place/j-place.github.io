// Swim Tools v3: the "Premium light command center" design, filled in from
// the same data as v2. One goal race (an event and course) drives the page:
// the swimmer's best and the next USMS tier up as the goal, the countdown to
// the next championship meet in that course, splits, predictions, course
// conversion, and where the swimmer stands in USMS rankings now and in later
// age groups. Results are estimates, not USMS-approved formulas.
(function () {
  var root = document.querySelector('.st3');
  if (!root) return;

  // ---------- Constants (shared with v2) ----------

  var COURSES = {
    SCY: { factor: 1, unit: 'yd' },
    SCM: { factor: 1.10, unit: 'm' },
    LCM: { factor: 1.12, unit: 'm' }
  };
  var FREE_YARDS = [50, 100, 200, 500, 1000, 1650];
  var FREE_METERS = [50, 100, 200, 400, 800, 1500];
  var EVENTS = {
    SCY: { Free: FREE_YARDS, stroke: [50, 100, 200], IM: [100, 200, 400] },
    SCM: { Free: FREE_METERS, stroke: [50, 100, 200], IM: [100, 200, 400] },
    LCM: { Free: FREE_METERS, stroke: [50, 100, 200], IM: [200, 400] }
  };
  var EQUIVALENT = { 500: 400, 1000: 800, 1650: 1500, 400: 500, 800: 1000, 1500: 1650 };
  var AGE_GROUPS = [
    [18, '18–24'], [25, '25–29'], [30, '30–34'], [35, '35–39'], [40, '40–44'],
    [45, '45–49'], [50, '50–54'], [55, '55–59'], [60, '60–64'], [65, '65–69'],
    [70, '70–74'], [75, '75–79'], [80, '80–84'], [85, '85–89'], [90, '90–94'],
    [95, '95–99'], [100, '100+']
  ].map(function (g) { return { min: g[0], label: g[1] }; });
  // Tiers fastest first. Top 10 is the 10th-place time (topTenCut); the
  // rest are percentile cuts of the rankings, by the data's own keys
  // (timeStandards.json: AAA top 6% … B top 55%). Its AAAA (top 2%) isn't a
  // tier, though tierCuts.js keeps it to place times between rows.
  var TOP_10 = 'Top 10';
  var TIERS = [TOP_10, 'AAA', 'AA', 'A', 'BB', 'B'];
  var TIER_TOP = { AAA: 6, AA: 8, A: 15, BB: 35, B: 55 };
  var LOWEST = TIERS[TIERS.length - 1];
  var UNRATED = 'Unrated';
  var RIEGEL = 1.06;     // the predictor's distance exponent, as in v2
  var TREND = -0.05;     // split plan: a slight negative split (v2's 'neg')
  var DIVE = 1.8;        // seconds a dive start takes off the first split
  var PLAN_WEEKS = 12;   // the training plan ends at the goal meet
  // Calories, as in v2's Training Metrics: CAL_PER_MIN for freestyle at
  // REF_PACE per 100 yd, scaled by stroke and by how hard the pace was
  var CAL_PER_MIN = 7.2;
  var REF_PACE = 105;
  var STROKE_BURN = { Free: 1, Back: 0.9, Breast: 1.05, Fly: 1.35, IM: 1.1 };
  // Run and ride equivalents per swim distance: a rule of thumb, sample math
  var RUN_RATIO = 4;
  var RIDE_RATIO = 12;

  // ---------- Data ----------

  function json(id) {
    try { return JSON.parse(document.getElementById(id).textContent); } catch (e) { return null; }
  }
  var HISTORY = json('race-history-data') || { swimmers: {} };
  var USERS = (json('site-users-data') || {}).users || {};
  var CUTS = json('tier-cuts-data') || [];
  var TOP_TENS = (json('top-tens-data') || {}).lists || [];
  var MEETS = json('meets-data') || [];

  // The active persona, as current-user.js resolves it (?user=, then
  // sessionStorage.activeUser, then the page's swimmerId)
  function swimmerId() {
    var id = null;
    try {
      id = new URLSearchParams(location.search).get('user') || sessionStorage.getItem('activeUser');
    } catch (e) {}
    return id && USERS[id] ? id : HISTORY.default;
  }
  var SWIMMER = swimmerId();
  var USER = USERS[SWIMMER] || {};
  var GENDER = { M: 'Men', F: 'Women' }[USER.gender] || '';

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  // Age on a date (YYYY-MM-DD) from the birth date (MM/DD/YYYY), or null
  function ageOn(date) {
    var b = (USER.birthDate || '').split('/');
    if (b.length !== 3) return null;
    var d = date.split('-').map(Number);
    return d[0] - b[2] - (d[1] * 100 + d[2] < b[0] * 100 + Number(b[1]) ? 1 : 0);
  }
  var AGE = ageOn(today());

  function groupOf(age) {
    var found = null;
    AGE_GROUPS.forEach(function (g) { if (age >= g.min) found = g; });
    return found;
  }
  var GROUP = AGE != null ? groupOf(AGE) : null;

  // Races: the viewer's own list from v2 (localStorage) if they've edited
  // it, otherwise the persona's results
  function loadRaces() {
    var races = null;
    try { races = JSON.parse(localStorage.getItem('swimTools.races.' + SWIMMER)); } catch (e) {}
    if (!Array.isArray(races)) races = ((HISTORY.swimmers || {})[SWIMMER] || {}).races || [];
    return races.map(function (r) {
      return {
        course: r.course, d: Number(r.distance), stroke: r.stroke, secs: parse(r.time),
        date: r.date || '', age: r.age != null ? r.age : r.date ? ageOn(r.date) : null
      };
    }).filter(function (r) { return isFinite(r.secs) && COURSES[r.course]; });
  }
  var RACES = loadRaces();

  // ---------- Time helpers ----------

  function parse(text) {
    var parts = String(text).trim().split(':');
    if (parts.length > 2 || parts[parts.length - 1] === '') return NaN;
    var secs = parts.length === 2 ? Number(parts[0]) * 60 + Number(parts[1]) : Number(parts[0]);
    return secs > 0 ? secs : NaN;
  }

  // Race time, m:ss.hh
  function race(s) {
    if (s == null || !isFinite(s)) return '—';
    s = Math.round(s * 100) / 100;
    var m = Math.floor(s / 60), r = (s - m * 60).toFixed(2);
    return m ? m + ':' + (r < 10 ? '0' : '') + r : r;
  }

  // Pace, m:ss
  function clock(s) {
    if (s == null || !isFinite(s)) return '—';
    s = Math.round(s);
    var r = s % 60;
    return Math.floor(s / 60) + ':' + (r < 10 ? '0' : '') + r;
  }

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // "2026-09-19" as "Sep 19, 2026"
  function longDate(iso) {
    var d = iso.split('-').map(Number);
    return d.length === 3 ? MONTHS[d[1] - 1] + ' ' + d[2] + ', ' + d[0] : iso;
  }

  function eventsFor(course, stroke) {
    return EVENTS[course][stroke] || EVENTS[course].stroke;
  }

  // A distance's match in another course: the same distance, or its
  // yards/meters equivalent; 0 when there isn't one
  function matchDistance(d, course, stroke) {
    var list = eventsFor(course, stroke);
    return list.indexOf(d) >= 0 ? d : list.indexOf(EQUIVALENT[d]) >= 0 ? EQUIVALENT[d] : 0;
  }

  // A time in one course as the matching event's time in another
  function convert(secs, d, from, to, stroke) {
    var target = matchDistance(d, to, stroke);
    if (!target) return { d: 0, secs: NaN };
    return { d: target, secs: secs / COURSES[from].factor * COURSES[to].factor * target / d };
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function set(name, text) {
    document.querySelectorAll('[data-st3="' + name + '"]').forEach(function (el) { el.textContent = text; });
  }

  // ---------- Tier cuts ----------

  // An event's ranking for a course, gender and age group: { n, cuts:
  // [[tier, row, seconds]…], converted } in the course's own times. Uses the
  // course's own rankings where there are any, otherwise SCY's converted.
  // null when there's no ranking.
  function ranking(course, stroke, d, ageMin, gender) {
    var find = function (c) {
      return CUTS.filter(function (g) { return g.course === c && g.gender === gender && g.ageGroup === ageMin; })[0];
    };
    var data = find(course), from = course;
    if (!data) { data = find('SCY'); from = 'SCY'; }
    if (!data) return null;
    var fromD = matchDistance(d, from, stroke);
    var e = fromD && (data.events[stroke] || {})[fromD];
    if (!e) return null;
    var scale = COURSES[course].factor / COURSES[from].factor * d / fromD;
    var rank = {
      n: e.n, capped: e.capped, converted: from !== course,
      cuts: e.cuts.map(function (c) { return [c[0], c[1], c[2] * scale]; })
    };
    rank.top10 = topTenCut(rank, course, stroke, d, ageMin, gender);
    return rank;
  }

  // The Top 10 cut: 10th place in the latest USMS Top 10 list for the
  // event, course, age group and gender where there is one; otherwise the
  // 10th-fastest swim in the rankings (everyone, in a field of 10 or fewer)
  function topTenCut(rank, course, stroke, d, ageMin, gender) {
    var list = topTenList(course, stroke, d, ageMin, gender);
    if (list) return { secs: list.last, year: list.year, list: true };
    if (rank.n <= 10) return { secs: rank.cuts[rank.cuts.length - 1][2], list: false };
    var pts = rank.cuts;
    for (var i = 1; i < pts.length; i++) {
      if (pts[i][1] >= 10) {
        var a = pts[i - 1], b = pts[i];
        return { secs: b[1] === a[1] ? b[2] : a[2] + (b[2] - a[2]) * (10 - a[1]) / (b[1] - a[1]), list: false };
      }
    }
    return { secs: NaN, list: false };
  }

  // A tier's cut time. In a small field 10th place can be slower than a
  // star's cut; that star is then out of reach without making the Top 10,
  // so its cut is the Top 10's.
  function cutOf(rank, tier) {
    if (tier === TOP_10) return rank.top10.secs;
    var c = rank.cuts.filter(function (x) { return x[0] === tier; })[0];
    return c ? Math.max(c[2], rank.top10.secs) : NaN;
  }

  // A tier as a note under a time: "Tier B", but "Top 10" and "Unrated"
  function tierNote(t) {
    return t && t !== TOP_10 && t !== UNRATED ? 'Tier ' + t : t || '';
  }

  // The tier a time earns: the fastest tier whose cut it makes
  function tierOf(secs, rank) {
    if (!rank || !isFinite(secs)) return null;
    for (var i = 0; i < TIERS.length; i++) {
      if (secs <= cutOf(rank, TIERS[i])) return TIERS[i];
    }
    return UNRATED;
  }

  // A time's place in the ranking, interpolated between the known rows
  // (fastest, each tier, slowest)
  function placeIn(secs, rank) {
    var pts = rank.cuts;
    if (secs <= pts[0][2]) return 1;
    for (var i = 1; i < pts.length; i++) {
      if (secs <= pts[i][2]) {
        var a = pts[i - 1], b = pts[i];
        return b[2] === a[2] ? b[1] : a[1] + (b[1] - a[1]) * (secs - a[2]) / (b[2] - a[2]);
      }
    }
    return rank.n;
  }

  // ---------- State ----------

  var state = { course: 'SCY', stroke: 'Free', d: 200, desk: 'vibe' };

  // Start on the event the swimmer has raced most (the latest wins a tie)
  (function startFromSwimmer() {
    var counts = {}, best = null;
    RACES.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (r) {
      var key = r.course + ' ' + r.d + ' ' + r.stroke;
      counts[key] = (counts[key] || 0) + 1;
      if (!best || counts[key] >= counts[best]) best = key;
    });
    if (best) {
      best = best.split(' ');
      state.course = best[0]; state.d = Number(best[1]); state.stroke = best[2];
    }
  })();

  function strokeLabel(stroke) {
    return stroke === 'IM' ? 'IM' : stroke.toLowerCase();
  }
  function eventLabel(d, stroke) {
    return d + ' ' + strokeLabel(stroke);
  }

  function racesFor(course, stroke, d) {
    return RACES.filter(function (r) { return r.course === course && r.stroke === stroke && r.d === d; });
  }

  // The swimmer's best for an event in a course: within their current age
  // group if they've raced it there, otherwise any age, otherwise converted
  // from their best in another course. null when they've never raced it.
  function bestFor(course, stroke, d) {
    var fastest = function (list) {
      return list.reduce(function (b, r) { return !b || r.secs < b.secs ? r : b; }, null);
    };
    var all = racesFor(course, stroke, d);
    var inGroup = GROUP ? all.filter(function (r) { return r.age == null || groupOf(r.age) === GROUP; }) : all;
    var r = fastest(inGroup) || fastest(all);
    if (r) return { secs: r.secs, race: r, inGroup: inGroup.indexOf(r) >= 0 };
    var other = null;
    Object.keys(COURSES).forEach(function (c) {
      if (c === course) return;
      var b = fastest(RACES.filter(function (x) { return x.course === c && x.stroke === stroke && matchDistance(x.d, course, stroke) === d; }));
      if (!b) return;
      var t = convert(b.secs, b.d, c, course, stroke).secs;
      if (!other || t < other.secs) other = { secs: t, race: b, from: c };
    });
    return other;
  }

  // ---------- Goal meet ----------

  // The next championship in the course (nationals first), otherwise its
  // next meet
  function goalMeet(course) {
    var now = new Date(today() + 'T00:00:00');
    var upcoming = MEETS.map(function (m) { return { title: m.title, url: m.url, course: m.course, date: new Date(m.date) }; })
      .filter(function (m) { return m.course === course && m.date >= now; })
      .sort(function (a, b) { return a.date - b.date; });
    var pick = function (re) { return upcoming.filter(function (m) { return re.test(m.title); })[0]; };
    var m = pick(/national championship/i) || pick(/championship/i) || upcoming[0];
    if (!m) return null;
    m.weeks = Math.max(0, Math.ceil((m.date - now) / (7 * 864e5)));
    m.short = m.title.replace(/^\d{4}\s+/, '').replace(/^U\.?S\.? Masters Swimming\s+/i, '');
    return m;
  }

  // ---------- Rendering ----------

  function renderControls() {
    // Event pills: the swimmer's most-raced events in this course, topped
    // up with the design's 100, 200 and 500 (400 m) free
    var counts = {};
    RACES.forEach(function (r) {
      if (r.course !== state.course) return;
      var key = r.stroke + ' ' + r.d;
      counts[key] = (counts[key] || 0) + 1;
    });
    var picks = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 3);
    [100, 200, 500].forEach(function (d) {
      var key = 'Free ' + matchDistance(d, state.course, 'Free');
      if (picks.length < 3 && picks.indexOf(key) < 0) picks.push(key);
    });
    var current = state.stroke + ' ' + state.d;
    if (picks.indexOf(current) < 0) picks[picks.length - 1] = current;
    picks.sort(function (a, b) {
      a = a.split(' '); b = b.split(' ');
      return a[0] === b[0] ? a[1] - b[1] : a[0] < b[0] ? -1 : 1;
    });
    root.querySelector('[data-st3-events]').innerHTML = picks.map(function (k) {
      var p = k.split(' ');
      return '<button type="button" data-stroke="' + p[0] + '" data-d="' + p[1] + '" aria-pressed="' + (k === current) + '">' + eventLabel(p[1], p[0]) + '</button>';
    }).join('');
    root.querySelectorAll('[data-st3-courses] button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === state.course));
    });
  }

  // The page's figures for the goal event, shared by every card
  function figures() {
    var f = { best: bestFor(state.course, state.stroke, state.d) };
    f.rank = GROUP && GENDER ? ranking(state.course, state.stroke, state.d, GROUP.min, GENDER) : null;
    f.bestTier = f.best ? tierOf(f.best.secs, f.rank) : null;
    f.topTen = GROUP ? topTenList(state.course, state.stroke, state.d, GROUP.min, GENDER) : null;
    // Goal: the next tier up (the slowest cut faster than your best, the
    // higher tier on a tie); in the Top 10 already, 1% off your best
    if (f.rank) {
      var next = null;
      TIERS.forEach(function (t) {
        var c = cutOf(f.rank, t);
        if ((!f.best || c < f.best.secs) && (!next || c > next.secs)) next = { tier: t, secs: c };
      });
      if (!f.best) next = { tier: TIERS[TIERS.length - 1], secs: cutOf(f.rank, TIERS[TIERS.length - 1]) };
      f.goalTier = next ? next.tier : null;
      f.goal = next ? next.secs : f.best.secs * 0.99;
    } else if (f.best) {
      f.goal = f.best.secs * 0.99;
    }
    f.ref = f.best ? f.best.secs : f.goal; // the time the race cards work from
    f.meet = goalMeet(state.course);
    var latest = racesFor(state.course, state.stroke, state.d).sort(function (a, b) { return a.date < b.date ? 1 : -1; })[0];
    f.latest = latest || null;
    return f;
  }

  function renderHead(f) {
    var name = (USER.firstName || '') + (USER.lastName ? ' ' + USER.lastName.charAt(0) + '.' : '');
    var who = [name.trim(), [USER.gender, GROUP && GROUP.label].filter(Boolean).join(' ')].filter(Boolean);
    if (f.meet) {
      set('headline', f.meet.short + (f.meet.weeks === 0 ? ' is this week' : ' is ' + f.meet.weeks + (f.meet.weeks === 1 ? ' week' : ' weeks') + ' out'));
      who.push(MONTHS[f.meet.date.getMonth()] + ' ' + f.meet.date.getDate() + ', ' + f.meet.date.getFullYear());
    } else {
      set('headline', 'Your goal race');
    }
    set('subhead', who.join(' · '));
    set('eventLabel', eventLabel(state.d, state.stroke));
    set('course', state.course);
  }

  function renderGoal(f) {
    set('best', f.best ? race(f.best.secs) : '—');
    set('bestNote', !f.best ? 'No races yet' :
      tierNote(f.bestTier) +
      (f.best.from ? (f.bestTier ? ' · ' : '') + 'from your ' + f.best.from + ' ' + race(f.best.race.secs) :
        !f.best.inGroup && f.best.race.age != null ? (f.bestTier ? ' · ' : '') + 'at age ' + f.best.race.age : ''));
    set('goal', race(f.goal));
    set('goalNote', tierNote(f.goalTier) || (f.best ? '1% under your best' : ''));
    var gap = f.best && isFinite(f.goal) ? f.best.secs - f.goal : NaN;
    set('gap', isFinite(gap) ? gap.toFixed(2) : '—');
    set('gapNote', !isFinite(gap) ? 'Race it to set a best' :
      f.meet && f.meet.weeks ? 's, about ' + (gap / f.meet.weeks).toFixed(2) + ' s per week' : 's');

    // Tier bar: bands slowest to fastest, left to right
    var bar = root.querySelector('[data-st3-tierbar]');
    var empty = root.querySelector('[data-st3="tierEmpty"]');
    bar.hidden = !f.rank;
    empty.hidden = !!f.rank;
    if (!f.rank) {
      empty.textContent = !GENDER || !GROUP ? 'Tiers need a gender and birth date on your profile.' :
        'No USMS rankings for ' + GROUP.label + ' ' + state.stroke + ' ' + state.d + ' yet.';
      return;
    }
    var edges = TIERS.map(function (t) { return cutOf(f.rank, t); }).reverse(); // B … Top 10
    var marks = [f.best ? f.best.secs : NaN, f.goal, f.latest ? f.latest.secs : NaN].filter(isFinite);
    var hi = Math.max.apply(null, [edges[0] * 1.06].concat(marks.map(function (m) { return m * 1.01; })));
    var lo = Math.min.apply(null, [edges[edges.length - 1] * 0.98].concat(marks.map(function (m) { return m * 0.995; })));
    var span = hi - lo;
    var pos = function (t) { return ((hi - t) / span * 100).toFixed(2) + '%'; };
    var bounds = [hi].concat(edges, [lo]);
    var names = [UNRATED].concat(TIERS.slice().reverse());
    var bands = root.querySelector('[data-st3-bands]');
    bands.innerHTML = names.map(function (n, i) {
      var w = (bounds[i] - bounds[i + 1]) / span * 100;
      if (w <= 0) return '';
      return '<div class="st3-tierbar__band st3-tierbar__band--' + i + '" style="width: ' + w.toFixed(2) + '%" title="' + n + '">' +
        (n === UNRATED ? '' : '<span>' + n + '</span>') + '</div>';
    }).join('');
    // Names that don't fit their band are left to its tooltip
    bands.querySelectorAll('span').forEach(function (el) {
      if (el.offsetWidth > el.parentNode.clientWidth - 6) el.parentNode.removeChild(el);
    });
    var place = function (sel, t) {
      root.querySelectorAll(sel).forEach(function (el) {
        el.hidden = !isFinite(t);
        if (isFinite(t)) el.style.left = pos(t);
      });
    };
    place('[data-st3-mark="now"], [data-st3-line="now"]', f.best ? f.best.secs : NaN);
    place('[data-st3-mark="goal"], [data-st3-line="goal"]', f.goal);
    place('[data-st3-line="last"]', f.latest ? f.latest.secs : NaN);
    // Labels: one "Now · Goal" when they'd overlap, and kept inside the bar
    var nowLabel = root.querySelector('[data-st3-mark="now"]'), goalLabel = root.querySelector('[data-st3-mark="goal"]');
    nowLabel.textContent = 'Now';
    if (f.best && isFinite(f.goal) && Math.abs(f.best.secs - f.goal) / span < 0.1) {
      goalLabel.hidden = true;
      nowLabel.textContent = 'Now · Goal';
      nowLabel.style.left = pos((f.best.secs + f.goal) / 2);
    }
    [nowLabel, goalLabel].forEach(function (el) {
      var at = parseFloat(el.style.left);
      el.style.transform = at > 92 ? 'translateX(-100%)' : at < 8 ? 'none' : '';
    });
    set('scaleHi', race(hi));
    set('scaleLo', race(lo));
    set('lastNote', f.latest ? 'Dotted: latest race ' + race(f.latest.secs) + (f.latest.date ? ' (' + longDate(f.latest.date) + ')' : '') : '');
    root.querySelector('[data-st3-track]').setAttribute('aria-label',
      'Tier cuts from ' + LOWEST + ' ' + race(edges[0]) + ' to Top 10 ' + race(edges[edges.length - 1]) +
      (f.best ? '. Your best ' + race(f.best.secs) + ' is ' + f.bestTier : '') +
      (isFinite(f.goal) ? '. Goal ' + race(f.goal) : ''));
  }

  function renderPlan(f) {
    var fill = root.querySelector('[data-st3-ring-fill]'), ring = root.querySelector('[data-st3-ring]');
    var link = root.querySelector('[data-st3-meet-link]');
    if (!f.meet) {
      set('planWeek', 'No meet scheduled');
      set('planPhase', 'No upcoming ' + state.course + ' meets on the calendar');
      fill.setAttribute('stroke-dasharray', '0 100');
      ring.setAttribute('aria-label', 'No plan');
      set('meetName', 'Find a meet');
      link.href = '/events/index.html';
      set('meetDate', '');
      return;
    }
    var week = PLAN_WEEKS - f.meet.weeks + 1;
    if (week < 1) {
      set('planWeek', 'Plan starts in ' + (1 - week) + (1 - week === 1 ? ' week' : ' weeks'));
      set('planPhase', 'Base season · ' + PLAN_WEEKS + '-week plan to the meet');
      week = 0;
    } else {
      week = Math.min(week, PLAN_WEEKS);
      set('planWeek', 'Week ' + week + ' of ' + PLAN_WEEKS);
      set('planPhase', (week <= 4 ? 'Base' : week <= 8 ? 'Build' : week <= 11 ? 'Peak' : 'Taper') + ' phase');
    }
    var pct = Math.round(week / PLAN_WEEKS * 100);
    fill.setAttribute('stroke-dasharray', pct + ' 100');
    ring.setAttribute('aria-label', 'Plan ' + pct + ' percent complete');
    set('meetName', f.meet.title);
    link.href = f.meet.url;
    set('meetDate', longDate(f.meet.date.getFullYear() + '-' + (f.meet.date.getMonth() + 1) + '-' + f.meet.date.getDate()) + ' · ' + f.meet.course);
  }

  // Split lengths: 50s up to the 200, then 100s, 200s, or 150s for the mile
  function legFor(d) {
    return d <= 200 ? 50 : d <= 500 ? 100 : d <= 1000 ? 200 : 150;
  }

  function splitTimes(total, n) {
    var segs = [], sum = 0, i;
    for (i = 0; i < n; i++) {
      var x = n > 1 ? i / (n - 1) - 0.5 : 0;
      segs.push(total / n * (1 + TREND * x));
    }
    if (n > 1) segs[0] -= DIVE;
    segs.forEach(function (s) { sum += s; });
    return segs.map(function (s) { return s * total / sum; });
  }

  function splitPlan(f) {
    if (!isFinite(f.goal)) return [];
    var leg = legFor(state.d), n = state.d / leg, cum = 0, unit = COURSES[state.course].unit;
    var segs = splitTimes(f.goal, n), max = Math.max.apply(null, segs);
    return segs.map(function (s, i) {
      cum += s;
      return { label: (i + 1) * leg + ' ' + unit, t: s, cum: cum, w: s / max * 100 };
    });
  }

  function renderRace(f) {
    var plan = splitPlan(f);
    root.querySelector('[data-st3-splits]').innerHTML = plan.length ? plan.map(function (s) {
      return '<div class="st3-splits__row"><span class="st3-splits__label">' + s.label + '</span>' +
        '<span class="st3-splits__track"><span style="width: ' + s.w.toFixed(1) + '%"></span></span>' +
        '<span class="st3-splits__time st3-num">' + race(s.t) + '</span></div>';
    }).join('') : '<p class="st3-card__note">Set a goal to plan splits.</p>';

    // Predicted pace: Riegel from the reference time, with the swimmer's
    // actual bests as filled dots
    var dists = eventsFor(state.course, state.stroke);
    var paces = dists.map(function (d) {
      var pred = f.ref * Math.pow(d / state.d, RIEGEL) / (d / 100);
      var best = bestFor(state.course, state.stroke, d);
      var actual = best && !best.from ? best.secs / (d / 100) : NaN;
      return { d: d, pred: pred, actual: actual };
    });
    var all = [];
    paces.forEach(function (p) { all.push(p.pred); if (isFinite(p.actual)) all.push(p.actual); });
    var pmin = Math.min.apply(null, all), pmax = Math.max.apply(null, all), pad = (pmax - pmin) * 0.08 || 1;
    pmin -= pad; pmax += pad;
    var x = function (i) { return dists.length > 1 ? i / (dists.length - 1) * 100 : 50; };
    var y = function (p) { return (p - pmin) / (pmax - pmin) * 100; }; // slower is lower
    var ok = isFinite(f.ref);
    root.querySelector('[data-st3-pace-line]').setAttribute('points', ok ? paces.map(function (p, i) {
      return x(i).toFixed(1) + ',' + y(p.pred).toFixed(1);
    }).join(' ') : '');
    root.querySelector('[data-st3-pace-dots]').innerHTML = ok ? paces.map(function (p, i) {
      var has = isFinite(p.actual), v = has ? p.actual : p.pred;
      return '<span class="st3-pace__dot' + (has ? ' st3-pace__dot--swum' : '') + '" style="left: ' + x(i).toFixed(1) + '%; top: ' + y(v).toFixed(1) + '%" title="' +
        p.d + ': ' + clock(v) + ' /100' + (has ? '' : ' (predicted)') + '"></span>';
    }).join('') : '';
    root.querySelector('[data-st3-pace-svg]').setAttribute('aria-label', ok ? 'Pace per 100 by distance, higher is faster: ' +
      paces.map(function (p) { return p.d + ' ' + clock(isFinite(p.actual) ? p.actual : p.pred); }).join(', ') : 'No pace to show');
    root.querySelector('[data-st3-pace-axis]').innerHTML = dists.map(function (d) { return '<span>' + d + '</span>'; }).join('');
    var beats = [], trails = [];
    paces.forEach(function (p) {
      if (p.d === state.d || !isFinite(p.actual)) return;
      if (p.actual < p.pred * 0.99) beats.push(p.d);
      else if (p.actual > p.pred * 1.01) trails.push(p.d);
    });
    var list = function (ds) { return ds.length > 1 ? ds.slice(0, -1).join(', ') + ' and ' + ds[ds.length - 1] : ds[0]; };
    set('paceNote', !ok ? '' : 'Higher is faster. Filled = swum, open = predicted from your ' + state.d + '.' +
      (beats.length ? ' Your ' + list(beats) + (beats.length > 1 ? ' beat' : ' beats') + ' prediction' : '') +
      (beats.length && trails.length ? '; your ' : trails.length ? ' Your ' : '') +
      (trails.length ? list(trails) + (trails.length > 1 ? ' trail' : ' trails') + ' it' : '') +
      (beats.length || trails.length ? '.' : ''));

    // The reference time in every course
    root.querySelector('[data-st3-conv]').innerHTML = Object.keys(COURSES).map(function (c) {
      var t = ok ? convert(f.ref, state.d, state.course, c, state.stroke) : { secs: NaN, d: 0 };
      var on = c === state.course;
      return '<div class="st3-conv__row' + (on ? ' is-on' : '') + '"><span class="st3-conv__course">' + c +
        ' <span class="st3-conv__note">' + (on ? 'selected' : t.d && t.d !== state.d ? t.d + ' ' + COURSES[c].unit : '') + '</span></span>' +
        '<span class="st3-conv__time st3-num">' + race(t.secs) + '</span></div>';
    }).join('');
    set('pace', ok ? clock(f.ref / (state.d / 100)) : '—');
  }

  // Where a time sits in pooled rankings: groups of one gender, or everyone
  function pooledTop(secs, genders) {
    var place = 0, n = 0;
    CUTS.forEach(function (g) {
      if (g.course !== 'SCY' || genders.indexOf(g.gender) < 0) return;
      var r = ranking(state.course, state.stroke, state.d, g.ageGroup, g.gender);
      if (!r) return;
      place += placeIn(secs, r); n += r.n;
    });
    return n ? place / n * 100 : NaN;
  }

  function topPct(p) {
    return isFinite(p) ? 'Top ' + (p < 1 ? '1' : Math.round(p)) + '%' : '—';
  }

  function renderStanding(f) {
    var best = f.best ? f.best.secs : NaN;

    // Swim age: the age whose typical (B, top 55%) time matches your best
    var points = AGE_GROUPS.map(function (g) {
      var r = GENDER ? ranking(state.course, state.stroke, state.d, g.min, GENDER) : null;
      return r ? { age: g.min === 18 ? 21 : g.min + 2, b: cutOf(r, LOWEST), group: g } : null;
    }).filter(Boolean);
    var swimAge = null, or = '';
    if (isFinite(best) && points.length > 1) {
      if (best <= points[0].b) { swimAge = points[0].age; or = ' or younger'; }
      for (var i = 1; i < points.length && swimAge == null; i++) {
        var a = points[i - 1], b = points[i];
        if ((best - a.b) * (best - b.b) <= 0 && a.b !== b.b) swimAge = a.age + (b.age - a.age) * (best - a.b) / (b.b - a.b);
      }
      if (swimAge == null) { swimAge = points[points.length - 1].age; or = ' or older'; }
      swimAge = Math.round(swimAge);
    }
    set('swimAge', swimAge != null ? swimAge + or : '—');
    set('swimAgeNote', swimAge != null && AGE != null ? 'vs ' + AGE + ' actual' : '');
    var pct = function (age) { return Math.max(0, Math.min(100, (age - 18) / (84 - 18) * 100)); };
    var span = root.querySelector('[data-st3-agebar-span]'), sw = root.querySelector('[data-st3-agebar-swim]'), act = root.querySelector('[data-st3-agebar-actual]');
    [span, sw, act].forEach(function (el) { el.hidden = swimAge == null || AGE == null; });
    if (swimAge != null && AGE != null) {
      var lo = pct(Math.min(swimAge, AGE)), hi = pct(Math.max(swimAge, AGE));
      span.style.left = lo + '%'; span.style.width = (hi - lo) + '%';
      sw.style.left = pct(swimAge) + '%'; sw.textContent = swimAge;
      act.style.left = pct(AGE) + '%'; act.textContent = AGE;
    }
    var own = GROUP && points.filter(function (p) { return p.group === GROUP; })[0];
    var at = points.filter(function (p) { return p.group.min === (GROUP && GROUP.min === 30 ? 25 : 30); })[0];
    set('swimAgeAt', own && at && isFinite(best) ? 'At ' + at.group.label + ' this swim would be about ' + race(best * at.b / own.b) + '.' :
      !isFinite(best) ? 'Race the ' + eventLabel(state.d, state.stroke) + ' to see your swim age.' : '');

    // Percentiles: your age group, your gender, everyone
    var rows = [];
    if (isFinite(best) && f.rank) {
      rows.push([GENDER + ' ' + GROUP.label, placeIn(best, f.rank) / f.rank.n * 100]);
      rows.push(['All ' + GENDER.toLowerCase(), pooledTop(best, [GENDER])]);
      rows.push(['Everyone', pooledTop(best, ['Men', 'Women'])]);
    }
    set('percentile', rows.length ? topPct(rows[0][1]) : '—');
    root.querySelector('[data-st3-percentiles]').innerHTML = rows.length ? rows.map(function (r) {
      return '<div class="st3-bars__row"><span class="st3-bars__label">' + r[0] + '</span>' +
        '<span class="st3-bars__track"><span style="width: ' + Math.max(2, 100 - r[1]).toFixed(0) + '%"></span></span>' +
        '<span class="st3-bars__value">' + topPct(r[1]) + '</span></div>';
    }).join('') : '<p class="st3-card__note">' + (f.rank ? 'Race the ' + eventLabel(state.d, state.stroke) + ' to see where you stand.' : 'No rankings for this event yet.') + '</p>';
    var tn = root.querySelector('[data-st3="topTenNote"]');
    tn.hidden = !(f.topTen && isFinite(best));
    if (!tn.hidden) {
      var placed = f.topTen.times.filter(function (t) { return t < best; }).length + 1;
      tn.textContent = 'USMS Top 10 (' + f.topTen.year + '): 10th was ' + race(f.topTen.last) + '. ' +
        (placed <= 10 ? 'Your best would have placed ' + placed + ordinal(placed) + '.' : 'You\'re ' + (best - f.topTen.last).toFixed(2) + ' s off.');
    }

    // Future age groups: the same time in the next group, then a projected
    // time two groups on that holds your place (by the B cuts' aging curve)
    var k = GROUP ? AGE_GROUPS.indexOf(GROUP) : -1;
    var future = root.querySelector('[data-st3-future]');
    if (!isFinite(best) || !f.rank || k < 0) {
      future.innerHTML = '<li class="st3-card__note">' + (f.rank ? 'Race the ' + eventLabel(state.d, state.stroke) + ' to see how it ages.' : 'No rankings for this event yet.') + '</li>';
      return;
    }
    var birthYear = Number((USER.birthDate || '').split('/')[2]);
    var item = function (dot, title, sub, time) {
      return '<li class="st3-timeline__item"><span class="st3-timeline__dot st3-timeline__dot--' + dot + '"></span>' +
        '<span>' + title + '<br><span class="st3-timeline__sub">' + sub + '</span></span><span class="st3-num">' + race(time) + '</span></li>';
    };
    var out = item('now', 'Now · ' + GROUP.label, tierNote(f.bestTier), best);
    var next = AGE_GROUPS[k + 1], later = AGE_GROUPS[k + 2];
    var rNext = next && ranking(state.course, state.stroke, state.d, next.min, GENDER);
    if (rNext) {
      out += item('next', (birthYear + next.min) + ' · turn ' + next.min, 'Same time ranks ' + tierOf(best, rNext) + ' in ' + next.label, best);
    }
    var rLater = later && ranking(state.course, state.stroke, state.d, later.min, GENDER);
    if (rLater) {
      var projected = best * cutOf(rLater, LOWEST) / cutOf(f.rank, LOWEST);
      out += item('later', (birthYear + later.min) + ' · turn ' + later.min, 'Projected, holding your place · ' + tierOf(projected, rLater), projected);
    }
    future.innerHTML = out;
  }

  function ordinal(n) {
    var tail = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
    return tail;
  }

  // The latest Top 10 list for the event, course, age group and gender:
  // { year, times, last } or null. Lists aren't converted between courses.
  function topTenList(course, stroke, d, ageMin, gender) {
    var list = TOP_TENS.filter(function (l) { return l.course === course && l.ageGroup === ageMin && l.gender === gender; })[0];
    if (!list) return null;
    var years = Object.keys(list.seasons).sort(), year = years[years.length - 1];
    var times = ((list.seasons[year][stroke] || {})[d] || []).map(parse);
    return times.length ? { year: year, times: times, last: times[times.length - 1] } : null;
  }

  // Sample week from the design reference; days before today are done
  var WEEK = [['Mon', 'Aerobic base', '3,200 yd'], ['Tue', 'Threshold 200s', '2,800 yd'], ['Wed', 'Technique + kick', '2,600 yd'],
    ['Thu', 'Rest', ''], ['Fri', 'Broken 200s', '3,400 yd'], ['Sat', 'Long easy', '2,200 yd'], ['Sun', 'Rest', '']];

  function renderTrain(f) {
    var todayAt = (new Date().getDay() + 6) % 7; // Monday first
    root.querySelector('[data-st3-week]').innerHTML = WEEK.map(function (w, i) {
      var rest = !w[2], status = i === todayAt ? 'Today' : i < todayAt && !rest ? 'Done' : '';
      return '<div class="st3-day' + (i === todayAt ? ' is-today' : rest ? ' is-rest' : '') + '">' +
        '<div class="st3-day__top"><span class="st3-day__name">' + w[0] + '</span><span>' + status + '</span></div>' +
        '<div class="st3-day__title">' + w[1] + '</div><div class="st3-day__yd st3-num">' + w[2] + '</div></div>';
    }).join('');

    // What the race history says
    var tips = [];
    if (f.best && !f.best.from) {
      var r = f.best.race;
      tips.push('Your fastest ' + eventLabel(state.d, state.stroke) + ' ' + state.course + ' is ' + race(r.secs) +
        (r.date ? ', from ' + longDate(r.date) : '') + (r.age != null ? ' at age ' + r.age : '') + '.');
    }
    var counts = {}, top = null;
    RACES.forEach(function (x) {
      var key = x.course + ' ' + x.d + ' ' + x.stroke;
      counts[key] = (counts[key] || 0) + 1;
      if (!top || counts[key] > counts[top]) top = key;
    });
    if (top && counts[top] > 1) {
      var p = top.split(' ');
      tips.push('You\'ve raced the ' + eventLabel(p[1], p[2]) + ' ' + p[0] + ' ' + counts[top] + ' times, more than any other event.');
    }
    var mine = racesFor(state.course, state.stroke, state.d).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (mine.length > 1 && mine[mine.length - 1].date) {
      var cutoff = Number(mine[mine.length - 1].date.slice(0, 4)) - 1 + mine[mine.length - 1].date.slice(4);
      var recent = mine.filter(function (x) { return x.date > cutoff; }), before = mine.filter(function (x) { return x.date <= cutoff; });
      if (recent.length && before.length) {
        var rb = Math.min.apply(null, recent.map(function (x) { return x.secs; }));
        var bb = Math.min.apply(null, before.map(function (x) { return x.secs; }));
        tips.push('Your latest year of ' + eventLabel(state.d, state.stroke) + 's is ' + Math.abs(rb - bb).toFixed(2) + ' s ' +
          (rb <= bb ? 'faster' : 'slower') + ' than your best before it.');
      }
    }
    root.querySelector('[data-st3-insights]').innerHTML = tips.length ? tips.map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') :
      '<li>Add races in <a href="/fitness-and-training/swim-tools-v2/index.html">Swim Tools</a> to see what they say.</li>';

    // Lifetime racing: races per year
    var years = {}, days = {};
    RACES.forEach(function (x) {
      if (!x.date) return;
      var y = x.date.slice(0, 4);
      years[y] = (years[y] || 0) + 1;
      days[x.date] = 1;
    });
    var ys = Object.keys(years).sort(), first = ys[0];
    set('lifetime', RACES.length ? RACES.length.toLocaleString() + (RACES.length === 1 ? ' race' : ' races') : '—');
    var shown = ys.slice(-11), max = Math.max.apply(null, shown.map(function (y) { return years[y]; }).concat([1]));
    root.querySelector('[data-st3-years]').innerHTML = shown.map(function (y, i) {
      return '<span class="st3-years__bar st3-years__bar--' + Math.min(3, Math.floor(i / shown.length * 4)) + '" style="height: ' +
        Math.max(8, years[y] / max * 100).toFixed(0) + '%" title="' + y + ': ' + years[y] + '"></span>';
    }).join('');
    set('lifetimeNote', first ? 'Since ' + first + ' · ' + Object.keys(days).length.toLocaleString() + ' race days' : 'No races yet');
  }

  function renderLastRace() {
    var r = RACES.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; })[0];
    if (!r) {
      set('lastRace', 'No races yet');
      ['lastKcal', 'lastTier', 'lastRun', 'lastRide'].forEach(function (k) { set(k, '—'); });
      return;
    }
    set('lastRace', eventLabel(r.d, r.stroke) + ' ' + r.course + ' · ' + race(r.secs) + (r.date ? ' · ' + longDate(r.date) : ''));
    var pace = r.secs / (r.d / 100);
    var intensity = Math.min(1.4, Math.max(0.7, REF_PACE / (pace / COURSES[r.course].factor)));
    set('lastKcal', Math.round(r.secs / 60 * CAL_PER_MIN * (STROKE_BURN[r.stroke] || 1) * intensity));
    var g = r.age != null ? groupOf(r.age) : GROUP;
    var rk = g && GENDER ? ranking(r.course, r.stroke, r.d, g.min, GENDER) : null;
    set('lastTier', tierOf(r.secs, rk) || '—');
    var km = r.d * (COURSES[r.course].unit === 'yd' ? 0.9144 : 1) / 1000;
    var fmt = function (v) { return '≈ ' + (v < 10 ? v.toFixed(1) : Math.round(v)) + ' km'; };
    set('lastRun', fmt(km * RUN_RATIO));
    set('lastRide', fmt(km * RIDE_RATIO));
  }

  // Coach desk: the design's sample prompts and results
  var DESK = {
    vibe: { p: 'Describe the workout you want', ph: '45 minutes, feel fast but not wrecked', cta: 'Generate workout', head: 'Sample result · 2,850 yd',
      r: [['Warm-up: 400 swim, 4×50 build', '600'], ['Main: 6×100 @ race pace +4, 30 s rest', '600'], ['Speed: 8×25 fast from a push', '200'], ['Kick 6×75 fins, cool-down 300', '750']] },
    find: { p: 'What do you want to swim?', ph: 'a threshold set for my 200', cta: 'Find in Workout Library', head: 'Best matches',
      r: [['Threshold Thursday', '3,400 yd'], ['200 pace ladder', '3,000 yd'], ['Broken 200s', '2,800 yd']] },
    body: { p: 'What hurts, and when in the stroke?', ph: 'front of my shoulder at the catch', cta: 'Check my stroke', head: 'Common stroke causes, not a diagnosis',
      r: [['Hand crossing midline on entry', 'likely'], ['Dropped elbow in early catch', 'likely'], ['Over-rotation on breathing side', 'possible']] }
  };

  function renderDesk() {
    var d = DESK[state.desk];
    root.querySelectorAll('[data-st3-desk-tabs] [role="tab"]').forEach(function (t) {
      t.setAttribute('aria-selected', String(t.getAttribute('data-value') === state.desk));
    });
    set('deskPrompt', d.p);
    root.querySelector('[data-st3-desk-input]').placeholder = d.ph;
    set('deskCta', d.cta);
    set('deskHead', d.head);
    root.querySelector('[data-st3-desk-results]').innerHTML = d.r.map(function (r) {
      return '<div class="st3-desk__row"><span>' + r[0] + '</span><span class="st3-num">' + r[1] + '</span></div>';
    }).join('');
  }

  // The sheet (modal): tier cuts or the split plan
  function renderSheet(kind) {
    var f = figures(), cols, rows = [], sub, note = '';
    if (kind === 'splits') {
      document.getElementById('st3-sheet-title').textContent = 'Split plan · ' + eventLabel(state.d, state.stroke);
      sub = 'Goal ' + race(f.goal) + ' · ' + state.course + ' · a slight negative split, with a dive on the first';
      cols = ['Split', 'Time', 'Cumulative'];
      rows = splitPlan(f).map(function (s) { return { a: s.label, b: race(s.t), c: race(s.cum) }; });
    } else {
      document.getElementById('st3-sheet-title').textContent = 'Tier cuts · ' + eventLabel(state.d, state.stroke);
      sub = (GENDER && GROUP ? GENDER + ' ' + GROUP.label + ' · ' : '') + state.course + ' · USMS event rankings, 2025–2026';
      cols = ['Tier', 'Cut', 'Rank'];
      if (f.rank) {
        var t10 = f.rank.top10;
        rows = TIERS.map(function (t) {
          var you = f.bestTier === t, c = cutOf(f.rank, t);
          var rule = t === TOP_10 ? (t10.list ? '10th place, USMS Top 10 ' + t10.year : '10th-fastest ranked swim') :
            c === t10.secs ? 'top ' + TIER_TOP[t] + '%, within the Top 10 here' : 'top ' + TIER_TOP[t] + '%';
          return { a: t, b: race(c), c: rule + (you ? ' · you' : ''), on: you };
        });
        if (f.bestTier === UNRATED) rows.push({ a: UNRATED, b: '', c: 'you', on: true });
        note = (f.rank.converted ? 'Converted from SCY rankings. ' : '') +
          (f.rank.capped ? 'This ranking hit its 500-swim limit, so the cuts run a little fast. ' : '') +
          'Cuts come from ' + f.rank.n + ' ranked swims.';
      } else {
        note = 'No rankings for this event, age group and gender yet.';
      }
    }
    set('sheetSub', sub);
    set('sheetNote', note);
    document.querySelector('[data-st3-sheet-cols]').innerHTML = cols.map(function (c) { return '<th scope="col">' + c + '</th>'; }).join('');
    document.querySelector('[data-st3-sheet-rows]').innerHTML = rows.map(function (r) {
      return '<tr' + (r.on ? ' class="is-you"' : '') + '><th scope="row">' + r.a + '</th><td>' + r.b + '</td><td>' + r.c + '</td></tr>';
    }).join('');
  }

  function render() {
    renderControls();
    var f = figures();
    renderHead(f);
    renderGoal(f);
    renderPlan(f);
    renderRace(f);
    renderStanding(f);
    renderTrain(f);
  }

  // ---------- Events ----------

  root.addEventListener('click', function (e) {
    var ev = e.target.closest('[data-st3-events] button');
    if (ev) {
      state.stroke = ev.getAttribute('data-stroke');
      state.d = Number(ev.getAttribute('data-d'));
      render();
      return;
    }
    var course = e.target.closest('[data-st3-courses] button');
    if (course) {
      var c = course.getAttribute('data-value');
      state.d = matchDistance(state.d, c, state.stroke) || eventsFor(c, state.stroke)[1];
      state.course = c;
      render();
      return;
    }
    var tab = e.target.closest('[data-st3-desk-tabs] [role="tab"]');
    if (tab) {
      state.desk = tab.getAttribute('data-value');
      renderDesk();
      return;
    }
    // Fill the sheet before modal.js opens it
    var sheet = e.target.closest('[data-st3-sheet]');
    if (sheet) renderSheet(sheet.getAttribute('data-st3-sheet'));
  });

  var print = document.querySelector('[data-st3-print]');
  if (print) print.addEventListener('click', function () { window.print(); });

  render();
  renderDesk();
  renderLastRace();
})();
