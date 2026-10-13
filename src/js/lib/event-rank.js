// USMS event rankings (www.usms.org/comp/meets/eventrank.php), one set at a
// time: one season, course, gender, stroke, distance and age group per
// request, the same inputs as production's Event Ranking form
// (/comp/meets/toptimes.php). Shared by any page that shows rankings
// (event-rank-card.js); the page parses the result table itself, as there's
// no JSON version of it.
//
// Fetched live from the browser, not scraped at build time, so it always
// matches production. That only works once usms.org allows it: today the
// response's Access-Control-Allow-Origin is https://www.usms.org only, and
// the Azure WAF answers anything that hasn't passed its JavaScript challenge
// with a 403. Both need changing on production's side (allow this site's
// origin, exempt eventrank.php from the challenge). Until then fetch()
// rejects with err.blocked = true, and callers link to permalink() instead,
// which opens the same set on usms.org (it takes GET as well as POST).
window.UsmsEventRank = (function () {
  'use strict';

  var ENDPOINT = 'https://www.usms.org/comp/meets/eventrank.php';
  var COURSE_IDS = { SCY: 1, LCM: 2, SCM: 3 };
  var STROKE_IDS = { Free: 1, Back: 2, Breast: 3, Fly: 4, IM: 5 };
  var HOW_MANY = [10, 20, 25, 50, 100, 200, 300, 400, 500];
  // Production's age groups end at 24 for 18 and every 5 years after
  var AGE_GROUPS = [18, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105];
  // The form's earliest season; seasons are named by the year they end in
  var FIRST_SEASON = 2004;
  var TIMEOUT_MS = 20000;

  var cache = {};

  function highAge(low) {
    return low === 18 ? 24 : low + 4;
  }

  // Production's form lists seasons up to the current calendar year, in
  // every course (SCY's runs June 1 – May 31 and is named by its end year,
  // but the form doesn't offer the next one until January)
  function currentSeason() {
    return new Date().getFullYear();
  }

  // { season, course, gender, stroke, distance, ageGroup, howMany } →
  // production's form fields. gender takes Men/Women or M/F; ageGroup is
  // the group's youngest age, any age is rounded down to its group.
  function params(q) {
    var course = q.course || 'SCY';
    var low = AGE_GROUPS.filter(function (a) { return a <= (+q.ageGroup || 18); }).pop();
    var howMany = HOW_MANY.indexOf(+q.howMany) >= 0 ? +q.howMany : 10;
    return {
      Season: String(q.season || currentSeason()),
      Sex: /^f|^w/i.test(q.gender || '') ? 'F' : 'M',
      StrokeID: String(STROKE_IDS[q.stroke] || 1),
      Distance: String(q.distance || 50),
      lowage: String(low),
      highage: String(highAge(low)),
      How_Many: String(howMany),
      CourseID: String(COURSE_IDS[course] || 1)
    };
  }

  function permalink(q) {
    return ENDPOINT + '?' + new URLSearchParams(params(q)).toString();
  }

  function seconds(t) {
    var parts = String(t).split(':');
    var s = 0;
    for (var i = 0; i < parts.length; i++) s = s * 60 + parseFloat(parts[i]);
    return s;
  }

  function text(el) {
    return el ? el.textContent.replace(/ /g, ' ').trim() : '';
  }

  function link(el) {
    var a = el && el.querySelector('a[href]');
    return a ? new URL(a.getAttribute('href'), ENDPOINT).href : null;
  }

  // The ranking page's HTML → { title, rows: [{ place, name, age, time,
  // seconds, club, clubName, meet, meetUrl, swimUrl }] }. Rows come in
  // place order, fastest first; ties share a place. title is production's
  // heading, e.g. "USMS Times Reported for Men SCY 50 Free Ages 50-54 · 2026
  // Season (2025-06-01 through 2026-05-31)".
  function parse(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var table = doc.querySelector('table.meet_event-rank');
    if (!table) {
      var err = new Error('No rankings table in the response');
      err.empty = /Not enough information/i.test(html);
      throw err;
    }
    var heading = doc.querySelector('.contentbar big');
    var title = heading
      ? heading.innerHTML.split(/<br\s*\/?>/i).map(function (s) {
          var d = document.createElement('div');
          d.innerHTML = s;
          return text(d);
        }).filter(Boolean).join(' · ')
      : '';
    var rows = [];
    table.querySelectorAll('tr').forEach(function (tr) {
      var td = tr.querySelectorAll('td');
      if (td.length < 6) return;
      var club = td[4].querySelector('a');
      rows.push({
        place: parseInt(text(td[0]), 10),
        name: text(td[1]),
        age: parseInt(text(td[2]), 10),
        time: text(td[3]),
        seconds: seconds(text(td[3])),
        club: text(td[4]),
        clubName: club ? club.getAttribute('title') || '' : '',
        meet: text(td[5]),
        meetUrl: link(td[5]),
        swimUrl: link(td[3])
      });
    });
    return { title: title, rows: rows };
  }

  // Resolves to parse()'s result plus query (the normalised inputs) and
  // url (permalink). Rejects with err.blocked = true when the browser
  // couldn't read the response (CORS or the WAF challenge, see the top of
  // this file). One request per set per page load; repeats come from cache.
  function fetchRanking(q) {
    var p = params(q);
    var url = permalink(q);
    if (cache[url]) return cache[url];
    var controller = window.AbortController ? new AbortController() : null;
    var timer = controller && setTimeout(function () { controller.abort(); }, TIMEOUT_MS);
    cache[url] = fetch(ENDPOINT, {
      method: 'POST',
      body: new URLSearchParams(p),
      credentials: 'omit',
      signal: controller && controller.signal
    }).then(function (res) {
      if (!res.ok) {
        var err = new Error('usms.org answered ' + res.status);
        err.blocked = res.status === 403;
        throw err;
      }
      return res.text();
    }, function (e) {
      // A CORS refusal surfaces as a bare network error
      var err = new Error(e && e.name === 'AbortError' ? 'Timed out' : 'usms.org refused the request');
      err.blocked = !(e && e.name === 'AbortError');
      throw err;
    }).then(function (html) {
      var result = parse(html);
      result.query = p;
      result.url = url;
      return result;
    }).catch(function (err) {
      delete cache[url];
      err.url = url;
      throw err;
    }).finally(function () {
      if (timer) clearTimeout(timer);
    });
    return cache[url];
  }

  // Seasons the form offers, newest first
  function seasons() {
    var list = [];
    for (var y = currentSeason(); y >= FIRST_SEASON; y--) list.push(y);
    return list;
  }

  // Distances production's form lists per course, for every stroke
  var DISTANCES = {
    SCY: [25, 50, 100, 200, 400, 500, 1000, 1650],
    LCM: [50, 100, 200, 400, 800, 1000, 1500],
    SCM: [25, 50, 100, 200, 400, 800, 1500]
  };
  function distances(course) {
    return DISTANCES[course] || DISTANCES.SCY;
  }

  return {
    ENDPOINT: ENDPOINT,
    AGE_GROUPS: AGE_GROUPS,
    HOW_MANY: HOW_MANY,
    STROKES: Object.keys(STROKE_IDS),
    COURSES: Object.keys(COURSE_IDS),
    highAge: highAge,
    currentSeason: currentSeason,
    seasons: seasons,
    distances: distances,
    params: params,
    permalink: permalink,
    parse: parse,
    fetch: fetchRanking
  };
})();
