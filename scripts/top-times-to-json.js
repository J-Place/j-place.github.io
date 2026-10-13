// scripts/top-times-to-json.js
// Turns scripts/scrape-top-times.js's raw output (top-times-scrape/
// scy-top500.csv + done.jsonl) into static Top Times API responses under
// src/data/top-times/, published at /data/top-times/. The contract is
// docs/api/top-times.openapi.yaml: each file is exactly the body of a
// GET /top-times response, one per event, at
//   {season}/{gender}-{age}/{course}/{stroke}/{distance}.json
// One file per event keeps a page's runtime fetch to the one ranking it
// shows. The index, available.json, is rebuilt by every build.
//
// Every search in done.jsonl gets a file, so an event the rankings had no one
// for is an empty list rather than missing. Rewrites only the datasets the
// scrape covers.
//
// Usage:
//   npm run top-times:json -- [--in top-times-scrape] [--out src/data/top-times]
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const flag = n => { const i = args.indexOf('--' + n); return i > -1 ? args[i + 1] : null; };
const root = path.join(__dirname, '..');
const IN_DIR = path.resolve(flag('in') || path.join(root, 'top-times-scrape'));
const OUT_DIR = path.resolve(flag('out') || path.join(root, 'src', 'data', 'top-times'));

const { EVENTS } = require('./lib/top-times-available');

const COURSE = 'scy'; // the scraper only does SCY so far
const GENDERS = { M: 'men', F: 'women' };
const STROKE_LABELS = { free: 'Free', back: 'Back', breast: 'Breast', fly: 'Fly', im: 'IM' };
const CAP = 500; // most rows the rankings return

// Minimal CSV parser: quoted fields with "" escapes, no newlines inside fields.
function parseCsvLine(line) {
  const cells = [];
  let cell = '', quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { cells.push(cell); cell = ''; }
    else cell += ch;
  }
  cells.push(cell);
  return cells;
}

// The CSV's stroke column holds the label ("Free"); key rows by the API's value.
const [header, ...lines] = fs.readFileSync(path.join(IN_DIR, 'scy-top500.csv'), 'utf8').split('\n').filter(Boolean);
const cols = parseCsvLine(header);
const rowsBySearch = new Map(); // "season|sex|stroke|distance|lo|hi" → rows
for (const line of lines) {
  const r = Object.fromEntries(parseCsvLine(line).map((v, i) => [cols[i], v]));
  const key = [r.season, r.sex, r.stroke.toLowerCase(), r.distance, r.lowage, r.highage].join('|');
  if (!rowsBySearch.has(key)) rowsBySearch.set(key, []);
  rowsBySearch.get(key).push(r);
}

// One dataset per season × gender × age group the scrape searched, dated by
// its most recent search.
const datasets = new Map();
for (const line of fs.readFileSync(path.join(IN_DIR, 'done.jsonl'), 'utf8').split('\n').filter(Boolean)) {
  const { key, scraped } = JSON.parse(line);
  const [season, sex, , , lo, hi] = key.split('|');
  const id = [season, sex, lo, hi].join('|');
  const prev = datasets.get(id);
  datasets.set(id, { season, sex, lo, hi, updated: !prev || (scraped && scraped > prev.updated) ? scraped : prev.updated });
}

let files = 0, swimmers = 0;
for (const { season, sex, lo, hi, updated } of datasets.values()) {
  const gender = GENDERS[sex];
  const age = `${lo}-${hi}`;
  for (const [stroke, distances] of Object.entries(EVENTS[COURSE])) {
    const dir = path.join(OUT_DIR, season, `${gender}-${age}`, COURSE, stroke);
    fs.mkdirSync(dir, { recursive: true });
    for (const distance of distances) {
      const rows = rowsBySearch.get([season, sex, stroke, distance, lo, hi].join('|')) || [];
      const body = {
        course: COURSE,
        season: Number(season),
        seasonLabel: `${season - 1}–${season}`,
        gender,
        age,
        stroke,
        distance,
        event: `${distance} ${STROKE_LABELS[stroke]}`,
        updated,
        // Real usms.org rankings; replaces any synthetic file for this event
        // (scripts/top-times-synthetic.js)
        provenance: 'usms',
        total: rows.length,
        truncated: rows.length >= CAP,
        swimmers: rows.map(r => ({ rank: Number(r.rank), name: r.name, age: Number(r.age), time: r.time, club: r.club, meet: r.meet })),
      };
      fs.writeFileSync(path.join(dir, `${distance}.json`), JSON.stringify(body));
      files++;
      swimmers += rows.length;
    }
  }
}

// available.json isn't written here: every build rebuilds it over this folder
// and the generated one (scripts/top-times-synthetic.js, npm prebuild).

console.log(`${datasets.size} datasets, ${files} event files, ${swimmers} swimmers → ${path.relative(process.cwd(), OUT_DIR)}/ ` +
  '(available.json and synthetic data update on the next build, or npm run top-times:synthetic)');
