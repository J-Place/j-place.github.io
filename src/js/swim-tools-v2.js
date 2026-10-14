// Swim Tools v2: one swimmer context (course, stroke) feeds every tool on the
// page, and each tool's inputs live in an editor modal. All results are sample
// math, not USMS-approved formulas. Race Time Predictions works as v4's:
// your bests against your age group's USMS rankings (Top Times), projecting
// the distances you haven't raced; split strategies are a linear pace trend
// plus a dive-start allowance on the first split.
(function () {
  var root = document.querySelector('.swim-deck');
  if (!root) return;

  var COURSES = {
    SCY: { factor: 1, unit: 'yd', name: 'short course yards' },
    SCM: { factor: 1.10, unit: 'm', name: 'short course meters' },
    LCM: { factor: 1.12, unit: 'm', name: 'long course meters' }
  };
  // Calorie burn: CAL_PER_MIN for freestyle at REF_PACE (per 100 yd) for a
  // 165 lb swimmer (no weight is asked for), scaled by stroke and by how much
  // faster or slower the swim was than REF_PACE. Sample math, not a
  // published formula.
  var CAL_PER_MIN = 7.2;
  var REF_PACE = 105;    // seconds per 100 yd, a moderate pace
  // No stroke (a mixed workout) burns at the freestyle rate
  var STROKE_BURN = { '': 1, Free: 1, Back: 0.9, Breast: 1.05, Fly: 1.35, IM: 1.1 };
  // Individual events by course and stroke; Back, Breast and Fly share a list.
  var FREE_YARDS = [50, 100, 200, 500, 1000, 1650];
  var FREE_METERS = [50, 100, 200, 400, 800, 1500];
  var EVENTS = {
    SCY: { Free: FREE_YARDS, stroke: [50, 100, 200], IM: [100, 200, 400] },
    SCM: { Free: FREE_METERS, stroke: [50, 100, 200], IM: [100, 200, 400] },
    LCM: { Free: FREE_METERS, stroke: [50, 100, 200], IM: [200, 400] }
  };
  // Equivalent distances, kept when switching between yards and meters
  var EQUIVALENT = { 500: 400, 1000: 800, 1650: 1500, 400: 500, 800: 1000, 1500: 1650 };
  var TREND = { even: 0, fast: 0.06, neg: -0.05 };
  var DIVE = 1.8; // seconds a dive start takes off the first split

  // USMS age groups with a slowdown factor relative to 25-29. 25-29 through
  // 65-69 match the design reference's sample times; the rest are filled in
  // along the same curve. Sample values, not USMS data.
  var AGE_GROUPS = [
    [18, '18–24', 1.000], [25, '25–29', 1.000], [30, '30–34', 1.008],
    [35, '35–39', 1.018], [40, '40–44', 1.038], [45, '45–49', 1.062],
    [50, '50–54', 1.103], [55, '55–59', 1.135], [60, '60–64', 1.170],
    [65, '65–69', 1.208], [70, '70–74', 1.270], [75, '75–79', 1.350],
    [80, '80–84', 1.460], [85, '85–89', 1.600], [90, '90–94', 1.800],
    [95, '95–99', 2.050], [100, '100+', 2.400]
  ].map(function (g) { return { min: g[0], label: g[1], factor: g[2] }; });
  var AGE_ROWS = 7; // your group plus up to three younger and three older

  var lastEvent = null; // course, distance and stroke at the last render

  var state = {
    course: 'SCY', stroke: 'Free', distance: '200', age: '27',
    // Your age group, by its youngest age, when we don't know your age:
    // 60-64, the largest men's group in USMS membership (11.9% of male
    // members, Nov. 1, 2024)
    ageGroup: '60',
    view: 'chart', strategy: 'even',
    predHidden: {}, // Race Time Predictions: lines turned off (you, mid, low, ten, top)
    // The swim Training Metrics are worked out from (its settings modal)
    // The Training Metrics swim (Your Swim). stroke is optional: '' for a
    // mixed workout.
    // Time and pace (per 100) both show; the one changed last (source) is
    // used, and the other is worked out from it
    // effort: how hard it felt, '1' to '10', or '' (not rated; Effort's
    // buttons, data-optional)
    metrics: { course: 'SCY', distance: '1650', time: '22:30.00', pace: '', source: 'time', stroke: '', effort: '' },
    // Race history, oldest first; the predictor is built from it (loadRaces)
    races: [],
    // The Add a Race form; reset from Your Event each time it opens
    newRace: { course: 'SCY', distance: '200', stroke: 'Free', time: '', date: '' },
    racesExpanded: false,   // Your Races: all of them, not just the newest few
    // Convert a Time (Time Conversions): its own event, and a time or a pace
    // (per 100); the one changed last (source) is used and the other worked
    // out from it
    conv: { course: 'SCY', distance: '200', stroke: 'Free', time: '', pace: '', source: 'time' },
    // Top 10 by Decade's event, in the lists' course; follows Your Event
    // (followEvent) until the card's own controls change it
    tens: { stroke: 'Free', distance: '200' },
    // Race Splits goal time. Empty means use the event's time (your best,
    // projected time or the age-group median).
    goal: '',
    interval: '50' // Race Splits: every 50, or the closest interval that divides the distance (fitInterval)
  };

  // ---------- Time helpers ----------

  // "1:02.34" or "27.80" to seconds; NaN when it can't be read
  function parse(text) {
    var parts = String(text).trim().split(':');
    if (parts.length > 2 || parts[parts.length - 1] === '') return NaN;
    var secs = parts.length === 2 ? Number(parts[0]) * 60 + Number(parts[1]) : Number(parts[0]);
    return secs > 0 ? secs : NaN;
  }

  // Race time, m:ss.hh
  function race(s) {
    if (!isFinite(s)) return '—';
    s = Math.round(s * 100) / 100;
    var m = Math.floor(s / 60), r = (s - m * 60).toFixed(2);
    return m ? m + ':' + (r < 10 ? '0' : '') + r : r;
  }

  // ---------- Three-box time fields (TimeField.njk) ----------

  function timeParts(group) {
    return {
      m: group.querySelector('[data-time-part="m"]'),
      s: group.querySelector('[data-time-part="s"]'),
      h: group.querySelector('[data-time-part="h"]')
    };
  }

  // The boxes as one "m:ss.hh" value, '' when all are empty. A lone seconds
  // digit is seconds (5 is 05); a lone hundredths digit is tenths (5 is 50).
  // A field without a hundredths box (e.g. a pace) reads as .00.
  function readTimeField(group) {
    var p = timeParts(group), h = p.h ? p.h.value : '';
    if (!p.m.value && !p.s.value && !h) return '';
    return Number(p.m.value || 0) + ':' + ('0' + (p.s.value || '0')).slice(-2) +
      '.' + (h + '00').slice(0, 2);
  }

  // Split a time into the boxes (or into their placeholders); to the whole
  // second for a field without a hundredths box
  function splitTime(secs, wholeSeconds) {
    secs = wholeSeconds ? Math.round(secs) : Math.round(secs * 100) / 100;
    var m = Math.floor(secs / 60), s = Math.floor(secs - m * 60);
    var h = Math.round((secs - m * 60 - s) * 100);
    return { m: m ? String(m) : '', s: ('0' + s).slice(-2), h: ('0' + h).slice(-2) };
  }

  function fillTimeField(group, value) {
    var p = timeParts(group), v = value ? splitTime(parse(value), !p.h) : { m: '', s: '', h: '' };
    p.m.value = v.m; p.s.value = v.s;
    if (p.h) p.h.value = v.h;
  }

  function setTimePlaceholders(group, secs) {
    var p = timeParts(group), v = isFinite(secs) ? splitTime(secs, !p.h) : { m: 'mm', s: 'ss', h: 'hh' };
    p.m.placeholder = v.m || '0'; p.s.placeholder = v.s;
    if (p.h) p.h.placeholder = v.h;
  }

  function markTimeField(group, ok) {
    group.querySelectorAll('[data-time-part]').forEach(function (el) {
      el.setAttribute('aria-invalid', String(!ok));
    });
  }

  // A time value needs seconds under 60
  function validEntry(text) {
    var m = /:(\d+)/.exec(text);
    return isFinite(parse(text)) && !(m && Number(m[1]) >= 60);
  }

  // "a Free race", "an IM race"
  function aStroke(stroke) {
    return (/^[AEIOU]/.test(stroke) ? 'an ' : 'a ') + stroke;
  }

  // Pace, m:ss
  function clock(s) {
    if (!isFinite(s)) return '—';
    s = Math.round(s);
    var r = s % 60;
    return Math.floor(s / 60) + ':' + (r < 10 ? '0' : '') + r;
  }

  // ---------- Calculations ----------

  function eventsFor(course, stroke) {
    return EVENTS[course][stroke] || EVENTS[course].stroke;
  }

  // Keep the context distance a real event for its course and stroke: the
  // equivalent distance after a yards/meters switch, otherwise the nearest.
  function fitDistance(settings, list) {
    var d = Number(settings.distance);
    if (list.indexOf(d) < 0 && list.indexOf(EQUIVALENT[d]) >= 0) d = EQUIVALENT[d];
    if (list.indexOf(d) < 0) {
      d = list.reduce(function (best, x) {
        return Math.abs(Math.log(x / d)) < Math.abs(Math.log(best / d)) ? x : best;
      });
    }
    settings.distance = String(d);
  }

  // A race's time for the matching event in another course: the same
  // distance, or its yards/meters equivalent (500 yd and 400 m), scaled by
  // course and distance. NaN when that course has no matching event.
  function convertRace(r, course) {
    var d = Number(r.distance), list = eventsFor(course, r.stroke);
    var target = list.indexOf(d) >= 0 ? d : list.indexOf(EQUIVALENT[d]) >= 0 ? EQUIVALENT[d] : 0;
    if (!target) return { d: 0, secs: NaN };
    return { d: target, secs: parse(r.time) / COURSES[r.course].factor * COURSES[course].factor * target / d };
  }

  // Only races swum in the selected age group count, so a long history
  // predicts from how you swim now, not from your lifetime bests. Races
  // without an age (no birth date to work it out) always count.
  function inAgeGroup(r) {
    if (r.age == null) return true;
    return groupOf(r.age) === ageGroup();
  }

  // The age group an age falls in, or null under 18
  function groupOf(age) {
    var found = null;
    AGE_GROUPS.forEach(function (g) { if (age >= g.min) found = g; });
    return found;
  }

  // Average times (src/_data/averageTimes.json, embedded as
  // #average-times-data): SCY, 25-29, by stroke and distance. Rank in Age
  // Group's estimate; the predictor uses USMS rankings (Top Times, below).
  var AVERAGES = {};
  try {
    AVERAGES = JSON.parse(document.getElementById('average-times-data').textContent);
  } catch (e) {}

  function ageGroup() {
    var min = Number(state.ageGroup);
    return AGE_GROUPS.filter(function (g) { return g.min === min; })[0] || AGE_GROUPS[1];
  }

  // The average time for an event in a course, for an age group: the SCY
  // 25-29 time for that distance (or its yards/meters equivalent), scaled by
  // course, distance and age
  function averageTime(course, stroke, d, group) {
    var table = AVERAGES[stroke] || {};
    var from = table[d] ? d : table[EQUIVALENT[d]] ? EQUIVALENT[d] : 0;
    if (!from) return NaN;
    return parse(table[from]) * COURSES[course].factor * (d / from) * group.factor;
  }

  // The same distance in another course's list, or its yards/meters
  // equivalent; 0 when there's neither
  function matchDistance(d, course, stroke) {
    var list = eventsFor(course, stroke);
    return list.indexOf(d) >= 0 ? d : list.indexOf(EQUIVALENT[d]) >= 0 ? EQUIVALENT[d] : 0;
  }

  // ---------- Rankings: USMS Top Times ----------

  // As on v4: the Top Times API's static files
  // (docs/api/top-times.openapi.yaml), one event's full ranking per season,
  // gender, age group and course, fetched as the predictor needs it. Which
  // exist is listed in available.json (fetched at start). A course with no
  // files of its own uses SCY's, converted.
  var DATA_BASE = '/data/top-times/';
  var AVAILABLE = null;  // its datasets, once available.json is in
  var RANKS = {};        // url: 'loading', null (no ranking), or the file's ranking
  var renderQueued = false;

  // "50-54", as the files name an age group
  function ageKey(group) {
    var k = AGE_GROUPS.indexOf(group), next = AGE_GROUPS[k + 1];
    return group.min + '-' + (next ? next.min - 1 : group.min + 4);
  }

  function request(url) {
    RANKS[url] = 'loading';
    fetch(url).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }).then(function (data) {
      RANKS[url] = data && data.swimmers && data.swimmers.length ? {
        n: data.total || data.swimmers.length, truncated: !!data.truncated, seasonLabel: data.seasonLabel,
        // 'usms' (real) or 'synthetic' (modeled), which the page must say
        synthetic: data.provenance === 'synthetic',
        times: data.swimmers.map(function (x) { return parse(x.time); }).filter(isFinite)
      } : null;
      // One render for a batch of files arriving together
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

  // An event's latest ranking for an age group and the swimmer's gender, in
  // a course (or SCY's, converted): { n, truncated, synthetic, times
  // (seconds, fastest first) }. null when there's none, or it isn't in yet
  // (asking for it starts the fetch).
  function groupRank(course, stroke, d, group) {
    var gender = swimmerGender().toLowerCase();
    if (!group || !gender || !AVAILABLE) return null;
    var age = ageKey(group), from = course.toLowerCase();
    var setsFor = function (c) {
      return AVAILABLE.filter(function (x) { return x.course === c && x.gender === gender && x.age === age; })
        .sort(function (a, b) { return b.season - a.season; });
    };
    var sets = setsFor(from);
    if (!sets.length) { from = 'scy'; sets = setsFor(from); }
    var FROM = from.toUpperCase(), fromD = matchDistance(d, FROM, stroke);
    if (!sets.length || !fromD) return null;
    var url = DATA_BASE + sets[0].season + '/' + gender + '-' + age + '/' + from + '/' + stroke.toLowerCase() + '/' + fromD + '.json';
    if (!(url in RANKS)) request(url);
    var e = RANKS[url];
    if (!e || e === 'loading') return null;
    var scale = COURSES[course].factor / COURSES[FROM].factor * d / fromD;
    return {
      n: e.n, truncated: e.truncated, synthetic: e.synthetic, seasonLabel: e.seasonLabel, converted: FROM !== course,
      times: e.times.map(function (t) { return t * scale; })
    };
  }

  // The time at a share of the field: the slowest swim within it (NaN past
  // the end of a truncated list)
  function atShare(rank, share) {
    var i = Math.max(0, Math.ceil(rank.n * share) - 1);
    return i < rank.times.length ? rank.times[i] : NaN;
  }
  function median(rank) {
    return atShare(rank, 0.5);
  }
  function topTen(rank) {
    return rank.times[Math.min(9, rank.times.length - 1)];
  }

  // The bottom edge of a ranking: the slowest swims, without outliers. Drops
  // anything past the usual outlier fence (more than 1.5 times the middle
  // half's spread beyond its slower end), then averages the 3 slowest left.
  function typicalSlowest(rank) {
    var t = rank.times, n = t.length;
    if (!n) return NaN;
    var q = function (p) { return t[Math.min(n - 1, Math.max(0, Math.ceil(n * p) - 1))]; };
    var fence = q(0.75) + 1.5 * (q(0.75) - q(0.25));
    var kept = t.filter(function (x) { return x <= fence; }).slice(-3);
    return kept.reduce(function (a, b) { return a + b; }, 0) / kept.length;
  }

  // Why there's no ranking to compare with
  function noRankText() {
    if (pending()) return 'Loading USMS rankings…';
    if (!swimmerGender()) return 'Add your gender to your profile to compare with your age group.';
    return 'USMS rankings for ' + swimmerGender().toLowerCase() + ' ' + ageGroup().label + ' ' + state.course + ' ' + lowerStroke(state.stroke) + ' aren\'t available yet.';
  }

  // "free", "IM"
  function lowerStroke(stroke) {
    return stroke === 'IM' ? 'IM' : stroke.toLowerCase();
  }

  // ---------- Race Time Predictions ----------

  // Your races as the predictor reads them: { course, d, stroke, secs, date, age }
  function predRaces() {
    return state.races.map(function (r) {
      return { course: r.course, d: Number(r.distance), stroke: r.stroke, secs: parse(r.time), date: r.date, age: r.age };
    }).filter(function (r) { return isFinite(r.secs); });
  }
  // Only the last 8 years' races count: age adjustment covers getting
  // older, not changes in fitness or training. Undated races count.
  var WINDOW_YEARS = 8;

  // The races the predictor works from: the window's, or, when none of
  // them are in the stroke, every race in it (pool.old: all over 8 years
  // ago), so a swimmer back from a break still sees their swims, adjusted
  function predPool(stroke) {
    var all = predRaces(), t = today();
    var from = (Number(t.slice(0, 4)) - WINDOW_YEARS) + t.slice(4);
    var recent = all.filter(function (r) { return !r.date || r.date >= from; });
    var inStroke = function (r) { return r.stroke === stroke; };
    var pool = !recent.some(inStroke) && all.some(inStroke) ? all : recent;
    pool.old = pool === all && pool !== recent;
    return pool;
  }

  function fastest(list) {
    return list.reduce(function (b, r) { return !b || r.secs < b.secs ? r : b; }, null);
  }

  // "Sep 2026"
  function monthYear(date) {
    return formatDate(date).replace(/ \d+,/, '');
  }

  // A distance you've raced in this course and stroke, but not in your
  // current age group: your best earlier swim, scaled from that age group to
  // yours by how the age-group median slows (AGE_GROUPS' slowdown factors
  // where those rankings aren't in). The fastest result wins. Sets r.proj,
  // r.projFrom and r.adjusted.
  function ageAdjust(rows, races, course, stroke) {
    var group = ageGroup();
    rows.forEach(function (r) {
      if (isFinite(r.you)) return;
      races.forEach(function (x) {
        if (x.course !== course || x.stroke !== stroke || x.d !== r.d) return;
        if (x.age == null || inAgeGroup(x)) return;
        var then = groupOf(x.age);
        if (!then) return;
        var a = groupRank(course, stroke, r.d, group), b = groupRank(course, stroke, r.d, then);
        var ratio = a && b ? median(a) / median(b) : group.factor / then.factor;
        var t = x.secs * ratio;
        if (!(t >= r.proj)) {
          r.proj = t; r.adjusted = true;
          r.projFrom = 'Age-adjusted from your ' + race(x.secs) + ' at ' + x.age + (x.date ? ' (' + monthYear(x.date) + ')' : '');
        }
      });
    });
  }

  // Projected times for the distances you haven't raced in this course and
  // stroke. First your best at the same distance in another course,
  // converted; otherwise your nearest distance, scaled by how the age
  // group's median slows from that distance to this one (or by Riegel's
  // 1.06 exponent without rankings). Sets r.proj and r.projFrom.
  function project(rows, races, course, stroke) {
    rows.forEach(function (r) {
      if (isFinite(r.you)) return;
      ['SCY', 'SCM', 'LCM'].forEach(function (c) {
        if (c === course) return;
        races.forEach(function (x) {
          // only swims from your current age group (and they beat an
          // age-adjusted older swim, being real ones)
          if (x.course !== c || x.stroke !== stroke || !inAgeGroup(x)) return;
          var to = convertRace({ course: c, distance: x.d, stroke: x.stroke, time: String(x.secs) }, course);
          if (to.d === r.d && isFinite(to.secs) && (r.adjusted || !(to.secs >= r.proj))) {
            r.proj = to.secs; r.projFrom = 'your ' + c + ' ' + x.d; r.adjusted = false; r.converted = true;
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
      r.projFrom = isFinite(a.you) ? 'your ' + a.d : a.adjusted ? 'your age-adjusted ' + a.d : a.projFrom;
    });
  }

  // Every event in a course and stroke (Your Event's, or Your Swim's for
  // Training Effect), as:
  //   you   your best in your current age group (NaN if you haven't raced it)
  //   proj  a projected or age-adjusted time where you haven't
  //   est   you, else proj
  //   mid, low, ten, top   your age group's median, slowest (outliers
  //         dropped), 10th place and fastest; NaN without rankings
  //   wins  est is as fast as this season's fastest: you'd have won
  // From the last 8 years' races (predPool): your current age group's are
  // real bests, earlier ones age-adjusted. rows.old: every race in the
  // stroke is older than that.
  function predictions(list, course, stroke) {
    var group = ageGroup(), races = predPool(stroke);
    var rows = list.map(function (d) {
      var b = fastest(races.filter(function (x) {
        return x.course === course && x.stroke === stroke && x.d === d && inAgeGroup(x);
      }));
      var r = groupRank(course, stroke, d, group);
      return {
        d: d, you: b ? b.secs : NaN, youDate: b ? b.date : '', proj: NaN,
        mid: r ? median(r) : NaN, low: r ? typicalSlowest(r) : NaN, ten: r ? topTen(r) : NaN, top: r ? r.times[0] : NaN,
        synthetic: !!(r && r.synthetic)
      };
    });
    ageAdjust(rows, races, course, stroke);
    project(rows, races, course, stroke);
    rows.forEach(function (r) {
      r.est = isFinite(r.you) ? r.you : r.proj;
      r.wins = isFinite(r.est) && isFinite(r.top) && r.est <= r.top;
    });
    rows.old = races.old;
    return rows;
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

  // Blue ramp across the split bar, darkest first
  function rampColor(i, n) {
    var from = [0, 104, 173], to = [140, 192, 227], t = n > 1 ? i / (n - 1) : 0;
    return 'rgb(' + from.map(function (c, k) { return Math.round(c + (to[k] - c) * t); }).join(',') + ')';
  }

  // ---------- Rendering ----------

  function set(name, text) {
    document.querySelectorAll('[data-st="' + name + '"]').forEach(function (el) {
      el.textContent = text;
    });
  }

  // Race Time Predictions' skeleton: the summary's lines (two on desktop,
  // five on phones, where it wraps more; .swim-skel__line--phone) and the
  // legend's pills at their usual widths
  var SKEL_LINES = '<span class="visually-hidden">Loading USMS rankings…</span>' +
    ['100%', '86%', '94%', '90%', '58%'].map(function (w, i) {
      return '<span class="swim-skel swim-skel__line' + (i > 1 ? ' swim-skel__line--phone' : '') + '" style="width: ' + w + '" aria-hidden="true"></span>';
    }).join('');
  var SKEL_PILLS = [94, 94, 122, 124, 126, 127].map(function (w) {
    return '<span class="swim-skel swim-skel__pill" style="width: ' + w + 'px" aria-hidden="true"></span>';
  }).join('');

  // The pace scale. Bottom: 15 s per 100 below your shortest event (real
  // or predicted), rounded down to 5 s, but never above the fastest line
  // showing; 0:30 without a time of yours. Top: the slowest pace, at least
  // 2 s clear, rounded up to the next 15 s. Ticks on the 30 s (or minute,
  // past six) marks, plus the bottom itself.
  function paceScale(anchor, slowest, fastestPace) {
    var lo = isFinite(anchor) ? Math.floor((anchor - 15) / 5) * 5 : 30;
    if (isFinite(fastestPace)) lo = Math.min(lo, Math.floor((fastestPace - 2) / 5) * 5);
    lo = Math.max(0, lo);
    var hi = Math.max(lo + 30, Math.ceil((slowest + 2) / 15) * 15);
    var step = 30 * Math.ceil((hi - lo) / 30 / 6), ticks = [lo];
    for (var tk = Math.ceil(lo / step) * step; tk <= hi; tk += step) {
      // the bottom's own label unless a round mark sits right on top of it
      if (tk - lo < 8) ticks.pop();
      ticks.push(tk);
    }
    if (ticks[ticks.length - 1] !== hi) ticks.push(hi);
    var at = function (p) { return 100 - (p - lo) / (hi - lo) * 100; };
    return {
      y: at,
      html: ticks.map(function (t) {
        return '<span style="top: ' + at(t).toFixed(1) + '%">' + clock(t) + '</span>';
      }).join('')
    };
  }

  // Race Time Predictions, as v4's: your bests (triangles) and projections
  // (open dots) as pace per 100, against your age group's median, slowest,
  // 10th place and fastest. Each line turns off from its legend pill
  // (state.predHidden). Returns the rows (predictions).
  function renderPredictor(list) {
    var q = function (sel) { return root.querySelector(sel); };
    var rows = predictions(list, state.course, state.stroke), group = ageGroup(), off = state.predHidden;
    var eventD = Number(state.distance);
    // No races to predict from (a guest, or a stroke you haven't raced):
    // predict from Your Event's time instead, your own goal if you've typed
    // one, else the age-group median, scaled to each distance by how the
    // age group's median changes. Untyped, they're simply the medians.
    var fromTime = null;
    if (!rows.some(function (r) { return isFinite(r.est); })) {
      var at = rows.filter(function (r) { return r.d === eventD; })[0];
      var own = !state.goalAuto && state.goal !== '' && validEntry(state.goal);
      var anchor = own ? parse(state.goal) : at ? at.mid : NaN;
      if (at && isFinite(anchor) && isFinite(at.mid)) {
        fromTime = { own: own, d: eventD, secs: anchor };
        var why = own ? 'Predicted from your ' + eventD + ' time, ' + race(anchor) : 'The ' + group.label + ' median';
        rows.forEach(function (r) {
          if (!isFinite(r.mid)) return;
          r.proj = anchor * r.mid / at.mid;
          r.est = r.proj;
          r.fromTime = true;
          r.projFrom = why;
          r.wins = isFinite(r.top) && r.est <= r.top;
        });
      }
    }
    var projected = rows.some(function (r) { return isFinite(r.proj); });
    var hasRank = rows.some(function (r) { return isFinite(r.mid); });
    // Rankings still on their way: grey placeholders the size of what's
    // coming (the plot's shimmer, the summary's lines, the legend's pills),
    // so nothing jumps when they arrive
    var loading = !hasRank && pending();
    root.querySelector('#race-predictor').classList.toggle('is-loading', loading);
    var pace = function (t, d) { return t / (d / 100); };
    var all = [];
    rows.forEach(function (r) {
      r.youP = pace(r.you, r.d); r.estP = pace(r.est, r.d);
      r.midP = pace(r.mid, r.d); r.lowP = pace(r.low, r.d); r.tenP = pace(r.ten, r.d); r.topP = pace(r.top, r.d);
      if (isFinite(r.estP) && !off.you) all.push(r.estP);
      if (isFinite(r.midP) && !off.mid) all.push(r.midP);
      if (isFinite(r.lowP) && !off.low) all.push(r.lowP);
      if (isFinite(r.tenP) && !off.ten) all.push(r.tenP);
    });
    var label = group.label + ' median', lowLabel = group.label + ' slowest';
    var tenLabel = group.label + ' top ten', topLabel = group.label + ' fastest';
    var synthetic = rows.some(function (r) { return r.synthetic; });
    set('predSubtitle', fromTime ? 'Pace per 100 · ' + state.course + ' ' + lowerStroke(state.stroke) + (fromTime.own ? ' predictions from your ' + fromTime.d + ' time' : ' median times') + ', with the ' + group.label + ' range' + (synthetic ? ' · synthetic data' : '') :
      'Pace per 100 · your ' + state.course + ' ' + lowerStroke(state.stroke) + ' races against the ' + label +
      (projected ? ', with projected times where you haven\'t raced' : '') + (rows.old ? ' · from races over ' + WINDOW_YEARS + ' years ago' : '') +
      (synthetic ? ' · synthetic data' : ''));
    set('groupCol', label);
    set('bottomCol', lowLabel);
    set('topTenCol', tenLabel);
    set('fastestCol', topLabel);

    // The legend: pills turn lines off and on; Projected is a key only
    var key = function (id, text) {
      return '<button type="button" class="swim-pred-key" data-pred-line="' + id + '" aria-pressed="' + !off[id] + '">' +
        '<span class="swim-pred-swatch swim-pred-swatch--' + id + '" aria-hidden="true"></span>' + text + '</button>';
    };
    q('[data-pred-legend]').innerHTML = loading ? SKEL_PILLS : key('you', 'Your best') +
      (projected ? '<span class="swim-pred-key swim-pred-key--static"><span class="swim-pred-swatch swim-pred-swatch--proj" aria-hidden="true"></span>Projected</span>' : '') +
      // fastest first, down to slowest
      (hasRank ? key('top', topLabel) + key('ten', tenLabel) + key('mid', label) + key('low', lowLabel) : '');

    var svg = q('[data-pred-svg]'), dots = q('[data-pred-dots]');
    var lines = ['group', 'bottom', 'top10', 'fastest', 'proj', 'field', 'field-mid', 'field-top', 'field-fastest'];
    // The events along the top, with the stroke: "200Fr", "100IM"
    var abbr = { Free: 'Fr', Back: 'Ba', Breast: 'Br', Fly: 'Fl', IM: 'IM' }[state.stroke];
    q('[data-pred-axis]').innerHTML = list.map(function (d, i) {
      return '<span style="left: ' + (list.length > 1 ? i / (list.length - 1) * 100 : 50).toFixed(2) + '%">' + d + abbr + '</span>';
    }).join('');
    if (!all.length) {
      lines.forEach(function (k) { q('[data-pred-' + k + ']').setAttribute('points', ''); });
      q('[data-pred-you]').setAttribute('d', '');
      dots.innerHTML = '';
      q('[data-pred-y]').innerHTML = '';
      svg.setAttribute('aria-label', 'No paces to show');
    } else {
      var first = rows.filter(function (r) { return isFinite(r.estP); })[0];
      var scale = paceScale(first ? first.estP : NaN, Math.max.apply(null, all), Math.min.apply(null, all));
      q('[data-pred-y]').innerHTML = scale.html;
      var x = function (i) { return list.length > 1 ? i / (list.length - 1) * 100 : 50; };
      var y = scale.y; // slower is higher
      var pts = function (k) {
        return rows.map(function (r, i) { return isFinite(r[k]) ? x(i).toFixed(2) + ',' + y(r[k]).toFixed(1) : null; }).filter(Boolean).join(' ');
      };
      // A line down to the chart's bottom, closed: the fills under a line
      var fill = function (k) {
        var p = rows.map(function (r, i) { return isFinite(r[k]) ? [x(i), y(r[k])] : null; }).filter(Boolean);
        return p.length ? p.map(function (a) { return a[0].toFixed(2) + ',' + a[1].toFixed(1); }).join(' ') +
          ' ' + p[p.length - 1][0].toFixed(2) + ',100 ' + p[0][0].toFixed(2) + ',100' : '';
      };
      q('[data-pred-group]').setAttribute('points', off.mid ? '' : pts('midP'));
      q('[data-pred-bottom]').setAttribute('points', off.low ? '' : pts('lowP'));
      q('[data-pred-top10]').setAttribute('points', off.ten ? '' : pts('tenP'));
      q('[data-pred-fastest]').setAttribute('points', off.top ? '' : pts('topP'));
      q('[data-pred-field]').setAttribute('points', off.low ? '' : fill('lowP'));
      q('[data-pred-field-top]').setAttribute('points', off.ten ? '' : fill('tenP'));
      q('[data-pred-field-fastest]').setAttribute('points', off.top ? '' : fill('topP'));
      // Between the median line and the top ten line
      var band = rows.map(function (r, i) { return isFinite(r.midP) && isFinite(r.tenP) ? i : null; }).filter(function (i) { return i !== null; });
      q('[data-pred-field-mid]').setAttribute('points', off.mid || off.ten || !band.length ? '' :
        band.map(function (i) { return x(i).toFixed(2) + ',' + y(rows[i].midP).toFixed(1); })
          .concat(band.slice().reverse().map(function (i) { return x(i).toFixed(2) + ',' + y(rows[i].tenP).toFixed(1); })).join(' '));
      // Solid only between real races at neighboring distances
      q('[data-pred-you]').setAttribute('d', off.you ? '' : rows.map(function (r, i) {
        if (!isFinite(r.youP)) return '';
        return (i && isFinite(rows[i - 1].youP) ? 'L' : 'M') + x(i).toFixed(2) + ',' + y(r.youP).toFixed(1);
      }).join(''));
      // Dotted through every point, so projections join your real races
      q('[data-pred-proj]').setAttribute('points', projected && !off.you ? pts('estP') : '');
      // Each label sits on the side away from the median line (above when
      // you're slower than it), or under its dot near the top of the chart.
      // Your Event's label is bold.
      dots.innerHTML = off.you ? '' : rows.map(function (r, i) {
        if (!isFinite(r.estP)) return '';
        var cls = isFinite(r.you) ? ' is-best' : ' is-projected';
        var below = (isFinite(r.midP) && !off.mid && r.estP < r.midP) || y(r.estP) < 14;
        var at = 'left: ' + x(i).toFixed(2) + '%; top: ' + y(r.estP).toFixed(1) + '%';
        var title = isFinite(r.you) ? '' : ' title="' + (r.adjusted || r.fromTime ? r.projFrom : 'Projected from ' + r.projFrom) + '"';
        return '<span class="swim-pred__dot' + cls + '" style="' + at + '"' + title + '></span>' +
          '<span class="swim-pred__label' + cls + (r.d === eventD ? ' is-event' : '') + (below ? ' is-below' : '') + '" style="' + at + '">' + race(r.est) + '</span>' +
          // On the side away from the time label, hung inward at the ends
          (r.wins ? '<span class="swim-pred-win' + (below ? '' : ' is-below') + (x(i) > 90 ? ' is-end' : x(i) < 10 ? ' is-start' : '') + '" style="' + at + '">Projected Winner</span>' : '');
      }).join('');
      svg.setAttribute('aria-label', 'Pace per 100 by distance, slower higher. ' + rows.map(function (r) {
        return r.d + ': you ' + clock(r.estP) + (isFinite(r.you) ? '' : ' (projected)') + ', ' + label + ' ' + clock(r.midP) +
          ', ' + lowLabel + ' ' + clock(r.lowP) + ', 10th place ' + clock(r.tenP) + ', fastest ' + clock(r.topP);
      }).join('; '));
    }

    q('[data-pred-rows]').innerHTML = rows.map(function (r) {
      var mine = isFinite(r.you) ? race(r.you) : isFinite(r.proj) ?
        '<span class="swim-pred__proj" title="' + (r.adjusted || r.fromTime ? r.projFrom : 'Projected from ' + r.projFrom) + '">' + race(r.proj) + ' <small>' +
        (r.fromTime ? (fromTime.own ? 'predicted' : 'median') : r.adjusted ? 'age-adjusted' : 'projected') + '</small></span>' : '—';
      if (r.wins) mine += ' <span class="swim-pred-win swim-pred-win--inline">Projected Winner</span>';
      return '<tr' + (r.d === eventD ? ' class="is-goal"' : '') + '><th scope="row">' + r.d + ' ' + state.stroke + '</th><td>' + mine + '</td><td>' + clock(r.estP) +
        '</td><td>' + race(r.mid) + '</td><td>' + clock(r.midP) + '</td><td>' + race(r.low) + '</td><td>' + clock(r.lowP) +
        '</td><td>' + race(r.ten) + '</td><td>' + clock(r.tenP) + '</td><td>' + race(r.top) + '</td><td>' + clock(r.topP) + '</td></tr>';
    }).join('');

    // Any distance where you'd have won: say so under the chart, with when
    // the best was swum (it may be years old, against today's field)
    var winNote = q('[data-pred-win-note]'), wins = rows.filter(function (r) { return r.wins; });
    winNote.hidden = !wins.length || !!off.you;
    winNote.innerHTML = wins.map(function (r) {
      var ev = r.d + ' ' + lowerStroke(state.stroke);
      var what = isFinite(r.you) ? 'Your best ' + ev + ' (' + race(r.est) + (r.youDate ? ', ' + monthYear(r.youDate) : '') + ')' :
        r.adjusted ? 'Your age-adjusted ' + ev + ' (' + race(r.est) + ', ' + r.projFrom.replace(/^Age-adjusted /, '') + ')' :
        'Your projected ' + ev + ' (' + race(r.est) + ')';
      return '<b>' + what + (r.est < r.top ? ' beats' : ' ties') + ' this season\'s fastest in ' +
        swimmerGender().toLowerCase() + ' ' + group.label + '</b> (' + race(r.top) + ').';
    }).join(' ');

    // The insight: where your pace is closest to and furthest from the median
    var box = q('[data-pred-insight]');
    // Your real bests and age-adjusted swims (not times projected from
    // another distance)
    var raced = rows.filter(function (r) { return (isFinite(r.you) || r.adjusted) && isFinite(r.estP) && isFinite(r.midP); });
    raced.forEach(function (r) { r.gap = r.estP - r.midP; });
    var old = rows.old ? 'Your last ' + lowerStroke(state.stroke) + ' races were over ' + WINDOW_YEARS + ' years ago, so they\'re age-adjusted to ' + group.label + '. ' : '';
    var gap = function (r) {
      return 'about ' + Math.abs(r.gap).toFixed(1) + ' s ' + (r.gap > 0 ? 'off' : 'ahead of') + ' the age-group median';
    };
    if (loading) {
      box.innerHTML = SKEL_LINES;
    } else if (!hasRank) {
      box.textContent = noRankText();
    } else if (fromTime) {
      box.innerHTML = fromTime.own ?
        '<b>Predicted from your ' + fromTime.d + ' ' + lowerStroke(state.stroke) + ' time of ' + race(fromTime.secs) + '.</b> Each distance scales it by how the ' + group.label + ' median changes. Race to see predictions from your own results.' :
        '<b>These are the ' + group.label + ' median times.</b> Enter your own time for the ' + fromTime.d + ' above to see your predictions, or race to see predictions from your results.';
    } else if (!raced.length) {
      box.textContent = 'Race the ' + lowerStroke(state.stroke) + ' to compare your pace with your age group.';
    } else if (raced.length === 1) {
      // How many times you've swum it in the window (or ever, past it)
      var times = predPool(state.stroke).filter(function (x) {
        return x.course === state.course && x.stroke === state.stroke && x.d === raced[0].d;
      }).length;
      box.innerHTML = old + '<b>You\'ve raced the ' + state.course + ' ' + raced[0].d + ' ' + lowerStroke(state.stroke) + ' ' +
        (times === 1 ? 'one time' : times === 2 ? 'twice' : times + ' times') + (rows.old ? '' : ' in the last ' + WINDOW_YEARS + ' years') + '.</b> Per 100 you\'re ' + gap(raced[0]) +
        '. Race another distance to see where you\'re strongest.';
    } else {
      // Strongest and weakest by pace against the median (lower is better)
      var strong = raced.reduce(function (a, b) { return b.gap < a.gap ? b : a; });
      var weak = raced.reduce(function (a, b) { return b.gap > a.gap ? b : a; });
      var kind = function (d) { return d <= 100 ? 'sprint' : d >= 500 ? 'distance' : d; };
      var work = weak.d > strong.d ? 'Distance work' : 'Speed work';
      var both = ' Per 100, your ' + strong.d + ' is ' + gap(strong) + ' and your ' + weak.d + ' is ' + gap(weak) + '. ';
      box.innerHTML = old + (weak.gap <= 0 ? '<b>You\'re ahead of the age-group median at every distance.</b>' + both + 'Your ' + kind(strong.d) + ' is your strongest event.' :
        strong.gap < 0 ? '<b>Your ' + kind(strong.d) + ' is ahead of the pack.</b>' + both + work + ' will close the gap fastest.' :
        '<b>Your ' + kind(strong.d) + ' is closest to the pack.</b>' + both + work + ' will move your times fastest.');
    }
    q('[data-pred-view]').textContent = state.view === 'chart' ? 'Table view' : 'Chart view';
    return rows;
  }

  // ---------- Top 10 by Decade ----------

  // USMS Top 10 lists (src/_data/topTens.json, embedded as #top-tens-data):
  // one per course, gender and age group, each with seasons of each event's
  // times, fastest first
  var TOP_TEN_LISTS = [];
  try {
    TOP_TEN_LISTS = JSON.parse(document.getElementById('top-tens-data').textContent).lists || [];
  } catch (e) {}

  // The swimmer's gender as the lists name it; '' when users.json doesn't
  // have it, which matches no list
  function swimmerGender() {
    return { M: 'Men', F: 'Women' }[(USERS[SWIMMER] || {}).gender] || '';
  }

  // The list for the selected age group and the swimmer's gender, in a
  // course if one is given; null when there isn't one yet
  function topTenList(course) {
    return TOP_TEN_LISTS.filter(function (l) {
      return (!course || l.course === course) && l.ageGroup === Number(state.ageGroup) && l.gender === swimmerGender();
    })[0] || null;
  }

  // 1st, 2nd, 3rd, 4th…
  function ordinal(n) {
    var tail = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
    return n + tail;
  }

  // Where a time would have placed in a Top 10 list; 0 when outside it
  function topTenPlace(secs, times) {
    if (!isFinite(secs)) return 0;
    var place = times.filter(function (t) { return t < secs; }).length + 1;
    return place <= 10 ? place : 0;
  }

  // Top 10 by Decade's event, in the lists' course: Your Event's (its yards
  // equivalent for a meters event), until the card's own Stroke or Distance
  // changes it
  function followEvent() {
    var c = convertRace({ course: state.course, distance: state.distance, stroke: state.stroke, time: '60' }, (topTenList() || TOP_TEN_LISTS[0] || {}).course || 'SCY');
    state.tens = { stroke: state.stroke, distance: String(c.d || state.distance) };
  }

  // Each season's range for the card's event, 1st to 10th, as a bar of its
  // ten times, joined into a band across the decades. When that's Your
  // Event and you've set a goal (in Your Event's course), it goes across it
  // converted to the lists' course. Fastest is at the top (the reverse of
  // the predictor), so 1st place reads as the top of the list.
  function renderTopTens(goal) {
    var svg = root.querySelector('[data-st-top-tens]');
    if (!svg) return; // the card is retired for now (TopTens.njk isn't included)
    var W = 960; // wider than the predictor's 720: the card spans the row
    // The swimmer's own list, or else the first there is, with a note
    var matched = topTenList();
    var tensList = matched || TOP_TEN_LISTS[0] || { seasons: {} };
    var listCourse = tensList.course || 'SCY';
    var t = state.tens;
    fitDistance(t, eventsFor(listCourse, t.stroke));
    renderEventOptions(root.querySelector('[data-st-tens-options]'), eventsFor(listCourse, t.stroke), listCourse + ' ' + t.stroke);
    var sel = root.querySelector('[data-tens-input="distance"]');
    if (sel.value !== t.distance) sel.value = t.distance;
    set('tensDistance', t.distance);
    root.querySelectorAll('[data-tens]').forEach(function (group) {
      var value = t[group.getAttribute('data-tens')];
      group.querySelectorAll('[data-value]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-value') === value));
      });
    });

    var at = function (secs) {
      return convertRace({ course: state.course, distance: state.distance, stroke: state.stroke, time: race(secs) }, listCourse).secs;
    };
    var yours = convertRace({ course: state.course, distance: state.distance, stroke: state.stroke, time: '60' }, listCourse);
    var isYourEvent = t.stroke === state.stroke && Number(t.distance) === yours.d;
    var target = isYourEvent && isFinite(goal) ? at(goal) : NaN;

    var years = Object.keys(tensList.seasons).sort();
    var cols = years.map(function (y) {
      var list = ((tensList.seasons[y][t.stroke] || {})[t.distance] || []).map(parse);
      return { year: y, times: list, first: list[0], last: list[list.length - 1] };
    });
    var withList = cols.filter(function (c) { return c.times.length; });
    var group = (tensList.gender || '') + ' ' + (tensList.ageGroupLabel || '');
    set('topTensSubtitle', listCourse + ' ' + group + (isYourEvent ? ' · Your event' : '') +
      (years.length ? ' · ' + years[0] + ' to ' + years[years.length - 1] : ''));
    var notes = [];
    if (!matched) notes.push('There are no Top 10 lists for ' + (swimmerGender() ? swimmerGender() + ' ' : '') + ageGroup().label + ' yet; these are for ' + group + '.');
    if (isFinite(target) && state.course !== listCourse) notes.push('Your goal is converted to ' + listCourse + '.');
    set('topTensNote', notes.join(' '));
    root.querySelector('[data-st-top-tens-goal]').hidden = !isFinite(target);
    if (!withList.length) {
      svg.setAttribute('viewBox', '0 0 ' + W + ' 264');
      svg.innerHTML = '<text x="' + W / 2 + '" y="140" text-anchor="middle" class="swim-chart__empty">No Top 10 lists for the ' +
        t.distance + ' ' + t.stroke + ' in ' + listCourse + '</text>';
      svg.setAttribute('aria-label', 'No Top 10 lists to show');
      return;
    }

    var all = [];
    withList.forEach(function (c) { all.push(c.first, c.last); });
    if (isFinite(target)) all.push(target);
    var min = Math.min.apply(null, all), max = Math.max.apply(null, all);
    var pad = Math.max((max - min) * 0.12, 0.3); // room for the labels above and below each bar
    var lo = min - pad, hi = max + pad;
    function X(i) { return 120 + i * (W - 260) / Math.max(cols.length - 1, 1); }
    function Y(v) { return 30 + (v - lo) / (hi - lo) * 200; } // fastest at the top

    var out = [30, 100, 170].map(function (y) {
      return '<line x1="64" y1="' + y + '" x2="' + (W - 20) + '" y2="' + y + '" class="swim-chart__grid"/>';
    }).join('');
    out += '<line x1="64" y1="230" x2="' + (W - 20) + '" y2="230" class="swim-chart__base"/>' +
      '<text x="56" y="34" text-anchor="end" class="swim-chart__axis">' + race(lo) + '</text>' +
      '<text x="56" y="234" text-anchor="end" class="swim-chart__axis">' + race(hi) + '</text>';

    // The range over time: 1st place across the decades, back along 10th
    var top = [], bottom = [];
    cols.forEach(function (c, i) {
      if (!c.times.length) return;
      top.push(X(i).toFixed(1) + ' ' + Y(c.last).toFixed(1));
      bottom.unshift(X(i).toFixed(1) + ' ' + Y(c.first).toFixed(1));
    });
    out += '<path d="M' + top.concat(bottom).join(' L') + ' Z" class="swim-tens__band"/>' +
      '<path d="M' + bottom.slice().reverse().join(' L') + '" class="swim-tens__first-line"/>';

    // Your goal across every season, labelled at the right
    if (isFinite(target)) {
      var gy = Y(target).toFixed(1);
      out += '<line x1="64" y1="' + gy + '" x2="' + (W - 20) + '" y2="' + gy + '" class="swim-tens__line swim-tens__line--goal"/>' +
        '<text x="' + (W - 20) + '" y="' + (gy - 6).toFixed(1) + '" text-anchor="end" class="swim-tens__line-label swim-tens__line-label--goal">Goal ' + race(target) + '</text>';
    }

    cols.forEach(function (c, i) {
      var x = X(i);
      out += '<text x="' + x.toFixed(1) + '" y="254" text-anchor="middle" class="swim-chart__axis swim-tens__year">' + c.year + '</text>';
      if (!c.times.length) {
        out += '<text x="' + x.toFixed(1) + '" y="134" text-anchor="middle" class="swim-chart__axis">No list</text>';
        return;
      }
      var y0 = Y(c.first), y1 = Y(c.last);
      out += '<rect x="' + (x - 12).toFixed(1) + '" y="' + (y0 - 6).toFixed(1) + '" width="24" height="' + (y1 - y0 + 12).toFixed(1) + '" rx="12" class="swim-tens__bar"/>';
      c.times.forEach(function (t, k) {
        out += '<circle cx="' + x.toFixed(1) + '" cy="' + Y(t).toFixed(1) + '" r="' + (k ? 3 : 5) + '" class="swim-tens__dot' + (k ? '' : ' swim-tens__dot--first') + '"/>';
      });
      out += '<text x="' + x.toFixed(1) + '" y="' + (y0 - 12).toFixed(1) + '" text-anchor="middle" class="swim-chart__value swim-chart__value--known">' + race(c.first) + '</text>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y1 + 22).toFixed(1) + '" text-anchor="middle" class="swim-chart__value">' + race(c.last) + '</text>';
      // Where your goal would have placed that season
      if (isFinite(target)) {
        var place = topTenPlace(target, c.times);
        out += '<text x="' + x.toFixed(1) + '" y="273" text-anchor="middle" class="swim-tens__place">Goal ' + (place ? ordinal(place) : '—') + '</text>';
      }
    });
    // Room under the years for the goal's row of places
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + (264 + (isFinite(target) ? 16 : 0)));
    svg.innerHTML = out;
    svg.setAttribute('aria-label', 'Top 10, ' + listCourse + ' ' + group + ' ' + t.distance + ' ' + t.stroke + ': ' +
      withList.map(function (c) {
        return c.year + ', 1st ' + race(c.first) + ' to 10th ' + race(c.last);
      }).join('; '));
  }

  // Split the goal time (seconds, in the context course) over the context
  // distance
  function renderSplits(total, distance) {
    var bar = root.querySelector('[data-st-split-bar]'), rows = root.querySelector('[data-st-split-rows]');
    if (!isFinite(total)) {
      bar.innerHTML = '';
      rows.innerHTML = '<li class="swim-splits__empty">Enter a goal time to see splits.</li>';
      return;
    }
    var n = distance / Number(state.interval);
    var segs = splitTimes(total, n, state.strategy);
    var even = splitTimes(total, n, 'even');
    var cum = 0;

    bar.innerHTML = segs.map(function (s, i) {
      return '<span style="flex: ' + s.toFixed(2) + '; background: ' + rampColor(i, n) + '"></span>';
    }).join('');
    rows.innerHTML = segs.map(function (s, i) {
      cum += s;
      var d = s - even[i], delta = '';
      if (Math.abs(d) >= 0.005) {
        delta = '<span class="swim-splits__delta swim-splits__delta--' + (d < 0 ? 'faster' : 'slower') + '">' +
          (d > 0 ? '+' : '−') + Math.abs(d).toFixed(2) + '</span>';
      }
      return '<li class="swim-splits__row"><span class="swim-splits__at">' + (i + 1) * Number(state.interval) + '</span>' +
        '<span class="swim-splits__split">' + race(s) + ' ' + delta + '</span>' +
        '<span class="swim-splits__cum">' + race(cum) + '</span></li>';
    }).join('');
  }

  // ---------- Rank and Tier ----------

  // Ranking tiers, as v4's, fastest first: the Top 10 (10th place), then to
  // the 25th, 50th and 75th percentiles of the full ranking, then the rest
  var TOP_10 = 'Top 10';
  var BOTTOM = '76–100%';
  var TIERS = [TOP_10, '11th–25%', '26–50%', '51–75%', BOTTOM];
  var TIER_SHARE = { '11th–25%': 0.25, '26–50%': 0.5, '51–75%': 0.75 };
  var TIER_WHERE = { 'Top 10': '10th place', '11th–25%': 'Top 25%', '26–50%': 'Top 50%', '51–75%': 'Top 75%', '76–100%': '> top 75%' };

  // A tier's cut: the slowest time in it. In a field under 40, 10th place is
  // slower than the 25% line; the tiers above it are then all Top 10.
  function cutOf(rank, tier) {
    if (tier === TOP_10) return topTen(rank);
    if (tier === BOTTOM) return Infinity;
    return Math.max(atShare(rank, TIER_SHARE[tier]), topTen(rank));
  }
  function tierOf(secs, rank) {
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

  // Rank and Tier, as v4's: Your Event's time (t: your goal, best, projected
  // time or the median; kind names it) on its age group's ladder. Members
  // only: others see it blurred under a join prompt. While rankings load,
  // grey rungs hold its place.
  function renderTier(t, kind) {
    var rank = groupRank(state.course, state.stroke, Number(state.distance), ageGroup());
    var user = USERS[SWIMMER] || {}, member = !!(user.loggedIn && user.membershipTier);
    var gender = swimmerGender();
    set('rankTierSub', state.course + ' ' + state.distance + ' ' + lowerStroke(state.stroke) + (gender ? ' · ' + gender.toLowerCase() + ' ' + ageGroup().label : '') +
      (rank ? ' · ' + (rank.seasonLabel ? rank.seasonLabel + ' season, ' : '') + rank.n.toLocaleString() + ' ranked' +
        (rank.converted ? ' · converted from SCY' : '') + (rank.synthetic ? ' · synthetic data' : '') : ''));
    var rungs = root.querySelector('[data-rank-rungs]'), next = root.querySelector('[data-rank-next]');
    var body = root.querySelector('[data-rank-body]'), lock = root.querySelector('[data-rank-lock]');
    if (!rank || !isFinite(t)) {
      var loading = !rank && pending();
      rungs.innerHTML = loading ? new Array(7).join('<span class="swim-skel swim-skel__rung" aria-hidden="true"></span>') : '';
      next.textContent = loading ? 'Loading USMS rankings…' : !rank ? noRankText() : 'Race the ' + state.distance + ' ' + lowerStroke(state.stroke) + ' or set a goal to see your tier.';
      lock.hidden = true;
      body.classList.remove('is-locked');
      return;
    }
    var here = tierOf(t, rank);
    // The fastest swim first, for reference (not a tier), then Top 10 down
    rungs.innerHTML = '<div class="swim-rung swim-rung--fastest"><b>Fastest</b><span>1st place</span><span>' + race(rank.times[0]) + '</span></div>' +
      TIERS.map(function (tier) {
        var c = cutOf(rank, tier);
        // A tier that's all Top 10 in a small field has no cut of its own
        var shared = tier !== TOP_10 && tier !== BOTTOM && c === topTen(rank);
        return '<div class="swim-rung' + (tier === here ? ' is-here' : '') + '"><b>' + tier + '</b><span>' + TIER_WHERE[tier] + '</span><span>' +
          (tier === BOTTOM ? '> ' + race(cutOf(rank, '51–75%')) : shared ? 'all Top 10' : !isFinite(c) ? '—' : race(c)) + '</span></div>';
      }).join('');
    var k = TIERS.indexOf(here), up = null;
    for (var i = k - 1; i >= 0 && !up; i--) if (cutOf(rank, TIERS[i]) < t) up = TIERS[i];
    var place = placeOf(t, rank);
    var placed = (/median/.test(kind) ? 'The ' : 'Your ') + kind + ' of ' + race(t) + (place ? ' would place ' + ordinal(place) + ' of ' + rank.n.toLocaleString() : ' is outside the ' + rank.times.length + ' listed') + '.';
    next.innerHTML = up ? '<b>Next rung: ' + up + ' at ' + race(cutOf(rank, up)) + '.</b> ' + placed + ' ' + (t - cutOf(rank, up)).toFixed(2) + ' s to go.' :
      '<b>You\'re in the Top 10.</b> ' + placed;
    lock.hidden = member;
    body.classList.toggle('is-locked', !member);
    set('lockTitle', up ? 'You\'re one rung from ' + up + '.' : 'You\'re in the Top 10 range.');
  }

  // Practice this, as v4's Race Splits: the race pace in pieces from a
  // push, at the chosen strategy. Pieces follow v4's split lengths (25s for
  // the 50, 50s to the 200, then 100s, 150s for the mile), not the split
  // interval above. A 50: its first 25 from a push, PUSH slower than off the
  // dive; longer races: their middle splits.
  var PUSH = 0.7; // seconds a push start runs slower than a dive
  function renderPractice(total, distance) {
    if (!isFinite(total)) {
      set('practiceSet', 'Set a goal to plan your practice');
      set('practiceNote', '');
      return;
    }
    var leg = distance <= 50 ? 25 : distance <= 200 ? 50 : distance === 1650 ? 150 : 100;
    var n = distance / leg, segs = splitTimes(total, n, state.strategy);
    if (leg === 25) { // the 50 (a 100 is also two splits, but of 50)
      set('practiceSet', '8 × 25 from a push at ' + race(segs[0] + PUSH));
      set('practiceNote', 'Rest 45 s. Push starts run about ' + PUSH + ' s slower than a dive.');
    } else {
      var mid = segs.slice(1).reduce(function (a, b) { return a + b; }, 0) / (n - 1);
      set('practiceSet', Math.min(10, Math.max(4, n)) + ' × ' + leg + ' from a push at ' + race(mid));
      set('practiceNote', 'Rest ' + (leg <= 50 ? 20 : leg <= 100 ? 30 : 40) + ' s. That\'s your race pace after the dive.');
    }
  }

  // Keep the split interval one that divides the distance: the largest valid
  // one no longer than the current, else the smallest valid
  var INTERVALS = [25, 50, 100];

  function fitInterval(distance) {
    var valid = INTERVALS.filter(function (i) { return distance % i === 0; });
    if (valid.indexOf(Number(state.interval)) >= 0) return;
    var shorter = valid.filter(function (i) { return i <= Number(state.interval); });
    state.interval = String(shorter.length ? shorter[shorter.length - 1] : valid[0]);
  }

  // Your age group with younger groups (what you might have swum then) and
  // older ones (what to expect), ten years apart. Near either end of the age
  // range the spare rows go to the other side.
  function renderAges(age, base) {
    var list = root.querySelector('[data-st-age-rows]');
    if (!age) {
      list.innerHTML = '<li class="swim-ages__empty">Enter an age of 18 or older.</li>';
      return;
    }
    // No time yet: the same rows, each "- -", with empty bars
    var mine = 0, younger = [], older = [], i;
    AGE_GROUPS.forEach(function (g, k) { if (age >= g.min) mine = k; });
    for (i = mine - 2; i >= 0; i -= 2) younger.push(i);
    if (mine === 1) younger.push(0); // 25-29's only younger group is 18-24
    for (i = mine + 2; i < AGE_GROUPS.length; i += 2) older.push(i);
    var others = AGE_ROWS - 1;
    var nYounger = Math.min(younger.length, Math.max(others / 2, others - older.length));
    var picks = younger.slice(0, nYounger).reverse()
      .concat([mine], older.slice(0, others - nYounger));

    var rows = picks.map(function (k) {
      var g = AGE_GROUPS[k];
      return { label: g.label, time: base / AGE_GROUPS[mine].factor * g.factor, current: k === mine };
    });
    var times = rows.map(function (r) { return r.time; });
    var lo = Math.min.apply(null, times) * 0.85, hi = Math.max.apply(null, times) * 1.03;

    list.innerHTML = rows.map(function (r) {
      var w = isFinite(r.time) ? Math.round((r.time - lo) / (hi - lo) * 100) : 0;
      return '<li class="swim-ages__row' + (r.current ? ' is-current' : '') + '">' +
        '<span class="swim-ages__group">' + r.label + (r.current ? '<span class="visually-hidden"> (your age group)</span>' : '') + '</span>' +
        '<span class="swim-ages__track" aria-hidden="true"><span style="width: ' + w + '%"></span></span>' +
        '<span class="swim-ages__time">' + (isFinite(r.time) ? race(r.time) : EMPTY) + '</span></li>';
    }).join('');
  }

  // ---------- Your races ----------

  var RACES_SHOWN = 6;
  // Whose races these are: the active persona, as current-user.js resolves
  // it (?user=, then sessionStorage.activeUser, then the page's swimmerId).
  // Each persona's races come from src/_data/raceHistory.json, embedded as
  // #race-history-data; their birth date from users.json (#site-users-data).
  var HISTORY = { swimmers: {} };
  try {
    HISTORY = JSON.parse(document.getElementById('race-history-data').textContent);
  } catch (e) {}
  var USERS = {};
  try {
    USERS = JSON.parse(document.getElementById('site-users-data').textContent).users;
  } catch (e) {}

  function swimmerId() {
    var id = null;
    try {
      id = new URLSearchParams(location.search).get('user') || sessionStorage.getItem('activeUser');
    } catch (e) {}
    return id && USERS[id] ? id : HISTORY.default;
  }
  var SWIMMER = swimmerId();
  var RACES_KEY = 'swimTools.races.' + SWIMMER;

  // Age on a date (YYYY-MM-DD) from the persona's birth date (MM/DD/YYYY),
  // or null without one
  // Logged out, the page doesn't know who you are, so no age either
  function ageOn(date) {
    if (!(USERS[SWIMMER] || {}).loggedIn) return null;
    var b = ((USERS[SWIMMER] || {}).birthDate || '').split('/');
    if (b.length !== 3) return null;
    var d = date.split('-').map(Number);
    return d[0] - b[2] - (d[1] * 100 + d[2] < b[0] * 100 + Number(b[1]) ? 1 : 0);
  }

  // The viewer's saved races for this persona if they've added or removed
  // any, otherwise the persona's seed list (none for a persona who hasn't
  // raced). Storage can be missing or blocked, so every read and write is
  // guarded.
  function loadRaces() {
    var races = null;
    try {
      races = JSON.parse(localStorage.getItem(RACES_KEY));
    } catch (e) {}
    if (!Array.isArray(races)) races = ((HISTORY.swimmers || {})[SWIMMER] || {}).races || [];
    return races.map(function (r, i) {
      return {
        id: i + 1, course: r.course, distance: String(r.distance), stroke: r.stroke,
        time: String(r.time), date: r.date || '',
        age: r.age != null ? r.age : r.date ? ageOn(r.date) : null
      };
    });
  }

  function saveRaces() {
    try {
      localStorage.setItem(RACES_KEY, JSON.stringify(state.races.map(function (r) {
        return { course: r.course, distance: r.distance, stroke: r.stroke, time: r.time, date: r.date, age: r.age };
      })));
    } catch (e) {}
  }

  // Start from the persona: their age today (Age Group Conversion) and its age
  // group, and Your Event as the event they've raced most (latest wins a tie)
  function startFromSwimmer() {
    var age = ageOn(today());
    if (age >= 18) {
      state.age = String(age);
      state.ageKnown = true;
      AGE_GROUPS.forEach(function (g) { if (age >= g.min) state.ageGroup = String(g.min); });
    }
    // The age group select, at the top of the page, only when we don't know
    // your age: logged out, or no birth date on the profile
    root.querySelector('[data-st-age-group-field]').hidden = age >= 18;
    // A greeting as on v4, and in the select's place, your sex and age group
    var user = USERS[SWIMMER] || {};
    if (user.loggedIn && user.firstName) set('greeting', 'Welcome back, ' + user.firstName + '. Here\'s where your swimming stands.');
    root.querySelector('[data-st-who]').hidden = !(age >= 18);
    if (age >= 18) set('who', [swimmerGender(), ageGroup().label].filter(Boolean).join(' · '));
    var counts = {}, best = null;
    state.races.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (r) {
      var key = r.course + ' ' + r.distance + ' ' + r.stroke;
      counts[key] = (counts[key] || 0) + 1;
      if (!best || counts[key] >= counts[best]) best = key;
    });
    if (best) {
      best = best.split(' ');
      state.course = best[0]; state.distance = best[1]; state.stroke = best[2];
    }
    // A guest (logged out): the 50 free SCY in Race Planning, with its
    // age-group median as the time (goalAuto) until they type their own,
    // following the age group and the event until then; and the 50 free SCY
    // in Time Conversions, empty until they enter a time or pace
    if (!user.loggedIn) {
      state.course = 'SCY'; state.distance = '50'; state.stroke = 'Free';
      state.goalAuto = true;
      state.conv.course = 'SCY'; state.conv.distance = '50'; state.conv.stroke = 'Free';
    }
  }

  // "2026-09-19" as "Sep 19, 2026"
  function formatDate(iso) {
    var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!p) return '';
    return new Date(Date.UTC(+p[1], +p[2] - 1, +p[3])).toLocaleDateString('en-US',
      { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  }

  // Today as YYYY-MM-DD, in the viewer's time zone
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  // Your Races, as v4's: every race, newest first (undated ones last,
  // newest added first), each against your best at that event (course,
  // distance and stroke); the newest RACES_SHOWN unless expanded, when the
  // list scrolls inside the card
  function renderRaces() {
    var list = root.querySelector('[data-st-races]');
    var toggle = root.querySelector('[data-races-toggle]');
    var races = state.races.map(function (r) {
      return { id: r.id, course: r.course, d: r.distance, stroke: r.stroke, secs: parse(r.time), date: r.date };
    }).filter(function (r) { return isFinite(r.secs); })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || b.id - a.id; });
    var key = function (r) { return r.course + ' ' + r.d + ' ' + r.stroke; };
    var bests = {};
    races.forEach(function (r) { if (!(bests[key(r)] <= r.secs)) bests[key(r)] = r.secs; });
    var dated = races.filter(function (r) { return r.date; });
    var first = dated.length ? dated[dated.length - 1].date.slice(0, 4) : '';
    set('racesSub', races.length ? races.length + (races.length === 1 ? ' race' : ' races') + (first ? ' since ' + first : '') +
      ' · new meet results appear automatically' : 'No races yet · meet results appear here automatically');
    var shown = state.racesExpanded ? races : races.slice(0, RACES_SHOWN);
    list.classList.toggle('is-all', state.racesExpanded);
    list.innerHTML = shown.length ? shown.map(function (r) {
      var best = bests[key(r)], pb = r.secs === best;
      return '<li class="swim-races__row"><span class="swim-races__course">' + r.course + '</span>' +
        '<span>' + r.d + ' ' + r.stroke + ' <span class="swim-races__date">' + formatDate(r.date) + '</span></span>' +
        '<span class="swim-badge' + (pb ? ' swim-badge--best' : '') + '">' + (pb ? 'Best' : '+' + (r.secs - best).toFixed(2) + ' vs best') + '</span>' +
        '<span class="swim-races__time">' + race(r.secs) + '</span></li>';
    }).join('') : '<li class="swim-races__empty">Add a race with the predictor\'s + to build your predictions.</li>';
    toggle.hidden = races.length <= RACES_SHOWN;
    toggle.setAttribute('aria-expanded', String(state.racesExpanded));
    toggle.textContent = state.racesExpanded ? 'Show fewer' : 'Show all ' + races.length;
  }


  // The Add a Race form
  function renderNewRace() {
    var t = state.newRace, list = eventsFor(t.course, t.stroke);
    var modal = document.getElementById('swimDeckRace');
    fitDistance(t, list);
    renderEventOptions(modal.querySelector('[data-st-race-options]'), list, t.course + ' ' + t.stroke);
    modal.querySelectorAll('[data-race]').forEach(function (group) {
      var value = t[group.getAttribute('data-race')];
      group.querySelectorAll('[data-value]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-value') === value));
      });
    });
    var sel = modal.querySelector('[data-race-input="distance"]');
    if (sel.value !== t.distance) sel.value = t.distance;
    set('raceDistance', t.distance);
  }

  function addRace() {
    var t = state.newRace, modal = document.getElementById('swimDeckRace');
    var field = modal.querySelector('[data-time-field]');
    if (!validEntry(t.time)) {
      markTimeField(field, false);
      set('raceHint', t.time === '' ? 'Enter your time.' : 'Seconds must be under 60.');
      field.querySelector('[data-time-part]').focus();
      return;
    }
    var date = modal.querySelector('[data-race-input="date"]');
    if (!t.date || t.date > today()) {
      date.setAttribute('aria-invalid', 'true');
      set('raceHint', t.date ? 'The race date can’t be in the future.' : 'Enter the race date.');
      date.focus();
      return;
    }
    var id = state.races.reduce(function (max, r) { return Math.max(max, r.id); }, 0) + 1;
    state.races.push({ id: id, course: t.course, distance: t.distance, stroke: t.stroke, time: t.time, date: t.date, age: ageOn(t.date) });
    saveRaces();
    close(modal);
    render();
  }

  // Each time the form opens it starts from Your Event, with no time
  function resetNewRace() {
    state.newRace = { course: state.course, distance: state.distance, stroke: state.stroke, time: '', date: today() };
    var field = document.querySelector('#swimDeckRace [data-time-field]');
    fillTimeField(field, '');
    markTimeField(field, true);
    var date = document.getElementById('sd-race-date');
    date.value = state.newRace.date;
    date.max = today();
    date.removeAttribute('aria-invalid');
    set('raceHint', '');
  }

  // ---------- Time Conversions ----------

  // Convert a Time's entry, converted to each course (Course Conversion) and
  // to other age groups at your age (Age Group Conversion)
  // A result with no time to work from yet
  var EMPTY = '- -';

  function renderConversions(age) {
    var c = state.conv, list = eventsFor(c.course, c.stroke);
    fitDistance(c, list);
    renderEventOptions(root.querySelector('[data-st-conv-options]'), list, c.course + ' ' + c.stroke);
    root.querySelectorAll('[data-conv]').forEach(function (group) {
      var value = c[group.getAttribute('data-conv')];
      group.querySelectorAll('[data-value]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-value') === value));
      });
    });
    var sel = root.querySelector('[data-conv-input="distance"]');
    if (sel.value !== c.distance) sel.value = c.distance;
    set('convDistance', c.distance);

    var d = Number(c.distance);
    // The time or pace that wasn't changed last, from the one that was
    var byPace = c.source === 'pace';
    var typedValue = byPace ? c.pace : c.time;
    var typed = typedValue !== '', ok = !typed || validEntry(typedValue);
    var secs, pace;
    if (byPace) {
      pace = typed && ok ? parse(c.pace) : NaN;
      secs = pace * d / 100;
      c.time = isFinite(secs) ? race(secs) : '';
    } else {
      secs = typed && ok ? parse(c.time) : NaN;
      pace = secs / d * 100;
      // The pace field has no hundredths: to the nearest second
      c.pace = isFinite(pace) ? race(Math.round(pace)) : '';
    }
    markTimeField(root.querySelector('[data-time-conv="time"]'), byPace || ok);
    markTimeField(root.querySelector('[data-time-conv="pace"]'), !byPace || ok);
    set('convHint', !ok ? (byPace ? 'Pace' : 'Time') + ': seconds must be under 60.'
      : typed ? '' : 'Enter a time or a pace to convert it to every course and age group.');

    // Course Conversion: a time as the matching event's time in each course;
    // a pace as the pace per 100 in each course
    var name = c.distance + ' ' + c.stroke;
    set('courseConvSubtitle', byPace ? 'Pace per 100 in ' + c.course + (isFinite(pace) ? ' @ ' + clock(pace) : '')
      : name + ' in ' + c.course + (isFinite(secs) ? ' @ ' + race(secs) : ''));
    Object.keys(COURSES).forEach(function (k) {
      if (byPace) {
        set('courseConv' + k, isFinite(pace) ? clock(pace / COURSES[c.course].factor * COURSES[k].factor) : EMPTY);
        set('courseConvEvent' + k, '/100 ' + COURSES[k].unit);
        return;
      }
      var to = convertRace(c, k);
      set('courseConv' + k, isFinite(secs) && to.d ? race(to.secs) : EMPTY);
      set('courseConvEvent' + k, !to.d ? 'No ' + name + ' in ' + k
        : to.d !== Number(c.distance) ? to.d + ' ' + c.stroke : '');
    });

    set('ageSubtitle', c.course + ' ' + name + (isFinite(secs) ? ' · ' + race(secs) : '') + (age ? ' at ' + age : ''));
    renderAges(age, secs);
    renderRank(age, secs);
  }

  // ---------- Rank in Age Group ----------

  // Sample model, not USMS data: an age group's times spread log-normally
  // around its average (averageTime), RANK_SPREAD wide, and its field shrinks
  // with distance and away from the busiest age groups.
  var RANK_SPREAD = 0.12;   // standard deviation of log time
  var RANK_FIELD = 300;     // swimmers in the shortest event, busiest group
  var RANK_FALLOFF = 0.72;  // each longer event in the list keeps this share
  var RANK_AGE_SHARE = [0.55, 0.7, 0.8, 0.9, 1, 1, 1, 0.95, 0.85, 0.7, 0.5, 0.35, 0.2, 0.1, 0.05, 0.02, 0.01];
  var TOP_10_Z = -1.2816;   // z of the 10th percentile

  // Share of a normal distribution below z
  function normalCdf(z) {
    var t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
    var erf = 1 - t * Math.exp(-z * z / 2) *
      (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
    return z < 0 ? (1 - erf) / 2 : (1 + erf) / 2;
  }

  // The Convert a Time entry's place among your age group's swimmers in
  // that event
  function renderRank(age, secs) {
    var c = state.conv, d = Number(c.distance);
    var k = 0;
    AGE_GROUPS.forEach(function (g, i) { if (age >= g.min) k = i; });
    var group = AGE_GROUPS[k];
    var avg = averageTime(c.course, c.stroke, d, group);
    // No time yet: place and share show "- -"; the average and Top 10% don't need one
    var empty = !age ? 'Enter an age of 18 or older.'
      : !isFinite(avg) ? 'No age group data for this event.' : '';
    set('rankSubtitle', c.course + ' ' + c.distance + ' ' + c.stroke + (age ? ' · ' + group.label : ''));
    set('rankEmpty', empty);
    root.querySelector('[data-st="rankEmpty"]').hidden = !empty;
    root.querySelector('[data-st-rank]').hidden = !!empty;
    if (empty) return;

    var list = eventsFor(c.course, c.stroke);
    var field = Math.max(3, Math.round(RANK_FIELD * Math.pow(RANK_FALLOFF, Math.max(0, list.indexOf(d))) * RANK_AGE_SHARE[k]));
    var faster = normalCdf(Math.log(secs / avg) / RANK_SPREAD); // share of the field faster than you
    var timed = isFinite(secs);
    set('rankPlace', timed ? '#' + (1 + Math.round(faster * (field - 1))) : EMPTY);
    set('rankOf', ' of ' + field);
    set('rankBeats', timed ? String(Math.min(99, Math.round((1 - faster) * 100))) : EMPTY);
    set('rankAvg', race(avg));
    set('rankTop10', race(avg * Math.exp(TOP_10_Z * RANK_SPREAD)));
    root.querySelector('[data-st-rank-pct]').hidden = !timed;
    var marker = root.querySelector('[data-st-rank-marker]');
    marker.hidden = !timed;
    if (timed) marker.style.left = ((1 - faster) * 100).toFixed(1) + '%';
  }

  // Distance options for a select, rebuilt only when its course or stroke
  // changes
  function renderEventOptions(sel, list, key) {
    if (sel.getAttribute('data-key') === key) return;
    sel.setAttribute('data-key', key);
    sel.innerHTML = list.map(function (d) {
      return '<option value="' + d + '">' + d + '</option>';
    }).join('');
  }

  // ---------- Training Metrics ----------

  // ---------- Add to Log ----------

  var LOG_KEY = 'swimTools.log';
  var metricsNow = null; // the Your Swim workout at the last render

  // Fill the modal from the workout as it stands, dated today
  function prepareLog() {
    var w = metricsNow, ok = w && isFinite(w.secs) && isFinite(w.distance);
    set('logDistance', w && isFinite(w.distance) ? w.distance + (w.unit === 'yd' ? ' yards' : ' meters') : '—');
    set('logCourse', w ? w.course : '—');
    set('logTime', ok ? race(w.secs) : '—');
    set('logPace', ok ? clock(w.pace) + ' /100 ' + w.unit : '—');
    set('logStroke', w && w.stroke ? w.stroke : '');
    document.querySelector('[data-st-log-stroke]').hidden = !(w && w.stroke);
    set('logCalories', ok && isFinite(w.calories) ? w.calories + ' cal' : '—');
    set('logEffort', w && w.effort ? w.effort + ' / 10' : '');
    document.querySelector('[data-st-log-effort]').hidden = !(w && w.effort);
    var date = document.getElementById('sd-log-date');
    date.value = today();
    date.max = today();
    date.removeAttribute('aria-invalid');
    document.querySelector('[data-save-log]').disabled = !ok;
    set('logHint', ok ? '' : 'Enter a distance and a time or pace first.');
  }

  function saveLog() {
    var w = metricsNow, date = document.getElementById('sd-log-date');
    if (!date.value || date.value > today()) {
      date.setAttribute('aria-invalid', 'true');
      set('logHint', date.value ? 'The date can’t be in the future.' : 'Enter the date of the workout.');
      date.focus();
      return;
    }
    var entry = {
      date: date.value, course: w.course, distance: w.distance, time: race(w.secs),
      pace: clock(w.pace), stroke: w.stroke, calories: w.calories, effort: w.effort ? Number(w.effort) : null
    };
    try {
      var log = JSON.parse(localStorage.getItem(LOG_KEY)) || [];
      log.push(entry);
      localStorage.setItem(LOG_KEY, JSON.stringify(log));
    } catch (e) {}
    close(document.getElementById('swimDeckLog'));
    set('logStatus', 'Added to your log: ' + entry.distance + ' ' + w.unit + (w.stroke ? ' ' + w.stroke : '') +
      ' in ' + entry.time + ', ' + formatDate(entry.date) + '.');
  }

  // The tiles, all from the one swim (Your Swim): calories (which use the
  // stroke too), pace, and that pace in each course
  // ---------- Training Effect ----------

  // Training Effect: what a swim does for your fitness, 0.0 to 5.0, from
  // the training-stress model swim coaches use (swim TSS), then judged
  // against your own recent training. Sample math, not a published formula.
  //   intensity  your threshold pace / the swim's pace, both freestyle terms
  //              (STROKE_PACE turns another stroke's pace into free's)
  //   load       intensity cubed × hours × 100 × the stroke's cost
  //              (STROKE_LOAD): an hour at threshold pace is 100
  //   effect     5 × (1 − e^(−0.7 × load / typical)): typical is your
  //              average logged swim over the last 6 weeks (Add to Log),
  //              or TE_BASE without any, about an hour of moderate swimming;
  //              a typical swim is about 2.5, Steady. From 4.5 it's
  //              Peak effort, with a caution about overdoing it.
  var STROKE_PACE = { '': 1, Free: 1, Back: 1.1, Breast: 1.22, Fly: 1.12, IM: 1.12 };
  var STROKE_LOAD = { '': 1, Free: 1, Back: 0.95, Breast: 1.05, Fly: 1.15, IM: 1.05 };
  var TE_BASE = 55;
  var TE_DAYS = 42;
  var TE_RATE = 0.7;
  var TE_PEAK = 4.5;
  // Effort words, like the Effort slider's RPE scale (Easy ... Max)
  var TE_WORDS = [[0, 'Easy'], [1, 'Light'], [2, 'Steady'], [3, 'Solid'], [4, 'Hard push'], [TE_PEAK, 'Peak effort']];

  // Your threshold pace per 100 in a course: freestyle at the pace you could
  // hold for about 30 minutes, the 1650 yd / 1500 m. From your nearest real
  // free race in your age group (in this course, or another converted),
  // scaled to that distance by Riegel's 1.06; else the nearest age-adjusted
  // older swim; else a projection; else the age group's median.
  function thresholdPace(course) {
    var list = eventsFor(course, 'Free'), d = list[list.length - 1];
    var rows = predictions(list, course, 'Free');
    var nearest = function (ok) {
      var have = rows.filter(ok);
      return have.length ? have.reduce(function (b, r) {
        return Math.abs(Math.log(r.d / d)) < Math.abs(Math.log(b.d / d)) ? r : b;
      }) : null;
    };
    var real = nearest(function (r) { return isFinite(r.you) || (r.converted && isFinite(r.proj)); }) ||
      nearest(function (r) { return r.adjusted && isFinite(r.proj); });
    if (real) {
      var from = isFinite(real.you) ? 'your ' + real.d + ' free' : real.converted ? real.projFrom + ' free' : 'your age-adjusted ' + real.d + ' free';
      return { pace: real.est * Math.pow(d / real.d, 1.06) / d * 100, from: from };
    }
    var at = rows.filter(function (r) { return r.d === d; })[0];
    if (at && isFinite(at.proj)) return { pace: at.proj / d * 100, from: 'your projected ' + d + ' free' };
    if (at && isFinite(at.mid)) return { pace: at.mid / d * 100, from: 'the ' + ageGroup().label + ' median ' + d + ' free' };
    return { pace: NaN, from: '' };
  }

  // A swim's intensity and load against a threshold pace
  function swimLoad(d, secs, stroke, threshold) {
    var intensity = threshold / (secs / d * 100 / (STROKE_PACE[stroke || ''] || 1));
    return { intensity: intensity, load: Math.pow(intensity, 3) * secs / 3600 * 100 * (STROKE_LOAD[stroke || ''] || 1) };
  }

  // Your typical logged swim's load over the last TE_DAYS days
  function typicalLoad() {
    var log = [];
    try { log = JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch (e) {}
    var now = new Date(), from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - TE_DAYS);
    var since = from.getFullYear() + '-' + ('0' + (from.getMonth() + 1)).slice(-2) + '-' + ('0' + from.getDate()).slice(-2);
    var thresholds = {};
    var loads = log.filter(function (e) { return e.date >= since && e.date <= today(); }).map(function (e) {
      if (!thresholds[e.course]) thresholds[e.course] = thresholdPace(e.course).pace;
      return swimLoad(Number(e.distance), parse(e.time), e.stroke, thresholds[e.course]).load;
    }).filter(isFinite);
    return loads.length ? { load: loads.reduce(function (a, b) { return a + b; }, 0) / loads.length, swims: loads.length } : { load: TE_BASE, swims: 0 };
  }

  function renderTraining(t, d, secs) {
    var threshold = thresholdPace(t.course);
    var swim = isFinite(secs) && d > 0 && isFinite(threshold.pace) ? swimLoad(d, secs, t.stroke, threshold.pace) : null;
    var warn = document.querySelector('[data-te-warn]');
    warn.hidden = true;
    if (!swim) {
      set('teValue', '—');
      set('teWord', '');
      set('teSub', !isFinite(secs) ? 'Enter a swim to see what it does for your fitness.' : pending() ? 'Loading USMS rankings…' : noRankText());
      return;
    }
    var typical = typicalLoad();
    var effect = Math.min(5, 5 * (1 - Math.exp(-TE_RATE * swim.load / typical.load)));
    var shown = effect >= 4.95 ? 5 : Math.floor(effect * 10) / 10;
    var word = TE_WORDS.filter(function (w) { return shown >= w[0]; }).pop()[1];
    set('teValue', shown.toFixed(1));
    set('teWord', word);
    // Peak effort: about 3 times your typical load or more
    if (shown >= TE_PEAK) {
      warn.hidden = false;
      set('teWarn', 'About ' + Math.round(swim.load / typical.load) + ' times your typical load: you may be overdoing it. ' +
        'Take an easy day or two after, and build toward swims like this gradually.');
    }
    set('teSub', 'Load ' + Math.round(swim.load) + ' against your typical ' + Math.round(typical.load) +
      (typical.swims ? ' (' + typical.swims + (typical.swims === 1 ? ' logged swim' : ' logged swims') + ', last 6 weeks)' : ' (no logged swims yet: about an hour of moderate swimming)') +
      ' · ' + Math.round(swim.intensity * 100) + '% of threshold pace, ' + clock(threshold.pace) + ' per 100 from ' + threshold.from);
  }

  // Calorie Burn's adjustment for an Effort rating: none at 5-6 (moderate,
  // what pace alone assumes), about 4% a step either side, so 1 burns about
  // 18% less and 10 about 18% more. Sample math, not a published formula.
  var FELT_STEP = 0.04;

  // Strokes spelled out, for Calorie Burn's note
  var STROKE_FULL = { Free: 'Freestyle', Back: 'Backstroke', Breast: 'Breaststroke', Fly: 'Butterfly', IM: 'Individual medley' };
  function effortFactor(effort) {
    return effort ? 1 + (Number(effort) - 5.5) * FELT_STEP : 1;
  }

  // Each rating's shade, light blue (very easy) to red (max)
  var FELT_SHADES = { 1: '#d6e9f6', 2: '#d6e9f6', 3: '#8cc0e3', 4: '#8cc0e3', 5: '#0068ad', 6: '#0068ad',
    7: '#ff7f00', 8: '#ff7f00', 9: '#cc2030', 10: '#cc2030' };

  // Effort ratings' words, as on the RPE scale athletes use
  var FELT_WORDS = { 1: 'Very easy', 2: 'Very easy', 3: 'Easy', 4: 'Easy', 5: 'Moderate', 6: 'Moderate',
    7: 'Hard', 8: 'Hard', 9: 'Very hard', 10: 'Max' };

  // Your own rating: the slider and its word, and beside Training Effect
  function renderFelt(t) {
    document.querySelector('[data-effort-felt]').hidden = t.effort === '';
    set('effortFelt', t.effort);
    set('effortWord', t.effort ? '· ' + FELT_WORDS[t.effort] : '(optional)');
    renderSlider(t.effort);
  }

  // ---------- Effort slider ----------

  // A range input, 1 to 10. Not rated (''): faded with no thumb, and
  // clicking or dragging on it rates. × clears; the mouse wheel steps it
  // while it's focused (one step a notch, trackpads one per 30px).
  var effortSlider = root.querySelector('[data-effort-slider]');
  var effortRange = effortSlider.querySelector('[data-effort-range]');
  var effortClear = effortSlider.querySelector('[data-effort-clear]');

  function renderSlider(value) {
    effortSlider.classList.toggle('is-unrated', !value);
    effortClear.hidden = !value;
    if (value && effortRange.value !== value) effortRange.value = value;
    // The thumb's ring takes the rating's shade
    effortSlider.style.setProperty('--felt-now', value ? FELT_SHADES[value] : 'transparent');
    effortRange.setAttribute('aria-valuetext', value ? value + ', ' + FELT_WORDS[value] : 'Not rated');
  }

  function setEffort(value) {
    if (state.metrics.effort === value) return;
    state.metrics.effort = value;
    render();
  }

  effortRange.addEventListener('input', function () { setEffort(effortRange.value); });
  // A click on the unrated track where the thumb already sits fires no input
  effortRange.addEventListener('pointerup', function () { setEffort(effortRange.value); });
  effortClear.addEventListener('click', function () {
    setEffort('');
    effortRange.focus();
  });

  var effortSpin = 0;
  effortRange.addEventListener('wheel', function (e) {
    if (effortRange !== document.activeElement) return;
    e.preventDefault();
    effortSpin += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : -e.deltaY;
    if (Math.abs(effortSpin) < 30) return;
    var now = Number(state.metrics.effort) || (effortSpin > 0 ? 0 : 11);
    setEffort(String(Math.min(10, Math.max(1, now + (effortSpin > 0 ? 1 : -1)))));
    effortSpin = 0;
  }, { passive: false });

  function renderMetrics() {
    var t = state.metrics, course = COURSES[t.course], unit = course.unit, d = Number(t.distance);
    if (!(d > 0)) d = NaN;
    // Time only: its Pace field is gone (pace shows as Training Pace)
    t.source = 'time';
    var byPace = false;
    var secs, pace;
    if (byPace) {
      pace = validEntry(t.pace) ? parse(t.pace) : NaN;
      secs = pace * d / 100;
      t.time = isFinite(secs) ? race(secs) : '';
    } else {
      secs = validEntry(t.time) ? parse(t.time) : NaN;
      pace = secs / d * 100;
      // The pace field has no hundredths: to the nearest second
      t.pace = isFinite(pace) ? race(Math.round(pace)) : '';
    }
    var unitWord = unit === 'yd' ? ' yards' : ' meters';

    set('paceValue', clock(pace));
    set('paceUnit', '/100 ' + unit);

    // Calories: pace in yards terms sets the intensity, capped to a sane range,
    // then your Effort rating adjusts it for how hard you were working
    var intensity = Math.min(1.4, Math.max(0.7, REF_PACE / (pace / course.factor)));
    var perMin = CAL_PER_MIN * STROKE_BURN[t.stroke] * intensity * effortFactor(t.effort);
    var calories = Math.round(perMin * secs / 60);
    set('calValue', isFinite(calories) ? String(calories) : '—');
    set('calNote', [STROKE_FULL[t.stroke], t.effort && '@ ' + t.effort + '/10 intensity'].filter(Boolean).join(' '));

    renderTraining(t, d, secs);
    renderFelt(t);

    // The workout as it stands, for Add to Log
    metricsNow = { course: t.course, unit: unit, distance: d, secs: secs, pace: pace, stroke: t.stroke, calories: calories, effort: t.effort };

    // Pace conversion: that pace per 100 in the two other courses (its tile,
    // PaceConversion.njk, is retired for now; this fills it if it's back)
    Object.keys(COURSES).filter(function (k) { return k !== t.course; }).forEach(function (k, i) {
      set('convCourse' + (i + 1), k);
      set('convPace' + (i + 1), clock(pace / course.factor * COURSES[k].factor));
    });

    // The Your Swim card
    var card = document.getElementById('your-swim');
    card.querySelectorAll('[data-metric]').forEach(function (group) {
      var value = t[group.getAttribute('data-metric')];
      group.querySelectorAll('[data-value]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-value') === value));
      });
    });
    card.querySelectorAll('[data-metric-input]').forEach(function (el) {
      var value = t[el.getAttribute('data-metric-input')];
      if (el !== document.activeElement && el.value !== value) el.value = value;
    });
    // Errors are for the one being typed in (the source)
    var timeField = card.querySelector('[data-time-metric="time"]');
    var typed = t.time, ok = typed === '' || validEntry(typed);
    markTimeField(timeField, ok);
    set('metricsHint', typed === '' ? 'Enter a time.' : ok ? '' : 'Time: seconds must be under 60.');
    set('metricsDistanceUnit', '(' + unitWord.trim() + ')');
  }

  function render() {
    // Context
    set('course', state.course);

    // Your age for Age Group Conversion and Rank in Age Group: your profile's when
    // we know it, otherwise the age group chosen at the top of the page
    var age = state.ageKnown ? Number(state.age) : ageGroup().min;

    // Training Metrics, from Your Swim
    renderMetrics();

    // Context distance
    var list = eventsFor(state.course, state.stroke);
    fitDistance(state, list);
    renderEventOptions(root.querySelector('[data-st-event-options]'), list, state.course + ' ' + state.stroke);
    set('distance', state.distance);
    // The goal belongs to one event; a new event starts it empty
    var eventKey = state.course + ' ' + state.distance + ' ' + state.stroke;
    if (lastEvent && eventKey !== lastEvent && !state.goalAuto) {
      state.goal = '';
      fillTimeField(document.querySelector('[data-time-input="goal"]'), ''); // even if focused
    }
    // Top 10 by Decade follows a new Your Event
    if (eventKey !== lastEvent) followEvent();
    lastEvent = eventKey;

    // Your races, and Race Time Predictions: your bests against your age
    // group's USMS rankings. Its marked event is the context distance.
    renderRaces();
    renderNewRace();
    set('ageGroupLabel', ageGroup().label);
    var rows = renderPredictor(list);
    var goalRow = rows.filter(function (r) { return r.d === Number(state.distance); })[0];
    // Your Event's time until you set a goal: your best, else your
    // projected time, else your age group's median
    var eventTime = isFinite(goalRow.est) ? goalRow.est : goalRow.mid;
    // A guest's time: the age-group median, shown in the Time boxes until
    // they type their own
    if (state.goalAuto) state.goal = isFinite(goalRow.mid) ? race(goalRow.mid) : '';
    var goalSet = state.goal !== '' && validEntry(state.goal);
    // Top 10 by Decade, with your goal across it when it shows Your Event
    renderTopTens(goalSet ? parse(state.goal) : NaN);

    // Splits: Your Event, toward its goal time (the Your Event panel's Goal;
    // the event's time until you set one, shown as the Goal placeholders).
    var distance = Number(state.distance);
    fitInterval(distance);
    var goalTyped = state.goal !== '' && !state.goalAuto;
    var goalOk = state.goal === '' || validEntry(state.goal);
    var goal = goalTyped ? (goalOk ? parse(state.goal) : NaN) : eventTime;
    renderSplits(goal, distance);
    renderPractice(goal, distance);
    // Rank and Tier: the same time, named by where it came from
    // (a prediction from the median, with no races, is the median)
    var projectedTime = isFinite(goalRow.proj) && !goalRow.fromTime;
    renderTier(goal, goalTyped ? 'goal' : isFinite(goalRow.you) ? 'best' : projectedTime ? 'projected time' : ageGroup().label + ' median');
    set('splitsSubtitle', state.distance + ' ' + state.stroke +
      (goalTyped ? ' · goal ' : isFinite(goalRow.you) ? ' · your best ' : projectedTime ? ' · your projected time ' : ' · ' + ageGroup().label + ' median ') + race(goal));
    var goalField = document.querySelector('[data-time-input="goal"]');
    setTimePlaceholders(goalField, eventTime);
    markTimeField(goalField, goalOk);
    set('goalHint', goalOk ? '' : 'Time: seconds must be under 60.');

    renderConversions(age);

    // Fields show the current setting, e.g. the distance after fitDistance();
    // the one being typed in is left alone.
    document.querySelectorAll('[data-input]').forEach(function (el) {
      var value = state[el.getAttribute('data-input')];
      if (el !== document.activeElement && el.value !== value) el.value = value;
    });

    // Time fields show their setting, unless they already do or are being
    // typed in (so a lone "5" isn't rewritten to "05" mid-entry)
    document.querySelectorAll('[data-time-field]').forEach(function (group) {
      var key = group.getAttribute('data-time-input'), metric = group.getAttribute('data-time-metric');
      var value = key ? state[key] : metric ? state.metrics[metric]
        : group.hasAttribute('data-time-conv') ? state.conv[group.getAttribute('data-time-conv')] : state.newRace.time;
      if (readTimeField(group) === value || group.contains(document.activeElement)) return;
      fillTimeField(group, value);
    });

    // A guest's untouched median time looks like a placeholder: grey until
    // they type their own (.is-default)
    root.querySelector('[data-time-input="goal"]').classList.toggle('is-default', !!state.goalAuto);

    // Pressed state for every segmented control and tile group
    document.querySelectorAll('[data-control]').forEach(function (group) {
      var value = state[group.getAttribute('data-control')];
      group.querySelectorAll('[data-value]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-value') === value));
      });
    });
    // Stroke selects (StrokeSelect.njk), the modal's too: each shows its
    // setting, and its pill the stroke's name
    document.querySelectorAll('[data-stroke-select]').forEach(function (sel) {
      var value = sel.hasAttribute('data-metric-input') ? state.metrics.stroke
        : sel.hasAttribute('data-conv-input') ? state.conv.stroke
        : sel.hasAttribute('data-tens-input') ? state.tens.stroke
        : sel.hasAttribute('data-race-input') ? state.newRace.stroke : state.stroke;
      if (sel.value !== value) sel.value = value;
      var opt = sel.options[sel.selectedIndex];
      sel.parentNode.querySelector('[data-stroke-value]').textContent = opt ? opt.text : '';
    });
    root.querySelectorAll('[data-view-panel]').forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-view-panel') !== state.view;
    });
  }

  // ---------- Events ----------

  // Segmented controls: data-control sets a page setting, data-metric one of
  // the Training Metrics swim's, data-race one of the Add a Race form's,
  // data-conv one of Convert a Time's, data-tens one of Top 10 by Decade's
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-control] [data-value], [data-metric] [data-value], [data-race] [data-value], [data-conv] [data-value], [data-tens] [data-value]');
    if (!btn) return;
    var group = btn.closest('[data-control], [data-metric], [data-race], [data-conv], [data-tens]');
    var target = group.hasAttribute('data-metric') ? state.metrics
      : group.hasAttribute('data-race') ? state.newRace
      : group.hasAttribute('data-conv') ? state.conv
      : group.hasAttribute('data-tens') ? state.tens : state;
    var key = group.getAttribute('data-control') || group.getAttribute('data-metric') ||
      group.getAttribute('data-race') || group.getAttribute('data-conv') || group.getAttribute('data-tens');
    var value = btn.getAttribute('data-value');
    // An optional choice (data-optional) clears when its pressed button is clicked
    target[key] = group.hasAttribute('data-optional') && target[key] === value ? '' : value;
    render();
  });

  // Race Time Predictions: chart or table, and its legend pills turning
  // lines off and on (focus stays on the pill, which render replaces)
  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-pred-view]')) {
      state.view = state.view === 'chart' ? 'table' : 'chart';
      render();
      return;
    }
    var pill = e.target.closest('[data-pred-line]');
    if (!pill) return;
    var id = pill.getAttribute('data-pred-line');
    state.predHidden[id] = !state.predHidden[id];
    render();
    var again = root.querySelector('[data-pred-line="' + id + '"]');
    if (again) again.focus();
  });

  // Fields: data-input is a page setting, data-metric-input one of the
  // Training Metrics swim's, data-race-input one of the Add a Race form's,
  // data-conv-input one of Convert a Time's, data-tens-input one of Top 10
  // by Decade's
  function applyInput(el) {
    var key = el.getAttribute('data-input'), metric = el.getAttribute('data-metric-input');
    var raceKey = el.getAttribute('data-race-input'), convKey = el.getAttribute('data-conv-input');
    var tensKey = el.getAttribute('data-tens-input');
    if (key) state[key] = el.value;
    else if (metric) state.metrics[metric] = el.value;
    else if (convKey) state.conv[convKey] = el.value;
    else if (tensKey) state.tens[tensKey] = el.value;
    else if (raceKey) {
      state.newRace[raceKey] = el.value;
      if (raceKey === 'date') el.removeAttribute('aria-invalid');
    }
    else return;
    render();
  }

  // Time field boxes: digits only, two per box. A full box, ":" or "."
  // moves to the next one; Backspace in an empty box moves back.
  function writeTimeField(group) {
    var key = group.getAttribute('data-time-input'), metric = group.getAttribute('data-time-metric');
    if (key) {
      state[key] = readTimeField(group);
      if (key === 'goal') state.goalAuto = false; // their own time now
    }
    else if (metric) {
      // Your Swim: the time or pace just changed becomes the source the
      // other is worked out from
      state.metrics[metric] = readTimeField(group);
      state.metrics.source = metric;
    }
    else if (group.hasAttribute('data-time-conv')) {
      // Convert a Time: the time or pace just changed is the one used
      var convKey = group.getAttribute('data-time-conv');
      state.conv[convKey] = readTimeField(group);
      state.conv.source = convKey;
    }
    else {
      // Add a Race: clear an error once the time is fixed
      state.newRace.time = readTimeField(group);
      if (validEntry(state.newRace.time)) {
        markTimeField(group, true);
        set('raceHint', '');
      }
    }
    render();
  }

  function moveTimePart(el, step) {
    var parts = Array.prototype.slice.call(el.closest('[data-time-field]').querySelectorAll('[data-time-part]'));
    var next = parts[parts.indexOf(el) + step];
    if (!next) return;
    next.focus();
    if (step > 0) next.select();
  }

  document.addEventListener('input', function (e) {
    var el = e.target;
    if (!el.getAttribute) return;
    if (!el.hasAttribute('data-time-part')) {
      applyInput(el);
      return;
    }
    el.value = el.value.replace(/\D/g, '').slice(0, 2);
    writeTimeField(el.closest('[data-time-field]'));
    if (el.value.length === 2) moveTimePart(el, 1);
  });

  // Up/Down arrows, or the wheel while a box is focused, step it by one,
  // wrapping: minutes and seconds 0-59, hundredths 0-99. Stepping a field
  // that only shows placeholders (e.g. the event's time) starts from them.
  var PART_MAX = { m: 59, s: 59, h: 99 };

  function stepTimePart(el, dir) {
    var group = el.closest('[data-time-field]');
    var parts = group.querySelectorAll('[data-time-part]');
    var empty = Array.prototype.every.call(parts, function (p) { return p.value === ''; });
    if (empty) {
      parts.forEach(function (p) { if (/^\d+$/.test(p.placeholder)) p.value = p.placeholder; });
    }
    var part = el.getAttribute('data-time-part'), size = PART_MAX[part] + 1;
    var v = ((Number(el.value) || 0) + dir + size) % size;
    el.value = part === 'm' ? String(v) : ('0' + v).slice(-2);
    writeTimeField(group);
    el.select();
  }

  var wheelDelta = 0;

  document.addEventListener('wheel', function (e) {
    var el = e.target;
    if (!el.hasAttribute || !el.hasAttribute('data-time-part') || el !== document.activeElement) return;
    e.preventDefault();
    // Trackpads send many small deltas; step once per 30px of travel
    wheelDelta += e.deltaY;
    if (Math.abs(wheelDelta) < 30) return;
    stepTimePart(el, wheelDelta < 0 ? 1 : -1);
    wheelDelta = 0;
  }, { passive: false });

  document.addEventListener('keydown', function (e) {
    var el = e.target;
    if (!el.hasAttribute || !el.hasAttribute('data-time-part')) return;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      stepTimePart(el, e.key === 'ArrowUp' ? 1 : -1);
    } else if (e.key === ':' || e.key === '.') {
      e.preventDefault();
      moveTimePart(el, 1);
    } else if (e.key === 'Backspace' && el.value === '') {
      e.preventDefault();
      moveTimePart(el, -1);
    }
  });

  // Entering a box selects it, so typing replaces what's there. A click's
  // mouseup would put the caret back where the click landed, so the mouseup
  // that follows a click-to-focus is cancelled.
  var justFocused = null;

  document.addEventListener('focusin', function (e) {
    var el = e.target;
    if (!el.hasAttribute || !el.hasAttribute('data-time-part')) return;
    el.select();
    justFocused = el;
  });

  // Clicking into a time field from outside it starts at the minutes box,
  // wherever the click lands; once inside, a click picks that box
  document.addEventListener('mousedown', function (e) {
    var group = e.target.closest && e.target.closest('[data-time-field]');
    if (!group || group.contains(document.activeElement)) return;
    e.preventDefault();
    group.querySelector('[data-time-part="m"]').focus();
  });

  document.addEventListener('mouseup', function (e) {
    if (justFocused && e.target === justFocused) e.preventDefault();
    justFocused = null;
  });

  // Leaving a box pads it (5 seconds shows as 05, 5 hundredths as 50); the
  // value is already read that way, so nothing recalculates. Leaving an
  // empty hundredths box in a time that has minutes or seconds fills it with
  // 00, which is how it was already read.
  document.addEventListener('focusout', function (e) {
    var el = e.target, part = el.getAttribute && el.getAttribute('data-time-part');
    if (part === 'h' && el.value === '') {
      var group = el.closest('[data-time-field]');
      if (group.querySelector('[data-time-part="m"]').value || group.querySelector('[data-time-part="s"]').value) el.value = '00';
      return;
    }
    if (!part || el.value.length !== 1) return;
    if (part === 's') el.value = '0' + el.value;
    if (part === 'h') el.value = el.value + '0';
  });

  // Editor modals: modal.js opens and closes them. Here we add focus
  // handling, Escape, and closing on a click outside the dialog.
  var opener = null;

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-target]');
    if (trigger && root.contains(trigger)) {
      opener = trigger;
      if (trigger.getAttribute('data-modal-target') === '#swimDeckRace') {
        resetNewRace();
        render();
      }
      if (trigger.getAttribute('data-modal-target') === '#swimDeckLog') prepareLog();
      var modal = document.querySelector(trigger.getAttribute('data-modal-target'));
      var first = modal && modal.querySelector('input, select, [data-value]');
      if (first) setTimeout(function () { first.focus(); }, 0);
      return;
    }
    if (e.target.classList && e.target.classList.contains('swim-deck-modal')) {
      close(e.target);
      return;
    }
    if (e.target.closest('.swim-deck-modal .js-modal-close') && opener) {
      var back = opener;
      opener = null;
      setTimeout(function () { back.focus(); }, 0);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var modal = document.querySelector('.swim-deck-modal.in');
    if (modal) close(modal);
  });

  // Goes through modal.js's own close handler
  function close(modal) {
    modal.querySelector('.js-modal-close').click();
  }

  // Your races: add (Add a Race modal), and show all or fewer
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-races-toggle]')) {
      state.racesExpanded = !state.racesExpanded;
      render();
      return;
    }
    if (e.target.closest('[data-save-log]')) {
      saveLog();
      return;
    }
    if (e.target.closest('[data-add-race]')) {
      addRace();
      return;
    }
  });

  // Section ribbon: the chosen section moves to the top of the tools, the
  // rest keep their page order below it. Nodes are moved (not CSS order) so
  // tab order matches what's on screen, and nothing scrolls.
  var sectionsBox = root.querySelector('.swim-deck__sections');
  var ribbonButtons = root.querySelectorAll('.swim-ribbon [data-section]');
  var defaultOrder = Array.prototype.map.call(ribbonButtons, function (btn) {
    return document.getElementById(btn.getAttribute('data-section'));
  });

  function showFirst(id) {
    var first = document.getElementById(id);
    [first].concat(defaultOrder.filter(function (s) { return s !== first; }))
      .forEach(function (section) { sectionsBox.appendChild(section); });
    ribbonButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-section') === id));
    });
    first.classList.remove('is-arriving');
    void first.offsetWidth; // restart the arrival fade
    first.classList.add('is-arriving');
  }

  root.addEventListener('click', function (e) {
    var btn = e.target.closest('.swim-ribbon [data-section]');
    if (btn && btn.getAttribute('aria-pressed') !== 'true') showFirst(btn.getAttribute('data-section'));
  });

  // Keyboard vs. pointer, for focus rings that :focus-visible gets wrong
  // (the Distance selects). On <html>, since the modals sit outside root.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') document.documentElement.classList.add('swim-keyboard');
  });
  document.addEventListener('pointerdown', function () {
    document.documentElement.classList.remove('swim-keyboard');
  });

  state.races = loadRaces();
  startFromSwimmer();
  render();
  // Which rankings exist; the predictor fetches its events' files from there
  fetch(DATA_BASE + 'available.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    .then(function (data) {
      AVAILABLE = (data && data.datasets) || [];
      render();
    });
})();
