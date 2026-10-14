// scripts/top-times-synthetic.js
// Writes SYNTHETIC Top Times rankings (docs/api/top-times.openapi.yaml) for
// the seasons and age groups the site's personas need but no real scrape
// covers yet, flagged "provenance": "synthetic" in every file and in
// available.json. They're modeled to look like real rankings, never real
// results: swimmers have no name, club or meet (the fields are left out).
//
// Which datasets: for every persona in src/_data/users.json with a gender
// and birth date, the age group they were in when each season ended (May 31)
// for every season the real data covers, plus, in the latest season, their
// current age group and the one before and two after it (Swim Tools v4's
// age-up and age conversion cards). SCY, ages 18-24 to 80-84.
//
// How each event's ranking is modeled:
//   - field size and the times from 1st place down to the top 55% come from
//     that age group's real USMS percentile cuts (2025-26, via Openlane:
//     src/_data/timeStandards.json)
//   - the slower half follows the shape of the real rankings this folder
//     holds (men 40-44 and 50-54), scaled from the top-55% time
//   - 25s, which the cuts don't cover, are the 50's ranking times the real
//     25/50 ratio at each place
//   - other seasons scale field size and times by how the real rankings
//     changed from that season to 2026 (e.g. the small 2020-21 fields)
//   - places within the curve get a little seeded jitter, so ties and gaps
//     look real; the same inputs always write the same files
//
// Runs before every build (npm prebuild, and before npm run dev). Reads the
// committed real scrapes in src/data/top-times/ and writes everything else to
// src/data/top-times-generated/ (gitignored, emptied first every run):
// synthetic rankings, the real Top 10 lists from topTens.json and the index,
// available.json, over both folders. Eleventy publishes both folders at
// /data/top-times/. A dataset the real folder has is never generated, so a
// new real scrape displaces synthetic data on the next build. The output only
// changes when its inputs do.
//
// Usage:
//   npm run top-times:synthetic -- [--real src/data/top-times] [--out src/data/top-times-generated]
const fs = require('fs');
const path = require('path');
const { EVENTS, writeAvailable } = require('./lib/top-times-available');

const args = process.argv.slice(2);
const flag = n => { const i = args.indexOf('--' + n); return i > -1 ? args[i + 1] : null; };
const root = path.join(__dirname, '..');
const REAL_DIR = path.resolve(flag('real') || path.join(root, 'src', 'data', 'top-times'));
const OUT_DIR = path.resolve(flag('out') || path.join(root, 'src', 'data', 'top-times-generated'));
const COURSE = 'scy';
const STROKE_LABELS = { free: 'Free', back: 'Back', breast: 'Breast', fly: 'Fly', im: 'IM' };
const CAP = 500;
let UPDATED; // the newest real scrape's date, set below, so reruns don't churn
const AGE_MINS = [18, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
const ageKey = min => (min === 18 ? '18-24' : `${min}-${min + 4}`);
const groupOf = age => AGE_MINS.filter(m => age >= m).pop();

const users = require(path.join(root, 'src', '_data', 'users.json'));
const standards = require(path.join(root, 'src', '_data', 'timeStandards.json'));

// ---------- Real rankings in the folder ----------

const secs = t => String(t).split(':').reduce((a, p) => a * 60 + Number(p), 0);
const fmt = s => {
  s = Math.round(s * 100) / 100;
  const m = Math.floor(s / 60), r = (s - m * 60).toFixed(2);
  return m ? `${m}:${r < 10 ? '0' : ''}${r}` : r;
};
const readJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
const isReal = body => body && (body.provenance || 'usms') === 'usms';

// Modern seasons: those the real scrape covers. Earlier ones are history
// (below), back to HISTORY_FROM.
const folderSeasons = fs.readdirSync(REAL_DIR).filter(d => /^\d{4}$/.test(d)).map(Number).sort();
// (A real season known only from a Top 10 list, written below, has no names
// and doesn't count: only full scrapes make a season modern.)
const isScrape = body => isReal(body) && body.swimmers.some(x => x.name);
const seasons = folderSeasons.filter(season => fs.readdirSync(path.join(REAL_DIR, String(season)))
  .some(g => isScrape(readJson(path.join(REAL_DIR, String(season), g, COURSE, 'free', '50.json')))));
const LATEST = Math.max(...seasons);
const HISTORY_FROM = 1971; // the 1970-71 season, USMS's first
// Real datasets: [season, group] with any real file
function realGroups(season) {
  const dir = path.join(REAL_DIR, String(season));
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(g => isReal(readJson(path.join(dir, g, COURSE, 'free', '50.json'))));
}
function realRanking(season, group, stroke, d) {
  const body = readJson(path.join(REAL_DIR, String(season), group, COURSE, stroke, `${d}.json`));
  if (!isReal(body) || !body.swimmers.length) return null;
  return { n: body.total, times: body.swimmers.map(x => secs(x.time)) };
}
const at = (r, p) => r.times[Math.min(r.times.length - 1, Math.max(0, Math.ceil(r.n * p) - 1))];
const REAL_LATEST = realGroups(LATEST);
if (!REAL_LATEST.length) throw new Error(`No real rankings in ${REAL_DIR}/${LATEST} to model from`);
UPDATED = REAL_LATEST.map(g => readJson(path.join(REAL_DIR, String(LATEST), g, COURSE, 'free', '50.json')).updated).sort().pop();

// Start from nothing: the folder is only ever this script's output
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const avg = xs => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
// Shape of the slower half: time at p over time at 55%, averaged over the
// real groups, at 1% steps
const GRID = Array.from({ length: 101 }, (_, i) => i / 100);
function realShape(stroke, d) {
  const ranks = REAL_LATEST.map(g => realRanking(LATEST, g, stroke, d)).filter(r => r && r.n >= 20);
  if (!ranks.length) return null;
  return GRID.map(p => avg(ranks.map(r => at(r, p) / at(r, 0.55))));
}
// 25 over 50 at each place, and the 25's field over the 50's
function real25(stroke) {
  const pairs = REAL_LATEST.map(g => [realRanking(LATEST, g, stroke, 25), realRanking(LATEST, g, stroke, 50)]).filter(x => x[0] && x[1]);
  if (!pairs.length) return null;
  return {
    ratio: GRID.map(p => avg(pairs.map(([a, b]) => at(a, p) / at(b, p)))),
    field: avg(pairs.map(([a, b]) => a.n / b.n)),
  };
}
// How a season compares with the latest, per event: field size and median
function seasonEffect(season, stroke, d) {
  const pairs = realGroups(season).map(g => [realRanking(season, g, stroke, d), realRanking(LATEST, g, stroke, d)]).filter(x => x[0] && x[1]);
  if (!pairs.length) return { field: 1, time: 1 };
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  return {
    field: clamp(avg(pairs.map(([a, b]) => a.n / b.n)), 0.3, 1.6),
    time: clamp(avg(pairs.map(([a, b]) => at(a, 0.5) / at(b, 0.5))), 0.95, 1.05),
  };
}
const lookup = (grid, p) => {
  const x = Math.min(100, Math.max(0, p * 100)), i = Math.floor(x), f = x - i;
  return i >= 100 ? grid[100] : grid[i] + (grid[i + 1] - grid[i]) * f;
};

// ---------- One modeled ranking ----------

// Deterministic randomness, seeded per file
function rng(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353), h = (h << 13) | (h >>> 19);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// The cut-based curve for an age group's event (latest season): time at a
// share of the field
function curveFor(sex, ageMin, stroke, d) {
  const slice = standards.slices.find(s => s.course === 'SCY' && s.sex === sex && s.low_age === ageMin);
  const e = slice && slice.events.find(x => x.stroke === STROKE_LABELS[stroke] && x.distance === d);
  if (!e) return null;
  const n = e.rows_returned;
  const pts = [[1 / n, secs(e.fastest_time)]].concat(
    ['AAAA', 'AAA', 'AA', 'A', 'BB', 'B'].filter(t => e.cutoffs[t]).map(t => [e.cutoffs[t].row / n, e.cutoffs[t].seconds]))
    .sort((a, b) => a[0] - b[0]).filter((x, i, a) => !i || x[0] > a[i - 1][0]);
  const [pB, tB] = pts[pts.length - 1];
  const shape = realShape(stroke, d);
  const q = p => {
    if (p <= pts[0][0]) return pts[0][1];
    if (p <= pB) {
      for (let i = 1; i < pts.length; i++) {
        if (p <= pts[i][0]) {
          const [p0, t0] = pts[i - 1], [p1, t1] = pts[i];
          return t0 + (t1 - t0) * (p - p0) / (p1 - p0);
        }
      }
    }
    // The slower half: the real shape from the top-55% time (or a gentle
    // straight line where there's no real shape)
    return shape ? tB * lookup(shape, p) / lookup(shape, pB) : tB * (1 + 0.6 * (p - pB));
  };
  return { n, capped: e.cap_hit, q };
}

function writeEvent(season, gender, sex, ageMin, stroke, d) {
  let curve = curveFor(sex, ageMin, stroke, d);
  if (!curve && d === 25) {
    const base = curveFor(sex, ageMin, stroke, 50), r25 = real25(stroke);
    if (!base || !r25) return 0;
    curve = { n: Math.round(base.n * r25.field), capped: false, q: p => base.q(p) * lookup(r25.ratio, p) };
  }
  if (!curve) return 0;
  const eff = seasonEffect(season, stroke, d);
  const n = Math.max(1, Math.min(CAP, Math.round(curve.n * eff.field)));
  const rand = rng(`${season}|${gender}|${ageMin}|${stroke}|${d}`);
  const times = [];
  for (let i = 0; i < n; i++) {
    const p = Math.min(1, Math.max(0, (i + 0.5 + (rand() - 0.5) * 0.7) / n));
    times.push(Math.round(curve.q(p) * eff.time * 100) / 100);
  }
  times.sort((a, b) => a - b);
  const age = ageKey(ageMin), hi = ageMin === 18 ? 24 : ageMin + 4;
  let rank = 0;
  const swimmers = times.map((t, i) => {
    if (!i || t !== times[i - 1]) rank = i + 1;
    // No name, club or meet: synthetic swimmers aren't people
    return { rank, age: ageMin + Math.floor(rand() * (hi - ageMin + 1)), time: fmt(t) };
  });
  const body = {
    course: COURSE, season, seasonLabel: `${season - 1}–${season}`, gender, age, stroke, distance: d,
    event: `${d} ${STROKE_LABELS[stroke]}`, updated: UPDATED,
    provenance: 'synthetic',
    total: n,
    truncated: !!curve.capped && n >= CAP,
    swimmers,
  };
  const dir = path.join(OUT_DIR, String(season), `${gender}-${age}`, COURSE, stroke);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${d}.json`), JSON.stringify(body));
  return 1;
}

// ---------- History: Top 10s before the real data ----------
//
// Seasons from 1970-71 up to the first real season hold only each event's
// Top 10 ("truncated", with "total" the modeled field size). Times are the
// latest season's Top 10 scaled by how much slower that era was: the real
// USMS Top 10 lists for men 50-54 (src/_data/topTens.json, 1976-2026 by
// decade) give each event's 10th place against 2026's, interpolated between
// decades and carried back past 1976. Fields shrink going back with USMS's
// growth. Events and age groups follow USMS's history: no 25s before 2000,
// no 1000 free before 1980, no 18-24 group before 1990.

const topTens = require(path.join(root, 'src', '_data', 'topTens.json'));
const ERA_LIST = topTens.lists.find(l => l.course === 'SCY');
const ERA_YEARS = Object.keys(ERA_LIST.seasons).map(Number).sort();
const ERA_REF = ERA_YEARS[ERA_YEARS.length - 1];
function eraRatio(season, stroke, d) {
  const label = STROKE_LABELS[stroke];
  const tenth = (y, st, dist) => {
    const list = ((ERA_LIST.seasons[y] || {})[st] || {})[dist];
    return list && list.length ? secs(list[list.length - 1]) : NaN;
  };
  // This event's ratio each decade, or the average of every event's
  const at = y => {
    const own = tenth(y, label, d) / tenth(ERA_REF, label, d);
    if (isFinite(own)) return own;
    const all = [];
    Object.keys(ERA_LIST.seasons[y] || {}).forEach(st => Object.keys(ERA_LIST.seasons[y][st]).forEach(dist => {
      const r = tenth(y, st, dist) / tenth(ERA_REF, st, dist);
      if (isFinite(r)) all.push(r);
    }));
    return avg(all);
  };
  const ys = ERA_YEARS, r = ys.map(at);
  if (season <= ys[0]) return r[0] + (r[0] - r[1]) * (ys[0] - season) / (ys[1] - ys[0]) * 0.5;
  for (let i = 1; i < ys.length; i++) {
    if (season <= ys[i]) return r[i - 1] + (r[i] - r[i - 1]) * (season - ys[i - 1]) / (ys[i] - ys[i - 1]);
  }
  return 1;
}
// Field size against today's, as USMS grew
const FIELD = [[1971, 0.05], [1980, 0.25], [1990, 0.5], [2000, 0.7], [2010, 0.9], [2016, 1]];
function fieldFactor(season) {
  if (season <= FIELD[0][0]) return FIELD[0][1];
  for (let i = 1; i < FIELD.length; i++) {
    const [y0, f0] = FIELD[i - 1], [y1, f1] = FIELD[i];
    if (season <= y1) return f0 + (f1 - f0) * (season - y0) / (y1 - y0);
  }
  return 1;
}

// An age group's latest-season Top 10 and field size: the real ranking where
// there is one, otherwise the modeled curve
function latestTop(group, sex, ageMin, stroke, d) {
  const real = realRanking(LATEST, group, stroke, d);
  if (real) return { n: real.n, top: real.times.slice(0, 10) };
  let curve = curveFor(sex, ageMin, stroke, d);
  if (!curve && d === 25) {
    const base = curveFor(sex, ageMin, stroke, 50), r25 = real25(stroke);
    if (base && r25) curve = { n: Math.round(base.n * r25.field), q: p => base.q(p) * lookup(r25.ratio, p) };
  }
  if (!curve) return null;
  return { n: curve.n, top: Array.from({ length: Math.min(10, curve.n) }, (_, i) => curve.q((i + 0.5) / curve.n)) };
}

function writeHistoryEvent(season, gender, sex, ageMin, stroke, d) {
  const age = ageKey(ageMin), group = `${gender}-${age}`;
  const offered = !(d === 25 && season < 2000) && !(stroke === 'free' && d === 1000 && season < 1980);
  const base = offered ? latestTop(group, sex, ageMin, stroke, d) : null;
  const rand = rng(`history|${season}|${gender}|${ageMin}|${stroke}|${d}`);
  const n = base ? Math.max(1, Math.round(base.n * fieldFactor(season))) : 0;
  const era = base ? eraRatio(season, stroke, d) : 1;
  const times = base ? base.top.slice(0, Math.min(10, n)).map(t => Math.round(t * era * (1 + (rand() - 0.5) * 0.012) * 100) / 100).sort((a, b) => a - b) : [];
  const hi = ageMin === 18 ? 24 : ageMin + 4;
  let rank = 0;
  const swimmers = times.map((t, i) => {
    if (!i || t !== times[i - 1]) rank = i + 1;
    return { rank, age: ageMin + Math.floor(rand() * (hi - ageMin + 1)), time: fmt(t) };
  });
  const body = {
    course: COURSE, season, seasonLabel: `${season - 1}–${season}`, gender, age, stroke, distance: d,
    event: `${d} ${STROKE_LABELS[stroke]}`, updated: UPDATED,
    provenance: 'synthetic',
    total: n,
    // Only the Top 10 is listed for these seasons
    truncated: n > swimmers.length,
    swimmers,
  };
  const dir = path.join(OUT_DIR, String(season), group, COURSE, stroke);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${d}.json`), JSON.stringify(body));
  return 1;
}

// ---------- Which datasets ----------

const wanted = new Map(); // "season|gender|ageMin" → [season, gender, sex, ageMin]
const ageOn = (birth, date) => {
  const [m, d, y] = birth.split('/').map(Number), [Y, M, D] = date.split('-').map(Number);
  return Y - y - (M * 100 + D < m * 100 + d ? 1 : 0);
};
const history = new Map(); // same keys, for seasons before the real data
const addHistory = (season, sex, ageMin) => {
  if (ageMin == null || AGE_MINS.indexOf(ageMin) < 0 || (ageMin === 18 && season < 1990)) return;
  const gender = sex === 'M' ? 'men' : 'women';
  history.set(`${season}|${gender}|${ageMin}`, [season, gender, sex, ageMin]);
};
const add = (season, sex, ageMin) => {
  if (ageMin == null || AGE_MINS.indexOf(ageMin) < 0) return;
  const gender = sex === 'M' ? 'men' : 'women';
  wanted.set(`${season}|${gender}|${ageMin}`, [season, gender, sex, ageMin]);
};
for (const u of Object.values(users)) {
  if (!u || !u.birthDate || !/^[MF]$/.test(u.gender || '')) continue;
  for (const season of seasons) add(season, u.gender, groupOf(ageOn(u.birthDate, `${season}-05-31`)));
  const now = AGE_MINS.indexOf(groupOf(ageOn(u.birthDate, new Date().toISOString().slice(0, 10))));
  for (const k of [now - 1, now, now + 1, now + 2]) add(LATEST, u.gender, AGE_MINS[k]);
  // History: their current age group every season (Top 10 by season), and
  // the group they were in each season they were 25 or older (Race History)
  for (let season = HISTORY_FROM; season < seasons[0]; season++) {
    addHistory(season, u.gender, AGE_MINS[now]);
    const then = ageOn(u.birthDate, `${season}-05-31`);
    if (then >= 25) addHistory(season, u.gender, groupOf(then));
  }
}

let datasets = 0, files = 0, skipped = 0;
for (const [season, gender, sex, ageMin] of wanted.values()) {
  if (realGroups(season).indexOf(`${gender}-${ageKey(ageMin)}`) >= 0) { skipped++; continue; }
  for (const [stroke, distances] of Object.entries(EVENTS[COURSE])) {
    for (const d of distances) files += writeEvent(season, gender, sex, ageMin, stroke, d);
  }
  datasets++;
}
// Seasons with a real Top 10 list (topTens.json: men 50-54 by decade) are
// written from it, flagged usms: real times and ages, though the lists carry
// no names, clubs or meets
const REAL_TOP_TENS = new Map(); // "season|gender|ageMin" → list
topTens.lists.filter(l => l.course === 'SCY').forEach(l => {
  Object.keys(l.seasons).map(Number).filter(y => y < seasons[0]).forEach(y => {
    REAL_TOP_TENS.set(`${y}|${l.gender === 'Men' ? 'men' : 'women'}|${l.ageGroup}`,
      { times: l.seasons[y], ages: (l.ages || {})[y] || {} });
  });
});
function writeRealTopTen(season, gender, ageMin, stroke, d, list) {
  const times = ((list.times[STROKE_LABELS[stroke]] || {})[d] || []).map(secs);
  const ages = (list.ages[STROKE_LABELS[stroke]] || {})[d] || [];
  let rank = 0;
  const swimmers = times.map((t, i) => {
    if (!i || t !== times[i - 1]) rank = i + 1;
    return ages[i] != null ? { rank, age: ages[i], time: fmt(t) } : { rank, time: fmt(t) };
  });
  const age = ageKey(ageMin);
  const body = {
    course: COURSE, season, seasonLabel: `${season - 1}–${season}`, gender, age, stroke, distance: d,
    event: `${d} ${STROKE_LABELS[stroke]}`, updated: UPDATED,
    provenance: 'usms',
    total: swimmers.length,
    // The USMS Top 10 list only: the full field isn't known
    truncated: swimmers.length > 0,
    swimmers,
  };
  const dir = path.join(OUT_DIR, String(season), `${gender}-${age}`, COURSE, stroke);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${d}.json`), JSON.stringify(body));
}

let historyFiles = 0, realTens = 0;
for (const [key, list] of REAL_TOP_TENS) {
  const [season, gender, ageMin] = key.split('|');
  history.delete(key);
  for (const [stroke, distances] of Object.entries(EVENTS[COURSE])) {
    for (const d of distances) writeRealTopTen(Number(season), gender, Number(ageMin), stroke, d, list);
  }
  realTens++;
}
for (const [season, gender, sex, ageMin] of history.values()) {
  for (const [stroke, distances] of Object.entries(EVENTS[COURSE])) {
    for (const d of distances) historyFiles += writeHistoryEvent(season, gender, sex, ageMin, stroke, d);
  }
}
console.log(`${history.size} synthetic history datasets (${historyFiles} Top 10 files, ${HISTORY_FROM - 1}–${HISTORY_FROM} to ` +
  `${seasons[0] - 2}–${seasons[0] - 1}), ${realTens} from real Top 10 lists`);
const available = writeAvailable([REAL_DIR, OUT_DIR], path.join(OUT_DIR, 'available.json'));
const synthetic = available.datasets.filter(x => x.provenance === 'synthetic').length;
console.log(`${datasets} synthetic datasets (${files} event files) written, ${skipped} already real → ` +
  `${path.relative(process.cwd(), OUT_DIR)}/ (available.json: ${available.datasets.length} datasets, ${synthetic} synthetic)`);
