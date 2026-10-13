// scripts/lib/top-times-available.js
// Builds the Top Times index, available.json (GET /top-times/available,
// docs/api/top-times.openapi.yaml), and the event list shared by
// scripts/top-times-to-json.js (real rankings) and
// scripts/top-times-synthetic.js (the build's generated data, which writes
// the index).
const fs = require('fs');
const path = require('path');

const EVENTS = {
  scy: {
    free: [25, 50, 100, 200, 500, 1000, 1650],
    back: [25, 50, 100, 200],
    breast: [25, 50, 100, 200],
    fly: [25, 50, 100, 200],
    im: [100, 200, 400],
  },
};

// One index over every dataset folder in `dirs` (the committed real scrapes
// and the build's generated data share the /data/top-times/ URLs), written
// to `outFile`. A file without provenance predates the field and is real.
function writeAvailable(dirs, outFile) {
  const available = { updated: '', datasets: [], events: {} };
  for (const dir of dirs.filter(d => fs.existsSync(d))) {
    for (const season of fs.readdirSync(dir).filter(d => /^\d{4}$/.test(d))) {
      for (const group of fs.readdirSync(path.join(dir, season))) {
        const [, gender, age] = group.match(/^(men|women)-(\d+-\d+)$/) || [];
        if (!gender) continue;
        for (const course of fs.readdirSync(path.join(dir, season, group))) {
          const sample = path.join(dir, season, group, course, 'free', '50.json');
          const { updated, provenance } = JSON.parse(fs.readFileSync(sample, 'utf8'));
          available.datasets.push({ course, season: Number(season), gender, age, provenance: provenance || 'usms' });
          available.events[course] = EVENTS[course];
          if (updated > available.updated) available.updated = updated;
        }
      }
    }
  }
  available.datasets.sort((a, b) => a.course.localeCompare(b.course) || b.season - a.season ||
    a.gender.localeCompare(b.gender) || parseInt(a.age) - parseInt(b.age));
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(available, null, 1) + '\n');
  return available;
}

module.exports = { EVENTS, writeAvailable };
