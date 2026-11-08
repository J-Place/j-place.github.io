// scripts/flog-seed.js
// Writes the FLOG mockup's synthetic data (api/flog/seed.mjs, which the
// FLOG API starts every visitor from): a made-up log for every member
// persona in src/_data/users.json, in the Fitness Log's own field names
// (FlogModel.cs and Bonfire's primer).
//
// Usage: npm run flog:seed [-- --anchor=YYYY-MM-DD]
//
// Seeded, so every run with the same anchor writes the same file. The anchor
// is the "today" the data was made for: the API shifts every date by the days
// since then, so the latest swim is always yesterday and today has none.

'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const users = require(path.join(root, 'src/_data/users.json'));

const arg = process.argv.find(a => a.startsWith('--anchor='));
const anchor = arg ? arg.split('=')[1] : '2026-11-07';

// mulberry32: a small seeded random number generator
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

const YARDS_PER = { Y: 1, M: 1 / 0.9144, mi: 1760 };
const toYards = (d, unit) => Math.round(d * YARDS_PER[unit] * 100) / 100;

function iso(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function addDays(isoDate, n) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return iso(new Date(y, m - 1, d + n));
}
function weekday(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}
function month(isoDate) {
  return Number(isoDate.slice(5, 7));
}

const POOL_NOTES = [
  'Masters practice', 'Aerobic main set, 5x300 pull', 'Threshold set, 10x200 on 3:00',
  'Kick and drill day', 'IM work, 4x400 IM', 'Easy recovery swim', 'Sprint 50s off the blocks',
  'Broken 1650', 'Coach had us do 20x100 descending 1-5', 'Lane to myself, worked on turns',
  'Pull with paddles, 3x800', 'Back and breast drills', 'Fly 25s, then easy 500', '',
  '', '', 'Tempo trainer set, 1.2 sec/stroke'
];
const OW_NOTES = [
  'Lake swim with the group', 'Ocean swim, a little chop', 'Open water loop, sighting practice',
  'Bay swim, water 68°F', 'Practice for the 2-mile race', ''
];
const LONG_NOTES = [
  'Felt strong through the main set today. Held 1:25s on the 100s for the first time this season, then fell apart a bit on the last four. Shoulder was fine. Need to remember to eat something before morning practice.',
  'Pool was crowded so I shared a lane with three others. Did the coach\'s workout but shortened the warmup. Worked on keeping my head down on breathing strokes and it made a real difference in the back half of the 200s.'
];
const STROKES = ['Free', 'Free', 'Free', 'Back', 'Breast', 'Fly', 'IM'];

// How each persona swims. Others get the default habits.
const HABITS = {
  KT2JH: { months: 14, perWeek: 4.2, course: 'SCY', poolUnits: { SCY: 'Y' }, base: 3200, spread: 900, owSummer: 0.25, owUnit: 'mi', pace: 1.55,
           prefs: { WorkoutsPublic: 1, MeasurementsPublic: 0, UserDefaultView: 'week', UserDefaultCourse: 'SCY', UserDefaultDistance: 'Y' },
           prior: { NumSessions: 1184, TotalMinutes: 70250, TotalYards: 3482600 }, firstLogDate: '2012-01-09' },
  GAT0R: { months: 14, perWeek: 3.4, course: 'LCM', poolUnits: { LCM: 'M', SCM: 'M' }, base: 3000, spread: 1100, owSummer: 0.4, owUnit: 'mi', pace: 1.7, mixScm: 0.25,
           prefs: { WorkoutsPublic: 0, MeasurementsPublic: 0, UserDefaultView: 'month', UserDefaultCourse: 'LCM', UserDefaultDistance: 'M' },
           prior: { NumSessions: 712, TotalMinutes: 47900, TotalYards: 2140300 }, firstLogDate: '2016-06-02' }
};
const DEFAULT_HABITS = { months: 3, perWeek: 2.6, course: 'SCY', poolUnits: { SCY: 'Y' }, base: 2200, spread: 700, owSummer: 0.1, owUnit: 'Y', pace: 1.9,
  prefs: { WorkoutsPublic: 0, MeasurementsPublic: 0, UserDefaultView: 'month', UserDefaultCourse: 'SCY', UserDefaultDistance: 'Y' } };

function roundTo(n, step) {
  return Math.max(step, Math.round(n / step) * step);
}

function swimmerLog(id, idBase) {
  const h = Object.assign({}, DEFAULT_HABITS, HABITS[id] || {});
  const r = rng(hash(id + anchor));
  const pick = list => list[Math.floor(r() * list.length)];
  const start = addDays(anchor, -Math.round(h.months * 30.4));
  const entries = [];
  let longNotes = 0;
  // Swim days: the persona's usual days, with a few skipped and a few added
  const usual = [1, 3, 5, 6, 2, 4, 0].slice(0, Math.ceil(h.perWeek));
  for (let day = start; day < anchor; day = addDays(day, 1)) {
    const wd = weekday(day);
    let swims = 0;
    if (usual.includes(wd)) swims = r() < 0.82 ? 1 : 0;
    else if (r() < 0.05) swims = 1;
    if (swims && r() < 0.035) swims = 2; // a two-swim day now and then
    if (day === addDays(anchor, -2) || day === addDays(anchor, -9)) swims = 2; // and always two recent ones
    if (day === addDays(anchor, -1)) swims = 1; // a swim yesterday, none today
    for (let s = 0; s < swims; s++) {
      const summer = month(day) >= 6 && month(day) <= 9;
      const ow = summer && r() < h.owSummer;
      let course, unit, distance;
      if (ow) {
        course = 'OW';
        unit = h.owUnit;
        distance = unit === 'mi' ? roundTo(0.5 + r() * 2, 0.1) : roundTo(1500 + r() * 2500, 100);
        distance = Math.round(distance * 10) / 10;
      } else {
        course = h.mixScm && r() < h.mixScm ? 'SCM' : h.course;
        if (r() < 0.02) course = 'Other';
        unit = course === 'Other' ? 'Y' : (h.poolUnits[course] || 'Y');
        distance = roundTo(h.base + (r() - 0.5) * 2 * h.spread, course === 'Other' ? 50 : 100);
        if (s === 1) distance = roundTo(distance * 0.5, 100); // the second swim of the day is short
      }
      const yards = toYards(distance, unit);
      const minutes = Math.round((yards / 100) * h.pace * (ow ? 1.15 : 1) + (ow ? 0 : 8 + r() * 8));
      const entry = {
        EntryID: idBase + entries.length,
        Date: day,
        RawDistance: distance,
        RawDistanceUnit: unit,
        RawDistanceCourse: course,
        DistanceYards: yards,
        DurationMinutes: minutes,
        Details: ow ? pick(OW_NOTES) : pick(POOL_NOTES)
      };
      if (longNotes < LONG_NOTES.length && r() < 0.03) entry.Details = LONG_NOTES[longNotes++];
      // The new fields are optional: about half the swims have them
      if (r() < 0.55) entry.Intensity = Math.min(10, Math.max(1, Math.round(3 + r() * 6)));
      if (r() < 0.4) entry.Stroke = ow ? 'Free' : pick(STROKES);
      if (r() < 0.3) entry.Calories = Math.round(minutes * (7 + r() * 4));
      entries.push(entry);
    }
  }
  // Make sure both long comments appear, on recent swims
  LONG_NOTES.slice(longNotes).forEach((note, i) => {
    const e = entries[entries.length - 3 - i * 4];
    if (e) e.Details = note;
  });
  const seed = { preferences: h.prefs, entries };
  if (h.prior) {
    seed.prior = h.prior;
    seed.firstLogDate = h.firstLogDate;
  }
  return seed;
}

// Every logged-in member persona gets a log; non-members and the logged-out
// guest get none (FLOG is for members)
const swimmers = {};
let idBase = 100000;
for (const [id, u] of Object.entries(users)) {
  if (!u.loggedIn || !u.membershipTier) continue;
  swimmers[id] = swimmerLog(id, idBase);
  idBase += 100000;
}

const out = path.join(root, 'api/flog/seed.mjs');
fs.mkdirSync(path.dirname(out), { recursive: true });
const body = JSON.stringify({ anchor, swimmers });
fs.writeFileSync(out,
  '// Generated by scripts/flog-seed.js (npm run flog:seed): synthetic, made-up\n' +
  '// Fitness Log data for the FLOG mockup. Don\'t edit by hand.\n' +
  'export default ' + body + ';\n');
const counts = Object.entries(swimmers).map(([id, s]) => id + ' ' + s.entries.length).join(', ');
console.log('Wrote ' + path.relative(root, out) + ' (' + Math.round(body.length / 1024) + ' KB): ' + counts);
