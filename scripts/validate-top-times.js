// scripts/validate-top-times.js
// Checks every static Top Times file against its contract,
// docs/api/top-times.openapi.yaml: the committed real scrapes in
// src/data/top-times/ and what the build generates into
// src/data/top-times-generated/ (scripts/top-times-synthetic.js). Both
// publish at /data/top-times/, so they're checked as one set. Run it after a
// scrape (npm run top-times:json) or a change to the generator.
//
// Checks:
//   - every ranking matches the spec's TopTimes schema, available.json its
//     Available schema, and the spec's own examples their schemas
//   - a ranking's path is its own season/gender-age/course/stroke/distance,
//     and that event is swum in that course
//   - swimmers run fastest first: ranks and times never go down, a tie shares
//     a rank, and every age is inside the age group
//   - total: equals the list's length, unless truncated (then at least it)
//   - provenance: synthetic swimmers have no name, club or meet; the
//     committed real scrapes have all three
//   - no dataset is in both folders (a real scrape replaces synthetic data)
//   - available.json lists exactly the datasets on disk, with their provenance
//
// Usage:
//   npm run top-times:validate -- [--all] [--real src/data/top-times] [--generated src/data/top-times-generated]
//   --all  list every problem (default: the first 50)
// Exits 1 if anything fails. The generated folder only exists after a build
// (or npm run top-times:synthetic); without it, only the real files are checked.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv2020 = require('ajv/dist/2020');
const { EVENTS } = require('./lib/top-times-available');

const args = process.argv.slice(2);
const flag = n => { const i = args.indexOf('--' + n); return i > -1 ? args[i + 1] : null; };
const root = path.join(__dirname, '..');
const REAL_DIR = path.resolve(flag('real') || path.join(root, 'src', 'data', 'top-times'));
const GEN_DIR = path.resolve(flag('generated') || path.join(root, 'src', 'data', 'top-times-generated'));
const SPEC = path.join(root, 'docs', 'api', 'top-times.openapi.yaml');

const problems = [];
const fail = (file, msg) => problems.push(`${path.relative(root, file)}: ${msg}`);
const secs = t => String(t).split(':').reduce((a, p) => a * 60 + Number(p), 0);

// ---------- Schemas from the spec ----------

const spec = yaml.load(fs.readFileSync(SPEC, 'utf8'));
// OpenAPI 3.1 schemas are JSON Schema 2020-12. Register the spec so its
// '#/components/...' refs resolve, then compile each schema by reference.
const ajv = new Ajv2020({ strict: false, allErrors: true });
ajv.addFormat('date', /^\d{4}-\d{2}-\d{2}$/);
ajv.addSchema({ $id: 'spec', components: spec.components });
const schema = name => ajv.getSchema(`spec#/components/schemas/${name}`);
const check = (name, data, file) => {
  const validate = schema(name);
  if (!validate(data)) {
    for (const e of validate.errors.slice(0, 3)) fail(file, `${name} schema: ${e.instancePath || '/'} ${e.message}`);
  }
};

const get = spec.paths['/top-times'].get.responses;
for (const [name, ex] of Object.entries(get['200'].content['application/json'].examples)) check('TopTimes', ex.value, `${SPEC}#example:${name}`);
check('Available', spec.paths['/top-times/available'].get.responses['200'].content['application/json'].example, `${SPEC}#example:available`);
for (const r of ['BadRequest', 'NotFound']) check('Error', spec.components.responses[r].content['application/json'].example, `${SPEC}#example:${r}`);

// ---------- Rankings ----------

const datasets = new Map(); // "course|season|gender|age" → { provenance, dir }
let rankings = 0, swimmers = 0;

function checkRanking(file, rel, isReal) {
  let j;
  try { j = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return fail(file, `not JSON: ${e.message}`); }
  rankings++;
  check('TopTimes', j, file);
  if (!Array.isArray(j.swimmers)) return;
  swimmers += j.swimmers.length;

  const expected = [j.season, `${j.gender}-${j.age}`, j.course, j.stroke, `${j.distance}.json`].join('/');
  if (rel !== expected) fail(file, `path doesn't match its contents (${expected})`);
  if (!(EVENTS[j.course]?.[j.stroke] || []).includes(j.distance)) fail(file, `${j.distance} ${j.stroke} isn't an event in ${j.course}`);

  if (j.truncated ? j.total < j.swimmers.length : j.total !== j.swimmers.length) {
    fail(file, `total ${j.total} vs ${j.swimmers.length} swimmers (truncated: ${j.truncated})`);
  }

  const [lo, hi] = j.age.split('-').map(Number);
  const synthetic = j.provenance === 'synthetic';
  j.swimmers.forEach((s, i) => {
    if (s.age < lo || s.age > hi) fail(file, `#${i + 1} age ${s.age} outside ${j.age}`);
    const named = ['name', 'club', 'meet'].filter(k => k in s);
    if (synthetic && named.length) fail(file, `#${i + 1} is synthetic but has ${named.join(', ')}`);
    if (isReal && named.length < 3) fail(file, `#${i + 1} is a real scrape but is missing name, club or meet`);
    if (i === 0) return;
    const prev = j.swimmers[i - 1];
    if (s.rank < prev.rank) fail(file, `#${i + 1} rank ${s.rank} after ${prev.rank}`);
    if (secs(s.time) < secs(prev.time)) fail(file, `#${i + 1} time ${s.time} faster than ${prev.time} above it`);
    if (s.time === prev.time && s.rank !== prev.rank) fail(file, `#${i + 1} ties ${prev.time} but has a different rank`);
  });

  const key = [j.course, j.season, j.gender, j.age].join('|');
  const prov = j.provenance || 'usms';
  const seen = datasets.get(key);
  if (!seen) datasets.set(key, { provenance: prov, dir: isReal ? 'real' : 'generated' });
  else if (seen.dir !== (isReal ? 'real' : 'generated')) fail(file, `dataset ${key} is in both folders`);
}

function walk(dir, isReal, base = dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, isReal, base);
    else if (e.name.endsWith('.json') && !(dir === base && e.name === 'available.json')) {
      checkRanking(p, path.relative(base, p).split(path.sep).join('/'), isReal);
    }
  }
}

walk(REAL_DIR, true);
const haveGenerated = fs.existsSync(GEN_DIR);
if (haveGenerated) walk(GEN_DIR, false);

// ---------- available.json ----------

const availablePath = path.join(GEN_DIR, 'available.json');
if (fs.existsSync(availablePath)) {
  const available = JSON.parse(fs.readFileSync(availablePath, 'utf8'));
  check('Available', available, availablePath);
  const listed = new Set();
  for (const d of available.datasets || []) {
    const key = [d.course, d.season, d.gender, d.age].join('|');
    listed.add(key);
    const onDisk = datasets.get(key);
    if (!onDisk) fail(availablePath, `lists ${key}, which has no files`);
    else if (onDisk.provenance !== d.provenance) fail(availablePath, `${key} is ${d.provenance} here but ${onDisk.provenance} on disk`);
  }
  for (const key of datasets.keys()) if (!listed.has(key)) fail(availablePath, `doesn't list ${key}`);
} else if (haveGenerated) {
  fail(availablePath, 'missing');
}

// ---------- Report ----------

const byProv = {};
for (const { provenance, dir } of datasets.values()) byProv[`${dir} ${provenance}`] = (byProv[`${dir} ${provenance}`] || 0) + 1;
console.log(`${rankings} rankings, ${swimmers} swimmers, ${datasets.size} datasets ` +
  `(${Object.entries(byProv).map(([k, n]) => `${n} ${k}`).join(', ')})`);
if (!haveGenerated) console.log(`No ${path.relative(root, GEN_DIR)}/: checked the real files only. Run npm run top-times:synthetic to include the generated ones.`);
if (problems.length) {
  const shown = args.includes('--all') ? problems : problems.slice(0, 50);
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:\n  ` + shown.join('\n  ') +
    (problems.length > shown.length ? `\n  … and ${problems.length - shown.length} more` : ''));
  process.exit(1);
}
console.log('All files match the spec.');
