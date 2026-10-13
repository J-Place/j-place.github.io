// Swim Tools v2: one swimmer context (course, stroke) feeds every tool on the
// page, and each tool's inputs live in an editor modal. All results are sample
// math, not USMS-approved formulas. The predictor extends the 100 time with
// Riegel's exponent (1.06); split strategies are a linear pace trend plus a
// dive-start allowance on the first split.
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
    ageGroup: '25', // Your Event's age group, by its youngest age
    view: 'chart', strategy: 'even',
    // The swim Training Metrics are worked out from (its settings modal)
    // The Training Metrics swim (Your Swim). stroke is optional: '' for a
    // mixed workout.
    // Time and pace (per 100) both show; the one changed last (source) is
    // used, and the other is worked out from it
    metrics: { course: 'SCY', distance: '1650', time: '22:30.00', pace: '', source: 'time', stroke: '' },
    // Race history, oldest first; the predictor is built from it (loadRaces)
    races: [],
    // The Add a Race form; reset from Your Event each time it opens
    newRace: { course: 'SCY', distance: '200', stroke: 'Free', time: '', date: '' },
    racesStroke: '',        // Your Races: one stroke's races, or '' for all
    racesDistance: '',      // Your Races: one distance's races, or '' for all
    racesExpanded: false,   // Your Races: all of them, not just the newest few
    // Convert a Time (Time Conversions): its own event and time
    conv: { course: 'SCY', distance: '200', stroke: 'Free', time: '' },
    // Top 10 by Decade's event, in the lists' course; follows Your Event
    // (followEvent) until the card's own controls change it
    tens: { stroke: 'Free', distance: '200' },
    // Race Splits goal, as a time or a pace (per 100): the one changed last
    // (goalSource) is used, and the other worked out. Empty means use the
    // event's time (your race or the average).
    goal: '', goalPace: '', goalSource: 'time',
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

  // Your races in the context stroke, in the context course: the fastest at
  // each distance, as { distance: seconds }
  // A goal's effect on every distance: the improvement ratio at Your Event
  // (goal / your time there) applies in full there and fades with distance,
  // exp(-|ln(d / event distance)| / GOAL_FALLOFF): about 60% at half or
  // double the distance, 37% at a quarter or four times, 8% from a 50 to a
  // 1650. Raced distances move too: a goal says you'll beat your old races.
  var GOAL_FALLOFF = Math.log(4);

  function goalPredictions(rows, goalTime) {
    var at = rows.filter(function (r) { return r.goal; })[0];
    var ratio = goalTime / at.secs;
    return rows.map(function (r) {
      var reach = Math.exp(-Math.abs(Math.log(r.d / at.d)) / GOAL_FALLOFF);
      return { d: r.d, known: r.known, goal: r.goal, secs: r.secs * (1 + (ratio - 1) * reach) };
    });
  }

  // Only races swum in the selected age group count, so a long history
  // predicts from how you swim now, not from your lifetime bests. Races
  // without an age (no birth date to work it out) always count.
  function inAgeGroup(r) {
    if (r.age == null) return true;
    var k = AGE_GROUPS.indexOf(ageGroup()), next = AGE_GROUPS[k + 1];
    return r.age >= ageGroup().min && (!next || r.age < next.min);
  }

  // Your fastest race at each distance, as { distance: seconds }: only races
  // swum in Your Event's course and stroke. Races in other courses aren't
  // converted, so every time on your line is one you actually swam.
  function knownTimes() {
    var known = {};
    state.races.forEach(function (r) {
      if (r.course !== state.course || r.stroke !== state.stroke || !inAgeGroup(r)) return;
      var secs = parse(r.time), d = Number(r.distance);
      if (isFinite(secs) && !(known[d] <= secs)) known[d] = secs;
    });
    return known;
  }

  // Average times (src/_data/averageTimes.json, embedded as
  // #average-times-data): SCY, 25-29, by stroke and distance
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

  // USMS age group cut times (src/_data/ageGroupRanges.js, embedded as
  // #age-group-ranges-data): per course, gender and age group, each event's
  // A (top 15%) and B (top 55%) times in seconds. SCY only so far, 18-24 to
  // 80-84.
  var AGE_RANGES = [];
  try {
    AGE_RANGES = JSON.parse(document.getElementById('age-group-ranges-data').textContent);
  } catch (e) {}

  // The age group range at each event in the list, as seconds: fast (A) and
  // slow (B), for the selected age group and the swimmer's gender. Uses the
  // chart's course where there's data for it, otherwise SCY converted the way
  // averageTime converts (course factor, yards/meters equivalent distance).
  // null when there's no data for the group or it misses an event.
  function ageGroupRange(rows) {
    var match = function (course) {
      return AGE_RANGES.filter(function (g) {
        return g.course === course && g.ageGroup === Number(state.ageGroup) && g.gender === swimmerGender();
      })[0];
    };
    var data = match(state.course), from = state.course;
    if (!data) { data = match('SCY'); from = 'SCY'; }
    if (!data) return null;
    var table = data.times[state.stroke] || {}, fast = [], slow = [];
    rows.forEach(function (r) {
      var d = table[r.d] ? r.d : table[EQUIVALENT[r.d]] ? EQUIVALENT[r.d] : 0;
      var scale = d ? COURSES[state.course].factor / COURSES[from].factor * r.d / d : NaN;
      fast.push(d ? table[d][0] * scale : NaN);
      slow.push(d ? table[d][1] * scale : NaN);
    });
    return fast.some(isNaN) ? null : { fast: fast, slow: slow };
  }

  // Every event in the list, as:
  //   avg   your age group's average
  //   mine  your line, if you've raced this stroke: your fastest race where
  //         you have one (converted to Your Event's course); elsewhere the
  //         average adjusted by how your races compare with the average there
  //         (your time / average, blended across your races, nearer
  //         distances weighted more: 1 / log-distance squared)
  //   secs  the main line: yours if you have races, otherwise the average
  function eventTimes(list) {
    var known = knownTimes(), goal = Number(state.distance), group = ageGroup();
    var avgOf = function (d) { return averageTime(state.course, state.stroke, d, group); };
    var raced = Object.keys(known).map(Number).filter(function (x) { return isFinite(avgOf(x)); });
    var ratios = {};
    raced.forEach(function (x) { ratios[x] = known[x] / avgOf(x); });
    return list.map(function (d) {
      var avg = avgOf(d), mine = NaN;
      if (d in known) mine = known[d];
      else if (raced.length) {
        var sum = 0, weights = 0;
        raced.forEach(function (x) {
          var w = 1 / Math.pow(Math.log(d / x), 2);
          sum += w * ratios[x];
          weights += w;
        });
        mine = avg * sum / weights;
      }
      return {
        d: d, known: d in known, goal: d === goal, avg: avg, mine: mine,
        secs: raced.length ? mine : avg
      };
    });
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

  // The chart: your race time or the age group average for every event, with
  // Your Event's distance marked
  // Up to three lines: your age group's average (always), your line (if
  // you've raced this stroke), and a dashed goal line (if you set a goal).
  // The main line, yours or else the average, carries the dots and labels.
  // The latest Top 10's range at each event in the list, as seconds: first
  // (1st place) and last (10th, or the last listed for a tie), so last is
  // what it took to make the Top 10. Only from the list for Your Event's
  // course and the swimmer's age group and gender (topTenList); null when
  // there's no such list or it misses an event. Lists aren't converted.
  function topTenRange(rows) {
    var top = topTenList(state.course);
    if (!top) return null;
    var years = Object.keys(top.seasons).sort(), latest = top.seasons[years[years.length - 1]];
    if (!latest) return null;
    var first = [], last = [];
    rows.forEach(function (r) {
      var list = (latest[state.stroke] || {})[r.d] || [];
      first.push(list.length ? parse(list[0]) : NaN);
      last.push(list.length ? parse(list[list.length - 1]) : NaN);
    });
    return first.some(isNaN) ? null : { first: first, last: last };
  }

  function renderChart(rows, goalRows) {
    var svg = root.querySelector('[data-st-chart]');
    var per = rows.map(function (r) { return r.secs / r.d * 100; });
    var avg = rows.map(function (r) { return r.avg / r.d * 100; });
    if (per.some(isNaN)) {
      svg.innerHTML = '<text x="360" y="140" text-anchor="middle" class="swim-chart__empty">No average times for ' + state.course + ' ' + state.stroke + '</text>';
      svg.setAttribute('aria-label', 'No times to show');
      root.querySelector('[data-st-legend-top-ten]').hidden = true;
      root.querySelector('[data-st-legend-age-range]').hidden = true;
      return;
    }
    var mine = rows.some(function (r) { return r.known; });
    var goal = goalRows ? goalRows.map(function (r) { return r.secs / r.d * 100; }) : null;
    // The Top 10 range as pace: fastest (1st) and slowest (10th)
    var range = topTenRange(rows);
    var paceOf = function (t, i) { return t / rows[i].d * 100; };
    var top = range ? { first: range.first.map(paceOf), last: range.last.map(paceOf) } : null;
    // The age group range as pace: A (top 15%) to B (top 55%)
    var ages = ageGroupRange(rows);
    var band = ages ? { fast: ages.fast.map(paceOf), slow: ages.slow.map(paceOf) } : null;
    var all = per.concat(avg, goal || [], top ? top.first.concat(top.last) : [], band ? band.fast.concat(band.slow) : []);
    var pad = goal || mine ? 4 : 2; // room for a label under the lower line
    var lo = Math.floor(Math.min.apply(null, all) - pad), hi = Math.ceil(Math.max.apply(null, all) + pad);
    var first = rows[0].d, last = rows[rows.length - 1].d;
    function X(d) { return 70 + (Math.log(d) - Math.log(first)) / (Math.log(last) - Math.log(first)) * 600; }
    function Y(v) { return 230 - (v - lo) / (hi - lo) * 200; }
    function path(values) {
      return values.map(function (v, i) { return (i ? 'L' : 'M') + X(rows[i].d).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(' ');
    }

    var pts = rows.map(function (r, i) { return { x: X(r.d).toFixed(1), y: Y(per[i]).toFixed(1) }; });
    var line = path(per);
    var out = [30, 100, 170].map(function (y) {
      return '<line x1="40" y1="' + y + '" x2="700" y2="' + y + '" class="swim-chart__grid"/>';
    }).join('');
    out += '<line x1="40" y1="230" x2="700" y2="230" class="swim-chart__base"/>' +
      '<text x="34" y="34" text-anchor="end" class="swim-chart__axis">' + clock(hi) + '</text>' +
      '<text x="34" y="234" text-anchor="end" class="swim-chart__axis">' + clock(lo) + '</text>';
    // Shaded ranges under every line: the age group range (A to B), then
    // the Top 10 (1st to 10th)
    function shade(upper, lower, cls) {
      var back = lower.map(function (v, i) { return X(rows[i].d).toFixed(1) + ' ' + Y(v).toFixed(1); }).reverse();
      return '<path d="' + path(upper) + ' L' + back.join(' L') + ' Z" class="' + cls + '"/>';
    }
    if (band) out += shade(band.slow, band.fast, 'swim-chart__age-range');
    if (top) out += shade(top.last, top.first, 'swim-chart__top-ten');
    if (mine) {
      // Your line over the average line
      out += '<path d="' + path(avg) + '" class="swim-chart__line swim-chart__line--average"/>' +
        '<path d="' + line + '" class="swim-chart__line"/>';
    } else {
      out += '<path d="' + line + '" class="swim-chart__line swim-chart__line--average"/>';
    }
    if (goal) out += '<path d="' + path(goal) + '" class="swim-chart__line swim-chart__line--goal"/>';

    // The main line's labels go on the side away from the goal line, and away
    // from the average line when yours is drawn over it
    var eventAt = rows.map(function (r) { return r.goal; }).indexOf(true);
    var goalBelow = goal && goal[eventAt] < per[eventAt];
    var otherBelow = goal ? goalBelow : mine && avg[eventAt] < per[eventAt];
    var dy = otherBelow ? -14 : 22;

    rows.forEach(function (r, i) {
      var p = pts[i];
      var kind = r.goal ? 'goal' : r.known ? 'known' : mine ? 'estimate' : 'average';
      var radius = { goal: 7, known: 6, estimate: 5, average: 6 }[kind];
      out += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + radius + '" class="swim-chart__dot swim-chart__dot--' + kind + '"/>' +
        '<text x="' + p.x + '" y="' + (Number(p.y) + dy).toFixed(1) + '" text-anchor="middle" class="swim-chart__value swim-chart__value--' + kind + '">' + race(r.secs) + '</text>' +
        '<text x="' + p.x + '" y="254" text-anchor="middle" class="swim-chart__axis">' + r.d + '</text>';
      // The goal line's only dot: your goal, at Your Event
      if (goal && r.goal) {
        var gy = Y(goal[i]);
        out += '<circle cx="' + p.x + '" cy="' + gy.toFixed(1) + '" r="5" class="swim-chart__dot swim-chart__dot--goal-time"/>' +
          '<text x="' + p.x + '" y="' + (gy + (goalBelow ? 22 : -14)).toFixed(1) + '" text-anchor="middle" class="swim-chart__value swim-chart__value--goal-time">Goal ' + race(goalRows[i].secs) + '</text>';
      }
    });
    svg.innerHTML = out;
    svg.setAttribute('aria-label', (mine ? 'Your pace' : ageGroup().label + ' average pace') + ' per 100 goes from ' +
      clock(per[0]) + ' at the ' + first + ' to ' + clock(per[per.length - 1]) + ' at the ' + last +
      (mine ? '; the ' + ageGroup().label + ' average from ' + clock(avg[0]) + ' to ' + clock(avg[avg.length - 1]) : '') +
      (goal ? '. At your goal pace it goes from ' + clock(goal[0]) + ' to ' + clock(goal[goal.length - 1]) : '') +
      (top ? '. The ' + topTenList(state.course).ageGroupLabel + ' Top 10, 1st to 10th, goes from ' + clock(top.first[0]) + '–' + clock(top.last[0]) + ' at the ' + first +
        ' to ' + clock(top.first[top.first.length - 1]) + '–' + clock(top.last[top.last.length - 1]) + ' at the ' + last : ''));
    root.querySelector('[data-st-legend-age-range]').hidden = !band;
    root.querySelector('[data-st-legend-top-ten]').hidden = !top;
    if (top) set('topTenLegend', 'Top ten range');
  }

  // Every event: the average, your time (race or estimate), its pace, and
  // the goal line's time when a goal is set
  function renderPredTable(rows, goalRows) {
    var body = root.querySelector('[data-st-pred-rows]');
    var mine = rows.some(function (r) { return r.known; });
    root.querySelector('[data-st-you-col]').hidden = !mine;
    root.querySelector('[data-st-goal-col]').hidden = !goalRows;
    var range = topTenRange(rows);
    root.querySelector('[data-st-top-ten-col]').hidden = !range;
    body.innerHTML = rows.map(function (r, i) {
      var source = (r.known ? 'Your race' : mine ? 'Estimate' : 'Average') + (r.goal ? ' · Your event' : '');
      return '<tr class="' + (r.goal ? 'is-goal' : r.known ? 'is-known' : '') + '">' +
        '<th scope="row">' + r.d + ' ' + state.stroke + '</th>' +
        '<td class="swim-table__avg">' + race(r.avg) + '</td>' +
        (mine ? '<td class="swim-table__time">' + race(r.mine) + '</td>' : '') +
        (range ? '<td class="swim-table__top-ten">' + race(range.first[i]) + '–' + race(range.last[i]) + '</td>' : '') +
        '<td>' + clock(r.secs / r.d * 100) + '</td>' +
        (goalRows ? '<td class="swim-table__goal">' + race(goalRows[i].secs) + '</td>' : '') +
        '<td class="swim-table__source">' + source + '</td></tr>';
    }).join('');
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
    if (!age || !isFinite(base)) {
      list.innerHTML = '<li class="swim-ages__empty">' +
        (age ? 'Enter a time above to see age conversions.' : 'Enter an age of 18 or older.') + '</li>';
      return;
    }
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
      return '<li class="swim-ages__row' + (r.current ? ' is-current' : '') + '">' +
        '<span class="swim-ages__group">' + r.label + (r.current ? '<span class="sr-only"> (your age group)</span>' : '') + '</span>' +
        '<span class="swim-ages__track" aria-hidden="true"><span style="width: ' + Math.round((r.time - lo) / (hi - lo) * 100) + '%"></span></span>' +
        '<span class="swim-ages__time">' + race(r.time) + '</span></li>';
    }).join('');
  }

  // ---------- Your races ----------

  var RACES_SHOWN = 5;
  var RACES_SCROLL = 20; // expanded lists longer than this scroll inside the card
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
  function ageOn(date) {
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

  // Start from the persona: their age today (Age Conversion) and its age
  // group, and Your Event as the event they've raced most (latest wins a tie)
  function startFromSwimmer() {
    var age = ageOn(today());
    if (age >= 18) {
      state.age = String(age);
      AGE_GROUPS.forEach(function (g) { if (age >= g.min) state.ageGroup = String(g.min); });
    }
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

  // Your races, newest race date first (undated ones last, newest added
  // first), filtered by stroke and distance if chosen; the newest few
  // unless expanded. The distance list offers only distances you've raced
  // in the chosen stroke, and goes back to all when the stroke has none.
  var STROKE_NAMES = { Fly: 'Butterfly' };

  function renderRaces() {
    var list = root.querySelector('[data-st-races]');
    var toggle = root.querySelector('[data-races-toggle]');
    var stroke = state.racesStroke;
    var inStroke = state.races.filter(function (r) { return !stroke || r.stroke === stroke; });
    var distances = inStroke.map(function (r) { return Number(r.distance); })
      .filter(function (d, i, all) { return all.indexOf(d) === i; })
      .sort(function (a, b) { return a - b; });
    if (distances.indexOf(Number(state.racesDistance)) < 0) state.racesDistance = '';
    var sel = root.querySelector('[data-st-races-distances]');
    if (sel.getAttribute('data-key') !== distances.join()) {
      sel.setAttribute('data-key', distances.join());
      sel.innerHTML = '<option value="">All distances</option>' + distances.map(function (d) {
        return '<option value="' + d + '">' + d + '</option>';
      }).join('');
    }
    var distance = state.racesDistance;
    var races = inStroke.filter(function (r) { return !distance || r.distance === distance; })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || b.id - a.id; });
    var shown = state.racesExpanded ? races : races.slice(0, RACES_SHOWN);
    // The filters, e.g. "100 Butterfly"
    var kind = [distance, stroke && (STROKE_NAMES[stroke] || stroke)].filter(Boolean).join(' ');
    var what = races.length === 1 ? 'race' : 'races';

    list.innerHTML = shown.length ? shown.map(function (r) {
      var name = r.course + ' ' + r.distance + ' ' + r.stroke, when = formatDate(r.date);
      return '<li class="swim-races__item">' +
        '<button type="button" class="swim-races__remove" data-remove-race="' + r.id + '" aria-label="Remove ' + name + ', ' + race(parse(r.time)) + (when ? ', ' + when : '') + '">' +
        '<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
        '<span class="swim-races__course">' + r.course + '</span>' +
        '<span class="swim-races__what"><span class="swim-races__event">' + r.distance + ' ' + r.stroke + '</span>' +
        (when ? '<span class="swim-races__date">' + when + '</span>' : '') + '</span>' +
        '<span class="swim-races__time">' + race(parse(r.time)) + '</span></li>';
    }).join('') : '<li class="swim-races__empty">' +
      (kind && state.races.length ? 'No ' + kind + ' races yet.' : 'No races yet. Add one to build your predictions.') + '</li>';

    // Long expanded lists scroll inside the card; focusable so the keyboard can scroll them
    var long = state.racesExpanded && races.length > RACES_SCROLL;
    list.classList.toggle('is-long', long);
    if (long) list.setAttribute('tabindex', '0');
    else list.removeAttribute('tabindex');

    toggle.hidden = races.length <= RACES_SHOWN;
    toggle.setAttribute('aria-expanded', String(state.racesExpanded));
    toggle.textContent = state.racesExpanded ? 'Show fewer' : 'Show all ' + races.length + ' ' + what;
    set('racesCount', !races.length ? '' : (kind ? kind + ': ' : '') +
      (races.length > shown.length ? 'Newest ' + shown.length + ' of ' + races.length + ' ' + what
        : races.length + ' ' + what) + ', newest first');
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
  // to other age groups at your age (Age Conversion)
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

    var typed = c.time !== '', ok = !typed || validEntry(c.time);
    var secs = typed && ok ? parse(c.time) : NaN;
    markTimeField(root.querySelector('[data-time-conv]'), ok);
    set('convHint', !ok ? 'Seconds must be under 60.'
      : typed ? '' : 'Enter a time to convert it to every course and age group.');

    var name = c.distance + ' ' + c.stroke;
    set('courseConvSubtitle', name + ' in ' + c.course + (isFinite(secs) ? ' @ ' + race(secs) : ''));
    Object.keys(COURSES).forEach(function (k) {
      var to = convertRace(c, k);
      set('courseConv' + k, isFinite(secs) && to.d ? race(to.secs) : '—');
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
    var empty = !age ? 'Enter an age of 18 or older.'
      : !isFinite(avg) ? 'No age group data for this event.'
      : !isFinite(secs) ? 'Enter a time above to see your rank.' : '';
    set('rankSubtitle', c.course + ' ' + c.distance + ' ' + c.stroke + (age ? ' · ' + group.label : ''));
    set('rankEmpty', empty);
    root.querySelector('[data-st="rankEmpty"]').hidden = !empty;
    root.querySelector('[data-st-rank]').hidden = !!empty;
    if (empty) return;

    var list = eventsFor(c.course, c.stroke);
    var field = Math.max(3, Math.round(RANK_FIELD * Math.pow(RANK_FALLOFF, Math.max(0, list.indexOf(d))) * RANK_AGE_SHARE[k]));
    var faster = normalCdf(Math.log(secs / avg) / RANK_SPREAD); // share of the field faster than you
    set('rankPlace', '#' + (1 + Math.round(faster * (field - 1))));
    set('rankOf', ' of ' + field);
    set('rankBeats', String(Math.min(99, Math.round((1 - faster) * 100))));
    set('rankAvg', race(avg));
    set('rankTop10', race(avg * Math.exp(TOP_10_Z * RANK_SPREAD)));
    root.querySelector('[data-st-rank-marker]').style.left = ((1 - faster) * 100).toFixed(1) + '%';
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
      pace: clock(w.pace), stroke: w.stroke, calories: w.calories
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
  function renderMetrics() {
    var t = state.metrics, course = COURSES[t.course], unit = course.unit, d = Number(t.distance);
    if (!(d > 0)) d = NaN;
    var byPace = t.source === 'pace';
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

    // Calories: pace in yards terms sets the intensity, capped to a sane range
    var intensity = Math.min(1.4, Math.max(0.7, REF_PACE / (pace / course.factor)));
    var perMin = CAL_PER_MIN * STROKE_BURN[t.stroke] * intensity;
    var calories = Math.round(perMin * secs / 60);
    set('calValue', isFinite(calories) ? String(calories) : '—');

    // The workout as it stands, for Add to Log
    metricsNow = { course: t.course, unit: unit, distance: d, secs: secs, pace: pace, stroke: t.stroke, calories: calories };

    // Pace conversion: that pace per 100 in the two other courses
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
    var paceField = card.querySelector('[data-time-metric="pace"]');
    var typed = t[t.source], ok = typed === '' || validEntry(typed);
    markTimeField(timeField, byPace || ok);
    markTimeField(paceField, !byPace || ok);
    set('metricsHint', typed === '' ? 'Enter a time or a pace.'
      : ok ? '' : (byPace ? 'Pace' : 'Time') + ': seconds must be under 60.');
    set('metricsDistanceUnit', '(' + unitWord.trim() + ')');
  }

  function render() {
    // Context
    set('course', state.course);

    // Your age (Age Conversion); an unusable value shows as a dash
    var age = Number(state.age);
    if (!(age >= 18 && age <= 120 && Math.floor(age) === age)) age = 0;

    // Training Metrics, from Your Swim
    renderMetrics();

    // Context distance
    var list = eventsFor(state.course, state.stroke);
    fitDistance(state, list);
    renderEventOptions(root.querySelector('[data-st-event-options]'), list, state.course + ' ' + state.stroke);
    set('distance', state.distance);
    // The goal belongs to one event; a new event starts it empty
    var eventKey = state.course + ' ' + state.distance + ' ' + state.stroke;
    if (lastEvent && eventKey !== lastEvent) {
      state.goal = state.goalPace = '';
      ['goal', 'goalPace'].forEach(function (key) {
        fillTimeField(document.querySelector('[data-time-input="' + key + '"]'), ''); // even if focused
      });
    }
    // The goal time or pace that wasn't changed last, from the one that was
    var goalD = Number(state.distance);
    if (state.goalSource === 'pace') {
      state.goal = validEntry(state.goalPace) ? race(parse(state.goalPace) * goalD / 100) : '';
    } else {
      // The pace field has no hundredths: to the nearest second
      state.goalPace = validEntry(state.goal) ? race(Math.round(parse(state.goal) / goalD * 100)) : '';
    }
    // Top 10 by Decade follows a new Your Event
    if (eventKey !== lastEvent) followEvent();
    lastEvent = eventKey;

    // Your races, and the chart: your age group's average, your line from
    // your races, and a goal line. Its marked event is the context distance.
    renderRaces();
    renderNewRace();
    set('ageGroupLabel', ageGroup().label);
    var rows = eventTimes(list);
    var goalRow = rows.filter(function (r) { return r.goal; })[0];
    var raced = rows.filter(function (r) { return r.known; }).length;
    set('predSubtitle', (raced ? 'Your times, from ' + raced + (raced === 1 ? ' raced distance' : ' raced distances') + ', against the ' + ageGroup().label + ' average'
      : ageGroup().label + ' average times') + ' · ' + state.course + ' ' + state.stroke);
    root.querySelectorAll('[data-st-legend-mine]').forEach(function (li) { li.hidden = !raced; });
    root.querySelector('[data-st-legend-estimate]').hidden = !raced || raced === rows.length;
    // A goal time (Your Event's Goal) adds a goal line to the chart
    var goalSet = state.goal !== '' && validEntry(state.goal) && isFinite(goalRow.secs);
    var goalRows = goalSet ? goalPredictions(rows, parse(state.goal)) : null;
    root.querySelector('[data-st-legend-goal]').hidden = !goalRows;
    renderChart(rows, goalRows);
    renderPredTable(rows, goalRows);
    // Top 10 by Decade, with your goal across it when it shows Your Event
    renderTopTens(goalSet ? parse(state.goal) : NaN);

    // Splits: Your Event, toward its goal time (the Your Event panel's Goal;
    // the event's time until you set one, shown as the Goal placeholders).
    var distance = Number(state.distance);
    fitInterval(distance);
    var goalTyped = state.goal !== '';
    var byPace = state.goalSource === 'pace';
    var typedGoal = byPace ? state.goalPace : state.goal;
    var goalOk = typedGoal === '' || validEntry(typedGoal);
    var goal = goalTyped ? (goalOk ? parse(state.goal) : NaN) : goalRow.secs;
    renderSplits(goal, distance);
    set('splitsSubtitle', state.distance + ' ' + state.stroke +
      (goalTyped ? ' · goal ' : goalRow.known ? ' · your race ' : rows.some(function (r) { return r.known; }) ? ' · your estimate ' : ' · ' + ageGroup().label + ' average ') + race(goal));
    var goalField = document.querySelector('[data-time-input="goal"]');
    var goalPaceField = document.querySelector('[data-time-input="goalPace"]');
    setTimePlaceholders(goalField, goalRow.secs);
    setTimePlaceholders(goalPaceField, goalRow.secs / distance * 100);
    markTimeField(goalField, byPace || goalOk);
    markTimeField(goalPaceField, !byPace || goalOk);
    set('goalHint', goalOk ? '' : (byPace ? 'Pace' : 'Time') + ': seconds must be under 60.');

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
        : group.hasAttribute('data-time-conv') ? state.conv.time : state.newRace.time;
      if (readTimeField(group) === value || group.contains(document.activeElement)) return;
      fillTimeField(group, value);
    });

    // Pressed state for every segmented control and tile group
    document.querySelectorAll('[data-control]').forEach(function (group) {
      var value = state[group.getAttribute('data-control')];
      group.querySelectorAll('[data-value]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-value') === value));
      });
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
      // Your Event's goal: the time or pace just changed is the one used
      if (key === 'goal') state.goalSource = 'time';
      if (key === 'goalPace') state.goalSource = 'pace';
    }
    else if (metric) {
      // Your Swim: the time or pace just changed becomes the source the
      // other is worked out from
      state.metrics[metric] = readTimeField(group);
      state.metrics.source = metric;
    }
    else if (group.hasAttribute('data-time-conv')) state.conv.time = readTimeField(group);
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

  // Your races: add (Add a Race modal), remove, and show all or fewer
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
    var remove = e.target.closest('[data-remove-race]');
    if (!remove) return;
    var id = Number(remove.getAttribute('data-remove-race'));
    state.races = state.races.filter(function (r) { return r.id !== id; });
    saveRaces();
    render();
    // The button is gone; keep focus in the card
    var next = root.querySelector('[data-remove-race]') || root.querySelector('#race-history [data-modal-target]');
    if (next) next.focus();
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
})();
