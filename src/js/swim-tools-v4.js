// Swim Tools v4: the "Swim Tools v2 + engagement layer" design, filled in
// from our data. One event (course, stroke, distance) and goal drive the
// page, and one switch picks the time every tool works from: your latest,
// your best or your goal. Rankings (age-group middle, tiers) come from USMS
// event rankings; races from USMS results; the swim log is sample data kept
// in the browser. Results are estimates, not USMS-approved formulas.
(function () {
  var root = document.querySelector('.st4');
  if (!root) return;

  // ---------- Constants (shared with v2 and v3) ----------

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
  // Ranking tiers, fastest first: the Top 10 (10th place), then to the
  // 25th, 50th and 75th percentiles of the full ranking, then the rest
  var TOP_10 = 'Top 10';
  var BOTTOM = '76–100%';
  var TIERS = [TOP_10, '11th–25%', '26–50%', '51–75%', BOTTOM];
  var TIER_SHARE = { '11th–25%': 0.25, '26–50%': 0.5, '51–75%': 0.75 };
  var TIER_WHERE = { 'Top 10': '10th place', '11th–25%': 'Top 25%', '26–50%': 'Top 50%', '51–75%': 'Top 75%', '76–100%': 'Slower than the top 75%' };
  var TREND = { even: 0, fast: 0.06, neg: -0.05 }; // split pace trend, as in v2
  var DIVE = 1.8;   // seconds a dive start takes off the first split
  var PUSH = 0.7;   // a push start runs about this much slower than a dive
  // Calories, as in v2's Training Metrics
  var CAL_PER_MIN = 7.2;
  var REF_PACE = 105;
  var RACES_SHOWN = 6;
  var MILESTONES = [100, 250, 500, 1000, 2500, 5000, 10000];
  // The sample log: miles before the browser's own entries, and a week of
  // swims (Mon, Wed done, Fri planned) for the This week card
  var SAMPLE_MILES = 412;
  var SAMPLE_WEEK = [[0, 2400, 'done'], [2, 2700, 'done'], [4, 2400, 'planned']];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // ---------- Data ----------

  function json(id) {
    try { return JSON.parse(document.getElementById(id).textContent); } catch (e) { return null; }
  }
  var HISTORY = json('race-history-data') || { swimmers: {} };
  var USERS = (json('site-users-data') || {}).users || {};
  var MEETS = json('meets-data') || [];
  var CLUBS = json('club-names-data') || {};

  // The active persona, as current-user.js resolves it: ?user=, then (unless
  // the page is pinned to its default) the persona saved from other pages
  function swimmerId() {
    var id = null, pinned = document.getElementById('site-users-data').hasAttribute('data-pin-default');
    try {
      id = new URLSearchParams(location.search).get('user') || (pinned ? null : sessionStorage.getItem('activeUser'));
    } catch (e) {}
    return id && USERS[id] ? id : HISTORY.default;
  }
  var SWIMMER = swimmerId();
  var USER = USERS[SWIMMER] || {};
  var GENDER = { M: 'Men', F: 'Women' }[USER.gender] || '';
  var MEMBER = !!(USER.loggedIn && USER.membershipTier);
  var GOAL_KEY = 'swimTools.v4.event.' + SWIMMER;
  var LOG_KEY = 'swimTools.v4.log.' + SWIMMER;

  function iso(d) {
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  var TODAY = iso(new Date());

  function ageOn(date) {
    var b = (USER.birthDate || '').split('/');
    if (b.length !== 3) return null;
    var d = date.split('-').map(Number);
    return d[0] - b[2] - (d[1] * 100 + d[2] < b[0] * 100 + Number(b[1]) ? 1 : 0);
  }
  var AGE = ageOn(TODAY);
  function groupOf(age) {
    var found = null;
    AGE_GROUPS.forEach(function (g) { if (age >= g.min) found = g; });
    return found;
  }
  var GROUP = AGE != null ? groupOf(AGE) : null;

  // A real number: isFinite(null) is true, so a missing goal needs this
  function isNum(x) {
    return typeof x === 'number' && isFinite(x);
  }

  function readStore(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  // Races: the viewer's own list from v2 if they've edited it, otherwise
  // the persona's results
  var RACES = (function () {
    var races = readStore('swimTools.races.' + SWIMMER);
    if (!Array.isArray(races)) races = ((HISTORY.swimmers || {})[SWIMMER] || {}).races || [];
    return races.map(function (r) {
      return {
        course: r.course, d: Number(r.distance), stroke: r.stroke, secs: parse(r.time), date: r.date || '',
        age: r.age != null ? r.age : r.date ? ageOn(r.date) : null
      };
    }).filter(function (r) { return isFinite(r.secs) && COURSES[r.course]; })
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; }); // newest first
  })();

  // ---------- Helpers ----------

  function parse(text) {
    var parts = String(text).trim().split(':');
    if (parts.length > 2 || parts[parts.length - 1] === '') return NaN;
    var secs = parts.length === 2 ? Number(parts[0]) * 60 + Number(parts[1]) : Number(parts[0]);
    return secs > 0 ? secs : NaN;
  }
  function race(s) {
    if (s == null || !isFinite(s)) return '—';
    s = Math.round(s * 100) / 100;
    var m = Math.floor(s / 60), r = (s - m * 60).toFixed(2);
    return m ? m + ':' + (r < 10 ? '0' : '') + r : r;
  }
  // m:ss, or whole seconds under a minute
  function whole(s) {
    var m = Math.floor(s / 60), r = Math.round(s - m * 60);
    return m ? m + ':' + (r < 10 ? '0' : '') + r : String(r);
  }
  function clock(s) {
    if (s == null || !isFinite(s)) return '—';
    s = Math.round(s);
    var r = s % 60;
    return Math.floor(s / 60) + ':' + (r < 10 ? '0' : '') + r;
  }
  function monthYear(date) {
    var d = date.split('-').map(Number);
    return MONTHS[d[1] - 1].slice(0, 3) + ' ' + d[0];
  }
  function longDate(date) {
    var d = date.split('-').map(Number);
    return MONTHS[d[1] - 1].slice(0, 3) + ' ' + d[2] + ', ' + d[0];
  }
  function eventsFor(course, stroke) {
    return EVENTS[course][stroke] || EVENTS[course].stroke;
  }
  function matchDistance(d, course, stroke) {
    var list = eventsFor(course, stroke);
    return list.indexOf(d) >= 0 ? d : list.indexOf(EQUIVALENT[d]) >= 0 ? EQUIVALENT[d] : 0;
  }
  function convert(secs, d, from, to, stroke) {
    var target = matchDistance(d, to, stroke);
    if (!target) return { d: 0, secs: NaN };
    return { d: target, secs: secs / COURSES[from].factor * COURSES[to].factor * target / d };
  }
  function eventName(d, stroke) {
    return d + ' ' + stroke;
  }
  function eventLower(d, stroke) {
    return d + ' ' + (stroke === 'IM' ? 'IM' : stroke.toLowerCase());
  }
  function set(name, html, asHtml) {
    root.parentNode.querySelectorAll('[data-st4="' + name + '"]').forEach(function (el) {
      if (asHtml) el.innerHTML = html; else el.textContent = html;
    });
    document.querySelectorAll('.st4-modal [data-st4="' + name + '"]').forEach(function (el) { el.textContent = html; });
  }
  function q(sel) { return root.querySelector(sel); }

  // ---------- Rankings: USMS Top Times ----------

  // The Top Times API's static files (docs/api/top-times.openapi.yaml): one
  // event's full ranking per season, gender, age group and course, fetched
  // as the page needs it. Which exist is listed in available.json. Each
  // ranking is { n, times (seconds, fastest first), truncated, converted,
  // season }, in the page's course; a course with no files of its own uses
  // SCY's, converted.
  var DATA_BASE = '/data/top-times/';
  var AVAILABLE = null;  // its datasets, once available.json is in
  var RANKS = {};        // url: 'loading', null (no ranking), or the file's ranking
  var renderQueued = false;

  function ageKey(group) {
    var k = AGE_GROUPS.indexOf(group), next = AGE_GROUPS[k + 1];
    return group.min + '-' + (next ? next.min - 1 : group.min + 4);
  }
  // The loaded datasets for a course, gender and age group, newest season first
  function datasetsFor(course, gender, age) {
    return (AVAILABLE || []).filter(function (x) { return x.course === course && x.gender === gender && x.age === age; })
      .sort(function (a, b) { return b.season - a.season; });
  }
  function datasetFor(course, gender, age) {
    return datasetsFor(course, gender, age)[0] || null;
  }
  function request(url) {
    RANKS[url] = 'loading';
    fetch(url).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }).then(function (data) {
      RANKS[url] = data && data.swimmers && data.swimmers.length ? {
        n: data.total || data.swimmers.length, truncated: !!data.truncated, seasonLabel: data.seasonLabel,
        // 'usms' (real) or 'synthetic' (modeled: docs/api/top-times.openapi.yaml)
        provenance: data.provenance || 'usms',
        times: data.swimmers.map(function (x) { return parse(x.time); }).filter(isFinite),
        // The Top 10 (more on a tie for 10th), for Top 10 by season
        top: data.swimmers.filter(function (x) { return x.rank <= 10; })
      } : null;
      if (!renderQueued) {
        renderQueued = true;
        setTimeout(function () { renderQueued = false; render(); }, 0);
      }
    });
  }
  // Still fetching something the page asked for
  function pending() {
    return AVAILABLE === null || Object.keys(RANKS).some(function (k) { return RANKS[k] === 'loading'; });
  }

  // An event's ranking for an age group and the swimmer's gender, or null
  // (not loaded, not fetched yet, or nobody ranked)
  // The seasons an event has rankings for, in the page's course or else
  // SCY's (converted): [{ season, url, scale, from }], newest first
  function seasonsFor(course, stroke, d, group) {
    if (!group || !GENDER || !AVAILABLE) return [];
    var gender = GENDER.toLowerCase(), age = ageKey(group), from = course.toLowerCase();
    var sets = datasetsFor(from, gender, age);
    if (!sets.length) { from = 'scy'; sets = datasetsFor(from, gender, age); }
    var FROM = from.toUpperCase(), fromD = matchDistance(d, FROM, stroke);
    if (!fromD) return [];
    return sets.map(function (ds) {
      return {
        season: ds.season, from: FROM, scale: COURSES[course].factor / COURSES[FROM].factor * d / fromD,
        url: DATA_BASE + ds.season + '/' + gender + '-' + age + '/' + from + '/' + stroke.toLowerCase() + '/' + fromD + '.json'
      };
    });
  }
  // One season's ranking (the latest unless one is given), once fetched
  function groupRank(course, stroke, d, group, season) {
    var src = seasonsFor(course, stroke, d, group).filter(function (x) { return !season || x.season === season; })[0];
    if (!src) return null;
    if (!(src.url in RANKS)) request(src.url);
    var e = RANKS[src.url];
    if (!e || e === 'loading') return null;
    return {
      n: e.n, truncated: e.truncated, converted: src.from !== course, seasonLabel: e.seasonLabel, season: src.season,
      synthetic: e.provenance === 'synthetic',
      times: e.times.map(function (t) { return t * src.scale; }),
      top: e.top.map(function (x) { return { rank: x.rank, name: x.name, age: x.age, club: x.club, secs: parse(x.time) * src.scale }; })
    };
  }
  // " · synthetic data" when any of these rankings is modeled, not real
  function synthNote() {
    var any = Array.prototype.slice.call(arguments).some(function (r) { return r && r.synthetic; });
    return any ? ' · synthetic data' : '';
  }

  // Why there's no ranking, for the cards that need one
  function noRankText() {
    if (pending()) return 'Loading USMS rankings…';
    if (!GENDER || !GROUP) return 'Add your gender and birth date to your profile to compare with your age group.';
    return 'USMS rankings for ' + GENDER.toLowerCase() + ' ' + GROUP.label + ' ' + eventLower(state.d, state.stroke) + ' aren\'t loaded yet.';
  }

  // The time at a share of the field: the slowest swim within it (NaN past
  // the end of a truncated list)
  function atShare(rank, share) {
    var i = Math.max(0, Math.ceil(rank.n * share) - 1);
    return i < rank.times.length ? rank.times[i] : NaN;
  }
  function topTen(rank) {
    return rank.times[Math.min(9, rank.times.length - 1)];
  }
  function median(rank) {
    return atShare(rank, 0.5);
  }
  // A tier's cut: the slowest time in it. In a field under 40, 10th place
  // is slower than the 25% line; the tiers above it are then all Top 10.
  function cutOf(rank, tier) {
    if (tier === TOP_10) return topTen(rank);
    if (tier === BOTTOM) return Infinity;
    return Math.max(atShare(rank, TIER_SHARE[tier]), topTen(rank));
  }
  function tierOf(secs, rank) {
    if (!rank || !isFinite(secs)) return null;
    for (var i = 0; i < TIERS.length; i++) {
      if (secs <= cutOf(rank, TIERS[i])) return TIERS[i];
    }
    return BOTTOM;
  }
  // Where a time would place: 1 + everyone faster; null past the end of a
  // truncated list
  function placeOf(secs, rank) {
    var faster = rank.times.filter(function (t) { return t < secs; }).length;
    return faster === rank.times.length && rank.truncated ? null : faster + 1;
  }
  function ordinal(n) {
    return n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  }

  // ---------- State ----------

  var state = {
    course: 'SCY', stroke: 'Free', d: 50, goal: null, goalSet: null, ref: 'latest', strat: 'even', view: 'chart',
    // Race History: '' is all; sort by date (newest first) or time (fastest first)
    hist: { course: '', stroke: '', d: '', sort: 'date', shown: 25 },
    hiddenLines: {} // Race History chart: events whose line is turned off
  };
  var HIST_PAGE = 25;

  // The saved event and goal, otherwise the event raced most (latest wins)
  (function start() {
    var saved = readStore(GOAL_KEY);
    if (saved && COURSES[saved.course] && eventsFor(saved.course, saved.stroke).indexOf(saved.d) >= 0) {
      state.course = saved.course; state.stroke = saved.stroke; state.d = saved.d;
      state.goal = isNum(saved.goal) ? saved.goal : null;
      state.goalSet = saved.goalSet || null;
      return;
    }
    var counts = {}, best = null;
    RACES.slice().reverse().forEach(function (r) {
      var key = r.course + ' ' + r.d + ' ' + r.stroke;
      counts[key] = (counts[key] || 0) + 1;
      if (!best || counts[key] >= counts[best]) best = key;
    });
    if (best) {
      best = best.split(' ');
      state.course = best[0]; state.d = Number(best[1]); state.stroke = best[2];
    }
  })();

  function racesFor(course, stroke, d) {
    return RACES.filter(function (r) { return r.course === course && r.stroke === stroke && r.d === d; });
  }
  function fastest(list) {
    return list.reduce(function (b, r) { return !b || r.secs < b.secs ? r : b; }, null);
  }

  // The page's figures for the event
  function figures() {
    var f = {}, mine = racesFor(state.course, state.stroke, state.d);
    f.latest = mine[0] || null;
    f.best = fastest(mine);
    // The goal: yours, or just under the whole second below your latest
    // ("break 30"), or with no races, the age-group middle
    f.rank = groupRank(state.course, state.stroke, state.d, GROUP);
    f.middle = f.rank ? median(f.rank) : NaN;
    if (isNum(state.goal)) { f.goal = state.goal; f.goalKind = 'set'; }
    else if (f.latest) { f.round = Math.floor(f.latest.secs); f.goal = f.round - 0.01; f.goalKind = 'break'; }
    else if (isFinite(f.middle)) { f.goal = f.middle; f.goalKind = 'middle'; }
    else f.goal = NaN;
    f.times = { latest: f.latest ? f.latest.secs : NaN, best: f.best ? f.best.secs : NaN, goal: f.goal };
    if (!isFinite(f.times[state.ref])) state.ref = isFinite(f.times.latest) ? 'latest' : 'goal';
    f.t = f.times[state.ref];
    return f;
  }

  // ---------- Head ----------

  function renderHead() {
    var club = USER.club ? CLUBS[USER.club] || USER.club : '';
    var who = [[USER.firstName, USER.lastName].filter(Boolean).join(' '), USER.gender, AGE, club].filter(function (x) { return x != null && x !== ''; }).join(' · ');
    q('[data-st4-member]').hidden = !USER.loggedIn || !who;
    q('[data-st4-guest]').hidden = MEMBER;
    set('welcome', USER.loggedIn && USER.firstName ? 'Welcome back, ' + USER.firstName + '. Here\'s where your swimming stands.' :
      'Calculators for racing, training and tracking your swimming.');
    set('whoLine', who);
  }

  // ---------- Engagement cards ----------

  function renderGoal(f) {
    var ev = eventLower(state.d, state.stroke);
    set('goalTitle', !isFinite(f.goal) ? 'Set a goal in the ' + ev :
      f.goalKind === 'break' ? 'Goal: break ' + whole(f.round) + (f.best && f.best.secs < f.round ? ' again' : '') + ' in the ' + ev :
      f.goalKind === 'middle' ? 'Goal: reach the age-group middle in the ' + ev :
      'Goal: ' + race(f.goal) + ' in the ' + ev);
    set('goalMeta', state.course + ' · ' + (state.goalSet ? 'set ' + monthYear(state.goalSet) : 'suggested'));
    set('latestLabel', f.latest ? 'Latest · ' + monthYear(f.latest.date) : 'Latest');
    set('bestLabel', f.best ? 'Best · ' + monthYear(f.best.date) : 'Best');
    set('latest', f.latest ? race(f.latest.secs) : '—');
    set('best', f.best ? race(f.best.secs) : '—');
    set('goal', race(f.goal));
    var gap = f.latest && isFinite(f.goal) ? f.latest.secs - f.goal : NaN;
    set('toGo', isFinite(gap) ? (gap > 0 ? gap.toFixed(2) : '0.00') : '—');

    // The track: slower on the left, as in the design
    var track = q('[data-st4-track]');
    var marks = [f.times.latest, f.times.best, f.goal].filter(isFinite);
    track.hidden = marks.length < 2;
    if (track.hidden) return;
    var hi = Math.ceil(Math.max.apply(null, marks) * 2 + 0.5) / 2, lo = Math.floor(Math.min.apply(null, marks) * 2 - 0.5) / 2;
    var pos = function (t) { return ((hi - t) / (hi - lo) * 100).toFixed(1) + '%'; };
    var show = function (sel, t) {
      var el = q(sel);
      el.hidden = !isFinite(t);
      if (isFinite(t)) el.style.left = pos(t);
    };
    q('[data-st4-track-fill]').style.width = isFinite(f.times.latest) ? pos(f.times.latest) : '0';
    show('[data-st4-track-latest]', f.times.latest);
    show('[data-st4-track-best]', f.times.best);
    show('[data-st4-track-goal]', f.goal);
    set('trackHi', race(hi));
    set('trackLo', race(lo));
    q('[data-st4-track-bar]').setAttribute('aria-label', 'Latest ' + race(f.times.latest) + ', best ' + race(f.times.best) + ', goal ' + race(f.goal));
  }

  // You move up an age group: your gap to the middle now and in the next
  function renderAgeUp(f) {
    var k = GROUP ? AGE_GROUPS.indexOf(GROUP) : -1, next = AGE_GROUPS[k + 1];
    var gaps = q('[data-st4-gaps]');
    if (k < 0 || !next) {
      set('ageUpTitle', 'Your age group');
      set('ageUpText', k < 0 ? 'Add your birth date and gender to your profile to compare with your age group.' : 'You\'re in the oldest age group.');
      gaps.innerHTML = ''; set('ageUpFine', '');
      return;
    }
    var b = USER.birthDate.split('/').map(Number), year = b[2] + next.min, now = Number(TODAY.slice(0, 4));
    var when = year === now ? 'this year' : year === now + 1 ? 'next year' : 'in ' + year;
    set('ageUpTitle', 'You move up to ' + next.label + ' ' + when);
    var t = f.latest ? f.latest.secs : NaN;
    var rNext = groupRank(state.course, state.stroke, state.d, next);
    if (!isFinite(t) || !f.rank || !rNext) {
      set('ageUpText', 'You turn ' + next.min + ' in ' + MONTHS[b[0] - 1] + ' ' + year + '.' +
        (!isFinite(t) ? ' Race the ' + eventLower(state.d, state.stroke) + ' to see how you compare there.' :
          pending() ? ' Loading USMS rankings…' : ' USMS rankings for ' + (f.rank ? next.label : GROUP.label) + ' aren\'t loaded yet.'));
      gaps.innerHTML = ''; set('ageUpFine', '');
      return;
    }
    var rows = [[GROUP.label, t - median(f.rank), false], [next.label, t - median(rNext), true]];
    var behind = rows[0][1] > 0;
    set('ageUpText', 'You turn ' + next.min + ' in ' + MONTHS[b[0] - 1] + ' ' + year + '. Hold today\'s ' + race(t) + ' and you ' +
      (behind ? (rows[1][1] < rows[0][1] ? 'get closer to' : 'drift further from') : 'stay ahead of') + ' the middle of the pack:');
    var max = Math.max(Math.abs(rows[0][1]), Math.abs(rows[1][1])) || 1;
    gaps.innerHTML = rows.map(function (r) {
      return '<div class="st4-gaps__row' + (r[2] ? ' is-next' : '') + '"><span>' + r[0] + '</span>' +
        '<span class="st4-gaps__track"><span style="width: ' + (Math.abs(r[1]) / max * 100).toFixed(1) + '%"></span></span>' +
        '<span class="st4-gaps__value">' + (r[1] < 0 ? '−' : '') + Math.abs(r[1]).toFixed(2) + ' s</span></div>';
    }).join('');
    set('ageUpFine', (behind ? 'Gap to' : 'Time under') + ' the age-group middle (median) for ' + state.course + ' ' + eventLower(state.d, state.stroke) +
      ', from USMS event rankings, ' + f.rank.seasonLabel + (f.rank.converted ? ', converted from SCY' : '') + '.' +
      (f.rank.synthetic || rNext.synthetic ? ' Synthetic data for ' + [f.rank.synthetic && GROUP.label, rNext.synthetic && next.label].filter(Boolean).join(' and ') +
        ': modeled, not real results.' : ''));
  }

  // Time since your last race, and what's coming up
  function renderComeback() {
    var last = RACES[0];
    if (!last || !last.date) {
      set('sinceTitle', 'Find your first meet');
      set('sinceText', 'A meet gives your goal a date, and your results show up here automatically.');
    } else {
      var a = last.date.split('-').map(Number), n = new Date(), months = (n.getFullYear() - a[0]) * 12 + n.getMonth() + 1 - a[1] - (n.getDate() < a[2] ? 1 : 0);
      set('sinceTitle', months >= 2 ? months + ' months since your last race' : months === 1 ? 'A month since your last race' : 'You raced this month');
      set('sinceText', 'Your last swim was ' + eventLower(last.d, last.stroke) + ' at ' + race(last.secs) + ' in ' + MONTHS[a[1] - 1] + ' ' + a[0] + '. ' +
        (months >= 2 ? 'A meet gives your goal a date.' : 'Keep the momentum going.'));
    }
    var now = new Date(TODAY + 'T00:00:00');
    var upcoming = MEETS.map(function (m) { return Object.assign({}, m, { at: new Date(m.date) }); })
      .filter(function (m) { return m.at >= now; }).sort(function (x, y) { return x.at - y.at; });
    var pool = upcoming.filter(function (m) { return !m.virtual && m.course === state.course; });
    var near = pool.filter(function (m) { return USER.state && m.state === USER.state; })[0] || pool[0];
    var virtual = upcoming.filter(function (m) { return m.virtual; })[0];
    var row = function (m, note) {
      return '<div class="st4-events__row"><a href="' + m.url + '">' + m.title + '</a><span>' + note +
        MONTHS[m.at.getMonth()].slice(0, 3) + ' ' + m.at.getDate() + '</span></div>';
    };
    q('[data-st4-events]').innerHTML = (near ? row(near, (near.state ? near.state + ' · ' : '')) : '') + (virtual ? row(virtual, 'Virtual · ') : '');
  }

  // ---------- Context: event chips and the reference time ----------

  function renderContext(f) {
    set('chipEvent', eventName(state.d, state.stroke));
    set('chipCourse', state.course);
    set('chipGroup', GENDER && GROUP ? GENDER + ' ' + GROUP.label : GROUP ? GROUP.label : 'No age group');
    var labels = { latest: 'Latest', best: 'Best', goal: 'Goal' };
    q('[data-st4-refs]').innerHTML = ['latest', 'best', 'goal'].filter(function (k) { return isFinite(f.times[k]); }).map(function (k) {
      return '<button type="button" data-value="' + k + '" aria-pressed="' + (state.ref === k) + '">' + labels[k] + ' ' + race(f.times[k]) + '</button>';
    }).join('');
  }

  // ---------- Race planning ----------

  // Projected times for the distances you haven't raced in this course and
  // stroke. First your best at the same distance in another course,
  // converted; otherwise your nearest distance, scaled by how the age
  // group's middle slows from that distance to this one (or by Riegel's
  // 1.06 exponent with no rankings). Sets r.proj and r.projFrom.
  function project(rows) {
    var COURSE_ORDER = ['SCY', 'SCM', 'LCM'];
    rows.forEach(function (r) {
      if (isFinite(r.you)) return;
      COURSE_ORDER.forEach(function (c) {
        if (c === state.course) return;
        RACES.forEach(function (x) {
          if (x.course !== c || x.stroke !== state.stroke) return;
          var to = convert(x.secs, x.d, c, state.course, state.stroke);
          if (to.d === r.d && isFinite(to.secs) && !(to.secs >= r.proj)) {
            r.proj = to.secs; r.projFrom = 'your ' + c + ' ' + x.d;
          }
        });
      });
    });
    var anchors = rows.filter(function (r) { return isFinite(r.you) || isFinite(r.proj); });
    rows.forEach(function (r) {
      if (isFinite(r.you) || isFinite(r.proj) || !anchors.length) return;
      var a = anchors.reduce(function (b, x) {
        return Math.abs(Math.log(x.d / r.d)) < Math.abs(Math.log(b.d / r.d)) ? x : b;
      });
      var t = isFinite(a.you) ? a.you : a.proj;
      r.proj = isFinite(a.mid) && isFinite(r.mid) ? t * r.mid / a.mid : t * Math.pow(r.d / a.d, 1.06);
      r.projFrom = isFinite(a.you) ? 'your ' + a.d : a.projFrom;
    });
  }

  function renderPredictor(f) {
    var dists = eventsFor(state.course, state.stroke);
    var rows = dists.map(function (d) {
      var b = fastest(racesFor(state.course, state.stroke, d));
      var r = groupRank(state.course, state.stroke, d, GROUP);
      // mid: the median; low: the slowest ranked swim (of the first 500 in a
      // truncated list)
      return { d: d, you: b ? b.secs : NaN, proj: NaN, mid: r ? median(r) : NaN, low: r ? r.times[r.times.length - 1] : NaN, synthetic: r && r.synthetic };
    });
    project(rows);
    var projected = rows.some(function (r) { return isFinite(r.proj); });
    var pace = function (t, d) { return t / (d / 100); };
    var all = [];
    rows.forEach(function (r) {
      r.youP = pace(r.you, r.d); r.midP = pace(r.mid, r.d); r.lowP = pace(r.low, r.d);
      // est: your best, or the projection where you haven't raced
      r.est = isFinite(r.you) ? r.you : r.proj; r.estP = pace(r.est, r.d);
      if (isFinite(r.estP)) all.push(r.estP);
      if (isFinite(r.midP)) all.push(r.midP);
      if (isFinite(r.lowP)) all.push(r.lowP);
    });
    var label = GROUP ? GROUP.label + ' middle' : 'Age-group middle';
    set('predSub', 'Pace per 100 · your ' + state.course + ' ' + (state.stroke === 'IM' ? 'IM' : state.stroke.toLowerCase()) + ' races against the ' + label +
      (projected ? ', with projected times where you haven\'t raced' : '') + synthNote.apply(null, rows));
    q('[data-st4-legend-proj]').hidden = !projected;
    set('groupLegend', label);
    set('groupCol', label);
    var svg = q('[data-st4-pred-svg]'), dots = q('[data-st4-pred-dots]');
    q('[data-st4-pred-axis]').innerHTML = dists.map(function (d) { return '<span>' + d + '</span>'; }).join('');
    if (!all.length) {
      q('[data-st4-pred-group]').setAttribute('points', '');
      q('[data-st4-pred-bottom]').setAttribute('points', '');
      q('[data-st4-pred-you]').setAttribute('d', '');
      q('[data-st4-pred-proj]').setAttribute('points', '');
      dots.innerHTML = '';
      svg.setAttribute('aria-label', 'No paces to show');
    } else {
      var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all), pad = (hi - lo) * 0.12 || 2;
      lo -= pad; hi += pad;
      var x = function (i) { return dists.length > 1 ? i / (dists.length - 1) * 100 : 50; };
      var y = function (p) { return (p - lo) / (hi - lo) * 100; }; // slower is lower
      var pts = function (key) {
        return rows.map(function (r, i) { return isFinite(r[key]) ? x(i).toFixed(2) + ',' + y(r[key]).toFixed(1) : null; }).filter(Boolean).join(' ');
      };
      q('[data-st4-pred-group]').setAttribute('points', pts('midP'));
      q('[data-st4-pred-bottom]').setAttribute('points', pts('lowP'));
      // Solid only between real races at neighboring distances
      q('[data-st4-pred-you]').setAttribute('d', rows.map(function (r, i) {
        if (!isFinite(r.youP)) return '';
        return (i && isFinite(rows[i - 1].youP) ? 'L' : 'M') + x(i).toFixed(2) + ',' + y(r.youP).toFixed(1);
      }).join(''));
      // Dashed through every point, so projections join your real races
      q('[data-st4-pred-proj]').setAttribute('points', projected ? pts('estP') : '');
      dots.innerHTML = rows.map(function (r, i) {
        if (!isFinite(r.estP)) return '';
        var proj = !isFinite(r.you) ? ' is-projected' : '';
        var at = 'left: ' + x(i).toFixed(2) + '%; top: ' + y(r.estP).toFixed(1) + '%';
        return '<span class="st4-pred__dot' + proj + '" style="' + at + '"' + (proj ? ' title="Projected from ' + r.projFrom + '"' : '') + '></span>' +
          '<span class="st4-pred__label' + proj + '" style="' + at + '">' + race(r.est) + '</span>';
      }).join('');
      svg.setAttribute('aria-label', 'Pace per 100 by distance. ' + rows.map(function (r) {
        return r.d + ': you ' + clock(r.estP) + (isFinite(r.you) ? '' : ' (projected)') + ', ' + label + ' ' + clock(r.midP) + ', slowest ' + clock(r.lowP);
      }).join('; '));
    }
    q('[data-st4-pred-rows]').innerHTML = rows.map(function (r) {
      var mine = isFinite(r.you) ? race(r.you) : isFinite(r.proj) ?
        '<span class="st4-pred__proj" title="Projected from ' + r.projFrom + '">' + race(r.proj) + ' <small>projected</small></span>' : '—';
      return '<tr><th scope="row">' + eventName(r.d, state.stroke) + '</th><td>' + mine + '</td><td>' + clock(r.estP) + '</td><td>' + race(r.mid) + '</td><td>' + clock(r.midP) + '</td><td>' + race(r.low) + '</td><td>' + clock(r.lowP) + '</td></tr>';
    }).join('');

    // The insight: where your pace is closest to and furthest from the middle
    var raced = rows.filter(function (r) { return isFinite(r.youP) && isFinite(r.midP); });
    var box = q('[data-st4-insight]'), cta = q('[data-st4-goal-from]');
    raced.forEach(function (r) { r.gap = r.youP - r.midP; });
    var off = function (r) {
      return 'about ' + Math.abs(r.gap).toFixed(1) + ' s ' + (r.gap > 0 ? 'off' : 'ahead of') + ' the age-group middle';
    };
    if (!rows.some(function (r) { return isFinite(r.mid); })) {
      box.textContent = noRankText();
    } else if (!raced.length) {
      box.textContent = 'Race the ' + (state.stroke === 'IM' ? 'IM' : state.stroke.toLowerCase()) + ' to compare your pace with your age group.';
    } else if (raced.length === 1) {
      box.innerHTML = '<b>One ' + state.course + ' ' + eventLower(raced[0].d, state.stroke) + ' so far.</b> Per 100 you\'re ' + off(raced[0]) + '. Race another distance to see where you\'re strongest.';
    } else {
      // Strongest and weakest by pace against the middle (lower is better)
      var strong = raced.reduce(function (a, b) { return b.gap < a.gap ? b : a; });
      var weak = raced.reduce(function (a, b) { return b.gap > a.gap ? b : a; });
      var kind = function (d) { return d <= 100 ? 'sprint' : d >= 500 ? 'distance' : d; };
      var work = weak.d > strong.d ? 'Distance work' : 'Speed work';
      if (weak.gap <= 0) {
        box.innerHTML = '<b>You\'re ahead of the age-group middle at every distance.</b> Per 100, your ' + strong.d + ' is ' + off(strong) +
          ' and your ' + weak.d + ' is ' + off(weak) + '. Your ' + kind(strong.d) + ' is your strongest event.';
      } else if (strong.gap < 0) {
        box.innerHTML = '<b>Your ' + kind(strong.d) + ' is ahead of the pack.</b> Per 100, your ' + strong.d + ' is ' + off(strong) +
          ' and your ' + weak.d + ' is ' + off(weak) + '. ' + work + ' will close the gap fastest.';
      } else {
        box.innerHTML = '<b>Your ' + kind(strong.d) + ' is closest to the pack.</b> Per 100, your ' + strong.d + ' is ' + off(strong) +
          ' and your ' + weak.d + ' is ' + off(weak) + '. ' + work + ' will move your times fastest.';
      }
    }
    // A goal at the next distance up that you've raced
    var nextUp = raced.filter(function (r) { return r.d > state.d; })[0] || raced.filter(function (r) { return r.d !== state.d; })[0];
    cta.hidden = !nextUp;
    if (nextUp) {
      cta.textContent = 'Set a ' + eventLower(nextUp.d, state.stroke) + ' goal from this';
      cta.setAttribute('data-d', nextUp.d);
    }
    q('[data-st4-pred-chart]').hidden = state.view !== 'chart';
    q('[data-st4-pred-table]').hidden = state.view !== 'table';
    q('[data-st4-view]').textContent = state.view === 'chart' ? 'Table view' : 'Chart view';
  }

  // Split length: 25s for the 50, 50s to the 200, then 100s (150s for the mile)
  function legFor(d) {
    return d <= 50 ? 25 : d <= 200 ? 50 : d === 1650 ? 150 : 100;
  }
  function splitTimes(total, n, strategy) {
    var segs = [], sum = 0, i;
    for (i = 0; i < n; i++) {
      var x = n > 1 ? i / (n - 1) - 0.5 : 0;
      segs.push(total / n * (1 + TREND[strategy] * x));
    }
    if (n > 1) segs[0] -= DIVE;
    segs.forEach(function (s) { sum += s; });
    return segs.map(function (s) { return s * total / sum; });
  }

  function renderSplits(f) {
    var refLabel = { latest: 'latest', best: 'best', goal: 'goal' }[state.ref];
    set('splitSub', eventName(state.d, state.stroke) + ' at ' + race(f.t) + ' (' + refLabel + ')');
    root.querySelectorAll('[data-st4-strats] button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === state.strat));
    });
    if (!isFinite(f.t)) {
      q('[data-st4-splitbar]').innerHTML = ''; q('[data-st4-splitrows]').innerHTML = '';
      set('practiceSet', 'Set a goal to plan your splits'); set('practiceNote', '');
      return;
    }
    var leg = legFor(state.d), n = state.d / leg, unit = COURSES[state.course].unit;
    var segs = splitTimes(f.t, n, state.strat);
    q('[data-st4-splitbar]').innerHTML = segs.map(function (s, i) {
      return '<span class="st4-splitbar__seg' + (i % 2 ? ' is-alt' : '') + '" style="width: ' + (s / f.t * 100).toFixed(2) + '%"></span>';
    }).join('');
    var ord = ['First', 'Second', 'Third', 'Fourth'];
    q('[data-st4-splitrows]').innerHTML = segs.map(function (s, i) {
      var name = n <= 4 ? ord[i] + ' ' + leg : (i + 1) * leg + ' ' + unit;
      return '<div class="st4-splitrows__row"><span>' + name + (i === 0 ? ' · dive' : n <= 4 ? ' · turn' : '') + '</span><b>' + race(s) + '</b></div>';
    }).join('');
    // Practice the race pace in pieces from a push: the 50's first 25 from
    // a push (a dive is faster), or longer races' middle splits
    if (n === 2) {
      set('practiceSet', '8 × 25 from a push at ' + race(segs[0] + PUSH));
      set('practiceNote', 'Rest 45 s. Push starts run about ' + PUSH + ' s slower than a dive.');
    } else {
      var mid = segs.slice(1).reduce(function (a, b) { return a + b; }, 0) / (n - 1);
      set('practiceSet', Math.min(10, Math.max(4, n)) + ' × ' + leg + ' from a push at ' + race(mid));
      set('practiceNote', 'Rest ' + (leg <= 50 ? 20 : leg <= 100 ? 30 : 40) + ' s. That\'s your race pace after the dive.');
    }
  }

  function renderRaces() {
    var bests = {};
    RACES.forEach(function (r) {
      var k = r.course + ' ' + r.d + ' ' + r.stroke;
      if (!(bests[k] <= r.secs)) bests[k] = r.secs;
    });
    var first = RACES.length ? RACES[RACES.length - 1].date.slice(0, 4) : '';
    set('racesSub', RACES.length ? RACES.length + (RACES.length === 1 ? ' race' : ' races') + (first ? ' since ' + first : '') + ' · new meet results appear automatically' :
      'No races yet · meet results appear here automatically');
    var shown = RACES.slice(0, RACES_SHOWN);
    q('[data-st4-races]').innerHTML = shown.map(function (r) {
      var b = bests[r.course + ' ' + r.d + ' ' + r.stroke], pb = r.secs === b;
      return '<li class="st4-races__row"><span class="st4-races__course">' + r.course + '</span>' +
        '<span>' + eventName(r.d, r.stroke) + ' <span class="st4-races__date">' + (r.date ? longDate(r.date) : '') + '</span></span>' +
        '<span class="st4-badge' + (pb ? ' st4-badge--best' : '') + '">' + (pb ? 'Best' : '+' + (r.secs - b).toFixed(2) + ' vs best') + '</span>' +
        '<span class="st4-races__time">' + race(r.secs) + '</span></li>';
    }).join('');
    var toggle = q('[data-st4-races-toggle]');
    toggle.hidden = RACES.length <= RACES_SHOWN;
    toggle.textContent = 'See all ' + RACES.length + ' in Race History';
  }

  // ---------- Race History ----------

  // Line colours, one per event, in order of first appearance
  var LINE_COLORS = ['#0068AD', '#CC2030', '#2A9D8F', '#E09F3E', '#6A4C93', '#1F7A3A', '#5A6B7D', '#8CC0E3', '#B5651D', '#D45087'];
  var LABEL_LIMIT = 40; // more dots than this: times on hover, and on each best

  // The filtered races as a line per event over time. Pace per 100 on the
  // vertical (faster higher), so every distance shares a scale; each dot
  // is a race, labelled with its time.
  function renderTrend(races) {
    var card = q('#st4-history'), box = card.querySelector('[data-st4-hist-trend]');
    var dated = races.filter(function (r) { return r.date; });
    box.hidden = !dated.length;
    if (box.hidden) return;
    var STROKES = ['Free', 'Back', 'Breast', 'Fly', 'IM'], COURSE_ORDER = ['SCY', 'SCM', 'LCM'];
    var events = {};
    dated.forEach(function (r) {
      var k = r.course + ' ' + r.d + ' ' + r.stroke;
      (events[k] = events[k] || { key: k, course: r.course, d: r.d, stroke: r.stroke, races: [] }).races.push(r);
    });
    var list = Object.keys(events).map(function (k) { return events[k]; }).sort(function (a, b) {
      return COURSE_ORDER.indexOf(a.course) - COURSE_ORDER.indexOf(b.course) ||
        STROKES.indexOf(a.stroke) - STROKES.indexOf(b.stroke) || a.d - b.d;
    });
    list.forEach(function (e, i) {
      e.color = LINE_COLORS[i % LINE_COLORS.length];
      e.races.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      e.best = Math.min.apply(null, e.races.map(function (r) { return r.secs; }));
      e.on = !state.hiddenLines[e.key];
    });
    var shown = list.filter(function (e) { return e.on; });
    var pace = function (r) { return r.secs / (r.d / 100); };
    var when = function (r) { return new Date(r.date + 'T00:00:00').getTime(); };
    var all = [];
    shown.forEach(function (e) { all = all.concat(e.races); });

    var legend = card.querySelector('[data-st4-trend-legend]');
    legend.innerHTML = list.length > 1 ? list.map(function (e) {
      return '<button type="button" class="st4-trend__key" data-st4-line="' + e.key + '" aria-pressed="' + e.on + '">' +
        '<span class="st4-trend__swatch" style="background: ' + e.color + '"></span>' + e.course + ' ' + eventName(e.d, e.stroke) +
        ' <span class="st4-trend__count">' + e.races.length + '</span></button>';
    }).join('') : '';
    var svg = card.querySelector('[data-st4-trend-svg]'), dots = card.querySelector('[data-st4-trend-dots]');
    if (!all.length) {
      svg.innerHTML = ''; dots.innerHTML = '';
      card.querySelector('[data-st4-trend-y]').innerHTML = '';
      card.querySelector('[data-st4-trend-axis]').innerHTML = '';
      set('trendNote', 'Every line is turned off. Select an event below to show it.');
      return;
    }
    var t0 = Math.min.apply(null, all.map(when)), t1 = Math.max.apply(null, all.map(when));
    // Each event's Top 10 line: 10th place in the swimmer's age group (their
    // age when the SCY season ended, May 31) each season within the chart's
    // years, where those rankings are loaded
    var seasons = {};
    (AVAILABLE || []).forEach(function (x) { seasons[x.season] = 1; });
    // Top 10 lines need a file per event per season, so only for a few events
    var TEN_LIMIT = 8, tooMany = shown.length > TEN_LIMIT;
    var tens = state.hiddenLines.top10 || !GENDER || tooMany ? [] : shown.map(function (e) {
      var pts = Object.keys(seasons).map(Number).sort().map(function (season) {
        var end = season + '-05-31', t = new Date(end + 'T00:00:00').getTime(), age = ageOn(end);
        if (t < t0 || t > t1 || age == null) return null;
        var g = groupOf(age), r = groupRank(e.course, e.stroke, e.d, g, season);
        return r ? { t: t, secs: topTen(r), pace: topTen(r) / (e.d / 100), season: season, group: g.label, synthetic: r.synthetic } : null;
      }).filter(Boolean);
      return { e: e, pts: pts };
    }).filter(function (x) { return x.pts.length; });
    // The Top 10 key turns every grey line off and on
    if (tens.length || state.hiddenLines.top10 || (tooMany && GENDER)) {
      legend.insertAdjacentHTML('beforeend', '<button type="button" class="st4-trend__key" data-st4-line="top10" aria-pressed="' + !state.hiddenLines.top10 + '">' +
        '<span class="st4-trend__swatch st4-trend__swatch--top10"></span>Top 10 (10th place)</button>');
    }
    var paces = all.map(pace);
    tens.forEach(function (x) { x.pts.forEach(function (p) { paces.push(p.pace); }); });
    var lo = Math.min.apply(null, paces), hi = Math.max.apply(null, paces), pad = (hi - lo) * 0.1 || 2;
    lo -= pad; hi += pad;
    // Times along 4–96%, so labels on the first and last races aren't cut off
    var xAt = function (t) { return t1 > t0 ? 4 + (t - t0) / (t1 - t0) * 92 : 50; };
    var x = function (r) { return xAt(when(r)); };
    var y = function (r) { return (pace(r) - lo) / (hi - lo) * 100; }; // faster is higher
    var labels = all.length <= LABEL_LIMIT;
    var tenY = function (p) { return ((p.pace - lo) / (hi - lo) * 100).toFixed(1); };
    // Top 10 lines: 1px, solid between real seasons, dashed into or out of
    // a synthetic one
    svg.innerHTML = tens.map(function (x) {
      return x.pts.slice(1).map(function (p, i) {
        var a = x.pts[i];
        return '<line class="st4-trend__line st4-trend__line--top10' + (a.synthetic || p.synthetic ? ' is-synthetic' : '') + '" x1="' + xAt(a.t).toFixed(2) + '" y1="' + tenY(a) +
          '" x2="' + xAt(p.t).toFixed(2) + '" y2="' + tenY(p) + '"></line>';
      }).join('');
    }).join('') + shown.map(function (e) {
      return '<polyline class="st4-trend__line" style="stroke: ' + e.color + '" points="' + e.races.map(function (r) {
        return x(r).toFixed(2) + ',' + y(r).toFixed(1);
      }).join(' ') + '"></polyline>';
    }).join('');
    dots.innerHTML = shown.map(function (e) {
      return e.races.map(function (r) {
        var at = 'left: ' + x(r).toFixed(2) + '%; top: ' + y(r).toFixed(1) + '%', isBest = r.secs === e.best;
        return '<span class="st4-trend__dot' + (isBest ? ' is-best' : '') + '" style="' + at + '; border-color: ' + e.color + '; background: ' + (isBest ? '#FFFFFF' : e.color) + '" title="' +
          e.course + ' ' + eventName(r.d, r.stroke) + ' · ' + longDate(r.date) + ' · ' + race(r.secs) + (isBest ? ' (best)' : '') + '"></span>' +
          (labels || isBest ? '<span class="st4-trend__label" style="' + at + '; color: ' + e.color + '">' + race(r.secs) + '</span>' : '');
      }).join('');
    }).join('');
    // Axes: pace at the top and bottom, years along the bottom
    card.querySelector('[data-st4-trend-y]').innerHTML = '<span>' + clock(lo + pad) + '</span><span>' + clock(hi - pad) + '</span>';
    var y0 = new Date(t0).getFullYear(), y1 = new Date(t1).getFullYear(), ticks = [], step = Math.max(1, Math.ceil((y1 - y0) / 6));
    for (var yr = y0; yr <= y1; yr += step) ticks.push(yr);
    if (ticks[ticks.length - 1] !== y1) ticks.push(y1);
    card.querySelector('[data-st4-trend-axis]').innerHTML = ticks.map(function (yr) {
      var at = xAt(Math.max(t0, new Date(yr, 0, 1).getTime()));
      return '<span style="left: ' + at.toFixed(1) + '%">' + yr + '</span>';
    }).join('');
    set('trendNote', 'Pace per 100, faster higher. Each dot is a race, labelled with its time' +
      (labels ? '' : ' on hover (each event\'s best is labelled)') + '; the open dot is that event\'s best.' +
      (tens.length ? ' The light grey line is 10th place in your age group each season, from USMS event rankings' +
        (tens.some(function (x) { return x.pts.some(function (p) { return p.synthetic; }); }) ? ', dashed where the season is synthetic data (modeled, not real).' : '.') :
        GENDER && !state.hiddenLines.top10 && tooMany ? ' Filter to ' + TEN_LIMIT + ' events or fewer to see each event\'s Top 10 line.' :
        GENDER && !state.hiddenLines.top10 ? ' No Top 10 line: USMS rankings aren\'t loaded for your age group in these seasons.' : ''));
    svg.setAttribute('aria-label', shown.map(function (e) {
      return e.course + ' ' + eventName(e.d, e.stroke) + ': ' + e.races.length + (e.races.length === 1 ? ' race' : ' races') + ', best ' + race(e.best) +
        ', from ' + race(e.races[0].secs) + ' in ' + e.races[0].date.slice(0, 4) + ' to ' + race(e.races[e.races.length - 1].secs) + ' in ' + e.races[e.races.length - 1].date.slice(0, 4);
    }).join('; '));
  }

  // Every race, newest first or fastest first, filtered by course, stroke
  // and distance. Each row's gap to that event's best, and its change from
  // the swim before it in the same event. One event gets a trend line.
  function renderHistory() {
    var h = state.hist, card = q('#st4-history');
    var key = function (r) { return r.course + ' ' + r.d + ' ' + r.stroke; };
    var best = {}, prev = {}, last = {};
    RACES.slice().reverse().forEach(function (r) { // oldest first
      var k = key(r);
      if (!(best[k] <= r.secs)) best[k] = r.secs;
      prev[RACES.indexOf(r)] = k in last ? last[k] : null;
      last[k] = r.secs;
    });
    // Distances raced under the course and stroke filters
    var ds = {};
    RACES.forEach(function (r) {
      if ((!h.course || r.course === h.course) && (!h.stroke || r.stroke === h.stroke)) ds[r.d] = 1;
    });
    var dists = Object.keys(ds).map(Number).sort(function (a, b) { return a - b; });
    if (h.d && dists.indexOf(Number(h.d)) < 0) h.d = '';
    card.querySelector('[data-st4-hist-distance]').innerHTML = '<option value="">All</option>' + dists.map(function (d) {
      return '<option value="' + d + '"' + (String(d) === String(h.d) ? ' selected' : '') + '>' + d + '</option>';
    }).join('');
    ['course', 'stroke'].forEach(function (f) {
      card.querySelectorAll('[data-st4-hist="' + f + '"] button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === h[f]));
      });
    });
    card.querySelector('[data-st4-hist-reset]').hidden = !(h.course || h.stroke || h.d);

    var rows = RACES.map(function (r, i) { return { r: r, i: i }; }).filter(function (x) {
      return (!h.course || x.r.course === h.course) && (!h.stroke || x.r.stroke === h.stroke) && (!h.d || x.r.d === Number(h.d));
    });
    // By time: fastest first within each event (course, stroke, distance)
    var STROKES = ['Free', 'Back', 'Breast', 'Fly', 'IM'], COURSE_ORDER = ['SCY', 'SCM', 'LCM'];
    if (h.sort === 'time') rows.sort(function (a, b) {
      return COURSE_ORDER.indexOf(a.r.course) - COURSE_ORDER.indexOf(b.r.course) ||
        STROKES.indexOf(a.r.stroke) - STROKES.indexOf(b.r.stroke) || a.r.d - b.r.d || a.r.secs - b.r.secs;
    });
    var label = [h.course, h.d, h.stroke].filter(Boolean).join(' ');
    var years = rows.map(function (x) { return x.r.date.slice(0, 4); }).filter(Boolean).sort();
    set('histSub', !RACES.length ? 'No races yet · meet results appear here automatically' :
      (label ? label + ' · ' : 'All events · ') + rows.length + (rows.length === 1 ? ' race' : ' races') +
      (years.length ? (years[0] === years[years.length - 1] ? ' in ' + years[0] : ' from ' + years[0] + ' to ' + years[years.length - 1]) : ''));
    card.querySelectorAll('[data-st4-sort-col]').forEach(function (th) {
      var on = th.getAttribute('data-st4-sort-col') === h.sort;
      th.setAttribute('aria-sort', on ? (h.sort === 'date' ? 'descending' : 'ascending') : 'none');
    });

    var shown = rows.slice(0, h.shown);
    card.querySelector('[data-st4-hist-rows]').innerHTML = shown.length ? shown.map(function (x) {
      var r = x.r, b = best[key(r)], p = prev[x.i], gap = r.secs - b;
      var change = p == null ? '<span class="st4-history__first">First swim</span>' :
        '<span class="st4-history__change ' + (r.secs < p ? 'is-faster' : r.secs > p ? 'is-slower' : '') + '">' +
          (r.secs < p ? '−' : r.secs > p ? '+' : '±') + Math.abs(r.secs - p).toFixed(2) + '</span>';
      return '<tr><td>' + (r.date ? longDate(r.date) : '—') + '</td><td>' + (r.age != null ? r.age : '—') + '</td>' +
        '<td><span class="st4-races__course">' + r.course + '</span></td><td>' + eventName(r.d, r.stroke) + '</td>' +
        '<td class="st4-history__time">' + race(r.secs) + '</td>' +
        '<td>' + (gap === 0 ? '<span class="st4-badge st4-badge--best">Best</span>' : '+' + gap.toFixed(2)) + '</td><td>' + change + '</td></tr>';
    }).join('') : '<tr><td colspan="7" class="st4-history__empty">' + (RACES.length ? 'No races match these filters.' : 'No races yet.') + '</td></tr>';
    set('histCount', rows.length > shown.length ? 'Showing ' + shown.length + ' of ' + rows.length : rows.length > HIST_PAGE ? 'Showing all ' + rows.length : '');
    var more = card.querySelector('[data-st4-hist-more]');
    more.hidden = rows.length <= shown.length;
    more.textContent = 'Show ' + Math.min(HIST_PAGE, rows.length - shown.length) + ' more';

    renderTrend(rows.map(function (x) { return x.r; }));
  }

  function renderRank(f) {
    set('rankSub', state.course + ' ' + eventLower(state.d, state.stroke) + (GENDER && GROUP ? ' · ' + GENDER.toLowerCase() + ' ' + GROUP.label : '') +
      (f.rank ? ' · ' + f.rank.seasonLabel + ' season, ' + f.rank.n.toLocaleString() + ' ranked' + (f.rank.converted ? ' · converted from SCY' : '') + synthNote(f.rank) : ''));
    var rungs = q('[data-st4-rungs]'), lock = q('[data-st4-lock]');
    if (!f.rank) {
      rungs.innerHTML = '';
      set('rankNext', noRankText());
      lock.hidden = true;
      q('[data-st4-rank-body]').classList.remove('is-locked');
      return;
    }
    var here = tierOf(f.t, f.rank);
    rungs.innerHTML = TIERS.map(function (t) { // Top 10 first
      var c = cutOf(f.rank, t);
      // A tier that's all Top 10 in a small field has no cut of its own
      var shared = t !== TOP_10 && t !== BOTTOM && c === topTen(f.rank);
      return '<div class="st4-rung' + (t === here ? ' is-here' : '') + '"><b>' + t + '</b><span>' + TIER_WHERE[t] + '</span><span>' +
        (t === BOTTOM ? 'slower than ' + race(cutOf(f.rank, '51–75%')) : shared ? 'all Top 10' : !isFinite(c) ? '—' : race(c)) + '</span></div>';
    }).join('');
    var k = TIERS.indexOf(here), next = null;
    for (var i = k - 1; i >= 0 && !next; i--) if (cutOf(f.rank, TIERS[i]) < f.t) next = TIERS[i];
    var refName = { latest: 'latest', best: 'best', goal: 'goal' }[state.ref];
    var place = placeOf(f.t, f.rank);
    var placed = 'Your ' + refName + ' of ' + race(f.t) + (place ? ' would place ' + ordinal(place) + ' of ' + f.rank.n.toLocaleString() : ' is outside the ' + f.rank.times.length + ' listed') + '.';
    set('rankNext', next ? '<b>Next rung: ' + next + ' at ' + race(cutOf(f.rank, next)) + '.</b> ' + placed + ' ' + (f.t - cutOf(f.rank, next)).toFixed(2) + ' s to go.' :
      '<b>You\'re in the Top 10.</b> ' + placed, true);
    lock.hidden = MEMBER;
    q('[data-st4-rank-body]').classList.toggle('is-locked', !MEMBER);
    set('lockTitle', next ? 'You\'re one rung from ' + next + '.' : 'You\'re in the Top 10 range.');
  }

  // ---------- Time conversions ----------

  function renderConversions(f) {
    set('convSub', eventName(state.d, state.stroke) + ' ' + race(f.t) + ' in ' + state.course);
    q('[data-st4-courses]').innerHTML = Object.keys(COURSES).map(function (c) {
      var t = isFinite(f.t) ? convert(f.t, state.d, state.course, c, state.stroke) : { secs: NaN, d: 0 };
      return '<div class="st4-courses__col"><div class="st4-courses__name">' + c + (t.d && t.d !== state.d ? ' · ' + t.d : '') + '</div><div class="st4-courses__time">' + race(t.secs) + '</div></div>';
    }).join('');
    // A real race in another course, against what this converts to
    var note = q('[data-st4="convNote"]'), real = null;
    Object.keys(COURSES).forEach(function (c) {
      if (c === state.course || real) return;
      var d = matchDistance(state.d, c, state.stroke), r = d && racesFor(c, state.stroke, d)[0];
      if (r) real = r;
    });
    note.hidden = !(real && isFinite(f.t));
    if (!note.hidden) {
      var conv = convert(f.t, state.d, state.course, real.course, state.stroke).secs, diff = real.secs - conv;
      note.innerHTML = 'You actually swam <b>' + race(real.secs) + ' ' + real.course + '</b> in ' + monthYear(real.date) + ', ' +
        (Math.abs(diff) < 0.05 ? 'right in line with the conversion' : Math.abs(diff).toFixed(2) + ' s ' + (diff > 0 ? 'slower' : 'faster') + ' than this converts to') + '.';
    }

    // Age conversion: the same place in the field at other ages, by the
    // age-group middles
    var k = GROUP ? AGE_GROUPS.indexOf(GROUP) : -1;
    set('agesSub', state.course + ' ' + eventLower(state.d, state.stroke) + ' ' + race(f.t) + (AGE != null ? ' at ' + AGE : '') + ' · what the same effort looks like at other ages');
    var list = q('[data-st4-ages]');
    if (k < 0 || !f.rank || !isFinite(f.t)) {
      list.innerHTML = '<li class="st4-ages__row"><span></span><span class="st4-ages__note">' +
        (!isFinite(f.t) ? 'Race the ' + eventLower(state.d, state.stroke) + ' or set a goal to compare ages.' : noRankText()) + '</span><span></span></li>';
      return;
    }
    var own = median(f.rank), now = Number(TODAY.slice(0, 4)), by = Number(USER.birthDate.split('/')[2]);
    list.innerHTML = [k - 1, k, k + 1, k + 2].map(function (i) {
      var g = AGE_GROUPS[i], r = g && groupRank(state.course, state.stroke, state.d, g);
      if (!r) return '';
      var when = by + g.min - now;
      var note = i < k ? 'what you might have swum then' : i === k ? 'you now' :
        i === k + 1 ? (when <= 0 ? 'this year' : when === 1 ? 'next year' : 'in ' + when + ' years') + ' · move up' : 'what to expect';
      return '<li class="st4-ages__row' + (i === k ? ' is-now' : i === k + 1 ? ' is-next' : '') + '"><span class="st4-ages__group">' + g.label + '</span>' +
        '<span class="st4-ages__note">' + note + (r.synthetic ? ' · synthetic data' : '') + '</span><span class="st4-ages__time">' + race(f.t * median(r) / own) + '</span></li>';
    }).join('');
  }

  // ---------- Training: the swim log ----------

  function loadLog() {
    var log = readStore(LOG_KEY);
    return Array.isArray(log) ? log : [];
  }
  var LOG = loadLog();
  var lastSaved = null;

  function mondayOf(date) {
    var d = new Date(date + 'T00:00:00');
    d.setDate(d.getDate() - (d.getDay() + 6) % 7);
    return d;
  }

  function logInputs() {
    var yd = Number(String(q('[data-st4-log="distance"]').value).replace(/[^\d.]/g, ''));
    var secs = parse(q('[data-st4-log="time"]').value);
    return { yd: yd, secs: secs, ok: yd > 0 && isFinite(secs) };
  }

  function renderLogCalc() {
    var v = logInputs();
    if (!v.ok) { set('logCalc', 'Enter a distance and a time (mm:ss)'); return; }
    var pace = v.secs / (v.yd / 100);
    var intensity = Math.min(1.4, Math.max(0.7, REF_PACE / pace));
    set('logCalc', 'Pace ' + race(pace) + ' /100 · ' + Math.round(v.secs / 60 * CAL_PER_MIN * intensity) + ' cal · SCM ' + clock(pace * COURSES.SCM.factor) + ' · LCM ' + clock(pace * COURSES.LCM.factor));
  }

  function renderSaved() {
    var box = q('[data-st4-saved]');
    if (!lastSaved) { box.innerHTML = ''; return; }
    box.innerHTML = MEMBER ?
      '<div class="st4-saved"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>' +
        '<span class="st4-num"><b>Saved to your log:</b> ' + lastSaved.yd.toLocaleString() + ' yd in ' + clock(lastSaved.secs) + ' today.</span>' +
        '<a href="#st4-week">View log</a><button type="button" class="st4-link" data-st4-undo>Undo</button></div>' :
      '<div class="st4-saved st4-saved--guest"><span><b>Keep this swim.</b> Members log workouts, see weekly totals and track lifetime distance.</span>' +
        '<a href="/join-usms/membership-comparison.html" class="st4-btn st4-btn--red st4-btn--sm">Join to start your log</a></div>';
  }

  function renderWeek(f) {
    var monday = mondayOf(TODAY), todayAt = (new Date().getDay() + 6) % 7;
    var days = DAYS.map(function (name, i) {
      var d = new Date(monday); d.setDate(d.getDate() + i);
      return { name: name, date: iso(d), yd: 0, kind: '' };
    });
    // The sample week (not before today for planned swims), then your log
    SAMPLE_WEEK.forEach(function (s) {
      var day = days[s[0]];
      if (s[2] === 'planned' && s[0] < todayAt) return;
      if (s[2] === 'done' && s[0] > todayAt) return;
      day.yd += s[1]; day.kind = s[2];
    });
    LOG.forEach(function (e) {
      days.forEach(function (day) { if (day.date === e.date) { day.yd += e.yd; day.kind = 'done'; } });
    });
    var max = Math.max.apply(null, days.map(function (d) { return d.yd; }).concat([1]));
    q('[data-st4-week]').innerHTML = days.map(function (d) {
      var h = d.yd ? Math.max(8, d.yd / max * 100) : 4;
      return '<a href="#st4-week" class="st4-week__day" aria-label="' + d.name + (d.kind === 'planned' ? ', planned ' : ', ') + (d.yd ? d.yd.toLocaleString() + ' yd' : 'no swim') + '">' +
        '<span class="st4-week__bar' + (d.kind ? ' is-' + d.kind : '') + '" style="height: ' + h.toFixed(0) + '%"></span>' +
        '<span class="st4-week__label">' + d.name.charAt(0) + '<br>' + (d.yd ? (d.yd / 1000).toFixed(1) + 'k' : '–') + '</span></a>';
    }).join('');
    var done = days.filter(function (d) { return d.kind === 'done'; });
    var planned = days.filter(function (d) { return d.kind === 'planned'; });
    set('weekSummary', done.length + (done.length === 1 ? ' swim' : ' swims') + ' · ' + done.reduce(function (a, d) { return a + d.yd; }, 0).toLocaleString() + ' yd' +
      (planned.length ? ' · ' + planned.length + ' planned' : ''));
    var plan = planned[0];
    set('weekNote', 'Select a day to open it in your log.' + (plan && isFinite(f.t) ? ' ' + plan.name + ': goal-pace ' + legFor(state.d) + 's from your race plan.' : ''));

    var miles = SAMPLE_MILES + LOG.reduce(function (a, e) { return a + e.yd; }, 0) / 1760;
    var goal = MILESTONES.filter(function (m) { return m > miles; })[0] || MILESTONES[MILESTONES.length - 1];
    set('lifeMi', Math.round(miles).toLocaleString());
    set('lifeSince', 'since you joined in ' + (RACES.length ? RACES[RACES.length - 1].date.slice(0, 4) : TODAY.slice(0, 4)));
    q('[data-st4-life-bar]').style.width = Math.min(100, miles / goal * 100).toFixed(1) + '%';
    set('lifeNext', Math.max(0, Math.round(goal - miles)) + ' mi to the next milestone: ' + goal.toLocaleString() + ' miles');
    set('logLink', MEMBER ? 'My swim log' : 'What the swim log tracks');
  }

  // ---------- Top 10 by season ----------

  var top10 = { open: false, season: null };

  // Each season's 1st to 10th place as a bar on one scale (your best marked),
  // then the chosen season's Top 10 with where your best would place
  function renderTop10(f) {
    var modal = document.getElementById('st4Top10');
    if (!modal || !top10.open) return;
    var title = document.getElementById('st4-top10-title');
    var srcs = seasonsFor(state.course, state.stroke, state.d, GROUP);
    title.textContent = 'Top 10 by season · ' + eventName(state.d, state.stroke);
    set('t10Sub', state.course + (GENDER && GROUP ? ' · ' + GENDER + ' ' + GROUP.label : '') + ' · USMS event rankings' +
      (srcs[0] && srcs[0].from !== state.course ? ' · converted from SCY' : ''));
    var seasons = modal.querySelector('[data-st4-t10-seasons]'), list = modal.querySelector('[data-st4-t10-list]');
    var ranks = srcs.map(function (x) { return groupRank(state.course, state.stroke, state.d, GROUP, x.season); }).filter(Boolean);
    if (ranks.some(function (x) { return x.synthetic; })) {
      set('t10Sub', document.querySelector('[data-st4="t10Sub"]').textContent + (ranks.every(function (x) { return x.synthetic; }) ? ' · synthetic data' : ' · includes synthetic data'));
    }
    if (!ranks.length) {
      seasons.innerHTML = '<p class="st4-modal__hint">' + noRankText() + '</p>';
      list.innerHTML = ''; set('t10Heading', ''); set('t10Key', ''); set('t10Note', '');
      return;
    }
    var best = f.best ? f.best.secs : NaN;
    var all = [];
    ranks.forEach(function (r) { all.push(r.times[0], topTen(r)); });
    if (isFinite(best)) all.push(best);
    var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all), pad = (hi - lo) * 0.04 || 0.5;
    lo -= pad; hi += pad;
    var x = function (t) { return ((t - lo) / (hi - lo) * 100).toFixed(1) + '%'; }; // faster on the left
    if (!top10.season || !ranks.some(function (r) { return r.season === top10.season; })) top10.season = ranks[0].season;
    seasons.innerHTML = ranks.map(function (r) {
      var first = r.times[0], tenth = topTen(r);
      return '<button type="button" class="st4-t10-season' + (r.season === top10.season ? ' is-on' : '') + '" data-st4-t10-season="' + r.season + '" aria-pressed="' + (r.season === top10.season) + '">' +
        '<span class="st4-t10-season__label">' + r.seasonLabel + (r.synthetic ? '<span class="st4-synth">synthetic</span>' : '') + '</span>' +
        '<span class="st4-t10-season__track"><span class="st4-t10-season__range" style="left: ' + x(first) + '; width: calc(' + x(tenth) + ' - ' + x(first) + ')"></span>' +
        (isFinite(best) ? '<span class="st4-t10-season__you" style="left: ' + x(best) + '"></span>' : '') + '</span>' +
        '<span class="st4-t10-season__times">' + race(first) + ' – ' + race(tenth) + '</span></button>';
    }).join('');
    set('t10Key', 'Bars run from 1st to 10th place, faster to the left' + (isFinite(best) ? '; the line is your best, ' + race(best) : '') + '. Select a season to see its Top 10.' +
      (ranks.some(function (x) { return x.synthetic; }) ? ' Seasons marked synthetic are modeled from USMS rankings, not real results.' : ''));
    var r = ranks.filter(function (x) { return x.season === top10.season; })[0];
    // A real season known only from its Top 10 list has no field size
    var listOnly = r.truncated && r.n <= r.times.length;
    set('t10Heading', r.seasonLabel + ' season · ' + (listOnly ? 'USMS Top 10 list' : r.n.toLocaleString() + ' ranked') + (r.synthetic ? ' · synthetic data' : ''));
    list.innerHTML = r.top.map(function (s) {
      return '<li class="st4-t10-list__row"><span class="st4-t10-list__place">' + s.rank + '</span><span>' + (s.name || (r.synthetic ? '<i>Synthetic swimmer</i>' : '<i>Name not on file</i>')) +
        ' <span class="st4-t10-list__meta">' + [s.age, s.club].filter(Boolean).join(' · ') + '</span></span><b>' + race(s.secs) + '</b></li>';
    }).join('');
    var place = isFinite(best) ? placeOf(best, r) : null;
    set('t10Note', !isFinite(best) ? '' : place && place <= 10 ? 'Your best, ' + race(best) + ', would have placed ' + ordinal(place) + ' that season.' :
      'Your best, ' + race(best) + ', is ' + (best - topTen(r)).toFixed(2) + ' s off 10th place that season' + (place ? ' (it would have placed ' + ordinal(place) + ')' : '') + '.');
  }

  // ---------- The event and goal modal ----------

  function fillDistances(course, stroke, d) {
    var sel = document.querySelector('[data-st4-edit="distance"]');
    var list = eventsFor(course, stroke), pick = list.indexOf(d) >= 0 ? d : matchDistance(d, course, stroke) || list[0];
    sel.innerHTML = list.map(function (x) { return '<option' + (x === pick ? ' selected' : '') + '>' + x + '</option>'; }).join('');
  }

  function openEditor() {
    var f = figures();
    document.querySelector('[data-st4-edit="course"]').value = state.course;
    document.querySelector('[data-st4-edit="stroke"]').value = state.stroke;
    fillDistances(state.course, state.stroke, state.d);
    document.querySelector('[data-st4-edit="goal"]').value = isNum(state.goal) ? race(state.goal) : '';
    document.querySelector('[data-st4-edit="goal"]').placeholder = isFinite(f.goal) ? race(f.goal) : 'm:ss.hh';
    document.querySelector('[data-st4="editHint"]').textContent = 'Leave the goal empty to aim just under your latest time.';
  }

  function saveEditor() {
    var course = document.querySelector('[data-st4-edit="course"]').value;
    var stroke = document.querySelector('[data-st4-edit="stroke"]').value;
    var d = Number(document.querySelector('[data-st4-edit="distance"]').value);
    var text = document.querySelector('[data-st4-edit="goal"]').value.trim();
    var goal = text ? parse(text) : null;
    if (text && !isFinite(goal)) {
      document.querySelector('[data-st4="editHint"]').textContent = 'Enter the goal as m:ss.hh, e.g. 29.99 or 1:05.50.';
      return false;
    }
    var changedEvent = course !== state.course || stroke !== state.stroke || d !== state.d;
    state.course = course; state.stroke = stroke; state.d = d;
    state.goal = goal;
    state.goalSet = goal ? TODAY : null;
    if (changedEvent && !goal) state.goalSet = null;
    writeStore(GOAL_KEY, { course: course, stroke: stroke, d: d, goal: goal, goalSet: state.goalSet });
    render();
    return true;
  }

  // ---------- Render ----------

  function render() {
    var f = figures();
    renderGoal(f);
    renderAgeUp(f);
    renderComeback();
    renderContext(f);
    renderPredictor(f);
    renderSplits(f);
    renderRaces();
    renderRank(f);
    renderConversions(f);
    renderWeek(f);
    renderTop10(f);
    renderHistory(); // its Top 10 lines arrive with the rankings
    // Nothing to show Top 10 for: no link
    q('[data-st4-top10]').hidden = !!AVAILABLE && !seasonsFor(state.course, state.stroke, state.d, GROUP).length;
  }

  // ---------- Events ----------

  root.addEventListener('click', function (e) {
    var t = e.target;
    var ref = t.closest('[data-st4-refs] button');
    if (ref) { state.ref = ref.getAttribute('data-value'); render(); return; }
    var strat = t.closest('[data-st4-strats] button');
    if (strat) { state.strat = strat.getAttribute('data-value'); render(); return; }
    if (t.closest('[data-st4-view]')) { state.view = state.view === 'chart' ? 'table' : 'chart'; render(); return; }
    if (t.closest('[data-st4-races-toggle]')) {
      state.hist = { course: '', stroke: '', d: '', sort: 'date', shown: HIST_PAGE };
      renderHistory();
      q('#st4-history').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    var hf = t.closest('[data-st4-hist] button');
    if (hf) {
      state.hist[hf.parentNode.getAttribute('data-st4-hist')] = hf.getAttribute('data-value');
      state.hist.shown = HIST_PAGE;
      renderHistory();
      return;
    }
    var sort = t.closest('[data-st4-sort]');
    if (sort) { state.hist.sort = sort.getAttribute('data-st4-sort'); state.hist.shown = HIST_PAGE; renderHistory(); return; }
    if (t.closest('[data-st4-hist-more]')) { state.hist.shown += HIST_PAGE; renderHistory(); return; }
    var line = t.closest('[data-st4-line]');
    if (line) {
      var lk = line.getAttribute('data-st4-line');
      state.hiddenLines[lk] = !state.hiddenLines[lk];
      renderHistory();
      return;
    }
    if (t.closest('[data-st4-hist-reset]')) { state.hist = { course: '', stroke: '', d: '', sort: state.hist.sort, shown: HIST_PAGE }; renderHistory(); return; }
    var from = t.closest('[data-st4-goal-from]');
    if (from) {
      state.d = Number(from.getAttribute('data-d'));
      state.goal = null; state.goalSet = null; state.ref = 'latest';
      writeStore(GOAL_KEY, { course: state.course, stroke: state.stroke, d: state.d, goal: null, goalSet: null });
      render();
      q('.st4-goal').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (t.closest('[data-st4-undo]')) {
      LOG = LOG.filter(function (x) { return x !== lastSaved; });
      writeStore(LOG_KEY, LOG);
      lastSaved = null;
      renderSaved(); renderWeek(figures());
      return;
    }
    if (t.closest('[data-st4-mlog]')) { q('[data-st4-log="distance"]').focus(); return; }
    if (t.closest('[data-st4-share]')) {
      var f = figures();
      var text = 'Working toward ' + race(f.goal) + ' in the ' + state.course + ' ' + eventLower(state.d, state.stroke) +
        (f.latest ? ': latest ' + race(f.latest.secs) : '') + (f.best ? ', best ' + race(f.best.secs) : '') + '.';
      var done = function (msg) { set('shareNote', msg); };
      if (navigator.share) navigator.share({ title: 'Swim Tools', text: text }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { done('Copied: ' + text); }, function () { done(text); });
      else done(text);
    }
  });

  // The event modal (outside .st4): fill it as it opens, save on Save
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-modal-target="#st4Event"]')) openEditor();
    if (e.target.closest('[data-st4-top10]')) { top10.open = true; top10.season = null; renderTop10(figures()); }
    var season = e.target.closest('[data-st4-t10-season]');
    if (season) { top10.season = Number(season.getAttribute('data-st4-t10-season')); renderTop10(figures()); }
    if (e.target.closest('#st4Top10 .js-modal-close')) top10.open = false;
    if (e.target.closest('[data-st4-edit-save]') && saveEditor()) {
      var close = document.querySelector('#st4Event .js-modal-close');
      if (close) close.click();
    }
  }, true);
  document.addEventListener('change', function (e) {
    var el = e.target.closest('[data-st4-edit="course"], [data-st4-edit="stroke"]');
    if (!el) return;
    fillDistances(document.querySelector('[data-st4-edit="course"]').value, document.querySelector('[data-st4-edit="stroke"]').value,
      Number(document.querySelector('[data-st4-edit="distance"]').value));
  });

  q('[data-st4-hist-distance]').addEventListener('change', function (e) {
    state.hist.d = e.target.value;
    state.hist.shown = HIST_PAGE;
    renderHistory();
  });

  var form = q('[data-st4-logform]');
  form.addEventListener('input', renderLogCalc);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = logInputs();
    if (!v.ok) { renderLogCalc(); return; }
    if (MEMBER) {
      lastSaved = { date: TODAY, yd: v.yd, secs: v.secs };
      LOG.push(lastSaved);
      writeStore(LOG_KEY, LOG);
    } else {
      lastSaved = { yd: v.yd, secs: v.secs };
    }
    renderSaved(); renderWeek(figures());
  });

  renderHead();
  renderLogCalc();
  render();
  renderHistory();
  // Which rankings are loaded; each card fetches its event's file from there
  fetch(DATA_BASE + 'available.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    .then(function (data) {
      AVAILABLE = (data && data.datasets) || [];
      render();
    });
})();
