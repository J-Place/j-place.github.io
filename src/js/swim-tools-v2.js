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
    // Your age group, by its youngest age, when we don't know your age
    // (logged out, or no birth date on the profile): 45-49
    ageGroup: '45',
    // Sex, when we don't know it (logged out, or no gender on the profile)
    sex: 'Men',
    view: 'chart', strategy: 'even',
    predHidden: {}, // Race Time Predictions: lines turned off (you, mid, low, ten, top)
    // The swim Training Metrics are worked out from (its settings modal)
    // The Training Metrics swim (Your Swim). stroke is optional: '' for a
    // mixed workout.
    // Time and pace (per 100) both show; the one changed last (source) is
    // used, and the other is worked out from it
    // effort: how hard it felt, '1' to '10', or '' (not rated; Effort's
    // buttons, data-optional); hrZone: heart rate zone, '1' to '5', or ''
    // (not given; data-optional)
    metrics: { course: 'SCY', distance: '1650', time: '22:30.00', pace: '', source: 'time', stroke: '', effort: '', hrZone: '' },
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

  // An event's latest ranking (or a given season's: Race History's Top 10
  // line) for an age group and the swimmer's gender, in a course (or SCY's,
  // converted): { n, truncated, synthetic, season, times (seconds, fastest
  // first) }. null when there's none, or it isn't in yet (asking for it
  // starts the fetch).
  function groupRank(course, stroke, d, group, season) {
    var gender = swimmerGender().toLowerCase();
    if (!group || !gender || !AVAILABLE) return null;
    var age = ageKey(group), from = course.toLowerCase();
    var setsFor = function (c) {
      return AVAILABLE.filter(function (x) { return x.course === c && x.gender === gender && x.age === age; })
        .sort(function (a, b) { return b.season - a.season; });
    };
    var sets = setsFor(from);
    if (!sets.length) { from = 'scy'; sets = setsFor(from); }
    if (season) sets = sets.filter(function (x) { return x.season === season; });
    var FROM = from.toUpperCase(), fromD = matchDistance(d, FROM, stroke);
    if (!sets.length || !fromD) return null;
    var url = DATA_BASE + sets[0].season + '/' + gender + '-' + age + '/' + from + '/' + stroke.toLowerCase() + '/' + fromD + '.json';
    if (!(url in RANKS)) request(url);
    var e = RANKS[url];
    if (!e || e === 'loading') return null;
    var scale = COURSES[course].factor / COURSES[FROM].factor * d / fromD;
    return {
      n: e.n, truncated: e.truncated, synthetic: e.synthetic, seasonLabel: e.seasonLabel, converted: FROM !== course, season: sets[0].season,
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

  // A text, then a "synthetic data" note in very light grey when the
  // rankings behind it are modeled (the data flags them; the page labels it)
  function setWithSynth(name, text, note) {
    document.querySelectorAll('[data-st="' + name + '"]').forEach(function (el) {
      el.textContent = text;
      if (note) {
        var span = document.createElement('span');
        span.className = 'swim-synth';
        span.textContent = ' ' + note;
        el.appendChild(span);
      }
    });
  }

  // Race Time Predictions' skeleton, shaped like the summary note it stands
  // in for: a kicker, a headline (two lines on phones), then the paragraph
  // (three lines on desktop, five on phones; .swim-skel--phone), and the
  // legend's pills at their usual widths
  var SKEL_LINES = '<span class="visually-hidden">Loading USMS rankings…</span>' +
    [['k', '22%'], ['l', '72%'], ['l', '40%', 1], ['b', '100%'], ['b', '96%'], ['b', '64%'], ['b', '90%', 1], ['b', '52%', 1]].map(function (x) {
      return '<span class="swim-skel swim-skel__' + x[0] + (x[2] ? ' swim-skel--phone' : '') + '" style="width: ' + x[1] + '" aria-hidden="true"></span>';
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
    // A swimmer with races, but none in the last WINDOW_YEARS in this course
    // and stroke: the projections (from their other courses) stand, and the
    // note says where they come from, and why any older races here aren't used
    var history = predRaces(), noneHere = '';
    if (history.length && !rows.some(function (r) { return isFinite(r.you); })) {
      var t = today(), from = (Number(t.slice(0, 4)) - WINDOW_YEARS) + t.slice(4);
      var here = history.filter(function (x) { return x.course === state.course && x.stroke === state.stroke; });
      var old = here.filter(function (x) { return x.date && x.date < from; }).map(function (x) { return Number(x.date.slice(0, 4)); });
      var others = [];
      history.forEach(function (x) {
        if (x.stroke === state.stroke && x.course !== state.course && (!x.date || x.date >= from) && others.indexOf(x.course) < 0) others.push(x.course);
      });
      others.sort(function (a, b) { return ['SCY', 'SCM', 'LCM'].indexOf(a) - ['SCY', 'SCM', 'LCM'].indexOf(b); });
      var ev = state.course + ' ' + lowerStroke(state.stroke);
      noneHere = (others.length ? 'Projected from your ' + others.join(' and ') + ' ' + lowerStroke(state.stroke) + ' races. ' : '') +
        (old.length ? 'Your ' + ev + ' races are from ' + Math.min.apply(null, old) +
          (Math.max.apply(null, old) > Math.min.apply(null, old) ? '–' + String(Math.max.apply(null, old)).slice(-2) : '') +
          ', over ' + WINDOW_YEARS + ' years ago, so they aren\'t used.' : 'Race ' + ev + ' to see your own times here.');
    }
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
    // A guest who hasn't picked both Age Group and Competition Category:
    // projections are grey, as defaults, until they have
    root.querySelector('#race-predictor').classList.toggle('is-pending', guestPending());
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
    // Your goal, once you've typed one (Race Planning's Goal): a solid deep
    // yellow dot at Your Event's distance, in the scale too
    var goalTyped = !state.goalAuto && state.goal !== '' && validEntry(state.goal);
    var goalIndex = list.indexOf(eventD);
    var goalP = goalTyped && goalIndex >= 0 ? pace(parse(state.goal), eventD) : NaN;
    if (isFinite(goalP)) all.push(goalP);
    // ...and a Projected Winner flag on it when it's as fast as this
    // season's fastest in your age group
    var goalRow = goalIndex >= 0 ? rows[goalIndex] : null;
    var goalWins = isFinite(goalP) && goalRow && isFinite(goalRow.top) && parse(state.goal) <= goalRow.top;
    var label = group.label + ' median', lowLabel = group.label + ' slowest';
    var tenLabel = group.label + ' top ten', topLabel = group.label + ' fastest';
    // Median times (no races, no typed time): just whose, "Pace per 100 |
    // 50 Free | 45–49 Men's/Open"; "(synthetic data)" after, light grey
    var category = CATEGORY_NAMES[swimmerGender()];
    var synthetic = rows.some(function (r) { return r.synthetic; });
    setWithSynth('predSubtitle', fromTime && !fromTime.own ?
      'Pace per 100 | ' + state.distance + ' ' + state.stroke + ' | ' + group.label + (category ? ' ' + category : '') :
      fromTime ? 'Pace per 100 · ' + state.course + ' ' + lowerStroke(state.stroke) + ' predictions from your ' + fromTime.d + ' time, with the ' + group.label + ' range' :
      'Pace per 100 · your ' + state.course + ' ' + lowerStroke(state.stroke) + ' races against the ' + label +
        (projected ? ', with projected times where you haven\'t raced' : '') + (rows.old ? ' · from races over ' + WINDOW_YEARS + ' years ago' : ''),
      synthetic && '(synthetic data)');
    set('groupCol', label);
    set('bottomCol', lowLabel);
    set('topTenCol', tenLabel);
    set('fastestCol', topLabel);

    // The legend: pills turn lines off and on; Projected is a key only
    var key = function (id, text) {
      return '<button type="button" class="swim-pred-key" data-pred-line="' + id + '" aria-pressed="' + !off[id] + '">' +
        '<span class="swim-pred-swatch swim-pred-swatch--' + id + '" aria-hidden="true"></span>' + text + '</button>';
    };
    // "Your best" only when there's a best to show (not for a guest with no races)
    var hasBest = rows.some(function (r) { return isFinite(r.you); });
    q('[data-pred-legend]').innerHTML = loading ? SKEL_PILLS : (hasBest ? key('you', 'Your best') : '') +
      (projected ? '<span class="swim-pred-key swim-pred-key--static"><span class="swim-pred-swatch swim-pred-swatch--proj" aria-hidden="true"></span>Projected</span>' : '') +
      (isFinite(goalP) ? '<span class="swim-pred-key swim-pred-key--static"><span class="swim-pred-swatch swim-pred-swatch--goal" aria-hidden="true"></span>Your goal</span>' : '') +
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
      }).join('') +
        (isFinite(goalP) ? '<span class="swim-pred__dot is-goal" style="left: ' + x(goalIndex).toFixed(2) + '%; top: ' + y(goalP).toFixed(1) +
          '%" title="Your goal: ' + race(parse(state.goal)) + ' in the ' + eventD + ' ' + lowerStroke(state.stroke) + '"></span>' : '') +
        // The goal's flag: above the dot (below it near the chart's top), hung
        // inward at the ends; not when your own time there already flies one
        (goalWins && !(goalRow.wins && !off.you) ? '<span class="swim-pred-win' + (y(goalP) < 14 ? ' is-below' : '') +
          (x(goalIndex) > 90 ? ' is-end' : x(goalIndex) < 10 ? ' is-start' : '') +
          '" style="left: ' + x(goalIndex).toFixed(2) + '%; top: ' + y(goalP).toFixed(1) + '%">Projected Winner</span>' : '');
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
    var winNote = q('[data-pred-win-note]'), wins = off.you ? [] : rows.filter(function (r) { return r.wins; });
    winNote.hidden = !wins.length && !goalWins;
    winNote.innerHTML = (goalWins ? '<b>Your goal of ' + race(parse(state.goal)) + ' in the ' + eventD + ' ' + lowerStroke(state.stroke) +
      (parse(state.goal) < goalRow.top ? ' beats' : ' ties') + ' this season\'s fastest in ' + swimmerGender().toLowerCase() + ' ' + group.label +
      '</b> (' + race(goalRow.top) + '). ' : '') + wins.map(function (r) {
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
    // The median-times message gets the editorial note treatment
    // Every summary as a note: a kicker, a headline, then a paragraph
    box.classList.add('swim-pred-insight--note');
    var note = function (kicker, lead, body) {
      return '<span class="swim-pred-insight__kicker">' + kicker + '</span>' +
        '<span class="swim-pred-insight__lead">' + lead + '</span>' +
        (body ? '<span class="swim-pred-insight__body">' + body + '</span>' : '');
    };
    if (loading) {
      box.innerHTML = SKEL_LINES;
    } else if (!hasRank) {
      box.innerHTML = note('Age-group rankings', noRankText());
    } else if (fromTime) {
      box.innerHTML = fromTime.own ?
        note('Your time', 'Predicted from your ' + fromTime.d + ' ' + lowerStroke(state.stroke) + ' time of ' + race(fromTime.secs) + '.',
          'Each distance scales it by how the ' + group.label + ' median changes. Race to see predictions from your own results.') :
        // A guest still on the defaults; then, once they've picked (or for
        // anyone with no races in this stroke), a nudge to add one
        guestPending() ?
          note('Age-group medians', 'These are the default median times for ' + group.label + '.',
            'For better results, <a href="#swimDeckWho" data-modal-target="#swimDeckWho">add your age and category</a>.') :
          note('Age-group medians', 'Projected times are based on the ' + CATEGORY_NAMES[swimmerGender()] + ' ' + group.label + ' median.',
            '<a href="#swimDeckRace" data-modal-target="#swimDeckRace">Add a race</a> to adjust your projections.');
    } else if (!raced.length) {
      box.innerHTML = noneHere ? note('Projected times', noneHere) :
        note('Your races', 'Race the ' + lowerStroke(state.stroke) + ' to compare your pace with your age group.');
    } else if (raced.length === 1) {
      // How many times you've swum it in the window (or ever, past it)
      var times = predPool(state.stroke).filter(function (x) {
        return x.course === state.course && x.stroke === state.stroke && x.d === raced[0].d;
      }).length;
      box.innerHTML = note('Your races',
        'You\'ve raced the ' + state.course + ' ' + raced[0].d + ' ' + lowerStroke(state.stroke) + ' ' +
          (times === 1 ? 'one time' : times === 2 ? 'twice' : times + ' times') + (rows.old ? '' : ' in the last ' + WINDOW_YEARS + ' years') + '.',
        old + 'Per 100 you\'re ' + gap(raced[0]) + '. Race another distance to see where you\'re strongest.');
    } else {
      // Strongest and weakest by pace against the median (lower is better)
      var strong = raced.reduce(function (a, b) { return b.gap < a.gap ? b : a; });
      var weak = raced.reduce(function (a, b) { return b.gap > a.gap ? b : a; });
      var kind = function (d) { return d <= 100 ? 'sprint' : d >= 500 ? 'distance' : d; };
      var work = weak.d > strong.d ? 'Distance work' : 'Speed work';
      var both = old + 'Per 100, your ' + strong.d + ' is ' + gap(strong) + ' and your ' + weak.d + ' is ' + gap(weak) + '. ';
      box.innerHTML = weak.gap <= 0 ? note('Your strengths', 'You\'re ahead of the age-group median at every distance.', both + 'Your ' + kind(strong.d) + ' is your strongest event.') :
        strong.gap < 0 ? note('Your strengths', 'Your ' + kind(strong.d) + ' is ahead of the pack.', both + work + ' will close the gap fastest.') :
        note('Your strengths', 'Your ' + kind(strong.d) + ' is closest to the pack.', both + work + ' will move your times fastest.');
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
  // A guest still on the default Age Group or Competition Category
  function guestPending() {
    return !!state.guest && !(state.ageChosen && state.sexChosen);
  }

  // Competition categories as the page shows them ("Men's/Open 40–44")
  var CATEGORY_NAMES = { Men: 'Men\'s/Open', Women: 'Women\'s' };

  // The swimmer's gender as the rankings name it: the profile's when logged
  // in with one, otherwise the header's Sex choice (state.sex)
  function swimmerGender() {
    var user = USERS[SWIMMER] || {};
    var own = { M: 'Men', F: 'Women' }[user.gender];
    return user.loggedIn && own ? own : state.sex;
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

  // ---------- Summary: goal, age-up, comeback (as v4's) ----------

  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MEETS = [];
  try { MEETS = JSON.parse(document.getElementById('meets-data').textContent) || []; } catch (e) {}

  // m:ss, or whole seconds under a minute ("break 2:55")
  function wholeTime(t) {
    var m = Math.floor(t / 60), r = Math.round(t - m * 60);
    return m ? m + ':' + (r < 10 ? '0' : '') + r : String(r);
  }

  // The summary band, from Your Event (goalRow: its predictor row)
  function renderSummary(goalRow) {
    var q = function (sel) { return root.querySelector(sel); };
    var d = Number(state.distance), ev = d + ' ' + lowerStroke(state.stroke);
    var mine = predRaces().filter(function (r) { return r.course === state.course && r.stroke === state.stroke && r.d === d; })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    var latest = mine[0] || null, best = fastest(mine);
    var groupMedian = goalRow ? goalRow.mid : NaN;

    // The goal: the one you typed in Race Planning, else v4's suggestion:
    // just under the whole second below your latest ("break 2:55"), or with
    // no races, the age-group median
    var typed = !state.goalAuto && state.goal !== '' && validEntry(state.goal);
    var goal, kind, round;
    if (typed) { goal = parse(state.goal); kind = 'set'; }
    else if (latest) { round = Math.floor(latest.secs); goal = round - 0.01; kind = 'break'; }
    else { goal = groupMedian; kind = 'middle'; }
    // The card shows a goal only once you've set one (Race Planning's Goal,
    // which Add goal / Edit goal goes to); the suggestion above still stands
    // in for it in Race Planning (its Goal placeholders, Race Splits, Rank
    // and Tier: this function's return)
    var shown = typed ? goal : NaN;
    set('goalTitle', typed ? race(goal) + ' in the ' + ev : 'Set a goal in the ' + ev);
    set('goalMeta', state.course);
    q('[data-goal-change]').textContent = typed ? 'Edit goal' : 'Add goal';
    set('goalLatestLabel', latest && latest.date ? 'Latest · ' + monthYear(latest.date) : 'Latest');
    set('goalBestLabel', best && best.date ? 'Best · ' + monthYear(best.date) : 'Best');
    set('goalLatest', latest ? race(latest.secs) : '—');
    set('goalBest', best ? race(best.secs) : '—');
    set('goalTime', typed ? race(goal) : '—');
    // The goal against your times: a personal best, or what it beats
    var synopsis = !typed ? '' :
      !best ? 'Your first race in the ' + ev + ' will set your personal best.' :
      goal < best.secs ? 'Your race goal would be a personal best, dropping ' + (best.secs - goal).toFixed(2) + ' s from your best time.' :
      goal === best.secs ? 'Your race goal would tie your personal best.' :
      latest && goal < latest.secs ? 'Your race goal would beat your latest time by ' + (latest.secs - goal).toFixed(2) + ' s, and your best is ' + race(best.secs) + '.' :
      latest && goal > latest.secs ? 'Your race goal is ' + (goal - latest.secs).toFixed(2) + ' s slower than your latest time.' :
      'Your race goal matches your latest time.';
    set('goalSynopsis', synopsis);
    q('[data-st="goalSynopsis"]').hidden = !synopsis;
    var gap = latest && isFinite(shown) ? latest.secs - shown : NaN;
    set('goalToGo', isFinite(gap) ? (gap > 0 ? gap.toFixed(2) : '0.00') : '—');
    // The track, slower on the left; only with two or more marks
    var track = q('[data-goal-track]');
    var lt = latest ? latest.secs : NaN, bt = best ? best.secs : NaN;
    var marks = [lt, bt, shown].filter(isFinite);
    track.hidden = marks.length < 2 || !latest;
    if (!track.hidden) {
      var hi = Math.ceil(Math.max.apply(null, marks) * 2 + 0.5) / 2, lo = Math.floor(Math.min.apply(null, marks) * 2 - 0.5) / 2;
      var pos = function (t) { return ((hi - t) / (hi - lo) * 100).toFixed(1) + '%'; };
      var show = function (sel, t) { var el = q(sel); el.hidden = !isFinite(t); if (isFinite(t)) el.style.left = pos(t); };
      q('[data-goal-track-fill]').style.width = pos(lt);
      show('[data-goal-track-latest]', lt);
      show('[data-goal-track-best]', bt);
      show('[data-goal-track-goal]', shown);
      set('goalTrackHi', race(hi));
      set('goalTrackLo', race(lo));
      q('[data-goal-track-bar]').setAttribute('aria-label', 'Latest ' + race(lt) + ', best ' + race(bt) + (typed ? ', goal ' + race(goal) : ''));
    }
    state.summaryShare = (typed ? 'Working toward ' + race(goal) + ' in the ' + state.course + ' ' + ev + (latest ? ':' : '.') :
      'My ' + state.course + ' ' + ev + (latest ? ':' : '.')) +
      (latest ? ' latest ' + race(latest.secs) : '') + (best ? ', best ' + race(best.secs) : '') + (latest ? '.' : '');

    // You move up an age group: your gap to the median now and in the next
    var user = USERS[SWIMMER] || {}, group = ageGroup(), k = AGE_GROUPS.indexOf(group), next = AGE_GROUPS[k + 1];
    var gaps = q('[data-ageup-gaps]');
    var dob = (user.birthDate || '').split('/').map(Number);
    var moveUpSoon = false, sinceMonths = NaN; // for the compact secondary card
    set('ageUpShort', '');
    if (!state.ageKnown || dob.length !== 3 || !next) {
      set('ageUpTitle', 'Your age group');
      set('ageUpText', !user.loggedIn ? 'Log in to see how you compare when you move up an age group.' :
        !next ? 'You\'re in the oldest age group.' : 'Add your birth date to your profile to compare with your next age group.');
      gaps.innerHTML = ''; set('ageUpFine', '');
    } else {
      var year = dob[2] + next.min, now = new Date().getFullYear();
      var when = year === now ? 'this year' : year === now + 1 ? 'next year' : 'in ' + year;
      set('ageUpTitle', 'You move up to ' + next.label + ' ' + when);
      var t = latest ? latest.secs : NaN;
      var rNow = groupRank(state.course, state.stroke, d, group), rNext = groupRank(state.course, state.stroke, d, next);
      var turns = 'You turn ' + next.min + ' in ' + MONTH_NAMES[dob[0] - 1] + ' ' + year + '.';
      var moveUpOn = new Date(year, dob[0] - 1, dob[1]), soon = new Date();
      soon.setFullYear(soon.getFullYear() + 1);
      moveUpSoon = moveUpOn <= soon;
      set('ageUpShort', turns);
      if (!isFinite(t) || !rNow || !rNext) {
        set('ageUpText', turns + (!isFinite(t) ? ' Race the ' + ev + ' to see how you compare there.' : pending() ? ' Loading USMS rankings…' : ' ' + noRankText()));
        gaps.innerHTML = ''; set('ageUpFine', '');
      } else {
        var rows = [[group.label, t - median(rNow), false], [next.label, t - median(rNext), true]];
        set('ageUpShort', turns + ' Holding ' + race(t) + ', you\'re ' + Math.abs(rows[1][1]).toFixed(2) + ' s ' +
          (rows[1][1] > 0 ? 'off' : 'under') + ' the ' + next.label + ' median.');
        var behind = rows[0][1] > 0;
        set('ageUpText', turns + ' Hold today\'s ' + race(t) + ' and you ' +
          (behind ? (rows[1][1] < rows[0][1] ? 'get closer to' : 'drift further from') : 'stay ahead of') + ' the middle of the pack:');
        var max = Math.max(Math.abs(rows[0][1]), Math.abs(rows[1][1])) || 1;
        gaps.innerHTML = rows.map(function (r) {
          return '<div class="swim-gaps__row' + (r[2] ? ' is-next' : '') + '"><span>' + r[0] + '</span>' +
            '<span class="swim-gaps__track"><span style="width: ' + (Math.abs(r[1]) / max * 100).toFixed(1) + '%"></span></span>' +
            '<span class="swim-gaps__value">' + (r[1] < 0 ? '−' : '') + Math.abs(r[1]).toFixed(2) + ' s</span></div>';
        }).join('');
        setWithSynth('ageUpFine', (behind ? 'Gap to' : 'Time under') + ' the age-group median for ' + state.course + ' ' + ev + ', from USMS event rankings' +
          (rNow.seasonLabel ? ', ' + rNow.seasonLabel : '') + (rNow.converted ? ', converted from SCY' : '') + '.',
          rNow.synthetic || rNext.synthetic ? 'Synthetic data for ' + [rNow.synthetic && group.label, rNext.synthetic && next.label].filter(Boolean).join(' and ') + ': modeled, not real results.' : '');
      }
    }

    // Time since your last race, and what's coming up
    var last = predRaces().filter(function (r) { return r.date; }).sort(function (a, b) { return b.date.localeCompare(a.date); })[0];
    if (!last) {
      set('sinceTitle', 'Find your first meet');
      set('sinceText', 'A meet gives your goal a date, and your results show up here automatically.');
    } else {
      var a = last.date.split('-').map(Number), n = new Date();
      var months = (n.getFullYear() - a[0]) * 12 + n.getMonth() + 1 - a[1] - (n.getDate() < a[2] ? 1 : 0);
      sinceMonths = months;
      set('sinceTitle', months >= 2 ? months + ' months since your last race' : months === 1 ? 'A month since your last race' : 'You raced this month');
      set('sinceText', 'Your last swim was ' + last.d + ' ' + lowerStroke(last.stroke) + ' at ' + race(last.secs) + ' in ' + MONTH_NAMES[a[1] - 1] + ' ' + a[0] + '. ' +
        (months >= 2 ? 'A meet gives your goal a date.' : 'Keep the momentum going.'));
    }
    var today0 = new Date(today() + 'T00:00:00');
    var upcoming = MEETS.map(function (m) { return Object.assign({}, m, { at: new Date(m.date) }); })
      .filter(function (m) { return m.at >= today0; }).sort(function (x, y) { return x.at - y.at; });
    var pool = upcoming.filter(function (m) { return !m.virtual && m.course === state.course; });
    var near = pool.filter(function (m) { return user.state && m.state === user.state; })[0] || pool[0];
    var virtual = upcoming.filter(function (m) { return m.virtual; })[0];
    var row = function (m, note) {
      return '<div class="swim-meets__row"><a href="' + m.url + '">' + m.title + '</a><span>' + note + MONTH_NAMES[m.at.getMonth()].slice(0, 3) + ' ' + m.at.getDate() + '</span></div>';
    };
    q('[data-comeback-meets]').innerHTML = (near ? row(near, near.state ? near.state + ' · ' : '') : '') + (virtual ? row(virtual, 'Virtual · ') : '');

    // Your training status leads; the age-up and comeback cards are
    // secondary. With no recent training to report, both show in full.
    // Beside a training status, at most one, compact: age-up when you move
    // up within a year, else comeback when your last race was 6 or more
    // months ago (or you haven't raced), else neither.
    var status = renderStatus();
    var pick = !status ? null :
      moveUpSoon ? q('.swim-ageup') :
      !(sinceMonths < SINCE_MONTHS) ? q('.swim-comeback') : null;
    root.querySelectorAll('[data-summary-fallback]').forEach(function (card) {
      card.hidden = status && card !== pick;
      card.classList.toggle('swim-summary__card--mini', card === pick);
    });
    q('.swim-summary').classList.toggle('swim-summary--status', status);
    q('.swim-summary').classList.toggle('swim-summary--mini', !!pick);
    // The goal, for Race Planning: its Goal placeholders, Race Splits and
    // Rank and Tier use it until you type your own
    return { secs: goal, kind: kind };
  }

  // Months since your last race before the compact comeback card shows
  var SINCE_MONTHS = 6;

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
    setWithSynth('rankTierSub', state.course + ' ' + state.distance + ' ' + lowerStroke(state.stroke) + (gender ? ' · ' + gender.toLowerCase() + ' ' + ageGroup().label : '') +
      (rank ? ' · ' + (rank.seasonLabel ? rank.seasonLabel + ' season, ' : '') + rank.n.toLocaleString() + ' ranked' +
        (rank.converted ? ' · converted from SCY' : '') : ''), rank && rank.synthetic && '(synthetic data)');
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
      // a guest's default age group isn't theirs until they pick it: not bold
      return { label: g.label, time: base / AGE_GROUPS[mine].factor * g.factor, current: k === mine && !(state.guest && !state.ageChosen) };
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
  var racesShown = 0; // set by balanceRacePlanning; 0 is RACES_SHOWN
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
    // The Sex choice, before it, likewise only when we don't know it
    var known = USERS[SWIMMER] && USERS[SWIMMER].loggedIn && { M: 1, F: 1 }[USERS[SWIMMER].gender];
    root.querySelector('[data-st-sex-field]').hidden = !!known;
    // A greeting as on v4, and in the select's place, your sex and age group
    var user = USERS[SWIMMER] || {};
    if (user.loggedIn && user.firstName) set('greeting', 'Welcome back, ' + user.firstName + '. Here are your races, times and training, all in one place.');
    root.querySelector('[data-st-who]').hidden = !(age >= 18);
    if (age >= 18) set('who', [CATEGORY_NAMES[swimmerGender()], ageGroup().label].filter(Boolean).join(' '));
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
      // Their Age Group and Competition Category start as defaults: grey,
      // and the chart's projections grey too, until they pick each
      state.guest = true;
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
    var count = racesShown || RACES_SHOWN;
    var shown = state.racesExpanded ? races : races.slice(0, count);
    list.classList.toggle('is-all', state.racesExpanded);
    list.innerHTML = shown.length ? shown.map(function (r) {
      var best = bests[key(r)], pb = r.secs === best;
      return '<li class="swim-races__row"><span class="swim-races__course">' + r.course + '</span>' +
        '<span>' + r.d + ' ' + r.stroke + ' <span class="swim-races__date">' + formatDate(r.date) + '</span></span>' +
        '<span class="swim-badge' + (pb ? ' swim-badge--best' : '') + '">' + (pb ? 'Best' : '+' + (r.secs - best).toFixed(2) + ' vs best') + '</span>' +
        '<span class="swim-races__time">' + race(r.secs) + '</span>' +
        // Pace per 100, unlabeled on screen
        '<span class="swim-races__pace" title="Pace per 100 ' + (r.course === 'SCY' ? 'yards' : 'meters') + '">' +
        clock(r.secs / Number(r.d) * 100) + '<span class="visually-hidden"> per 100 ' + (r.course === 'SCY' ? 'yards' : 'meters') + '</span></span></li>';
    }).join('') : '';
    // No races: the Find an Event promo in the list's place
    list.hidden = !shown.length;
    root.querySelector('[data-races-promo]').hidden = !!shown.length;
    toggle.hidden = races.length <= count;
    toggle.setAttribute('aria-expanded', String(state.racesExpanded));
    toggle.textContent = state.racesExpanded ? 'Show fewer' : 'Show all ' + races.length;
  }


  // ---------- Race History chart (as v4's) ----------

  // As v4's renderTrend (swim-tools-v4.js): your races in Your Event's
  // course and stroke (or every race), a line per event over time. Pace per
  // 100 up the side (slower higher), so a 50 and a 1650 share a scale; each
  // dot a race, Your Event's labelled with its time, each event's best a
  // solid ▲. Grey lines mark your age group's Top 10 each season (1st and 10th place)
  // (your age at the SCY season's end, May 31), where those rankings exist.
  // Zoom (− +) and pan (‹ ›, or drag) through the years once they span more
  // than five.
  var LINE_COLORS = ['#0068AD', '#CC2030', '#2A9D8F', '#E09F3E', '#6A4C93', '#1F7A3A', '#5A6B7D', '#8CC0E3', '#B5651D', '#D45087'];
  var LABEL_LIMIT = 40; // more of Your Event's dots than this: times on hover
  var YEAR_MS = 365.25 * 864e5, ZOOM_MIN = 5 * YEAR_MS, ZOOM_STEP = 0.6;
  var STROKE_SHORT = { Free: 'Fr', Back: 'Ba', Breast: 'Br', Fly: 'Fl', IM: 'IM' };
  // all: every race, not just Your Event's course and stroke; hidden: lines
  // turned off (an event's key, or top10); zoom: the years shown (null: all)
  var trend = { all: false, hidden: {}, zoom: { key: null, span: null, end: null }, dragged: false };

  // The zoom bar: hidden when every race fits in five years; each button off
  // at its limit, and the years in view for screen readers
  function renderZoom(card, canZoom, zoomed, full, span, end, t0, w0, w1) {
    var bar = card.querySelector('[data-zoom-bar]');
    bar.hidden = !canZoom;
    card.querySelector('[data-drag-hint]').hidden = true;
    card.querySelector('.swim-trend__chart').classList.toggle('is-draggable', canZoom && zoomed);
    if (!canZoom) return;
    var years = function (ms) { return Math.round(ms / YEAR_MS); };
    var yr = function (t) { return new Date(t).getFullYear(); };
    set('zoomLabel', zoomed ? yr(w0) + '–' + yr(w1) + ' · ' + years(span) + ' of ' + years(full) + ' years' :
      'All ' + years(full) + ' years · ' + yr(w0) + '–' + yr(w1));
    bar.querySelector('[data-zoom="in"]').disabled = span <= ZOOM_MIN + 1;
    bar.querySelector('[data-zoom="out"]').disabled = !zoomed;
    bar.querySelector('[data-zoom="all"]').hidden = !zoomed;
    bar.querySelector('[data-pan="earlier"]').disabled = !zoomed || w0 <= t0 + 864e5;
    bar.querySelector('[data-pan="later"]').disabled = !zoomed || end >= t0 + full - 864e5;
    // Zoomed in on a touch screen, say the chart drags, until the first drag
    card.querySelector('[data-drag-hint]').hidden = !(zoomed && !trend.dragged && window.matchMedia && matchMedia('(pointer: coarse)').matches);
  }

  // The Top 10 line's synthetic seasons, for the note: "2018–19 to 2021–22
  // are synthetic data (modeled, not real)." ('' when none are)
  function synthSeasons(tens) {
    var ss = [];
    tens.forEach(function (x) { x.pts.forEach(function (p) { if (p.synthetic && ss.indexOf(p.season) < 0) ss.push(p.season); }); });
    if (!ss.length) return '';
    ss.sort(function (a, b) { return a - b; });
    var label = function (y) { return (y - 1) + '–' + String(y).slice(2); };
    return (ss.length === 1 ? 'The ' + label(ss[0]) + ' season is' : label(ss[0]) + ' to ' + label(ss[ss.length - 1]) + ' are') +
      ' synthetic data (modeled, not real).';
  }

  function renderTrend() {
    var card = root.querySelector('[data-trend]');
    if (!card) return;
    var selected = state.course + ' ' + Number(state.distance) + ' ' + state.stroke;
    var dated = predRaces().filter(function (r) {
      return r.date && (trend.all || (r.course === state.course && r.stroke === state.stroke));
    });
    // No races at all: no card. Races, but none in this course and stroke:
    // the card stays, its chart blank, with a note in red over it.
    var anyRaces = predRaces().some(function (r) { return r.date; });
    card.hidden = !anyRaces;
    var emptyNote = card.querySelector('[data-trend-empty]');
    emptyNote.hidden = !!dated.length || !anyRaces;
    if (card.hidden) return;
    if (!dated.length) {
      emptyNote.textContent = 'You haven\'t raced ' + state.course + ' ' + lowerStroke(state.stroke) + ' yet.';
      card.querySelector('[data-trend-svg]').innerHTML = '';
      card.querySelector('[data-trend-dots]').innerHTML = '';
      card.querySelector('[data-trend-y]').innerHTML = '';
      card.querySelector('[data-trend-axis]').innerHTML = '';
      card.querySelector('[data-zoom-bar]').hidden = true;
      card.querySelector('[data-drag-hint]').hidden = true;
      // Show All Races still offers every race
      card.querySelector('[data-trend-legend]').innerHTML = '<button type="button" class="swim-pred-link swim-trend__all" data-trend-all aria-pressed="false">Show All Races</button>';
      set('trendNote', 'Your ' + state.course + ' ' + lowerStroke(state.stroke) + ' races over time, as pace per 100 (slower is higher).');
      return;
    }
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
      e.on = !trend.hidden[e.key];
      e.selected = e.key === selected;
    });
    var shown = list.filter(function (e) { return e.on; });
    var pace = function (r) { return r.secs / (r.d / 100); };
    var when = function (r) { return new Date(r.date + 'T00:00:00').getTime(); };
    var all = [];
    shown.forEach(function (e) { all = all.concat(e.races); });

    // The legend: no pill per event (retired 2026-10-15; each turned its line
    // off and on), just what Your Event's wide, see-through line is
    var legend = card.querySelector('[data-trend-legend]');
    var selectedEvent = list.filter(function (e) { return e.selected; })[0];
    legend.innerHTML = selectedEvent && !trend.all ? '<span class="swim-trend__key swim-trend__key--static">' +
      '<span class="swim-trend__swatch swim-trend__swatch--event" style="background: ' + selectedEvent.color + '" aria-hidden="true"></span>Selected race</span>' : '';
    var svg = card.querySelector('[data-trend-svg]'), dots = card.querySelector('[data-trend-dots]');
    if (!all.length) {
      svg.innerHTML = ''; dots.innerHTML = '';
      card.querySelector('[data-trend-y]').innerHTML = '';
      card.querySelector('[data-trend-axis]').innerHTML = '';
      card.querySelector('[data-zoom-bar]').hidden = true;
      set('trendNote', 'Every line is turned off. Select an event below to show it.');
      return;
    }
    var t0 = Math.min.apply(null, all.map(when)), t1 = Math.max.apply(null, all.map(when));
    // Your goal, once typed (Race Planning's Goal): a solid deep yellow dot,
    // as Race Time Predictions', at today, so the years run to now; not with
    // every race showing (it's Your Event's)
    var goalSecs = !trend.all && !state.goalAuto && state.goal !== '' && validEntry(state.goal) ? parse(state.goal) : NaN;
    var goalT = new Date(today() + 'T00:00:00').getTime();
    var goalPace = goalSecs / (Number(state.distance) / 100);
    if (isFinite(goalPace)) t1 = Math.max(t1, goalT);
    // The years shown: every race to start with, zoomed down to five; a new
    // course or stroke starts over
    var z = trend.zoom, zkey = state.course + ' ' + state.stroke + (trend.all ? ' all' : '');
    if (z.key !== zkey) { z.key = zkey; z.span = null; z.end = null; }
    var full = t1 - t0, canZoom = full > ZOOM_MIN;
    var span = canZoom && z.span ? Math.min(full, Math.max(ZOOM_MIN, z.span)) : full;
    var end = z.end == null ? t1 : Math.min(t1, Math.max(t0 + span, z.end));
    var w0 = end - span, w1 = end, zoomed = span < full - 1;
    z.range = { t0: t0, t1: t1, span: span, end: end };
    var inWin = function (t) { return t >= w0 - 864e5 && t <= w1 + 864e5; };
    // Your Event's Top 10 line: 10th place in your age group each season
    // within the chart's years, where those rankings are loaded
    var seasons = {};
    (AVAILABLE || []).forEach(function (x) { seasons[x.season] = 1; });
    // (not with every race showing: courses and strokes mixed, it isn't
    // any one event's)
    var tens = trend.all || trend.hidden.top10 || !swimmerGender() ? [] : shown.filter(function (e) { return e.selected; }).map(function (e) {
      var pts = Object.keys(seasons).map(Number).sort().map(function (season) {
        var at = season + '-05-31', t = new Date(at + 'T00:00:00').getTime(), age = ageOn(at);
        if (t < t0 || t > t1 || age == null) return null;
        var g = groupOf(age), r = g && groupRank(e.course, e.stroke, e.d, g, season);
        return r ? { t: t, pace: topTen(r) / (e.d / 100), fast: r.times[0] / (e.d / 100), season: season, synthetic: r.synthetic } : null;
      }).filter(Boolean);
      return { e: e, pts: pts };
    }).filter(function (x) { return x.pts.length; });
    if (!trend.all && (tens.length || trend.hidden.top10)) {
      legend.insertAdjacentHTML('beforeend', '<button type="button" class="swim-trend__key" data-trend-line="top10" aria-pressed="' + !trend.hidden.top10 + '">' +
        '<span class="swim-trend__swatch swim-trend__swatch--top10"></span>Top 10 (1st–10th place)</button>');
    }
    // The ▲ key: not a toggle, just what the mark means
    legend.insertAdjacentHTML('beforeend', '<span class="swim-trend__key swim-trend__key--static"><span class="swim-trend__swatch swim-trend__swatch--best" aria-hidden="true"></span>Personal Best</span>');
    if (isFinite(goalPace)) legend.insertAdjacentHTML('beforeend', '<span class="swim-trend__key swim-trend__key--static"><span class="swim-trend__swatch swim-pred-swatch--goal" aria-hidden="true"></span>Your goal</span>');
    // Every race on the chart, or back to Your Event's course and stroke
    legend.insertAdjacentHTML('beforeend', '<button type="button" class="swim-pred-link swim-trend__all" data-trend-all aria-pressed="' + trend.all + '">' +
      (trend.all ? 'Show ' + state.course + ' ' + state.stroke + ' Only' : 'Show All Races') + '</button>');
    // The pace scale fits the races in view (all of them if none are)
    var seen = all.filter(function (r) { return inWin(when(r)); });
    var paces = (seen.length ? seen : all).map(pace);
    tens.forEach(function (x) { x.pts.forEach(function (p) { if (inWin(p.t)) paces.push(p.pace, p.fast); }); });
    if (isFinite(goalPace) && inWin(goalT)) paces.push(goalPace);
    var fastest = Math.min.apply(null, paces);
    var scale = paceScale(fastest, Math.max.apply(null, paces), fastest);
    // With every race showing, courses mix yards and meters: no unit
    var unit = trend.all ? '' : ' ' + COURSES[state.course].unit;
    // Times along 4–96%, so labels on the first and last races aren't cut off
    var xAt = function (t) { return w1 > w0 ? 4 + (t - w0) / (w1 - w0) * 92 : 50; };
    var x = function (r) { return xAt(when(r)); };
    var y = function (r) { return scale.y(pace(r)); };
    var labels = shown.filter(function (e) { return e.selected; }).reduce(function (n, e) {
      return n + e.races.filter(function (r) { return inWin(when(r)); }).length;
    }, 0) <= LABEL_LIMIT;
    // Zoomed in, lines run on past the edges and are cut there
    svg.style.clipPath = zoomed ? 'inset(-40px 3.5% -40px 3.5%)' : '';
    // The age group's Top 10 each season: the fastest swim (1st place, a
    // solid grey line) and 10th place (a lighter dashed one), behind your races
    var at = function (p, k) { return xAt(p.t).toFixed(2) + ',' + scale.y(p[k]).toFixed(1); };
    svg.innerHTML = tens.map(function (t) {
      var ten = t.pts.map(function (p) { return at(p, 'pace'); }), fast = t.pts.map(function (p) { return at(p, 'fast'); });
      return '<polyline class="swim-trend__line swim-trend__line--fastest" points="' + fast.join(' ') + '"></polyline>' +
        '<polyline class="swim-trend__line swim-trend__line--top10" points="' + ten.join(' ') + '"></polyline>';
    }).join('') + (function () {
      // From Your Event's latest race to your goal: a light grey dashed line
      var ev = shown.filter(function (e) { return e.selected; })[0];
      if (!ev || !isFinite(goalPace) || !inWin(goalT)) return '';
      var last = ev.races[ev.races.length - 1];
      return '<line class="swim-trend__line swim-trend__line--to-goal" x1="' + x(last).toFixed(2) + '" y1="' + y(last).toFixed(1) +
        '" x2="' + xAt(goalT).toFixed(2) + '" y2="' + scale.y(goalPace).toFixed(1) + '"></line>';
    })() + shown.map(function (e) {
      return '<polyline class="swim-trend__line' + (e.selected ? ' is-event' : ' is-other') + '" style="stroke: ' + e.color + '" points="' + e.races.map(function (r) {
        return x(r).toFixed(2) + ',' + y(r).toFixed(1);
      }).join(' ') + '"></polyline>';
    }).join('');
    dots.innerHTML = shown.map(function (e) {
      return e.races.filter(function (r) { return inWin(when(r)); }).map(function (r) {
        var at = 'left: ' + x(r).toFixed(2) + '%; top: ' + y(r).toFixed(1) + '%', isBest = r.secs === e.best;
        return '<span class="swim-trend__dot' + (isBest ? ' is-best' : '') + (e.selected ? '' : ' is-other') + '" style="' + at + '; border-color: ' + e.color + '; background: ' + e.color + '" title="' +
          e.course + ' ' + e.d + ' ' + e.stroke + ' · ' + formatDate(r.date) + ' · ' + race(r.secs) + (isBest ? ' (best)' : '') + '"></span>' +
          ((labels && e.selected) || isBest ? '<span class="swim-trend__label' + (e.selected ? ' is-below' : ' is-other') + '" style="' + at + '; color: ' + e.color + '">' + race(r.secs) + '</span>' : '');
      }).join('');
    }).join('') + (isFinite(goalPace) && inWin(goalT) ? '<span class="swim-pred__dot is-goal" style="left: ' + xAt(goalT).toFixed(2) + '%; top: ' +
      scale.y(goalPace).toFixed(1) + '%" title="Your goal: ' + race(goalSecs) + ' in the ' + state.distance + ' ' + lowerStroke(state.stroke) + '"></span>' : '');
    // Axes: pace up the side (its unit above), years along the bottom
    card.querySelector('[data-trend-y]').innerHTML = '<span class="swim-trend__unit">per 100' + unit + '</span>' + scale.html;
    var y0 = new Date(w0).getFullYear(), y1 = new Date(w1).getFullYear(), ticks = [], ystep = Math.max(1, Math.ceil((y1 - y0) / 6));
    for (var yr = y0; yr <= y1; yr += ystep) ticks.push(yr);
    // The last year too, unless it would crowd the tick before it
    if (ticks[ticks.length - 1] !== y1) {
      if (y1 - ticks[ticks.length - 1] < ystep / 2 && ticks.length > 1) ticks.pop();
      ticks.push(y1);
    }
    // A year that starts before the view is pinned to its left edge; dropped
    // if that crowds the next year's label
    var tickAt = ticks.map(function (yr) { return xAt(Math.max(w0, new Date(yr, 0, 1).getTime())); });
    card.querySelector('[data-trend-axis]').innerHTML = ticks.map(function (yr, i) {
      if (i === 0 && ticks.length > 1 && tickAt[1] - tickAt[0] < 8) return '';
      return '<span style="left: ' + tickAt[i].toFixed(1) + '%">' + yr + '</span>';
    }).join('');
    renderZoom(card, canZoom, zoomed, full, span, end, t0, w0, w1);
    setWithSynth('trendNote', (trend.all ? 'Every race' : 'Your ' + state.course + ' ' + lowerStroke(state.stroke) + ' races') +
      ' over time, as pace per 100 (slower is higher). Each dot is a race' +
      (labels ? '; the ' + state.distance + '\'s are labelled with their time and the others show it on hover' : ', with its time on hover') +
      '. The solid ▲ marks each event\'s best.' +
      (tens.length ? ' The grey lines are your age group\'s Top 10 each season: the fastest swim (solid) and 10th place (dashed), from USMS event rankings.' : ''), synthSeasons(tens));
    svg.setAttribute('aria-label', shown.map(function (e) {
      return e.course + ' ' + e.d + ' ' + e.stroke + ': ' + e.races.length + (e.races.length === 1 ? ' race' : ' races') + ', best ' + race(e.best) +
        ', from ' + race(e.races[0].secs) + ' in ' + e.races[0].date.slice(0, 4) + ' to ' + race(e.races[e.races.length - 1].secs) + ' in ' + e.races[e.races.length - 1].date.slice(0, 4);
    }).join('; '));
  }

  // The Add a Race form
  function renderNewRace() {
    var t = state.newRace, list = eventsFor(t.course, t.stroke);
    var modal = document.getElementById('swimDeckRace');
    if (!modal) return; // Add a Race is retired for now (Editors.njk)
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
    // Just after a guest confirms Swimmer Info, with nothing typed yet, both
    // fields are outlined in red to show where to go next, until something's
    // typed in either
    if (typed) state.convNeedsTime = false;
    var waiting = !!state.convNeedsTime;
    markTimeField(root.querySelector('[data-time-conv="time"]'), (byPace || ok) && !waiting);
    markTimeField(root.querySelector('[data-time-conv="pace"]'), (!byPace || ok) && !waiting);
    // Only an error here; an empty field's prompt is its red outline
    set('convHint', !ok ? (byPace ? 'Pace' : 'Time') + ': seconds must be under 60.' : '');

    // Course Conversion: a time as the matching event's time in each course;
    // a pace as the pace per 100 in each course
    var name = c.distance + ' ' + c.stroke;
    set('courseConvSubtitle', byPace ? 'Pace per 100 | ' + c.course + (isFinite(pace) ? ' | ' + clock(pace) : '')
      : name + ' | ' + c.course + (isFinite(secs) ? ' | ' + race(secs) : ''));
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

    set('ageSubtitle', name + ' | ' + c.course + (isFinite(secs) ? ' | ' + race(secs) : ''));
    // No time yet: a prompt over the empty rows; for a guest (the header's
    // Age Group and Competition Category showing), to set those first
    var prompt = root.querySelector('[data-st-age-prompt]');
    // until both are picked (a logged-in swimmer missing either has the same fields)
    var guest = (!root.querySelector('[data-st-age-group-field]').hidden || !root.querySelector('[data-st-sex-field]').hidden) &&
      !(state.ageChosen && state.sexChosen);
    prompt.hidden = isFinite(secs);
    // A guest's: a button opening Swimmer Info (swimDeckWho)
    if (guest) {
      if (!prompt.querySelector('[data-modal-target]')) {
        prompt.innerHTML = '<button type="button" class="btn btn-lg btn-primary swim-ages__set" data-modal-target="#swimDeckWho"' +
          ' aria-label="Start here: enter your age group and competition category">Start Here</button>';
      }
    } else prompt.textContent = 'Enter a time or a pace above.';
    renderAges(age, secs);
    // Centred on the middle row (the 55–59 of seven), not the list's middle
    var rows = root.querySelectorAll('[data-st-age-rows] > li'), mid = rows[Math.floor(rows.length / 2)];
    prompt.style.top = mid ? (mid.offsetTop + mid.offsetHeight / 2) + 'px' : '';
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
    set('rankSubtitle', c.distance + ' ' + c.stroke + ' | ' + c.course);
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

  // Your workout log: yours alone, kept in this browser per persona, shown
  // only to you, and used only for your own estimates (Training Effect's
  // typical swim). Never mixed with race results.
  var LOG_KEY = 'swimTools.log.' + SWIMMER;
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
    set('logHrZone', w && w.hrZone ? 'Zone ' + w.hrZone + ', ' + HR_ZONE_WORDS[w.hrZone] : '');
    document.querySelector('[data-st-log-hr-zone]').hidden = !(w && w.hrZone);
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
      pace: clock(w.pace), stroke: w.stroke, calories: w.calories, effort: w.effort ? Number(w.effort) : null,
      hrZone: w.hrZone ? Number(w.hrZone) : null
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
  // Sample workouts for the demo swimmer, Jay Place (KT2JH), when he's
  // logged in: 19 pool swims from a real Garmin export (May to Sep 2020),
  // kept in order with their yards and moving times (Garmin's Time includes
  // rest), but re-dated three a week (Mon, Wed, Sat) back from today so
  // he's always a current, active swimmer and they never go stale. Course
  // SCY (the export has no pool length); stroke and effort weren't
  // recorded. Synthetic: flagged, never shown as races, used only for his
  // own estimates.
  var SAMPLE_LOG_SWIMMER = 'KT2JH';
  var SAMPLE_DAYS = [0, 2, 5]; // weekdays, 0 Monday
  // [yards, time], oldest first
  var SAMPLE_SWIMS = [
    [1700, '31:03.00'], [1700, '31:21.00'], [1750, '31:32.00'], [2050, '38:03.00'], [1100, '19:10.00'], [1350, '24:42.00'],
    [600, '10:06.00'], [1100, '20:38.00'], [775, '16:23.00'], [1100, '21:51.00'], [575, '10:31.00'], [1000, '19:10.00'],
    [1900, '37:47.00'], [1200, '20:01.00'], [2200, '41:35.00'], [1900, '39:32.00'], [1000, '19:52.00'], [450, '8:37.20'],
    [1650, '31:18.00']
  ];
  function sampleLog() {
    var user = USERS[SWIMMER] || {};
    if (SWIMMER !== SAMPLE_LOG_SWIMMER || !user.loggedIn) return [];
    // The swim days on or before today, newest first, one per sample swim
    var now = new Date(), days = [];
    for (var back = 0; days.length < SAMPLE_SWIMS.length; back++) {
      var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back);
      if (SAMPLE_DAYS.indexOf((day.getDay() + 6) % 7) !== -1) days.push(day);
    }
    return SAMPLE_SWIMS.map(function (x, i) {
      var day = days[SAMPLE_SWIMS.length - 1 - i];
      return {
        date: day.getFullYear() + '-' + ('0' + (day.getMonth() + 1)).slice(-2) + '-' + ('0' + day.getDate()).slice(-2),
        course: 'SCY', distance: x[0], time: x[1], stroke: '', effort: null, synthetic: true
      };
    });
  }

  // Your logged swims, with the demo swimmer's sample workouts
  function loggedSwims() {
    var log = [];
    try { log = JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch (e) {}
    return log.concat(sampleLog());
  }

  function typicalLoad() {
    var log = loggedSwims();
    var samples = log.filter(function (e) { return e.synthetic; });
    var now = new Date(), from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - TE_DAYS);
    var since = from.getFullYear() + '-' + ('0' + (from.getMonth() + 1)).slice(-2) + '-' + ('0' + from.getDate()).slice(-2);
    var thresholds = {};
    var loads = log.filter(function (e) { return e.date > since && e.date <= today(); }).map(function (e) {
      if (!thresholds[e.course]) thresholds[e.course] = thresholdPace(e.course).pace;
      return swimLoad(Number(e.distance), parse(e.time), e.stroke, thresholds[e.course]).load;
    }).filter(isFinite);
    return loads.length ? { load: loads.reduce(function (a, b) { return a + b; }, 0) / loads.length, swims: loads.length, sample: samples.length > 0 } : { load: TE_BASE, swims: 0 };
  }

  // ---------- Training status (summary band) ----------

  // Your training status from your log: the last 7 days' yards against
  // your weekly average over the last 6 weeks (TE_DAYS), averaged over the
  // weeks you've been logging when that's fewer. Meters count as yards
  // (× 1.0936). Sample math, not a published formula.
  //   ratio ≥ 1.5   Overreaching, with a caution
  //         ≥ 1.15  Building
  //         ≥ 0.8   Maintaining
  //         > 0     Recovering (a lighter week)
  //         0       Detraining (nothing in the last 7 days)
  // Nothing logged in 6 weeks: no status, and the summary band shows its
  // secondary cards (age-up, comeback) instead. Returns whether it showed.
  var STATUS_WEEKS = TE_DAYS / 7;
  var STATUS_BANDS = [[1.5, 'Overreaching'], [1.15, 'Building'], [0.8, 'Maintaining'], [0.0001, 'Recovering'], [0, 'Detraining']];
  function renderStatus() {
    var card = root.querySelector('[data-status-card]');
    var now = new Date(today() + 'T00:00:00');
    var daysAgo = function (iso) { return Math.round((now - new Date(iso + 'T00:00:00')) / 86400000); };
    var swims = loggedSwims().map(function (e) {
      var d = Number(e.distance);
      return { ago: daysAgo(e.date), yards: e.course === 'SCY' ? d : d * 1.0936, synthetic: e.synthetic };
    }).filter(function (e) { return e.ago >= 0 && e.ago < TE_DAYS && isFinite(e.yards) && e.yards > 0; });
    card.hidden = !swims.length;
    if (!swims.length) return false;

    // Weekly yards, rolling 7-day weeks back from today (0: the last 7 days)
    var weeks = [];
    for (var w = 0; w < STATUS_WEEKS; w++) weeks.push(0);
    swims.forEach(function (e) { weeks[Math.floor(e.ago / 7)] += e.yards; });
    var logging = Math.min(STATUS_WEEKS, Math.floor(Math.max.apply(null, swims.map(function (e) { return e.ago; })) / 7) + 1);
    var total = weeks.reduce(function (a, b) { return a + b; }, 0);
    var avg = total / logging, ratio = weeks[0] / avg;
    var word = STATUS_BANDS.filter(function (b) { return ratio >= b[0]; })[0][1];
    var last = Math.min.apply(null, swims.map(function (e) { return e.ago; }));
    var yd = function (n) { return Math.round(n).toLocaleString('en-US'); };

    set('statusTitle', word);
    set('statusWeek', yd(weeks[0]));
    set('statusAvg', yd(avg));
    set('statusSwims', String(swims.length));
    set('statusText', {
      Overreaching: 'About ' + ratio.toFixed(1) + ' times your usual week. Take an easy day or two, and build toward weeks like this gradually.',
      Building: 'You\'re swimming more than your usual week. Keep the increase gradual.',
      Maintaining: 'Right around your usual week. Steady training holds your fitness.',
      Recovering: 'A lighter week than usual: good for recovery, or before a meet.',
      Detraining: 'No swims in the last 7 days (your last was ' + last + ' days ago). Fitness starts to slip after a week or two off.'
    }[word]);
    set('statusFine', 'Yards logged with Add to Log' + (logging < STATUS_WEEKS ? ', averaged over the ' + logging + (logging === 1 ? ' week' : ' weeks') + ' you\'ve been logging' : '') +
      (swims.some(function (e) { return e.synthetic; }) ? ', including sample workouts' : '') + '. Sample math, not a published formula.');

    // The bars, oldest on the left
    var max = Math.max.apply(null, weeks) || 1;
    var bars = root.querySelector('[data-status-weeks]');
    bars.innerHTML = weeks.slice().reverse().map(function (y, i) {
      return '<span class="swim-weeks__bar' + (i === weeks.length - 1 ? ' is-now' : '') + '" style="height: ' + Math.max(4, y / max * 100).toFixed(1) + '%"></span>';
    }).join('');
    bars.setAttribute('aria-label', 'Yards per week, oldest first: ' + weeks.slice().reverse().map(yd).join(', '));
    return true;
  }

  // Training Effect needs a typical swim to judge against: at least
  // TE_MIN_SWIMS logged in the last 6 weeks. Until then the tile is locked:
  // a faded sample reading behind an upsell. Guests and non-members: join
  // (members log swims); members: log more, with how many so far.
  var TE_MIN_SWIMS = 5;

  function renderTraining(t, d, secs) {
    var card = document.getElementById('training-effect');
    var lock = card.querySelector('[data-te-lock]');
    var typical = typicalLoad();
    var locked = typical.swims < TE_MIN_SWIMS;
    card.classList.toggle('is-locked', locked);
    lock.hidden = !locked;
    if (locked) {
      var user = USERS[SWIMMER] || {}, member = !!(user.loggedIn && user.membershipTier);
      var left = TE_MIN_SWIMS - typical.swims;
      set('teLockTitle', member ? 'Log ' + left + (left === 1 ? ' more swim' : ' more swims') + ' to unlock' : 'See what each swim does for you');
      set('teLockText', member ?
        'Training Effect scores each swim against your own typical training from the last 6 weeks.' :
        'Members get a Training Effect for every swim, judged against their own training.');
      var dots = lock.querySelector('[data-te-lock-dots]');
      dots.hidden = !member;
      dots.innerHTML = new Array(TE_MIN_SWIMS + 1).join('.').split('').map(function (x, i) {
        return '<span class="' + (i < typical.swims ? 'is-done' : '') + '"></span>';
      }).join('') + '<em>' + typical.swims + ' of ' + TE_MIN_SWIMS + ' logged</em>';
      lock.querySelector('[data-te-lock-join]').hidden = member;
      lock.querySelector('[data-te-lock-log]').hidden = !member;
      return;
    }
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
      (typical.swims ? ' (' + typical.swims + (typical.swims === 1 ? ' logged swim' : ' logged swims') + ', last 6 weeks' + (typical.sample ? ', including sample workouts' : '') + ')' : ' (no logged swims yet: about an hour of moderate swimming)') +
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
    set('hrZoneWord', t.hrZone ? '· ' + HR_ZONE_WORDS[t.hrZone] : '(optional)');
  }

  // Heart rate zones' words, on the usual five-zone scale
  var HR_ZONE_WORDS = { 1: 'Recovery', 2: 'Endurance', 3: 'Tempo', 4: 'Threshold', 5: 'Max' };

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

  // Training Pace: this workout's pace, or your all-time average (every
  // logged swim in the same course, sample workouts included: their total
  // time over their total distance), with a line saying which and a link
  // to the other
  var paceView = 'swim';
  function renderPaceView(t, pace, unit) {
    var note = root.querySelector('[data-pace-note]');
    if (!note) return;
    var link = function (view, text) {
      return '<button type="button" class="swim-pace__link" data-pace-view="' + view + '">' + text + '</button>';
    };
    if (paceView === 'swim') {
      set('paceValue', clock(pace));
      set('paceUnit', '/100 ' + unit);
      note.innerHTML = '<em>Showing pace for this workout.</em> Want to see your ' + link('avg', 'all-time average') + '?';
      return;
    }
    var swims = loggedSwims().filter(function (e) {
      return e.course === t.course && isFinite(parse(e.time)) && Number(e.distance) > 0 && e.date <= today();
    });
    var secs = swims.reduce(function (a, e) { return a + parse(e.time); }, 0);
    var dist = swims.reduce(function (a, e) { return a + Number(e.distance); }, 0);
    var avg = dist ? secs / dist * 100 : NaN;
    set('paceValue', clock(avg));
    set('paceUnit', isFinite(avg) ? '/100 ' + unit : '');
    note.innerHTML = '<em>' + (swims.length ? 'Showing your all-time average, ' + swims.length + ' logged ' + t.course + (swims.length === 1 ? ' swim' : ' swims') + '.' :
      'No ' + t.course + ' swims logged yet.') + '</em> Back to ' + link('swim', 'this workout') + '.';
  }

  root.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-pace-view]');
    if (!btn) return;
    paceView = btn.getAttribute('data-pace-view');
    renderMetrics();
    var again = root.querySelector('[data-pace-view]');
    if (again) again.focus();
  });

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

    renderPaceView(t, pace, unit);

    // Calories: pace in yards terms sets the intensity, capped to a sane range,
    // then your Effort rating adjusts it for how hard you were working
    var intensity = Math.min(1.4, Math.max(0.7, REF_PACE / (pace / course.factor)));
    var perMin = CAL_PER_MIN * STROKE_BURN[t.stroke] * intensity * effortFactor(t.effort);
    var calories = Math.round(perMin * secs / 60);
    set('calValue', isFinite(calories) ? String(calories) : '—');
    set('calNote', [STROKE_FULL[t.stroke], t.effort && '@ ' + t.effort + '/10'].filter(Boolean).join(' '));

    renderTraining(t, d, secs);
    renderFelt(t);

    // The workout as it stands, for Add to Log
    metricsNow = { course: t.course, unit: unit, distance: d, secs: secs, pace: pace, stroke: t.stroke, calories: calories, effort: t.effort, hrZone: t.hrZone };

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
    renderTrend();
    renderNewRace();
    // A guest's Age Group says "Age" until they pick one (the tools still
    // use the default 45-49 meanwhile)
    set('ageGroupLabel', state.guest && !state.ageChosen ? 'Age' : ageGroup().label);
    // The header's pill, when we know your age: sex (yours, or the Sex
    // choice) and age group
    if (state.ageKnown) set('who', [ageGroup().label, CATEGORY_NAMES[swimmerGender()]].filter(Boolean).join(' '));
    var rows = renderPredictor(list);
    var goalRow = rows.filter(function (r) { return r.d === Number(state.distance); })[0];
    // Your Event's time until you set a goal: your best, else your
    // projected time, else your age group's median
    var eventTime = isFinite(goalRow.est) ? goalRow.est : goalRow.mid;
    // A guest's time: the age-group median, shown in the Time boxes until
    // they type their own
    if (state.goalAuto) state.goal = isFinite(goalRow.mid) ? race(goalRow.mid) : '';
    var goalSet = state.goal !== '' && validEntry(state.goal);
    // The summary's goal ("break 30"): Your Event's goal until you type one
    var suggested = renderSummary(goalRow);
    // Top 10 by Decade, with your goal across it when it shows Your Event
    renderTopTens(goalSet ? parse(state.goal) : NaN);

    // Splits: Your Event, toward its goal time (the Your Event panel's Goal;
    // until you set one, the summary's suggested goal, else the event's
    // time, shown as the Goal placeholders).
    var distance = Number(state.distance);
    fitInterval(distance);
    var goalTyped = state.goal !== '' && !state.goalAuto;
    var goalOk = state.goal === '' || validEntry(state.goal);
    // The summary's goal unless you typed one: "break 30", or with no races
    // in the event, the age-group median
    var suggestedGoal = suggested.kind !== 'set' && isFinite(suggested.secs);
    var untyped = suggestedGoal ? suggested.secs : eventTime;
    var untypedName = !suggestedGoal ? null : suggested.kind === 'break' ? 'suggested goal' : ageGroup().label + ' median';
    var goal = goalTyped ? (goalOk ? parse(state.goal) : NaN) : untyped;
    renderSplits(goal, distance);
    renderPractice(goal, distance);
    // Rank and Tier: the same time, named by where it came from
    // (a prediction from the median, with no races, is the median)
    var projectedTime = isFinite(goalRow.proj) && !goalRow.fromTime;
    renderTier(goal, goalTyped ? 'goal' : untypedName || (isFinite(goalRow.you) ? 'best' : projectedTime ? 'projected time' : ageGroup().label + ' median'));
    // Toward the age-group median: just whose median ("50 Free | 45–49
    // Men's/Open"); otherwise the time and what it is
    var toMedian = !goalTyped && (untypedName ? suggested.kind !== 'break' : !isFinite(goalRow.you) && !projectedTime);
    set('splitsSubtitle', state.distance + ' ' + state.stroke + (toMedian ?
      ' | ' + ageGroup().label + (CATEGORY_NAMES[swimmerGender()] ? ' ' + CATEGORY_NAMES[swimmerGender()] : '') :
      (goalTyped ? ' · goal ' : untypedName ? ' · ' + untypedName + ' ' : isFinite(goalRow.you) ? ' · your best ' : ' · your projected time ') + race(goal)));
    var goalField = document.querySelector('[data-time-input="goal"]');
    setTimePlaceholders(goalField, untyped);
    // Beside the Goal field: Set this goal (the suggestion in its boxes, or a
    // guest's median), or Edit this goal once one's set
    state.goalSuggestion = state.goalAuto ? parse(state.goal) : untyped;
    var goalSet = root.querySelector('[data-goal-set]');
    goalSet.hidden = !goalTyped && !isFinite(state.goalSuggestion);
    goalSet.textContent = goalTyped ? 'Edit this goal' : 'Set this goal';
    markTimeField(goalField, goalOk);
    set('goalHint', goalOk ? '' : 'Goal: seconds must be under 60.');

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

    // A guest's Age Group and Competition Category: grey until picked
    root.querySelector('[data-st-age-group-field]').classList.toggle('is-unset', !!state.guest && !state.ageChosen);
    root.querySelector('[data-st-sex-field]').classList.toggle('is-unset', !!state.guest && !state.sexChosen);

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
    // A guest's Competition Category before they pick: neither pressed
    // (the rankings still use Men's/Open until then)
    if (state.guest && !state.sexChosen) {
      root.querySelectorAll('[data-control="sex"] [data-value]').forEach(function (btn) { btn.setAttribute('aria-pressed', 'false'); });
    }
    root.querySelectorAll('[data-view-panel]').forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-view-panel') !== state.view;
    });
    balanceRacePlanning();
  }

  // ---------- Race Planning's column heights ----------

  // Race Planning's two columns (Predictions over Your Races; Race Splits
  // over Rank and Tier) end level on desktop, with real content rather than
  // empty space where possible. Measured with the cards at their natural
  // heights, then:
  //   right taller  more Your Races rows, then a shorter splits window
  //   left taller   a taller splits window (if it scrolls), then fewer
  //                 Your Races rows (not under RACES_MIN)
  // Whatever's left (under a row) the last card in the shorter column
  // takes up, stretched (.swim-deck__grid--balance). Side by side only,
  // and not while Your Races shows all.
  var RACES_MIN = 3;
  var SPLITS_MIN_ROWS = 5;
  var balanceGrid = root.querySelector('.swim-deck__grid--balance');

  function balanceRacePlanning() {
    if (!balanceGrid) return;
    var cells = balanceGrid.querySelectorAll(':scope > .swim-deck__cell--stack');
    var left = cells[0], right = cells[1];
    var splits = right.querySelector('[data-st-split-rows]');
    balanceGrid.classList.add('is-measuring');
    splits.style.maxHeight = '';
    var before = racesShown;
    racesShown = 0;
    var sideBySide = left.offsetTop === right.offsetTop && left.offsetParent;
    if (!sideBySide || state.racesExpanded) {
      if (before) renderRaces();
      balanceGrid.classList.remove('is-measuring');
      return;
    }
    renderRaces();
    var colHeight = function (cell) {
      var kids = Array.prototype.filter.call(cell.children, function (c) { return c.offsetParent; });
      var gap = parseFloat(getComputedStyle(cell).rowGap) || 0;
      return kids.reduce(function (h, c) { return h + c.offsetHeight; }, 0) + gap * Math.max(0, kids.length - 1);
    };
    var rows = left.querySelectorAll('.swim-races__row');
    var total = state.races.filter(function (r) { return isFinite(parse(r.time)); }).length;
    var rowH = rows.length ? rows[0].offsetHeight : 0;
    var shown = rows.length;
    var view = splits.clientHeight, content = splits.scrollHeight;
    var splitRow = splits.firstElementChild ? splits.firstElementChild.offsetHeight : 0;
    var floor = Math.min(content, splitRow * SPLITS_MIN_ROWS);
    var diff = colHeight(right) - colHeight(left); // > 0: right taller
    if (diff > 0 && rowH) {
      var add = Math.min(Math.floor(diff / rowH), total - shown);
      shown += add;
      diff -= add * rowH;
    }
    if (diff > 0 && content > view && view > floor) {
      splits.style.maxHeight = (view - Math.min(diff, view - floor)) + 'px';
    } else if (diff < 0) {
      if (content > view) {
        var grow = Math.min(-diff, content - view);
        splits.style.maxHeight = (view + grow) + 'px';
        diff += grow;
      }
      if (diff < 0 && rowH) shown -= Math.min(Math.floor(-diff / rowH), Math.max(0, shown - RACES_MIN));
    }
    if (shown !== rows.length) {
      racesShown = shown;
      renderRaces();
    }
    balanceGrid.classList.remove('is-measuring');
  }

  // Again when the layout changes width (columns stack on phones), and once
  // the web fonts have settled the text heights
  var balanceFrame = 0, balanceWidth = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth === balanceWidth) return; // a phone's toolbar
    balanceWidth = window.innerWidth;
    cancelAnimationFrame(balanceFrame);
    balanceFrame = requestAnimationFrame(balanceRacePlanning);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(balanceRacePlanning);

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
    if (target === state && key === 'sex') state.sexChosen = true;
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
    if (key) {
      state[key] = el.value;
      if (key === 'ageGroup') state.ageChosen = true;
    }
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

  // Up/Down arrows, or the wheel or a vertical swipe while a box is
  // focused, step it by one. Seconds carry into minutes like a clock: down
  // from 00 is 59 with a minute off, up from 59 is 00 with a minute on; at
  // 0:00, down does nothing. Minutes stop at 0 and 59; hundredths wrap
  // 0-99. Stepping a field that only shows placeholders (e.g. the event's
  // time) starts from them.
  var PART_MAX = { m: 59, s: 59, h: 99 };

  function stepTimePart(el, dir) {
    var group = el.closest('[data-time-field]');
    var parts = group.querySelectorAll('[data-time-part]');
    var empty = Array.prototype.every.call(parts, function (p) { return p.value === ''; });
    if (empty) {
      parts.forEach(function (p) { if (/^\d+$/.test(p.placeholder)) p.value = p.placeholder; });
    }
    var part = el.getAttribute('data-time-part'), v = (Number(el.value) || 0) + dir;
    if (part === 's' && (v < 0 || v > PART_MAX.s)) {
      var m = timeParts(group).m, mins = (Number(m.value) || 0) + (v < 0 ? -1 : 1);
      if (mins < 0 || mins > PART_MAX.m) { el.select(); return; } // 0:00 (or 59:59): nothing
      m.value = String(mins);
      v = v < 0 ? PART_MAX.s : 0;
    } else if (part === 'm') {
      v = Math.max(0, Math.min(PART_MAX.m, v));
    } else {
      v = (v + PART_MAX[part] + 1) % (PART_MAX[part] + 1);
    }
    el.value = part === 'm' ? String(v) : ('0' + v).slice(-2);
    writeTimeField(group);
    el.select();
  }

  // A vertical swipe on the focused box: up adds, down subtracts, one step
  // per 24px of travel, and the page doesn't scroll meanwhile
  var swipeY = null;

  document.addEventListener('touchstart', function (e) {
    var el = e.target;
    swipeY = el.hasAttribute && el.hasAttribute('data-time-part') && el === document.activeElement && e.touches.length === 1
      ? e.touches[0].clientY : null;
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (swipeY === null || e.target !== document.activeElement) return;
    e.preventDefault();
    var dy = e.touches[0].clientY - swipeY;
    if (Math.abs(dy) < 24) return;
    stepTimePart(e.target, dy < 0 ? 1 : -1);
    swipeY = e.touches[0].clientY;
  }, { passive: false });

  document.addEventListener('touchend', function () { swipeY = null; });

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
      if (trigger.tagName === 'A') e.preventDefault(); // e.g. "add a race" in the summary: no jump
      opener = trigger;
      if (trigger.getAttribute('data-modal-target') === '#swimDeckRace') {
        resetNewRace();
        render();
      }
      if (trigger.getAttribute('data-modal-target') === '#swimDeckLog') prepareLog();
      if (trigger.getAttribute('data-modal-target') === '#swimDeckWho') prepareWho();
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

  // Swimmer Info modal (a guest's age group and competition category):
  // starts from what they've picked in the header, if anything, and applies
  // on Confirm, the same as picking both there
  var who = { age: '', sex: '' };

  function renderWho() {
    var modal = document.getElementById('swimDeckWho');
    if (!modal) return;
    var sel = modal.querySelector('[data-who-age]');
    sel.value = who.age;
    set('whoAge', sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : 'Select');
    modal.querySelector('.swim-deck__field').classList.toggle('is-unset', !who.age);
    modal.querySelectorAll('[data-who-sex] [data-value]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-value') === who.sex));
    });
    // Confirm waits for both
    modal.querySelector('[data-who-set]').disabled = !(who.age && who.sex);
  }

  function prepareWho() {
    who.age = state.ageChosen ? String(state.ageGroup) : '';
    who.sex = state.sexChosen ? state.sex : '';
    renderWho();
  }

  document.addEventListener('change', function (e) {
    if (!e.target.closest('[data-who-age]')) return;
    who.age = e.target.value;
    renderWho();
  });

  document.addEventListener('click', function (e) {
    var sex = e.target.closest('[data-who-sex] [data-value]');
    if (sex) {
      who.sex = sex.getAttribute('data-value');
      renderWho();
      return;
    }
    if (!e.target.closest('[data-who-set]') || !who.age || !who.sex) return;
    state.ageGroup = who.age; state.ageChosen = true;
    state.sex = who.sex; state.sexChosen = true;
    state.convNeedsTime = true; // Convert a Time's fields, outlined in red next
    close(document.getElementById('swimDeckWho'));
    render();
  });

  // Set this goal / Edit this goal, beside Race Planning's Goal
  root.addEventListener('click', function (e) {
    if (!e.target.closest('[data-goal-set]')) return;
    var typed = state.goal !== '' && !state.goalAuto;
    if (!typed && isFinite(state.goalSuggestion)) {
      state.goal = race(state.goalSuggestion);
      state.goalAuto = false;
      render();
      return;
    }
    var minutes = root.querySelector('[data-time-input="goal"] [data-time-part="m"]');
    if (minutes) minutes.focus();
  });

  // Summary: share the goal card, and Add goal / Edit goal (to Race Planning's Goal)
  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-goal-share]')) {
      var text = state.summaryShare || '';
      var done = function (msg) { set('goalShareNote', msg); };
      if (navigator.share) navigator.share({ title: 'Swim Tools', text: text }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { done('Copied: ' + text); }, function () { done(text); });
      else done(text);
      return;
    }
    if (e.target.closest('[data-goal-change]')) {
      e.preventDefault();
      var box = root.querySelector('[data-time-input="goal"] [data-time-part="m"]');
      document.getElementById('race-planning').scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (box) setTimeout(function () { box.focus(); }, 400);
    }
  });

  // Your races: add (Add a Race modal), and show all or fewer
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-races-toggle]')) {
      state.racesExpanded = !state.racesExpanded;
      render();
      return;
    }
    if (e.target.closest('[data-save-log]')) {
      saveLog();
      render(); // the summary's training status
      return;
    }
    if (e.target.closest('[data-add-race]')) {
      addRace();
      return;
    }
  });

  // Race History chart: legend pills, Show All Races, zoom and pan. A line
  // or all races can change the columns' heights, so those re-render all.
  root.addEventListener('click', function (e) {
    var t = e.target;
    var line = t.closest('[data-trend-line]');
    if (line) {
      var lk = line.getAttribute('data-trend-line');
      trend.hidden[lk] = !trend.hidden[lk];
      render();
      return;
    }
    if (t.closest('[data-trend-all]')) {
      trend.all = !trend.all;
      render();
      return;
    }
    // Zoom the years, keeping the middle of the view
    var zb = t.closest('[data-zoom]'), zr = trend.zoom.range;
    if (zb && zr) {
      var mid = zr.end - zr.span / 2, how = zb.getAttribute('data-zoom');
      if (how === 'all') { trend.zoom.span = null; trend.zoom.end = null; }
      else {
        var ns = how === 'in' ? Math.max(ZOOM_MIN, zr.span * ZOOM_STEP) : Math.min(zr.t1 - zr.t0, zr.span / ZOOM_STEP);
        trend.zoom.span = ns >= zr.t1 - zr.t0 - 1 ? null : ns;
        trend.zoom.end = trend.zoom.span ? mid + ns / 2 : null;
      }
      renderTrend();
      return;
    }
    // Move the zoomed years half a view earlier or later
    var pb = t.closest('[data-pan]');
    if (pb && zr && trend.zoom.span) {
      var by = zr.span / 2 * (pb.getAttribute('data-pan') === 'earlier' ? -1 : 1);
      trend.zoom.end = Math.min(zr.t1, Math.max(zr.t0 + zr.span, zr.end + by));
      renderTrend();
    }
  });

  // Drag the zoomed chart sideways (mouse or touch) to move through the
  // years; ‹ › do the same without dragging
  (function dragToPan() {
    var chart = root.querySelector('.swim-trend__chart'), drag = null, frame = 0;
    if (!chart) return;
    chart.addEventListener('pointerdown', function (e) {
      var zr = trend.zoom.range;
      if (!zr || !trend.zoom.span || (e.pointerType === 'mouse' && e.button !== 0)) return;
      drag = { x: e.clientX, end: zr.end, perPx: zr.span / (chart.clientWidth * 0.92), id: e.pointerId };
      chart.setPointerCapture(e.pointerId);
      chart.classList.add('is-dragging');
    });
    chart.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var zr = trend.zoom.range, dx = e.clientX - drag.x;
      if (Math.abs(dx) > 3) trend.dragged = true;
      trend.zoom.end = Math.min(zr.t1, Math.max(zr.t0 + zr.span, drag.end - dx * drag.perPx));
      if (!frame) frame = requestAnimationFrame(function () { frame = 0; renderTrend(); });
    });
    var stop = function () {
      if (!drag) return;
      drag = null;
      chart.classList.remove('is-dragging');
    };
    chart.addEventListener('pointerup', stop);
    chart.addEventListener('pointercancel', stop);
  })();

  // Anyone but a logged-in member (a guest, or logged in without a
  // membership) has no race history or log to sum up: no Dashboard, and
  // the tools that work without one come first: Time Conversions, Training
  // Metrics, then Race Planning (sections and their ribbon tabs both)
  var isMember = !!((USERS[SWIMMER] || {}).loggedIn && (USERS[SWIMMER] || {}).membershipTier);
  var dashboard = document.getElementById('dashboard');
  // Member features (the Workout Library search) and what anyone else sees
  // in their place
  root.querySelectorAll('[data-members-only]').forEach(function (el) { el.hidden = !isMember; });
  root.querySelectorAll('[data-non-members-only]').forEach(function (el) { el.hidden = isMember; });
  if (!isMember) {
    // Hidden, and out of the sections, so the first one shown stays their
    // first child (the eyebrows' spacing)
    var sectionsEl = root.querySelector('.swim-deck__sections'), ribbon = root.querySelector('.swim-ribbon');
    dashboard.hidden = true;
    sectionsEl.parentNode.insertBefore(dashboard, sectionsEl.nextSibling);
    ['time-conversions', 'training-metrics', 'race-planning'].forEach(function (id) {
      ribbon.appendChild(ribbon.querySelector('[data-section="' + id + '"]'));
      sectionsEl.appendChild(document.getElementById(id));
    });
    // No Home either: with no summary it would only repeat Time Conversions'
    // order, so Time Conversions is the selected tab to start
    var home = ribbon.querySelector('[data-section="home"]');
    home.hidden = true;
    home.setAttribute('aria-pressed', 'false');
    ribbon.querySelector('[data-section="time-conversions"]').setAttribute('aria-pressed', 'true');
  }

  // Section ribbon: the chosen section moves to the top of the tools, above
  // even the Dashboard (members), and the rest keep their page order below
  // it; Home puts the Dashboard back on top and the sections in page order.
  // Nodes are moved (not CSS order) so tab order matches what's on screen,
  // and, from the stuck toolbar, the page glides to it (the click handler
  // below).
  var sectionsBox = root.querySelector('.swim-deck__sections');
  var ribbonButtons = root.querySelectorAll('.swim-ribbon [data-section]');
  var defaultOrder = Array.prototype.filter.call(ribbonButtons, function (btn) {
    return btn.getAttribute('data-section') !== 'home';
  }).map(function (btn) {
    return document.getElementById(btn.getAttribute('data-section'));
  });

  function showFirst(id) {
    var first = id === 'home' ? defaultOrder[0] : document.getElementById(id);
    [first].concat(defaultOrder.filter(function (s) { return s !== first; }))
      .forEach(function (section) { sectionsBox.appendChild(section); });
    if (isMember) sectionsBox.insertBefore(dashboard, id === 'home' ? sectionsBox.firstChild : first.nextSibling);
    ribbonButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-section') === id));
    });
    first.classList.remove('is-arriving');
    void first.offsetWidth; // restart the arrival fade
    first.classList.add('is-arriving');
  }

  // A tab, even the selected one: its section first (if it isn't). Clicked
  // from the stuck toolbar, the page then glides (keeping the toolbar
  // stuck) to where the section's heading sticks onto the toolbar's row; on
  // phones, where headings don't stick, to just under the toolbar. Near the
  // top, with the toolbar in place, the section is already in view.
  root.addEventListener('click', function (e) {
    var btn = e.target.closest('.swim-ribbon [data-section]');
    if (!btn) return;
    var stuck = toolbar && toolbar.classList.contains('is-stuck');
    if (btn.getAttribute('aria-pressed') !== 'true') showFirst(btn.getAttribute('data-section'));
    if (!stuck) return;
    var section = sectionsBox.querySelector(':scope > .swim-deck__section');
    var wide = !window.matchMedia || matchMedia('(min-width: 768px)').matches;
    var offset = wide ? stickyTop(section.querySelector('.swim-deck__eyebrow')) : toolbar.offsetHeight + 8;
    // The heading's top margin collapses outside its section, so the
    // section's top (the sections box's: the section itself may be mid
    // arrival fade) is where the heading sits in place; 1px past, so it's
    // stuck rather than just touching
    var top = sectionsBox.getBoundingClientRect().top + window.scrollY - offset + (wide ? 1 : 0);
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 'instant', not 'auto', which would follow the site's smooth scroll-behavior
    window.scrollTo({ top: Math.max(0, top), behavior: still ? 'instant' : 'smooth' });
  });

  // The sticky toolbar's shadow, only while it's stuck: a zero-height marker
  // just above it scrolls out of view exactly when it sticks
  var toolbar = root.querySelector('.swim-deck__toolbar');
  if (toolbar && 'IntersectionObserver' in window) {
    var marker = document.createElement('div');
    marker.setAttribute('aria-hidden', 'true');
    toolbar.parentNode.insertBefore(marker, toolbar);
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      toolbar.classList.toggle('is-stuck', !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(marker);
  }

  // Back to top: an up triangle before every section's eyebrow, shown on
  // all but the section on top (CSS :first-child, so it follows the ribbon's
  // reordering on its own), scrolling back to the top of the page
  root.querySelectorAll('.swim-deck__section > .swim-deck__eyebrow').forEach(function (eyebrow) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swim-deck__to-top';
    btn.setAttribute('data-to-top', '');
    btn.setAttribute('aria-label', 'Back to top');
    btn.title = 'Back to top';
    // The triangle is retired (2026-10-15): the button stays, hidden but for
    // the keyboard, and the heading's text still goes back to top
    // btn.innerHTML = '<svg viewBox="0 0 10 8" aria-hidden="true"><path d="M5 0l5 8H0z"/></svg>';
    eyebrow.insertBefore(btn, eyebrow.firstChild);
  });
  // A section heading stuck at the top (tablet and up, CSS sticky) drops its
  // triangle: is-stuck while it sits at its sticky spot, displaced from where
  // it would be in its section
  // The headings' sticky top, as swim-tools-v2.css sets it (read, so the CSS
  // stays the one place to change it)
  function stickyTop(heading) {
    return parseFloat(getComputedStyle(heading).top) || 0;
  }
  var stuckFrame = 0;
  function markStuckHeadings() {
    stuckFrame = 0;
    var wide = !window.matchMedia || matchMedia('(min-width: 768px)').matches;
    root.querySelectorAll('.swim-deck__section > .swim-deck__eyebrow').forEach(function (e) {
      // Its top margin collapses outside its section, so the section's top
      // is where it would sit in place
      var natural = e.parentElement.getBoundingClientRect().top, at = stickyTop(e);
      e.classList.toggle('is-stuck', wide && !!e.offsetParent && natural < at - 0.5 && e.getBoundingClientRect().top <= at + 0.5);
    });
    markCurrentTab(wide);
  }

  // The tabs follow the scroll: while the toolbar is stuck, the tab of the
  // section under it (whose heading is stuck there; on phones, the section
  // just under the toolbar) is lit (.is-current, aria-current), in place of
  // the selected one, which stays aria-pressed for what the clicks do.
  // Highlights is Home's. Near the top, the selected tab is lit again.
  function markCurrentTab(wide) {
    var ribbon = root.querySelector('.swim-ribbon');
    var current = null;
    if (toolbar && toolbar.classList.contains('is-stuck')) {
      var sections = Array.prototype.filter.call(sectionsBox.children, function (s) {
        return s.classList.contains('swim-deck__section') && !s.hidden;
      });
      var line = wide && sections[0] ? stickyTop(sections[0].querySelector('.swim-deck__eyebrow')) + 1 : toolbar.offsetHeight + 9;
      // The last section whose top has passed the line (so the gaps between
      // sections keep the one above); at the very bottom of the page, the
      // last section, which may be too short to reach the line
      var atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      var section = atEnd ? sections[sections.length - 1] : null;
      if (!section) sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) section = s; });
      if (section) current = section.id === 'dashboard' ? 'home' : section.id;
    }
    ribbon.classList.toggle('is-following', !!current);
    ribbon.querySelectorAll('[data-section]').forEach(function (btn) {
      var on = btn.getAttribute('data-section') === current;
      btn.classList.toggle('is-current', on);
      if (on) btn.setAttribute('aria-current', 'true'); else btn.removeAttribute('aria-current');
    });
  }
  ['scroll', 'resize'].forEach(function (type) {
    window.addEventListener(type, function () {
      if (!stuckFrame) stuckFrame = requestAnimationFrame(markStuckHeadings);
    }, { passive: true });
  });

  // The triangle, or the heading's text beside it while the triangle shows
  // (the button stays the keyboard's way in)
  root.addEventListener('click', function (e) {
    var heading = e.target.closest('.swim-deck__section > .swim-deck__eyebrow');
    var arrow = heading && heading.querySelector('[data-to-top]');
    if (!e.target.closest('[data-to-top]') && !(arrow && arrow.offsetParent)) return;
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: still ? 'instant' : 'smooth' });
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
