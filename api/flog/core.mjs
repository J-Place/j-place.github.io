// FLOG API: the rules, with no storage or HTTP. Pure, so the tests and
// both servers (Netlify, the local dev server) share them. Field names are
// the Fitness Log's own (docs/api/flog.openapi.yaml).

export const COURSES = ['SCY', 'SCM', 'LCM', 'OW', 'Other'];
export const UNITS = ['Y', 'M', 'mi'];
export const VIEWS = ['week', 'month'];
export const YARDS_PER = { Y: 1, M: 1 / 0.9144, mi: 1760 };
export const DEFAULT_PREFERENCES = {
  WorkoutsPublic: 0,
  MeasurementsPublic: 0,
  UserDefaultView: 'week',
  UserDefaultCourse: 'SCY',
  UserDefaultDistance: 'Y'
};
// Keeps one visitor's record a sensible size (the API is public)
export const MAX_ENTRIES = 3000;
export const MAX_DETAILS = 2000;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// ---------- Dates: plain calendar dates, YYYY-MM-DD ----------

export function isoDate(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
export function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(s, n) {
  const d = parseDate(s);
  d.setDate(d.getDate() + n);
  return isoDate(d);
}
export function daysBetween(a, b) {
  return Math.round((parseDate(b) - parseDate(a)) / 864e5);
}
export function isDate(s) {
  return typeof s === 'string' && DATE.test(s) && isoDate(parseDate(s)) === s;
}

export function toYards(distance, unit) {
  return Math.round(distance * YARDS_PER[unit] * 100) / 100;
}

// ---------- A visitor's record ----------

// A new record for one swimmer: their seed log, its dates moved forward so
// the latest swim is the day before `today`, or an empty one
export function recordFromSeed(seed, swimmer, today, empty) {
  const mine = !empty && seed.swimmers[swimmer];
  if (!mine) return { preferences: { ...DEFAULT_PREFERENCES }, entries: [], prior: null, firstLogDate: null };
  const shift = daysBetween(seed.anchor, today);
  return {
    preferences: { ...DEFAULT_PREFERENCES, ...mine.preferences },
    entries: mine.entries.map(e => ({ ...e, Date: addDays(e.Date, shift) })),
    prior: mine.prior || null,
    firstLogDate: mine.firstLogDate || null
  };
}

// ---------- Validation ----------

const isNumber = v => typeof v === 'number' && Number.isFinite(v);
const isWhole = v => isNumber(v) && Math.round(v) === v;

// The problems with an entry, each { field, message }; empty when valid.
// `today` is the server's date; a day's grace lets swimmers ahead of it
// (east of the server's time zone) log their own today.
export function entryProblems(e, today) {
  const problems = [];
  const add = (field, message) => problems.push({ field, message });
  if (!isDate(e.Date)) add('Date', 'Enter the date of your swim.');
  else if (e.Date > addDays(today, 1)) add('Date', 'The date can’t be in the future.');
  if (!COURSES.includes(e.RawDistanceCourse)) add('RawDistanceCourse', 'Choose where you swam.');
  if (!UNITS.includes(e.RawDistanceUnit)) add('RawDistanceUnit', 'Choose yards, meters or miles.');
  if (!isNumber(e.RawDistance) || e.RawDistance <= 0) add('RawDistance', 'Enter how far you swam.');
  else if (UNITS.includes(e.RawDistanceUnit) && toYards(e.RawDistance, e.RawDistanceUnit) > 100000) add('RawDistance', 'That’s more than 100,000 yards. Check the distance and unit.');
  if (!isWhole(e.DurationMinutes) || e.DurationMinutes < 1 || e.DurationMinutes > 1440) add('DurationMinutes', 'Enter your time in whole minutes, 1 to 1440.');
  if (e.Details != null && typeof e.Details !== 'string') add('Details', 'Comments must be text.');
  else if (e.Details && e.Details.length > MAX_DETAILS) add('Details', 'Comments can be up to ' + MAX_DETAILS + ' characters.');
  if (e.Intensity != null && (!isWhole(e.Intensity) || e.Intensity < 1 || e.Intensity > 10)) add('Intensity', 'Intensity is 1 to 10.');
  if (e.Calories != null && (!isNumber(e.Calories) || e.Calories < 0 || e.Calories > 20000)) add('Calories', 'Calories must be a number from 0 to 20,000.');
  if (e.Stroke != null && (typeof e.Stroke !== 'string' || e.Stroke.length > 20)) add('Stroke', 'Stroke must be a short word.');
  return problems;
}

// Only the fields an entry has; the server sets EntryID and DistanceYards
export function cleanEntry(input) {
  const e = {
    Date: input.Date,
    RawDistance: input.RawDistance,
    RawDistanceUnit: input.RawDistanceUnit,
    RawDistanceCourse: input.RawDistanceCourse,
    DurationMinutes: input.DurationMinutes,
    Details: input.Details == null ? '' : input.Details
  };
  for (const k of ['Intensity', 'Calories', 'Stroke']) {
    if (input[k] != null && input[k] !== '') e[k] = input[k];
  }
  return e;
}

export function preferencesProblems(p) {
  const problems = [];
  if (!VIEWS.includes(p.UserDefaultView)) problems.push({ field: 'UserDefaultView', message: 'Choose week or month.' });
  if (!COURSES.includes(p.UserDefaultCourse)) problems.push({ field: 'UserDefaultCourse', message: 'Choose a course.' });
  if (!UNITS.includes(p.UserDefaultDistance)) problems.push({ field: 'UserDefaultDistance', message: 'Choose yards, meters or miles.' });
  return problems;
}

export function cleanPreferences(input) {
  return {
    WorkoutsPublic: input.WorkoutsPublic ? 1 : 0,
    MeasurementsPublic: input.MeasurementsPublic ? 1 : 0,
    UserDefaultView: input.UserDefaultView,
    UserDefaultCourse: input.UserDefaultCourse,
    UserDefaultDistance: input.UserDefaultDistance
  };
}

// ---------- Reading ----------

const byDateAsc = (a, b) => (a.Date < b.Date ? -1 : a.Date > b.Date ? 1 : a.EntryID - b.EntryID);
const byDateDesc = (a, b) => byDateAsc(b, a);

// Swims from `from` to `to` (both included), oldest first
export function entriesBetween(entries, from, to, course) {
  return entries.filter(e => e.Date >= from && e.Date <= to && (!course || e.RawDistanceCourse === course)).sort(byDateAsc);
}

// Newest first: `limit` swims before `before` (not included), never
// splitting a day across pages
export function entriesPage(entries, limit, before) {
  const all = entries.filter(e => !before || e.Date < before).sort(byDateDesc);
  const page = all.slice(0, limit);
  const last = page.length ? page[page.length - 1].Date : null;
  while (page.length < all.length && all[page.length].Date === last) page.push(all[page.length]);
  return { entries: page, hasMore: page.length < all.length, nextBefore: page.length < all.length ? last : null };
}

function sum(entries) {
  return entries.reduce((t, e) => {
    t.NumSessions += 1;
    t.TotalMinutes += e.DurationMinutes;
    t.TotalYards += e.DistanceYards;
    return t;
  }, { NumSessions: 0, TotalMinutes: 0, TotalYards: 0 });
}

// The month and year `date` falls in (up to that date), and lifetime
export function totals(record, date) {
  const lifetime = sum(record.entries);
  if (record.prior) {
    lifetime.NumSessions += record.prior.NumSessions;
    lifetime.TotalMinutes += record.prior.TotalMinutes;
    lifetime.TotalYards += record.prior.TotalYards;
  }
  const round = t => ({ ...t, TotalYards: Math.round(t.TotalYards * 100) / 100 });
  return {
    month: round(sum(record.entries.filter(e => e.Date.slice(0, 7) === date.slice(0, 7) && e.Date <= date))),
    year: round(sum(record.entries.filter(e => e.Date.slice(0, 4) === date.slice(0, 4) && e.Date <= date))),
    lifetime: round(lifetime),
    firstLogDate: record.firstLogDate || record.entries.map(e => e.Date).sort()[0] || null
  };
}

export function nextEntryId(entries) {
  return entries.reduce((max, e) => Math.max(max, e.EntryID), 0) + 1;
}
