// FLOG API: the rules, with no storage or HTTP. Pure, so the tests and
// both servers (Netlify, the local dev server) share them. Field names are
// the Fitness Log's own (docs/api/flog.openapi.yaml).

export const COURSES = ['SCY', 'SCM', 'LCM', 'OW', 'Other'];
// A swim's units, by course: a pool's own (no miles in a pool, since
// 2026-11-18), and any for open water and Other
export const COURSE_UNITS = { SCY: ['Y'], SCM: ['M'], LCM: ['M'], OW: ['Y', 'M', 'mi'], Other: ['Y', 'M', 'mi'] };
export const UNITS = ['Y', 'M', 'mi', 'km'];
// Totals' unit (UserDefaultDistance): a swimmer's, so no km
export const TOTALS_UNITS = ['Y', 'M', 'mi'];
export const VIEWS = ['week', 'month'];
export const YARDS_PER = { Y: 1, M: 1 / 0.9144, mi: 1760, km: 1000 / 0.9144 };

// The legacy FLOG's activities, by its own ids (ActivityType). 1 is
// Swimming, the only one with a course; an entry without an ActivityType
// is a swim. `units`: the distance units an activity offers (its distance
// is optional); none, time only.
export const SWIMMING = 1;
export const ACTIVITIES = [
  { id: 1, name: 'Swimming' },
  { id: 25, name: 'Barre' },
  { id: 19, name: 'Canoeing', units: ['M', 'km', 'mi'] },
  { id: 18, name: 'Cross-Country Skiing', units: ['mi', 'km'] },
  { id: 5, name: 'Cycling', units: ['mi', 'km'] },
  { id: 12, name: 'Dancing' },
  { id: 17, name: 'Downhill Skiing' },
  { id: 13, name: 'Elliptical' },
  { id: 24, name: 'Hiking', units: ['mi', 'km'] },
  { id: 20, name: 'Kayaking', units: ['M', 'km', 'mi'] },
  { id: 15, name: 'Lawn Mowing' },
  { id: 9, name: 'Other' },
  { id: 8, name: 'Pilates' },
  { id: 22, name: 'Rowing', units: ['M', 'km', 'mi'] },
  { id: 3, name: 'Running', units: ['mi', 'km'] },
  { id: 16, name: 'Snowshoeing', units: ['mi', 'km'] },
  { id: 6, name: 'Spinning' },
  { id: 14, name: 'Stairs' },
  { id: 21, name: 'Stand-Up Paddleboarding', units: ['M', 'km', 'mi'] },
  { id: 23, name: 'Steps' },
  { id: 4, name: 'Walking', units: ['mi', 'km'] },
  { id: 2, name: 'Weights' },
  { id: 7, name: 'Yoga' }
];
const activityOf = id => ACTIVITIES.find(a => a.id === id);
export const isSwim = e => (e.ActivityType == null ? SWIMMING : e.ActivityType) === SWIMMING;

// The virtual events the Events page shows: Go the Distance (a yearly
// distance goal, in miles, that logged swims count toward) and the Virtual
// Championships. A swimmer's sign-ups are in their record's `events`.
// The virtual events: Go the Distance (a yearly goal the swimmer sets), three
// yearly distance challenges (a fixed goal; since 2026-11-23) and the
// Virtual Championships. The challenges' miles are placeholders until USMS
// gives their real distances (docs/flog-mockup-notes.md).
export const EVENTS = ['gtd', 'nile', 'atlantic', 'world', 'vc'];
export const EVENT_NAMES = {
  gtd: 'Go the Distance',
  nile: 'Swim the Nile',
  atlantic: 'Swim the Atlantic',
  world: 'Swim Around the World',
  vc: 'Virtual Championships'
};
export const CHALLENGE_MILES = { nile: 4132, atlantic: 3000, world: 24901 };
const DISTANCE_EVENTS = ['gtd', 'nile', 'atlantic', 'world'];
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
  if (!mine) return { preferences: { ...DEFAULT_PREFERENCES }, entries: [], prior: null, firstLogDate: null, events: {}, pastEvents: [] };
  const shift = daysBetween(seed.anchor, today);
  return {
    preferences: { ...DEFAULT_PREFERENCES, ...mine.preferences },
    entries: mine.entries.map(e => ({ ...e, Date: addDays(e.Date, shift) })),
    prior: mine.prior || null,
    firstLogDate: mine.firstLogDate || null,
    events: JSON.parse(JSON.stringify(mine.events || {})),
    pastEvents: JSON.parse(JSON.stringify(mine.pastEvents || []))
  };
}

// ---------- Validation ----------

const isNumber = v => typeof v === 'number' && Number.isFinite(v);
const isWhole = v => isNumber(v) && Math.round(v) === v;

// The problems with an entry, each { field, message }; empty when valid.
// `today` is the server's date; a day's grace lets swimmers ahead of it
// (east of the server's time zone) log their own today.
const UNIT_WORDS = { Y: 'yards', M: 'meters', mi: 'miles', km: 'kilometers' };
const unitList = ids => ids.map(u => UNIT_WORDS[u]).join(ids.length > 2 ? ', ' : ' or ').replace(/, ([^,]+)$/, ' or $1');

export function entryProblems(e, today) {
  const problems = [];
  const add = (field, message) => problems.push({ field, message });
  const activity = activityOf(e.ActivityType);
  if (!activity) add('ActivityType', 'Choose an activity.');
  const swim = e.ActivityType === SWIMMING;
  if (!isDate(e.Date)) add('Date', 'Enter the date of your activity.');
  else if (e.Date > addDays(today, 1)) add('Date', 'The date can’t be in the future.');
  if (swim) {
    if (!COURSES.includes(e.RawDistanceCourse)) add('RawDistanceCourse', 'Choose where you swam.');
    else if (!COURSE_UNITS[e.RawDistanceCourse].includes(e.RawDistanceUnit)) add('RawDistanceUnit', 'A ' + (e.RawDistanceCourse === 'OW' ? 'open water' : e.RawDistanceCourse === 'Other' ? 'swim' : e.RawDistanceCourse) + ' swim is in ' + unitList(COURSE_UNITS[e.RawDistanceCourse]) + '.');
    if (!isNumber(e.RawDistance) || e.RawDistance <= 0) add('RawDistance', 'Enter how far you swam.');
    else if (UNITS.includes(e.RawDistanceUnit) && toYards(e.RawDistance, e.RawDistanceUnit) > 100000) add('RawDistance', 'That’s more than 100,000 yards. Check the distance and unit.');
  } else if (activity && e.RawDistance != null) {
    // Optional, for the activities that have a distance
    if (!activity.units) add('RawDistance', activity.name + ' has no distance.');
    else if (!activity.units.includes(e.RawDistanceUnit)) add('RawDistanceUnit', 'Choose ' + unitList(activity.units) + '.');
    if (!isNumber(e.RawDistance) || e.RawDistance <= 0) add('RawDistance', 'Enter a distance more than 0, or leave it empty.');
    else if (UNITS.includes(e.RawDistanceUnit) && toYards(e.RawDistance, e.RawDistanceUnit) > 880000) add('RawDistance', 'That’s more than 500 miles. Check the distance and unit.');
  }
  if (!isWhole(e.DurationMinutes) || e.DurationMinutes < 1 || e.DurationMinutes > 1440) add('DurationMinutes', 'Enter your time in whole minutes, 1 to 1440.');
  if (e.HeartRate != null && (!isWhole(e.HeartRate) || e.HeartRate < 30 || e.HeartRate > 250)) add('HeartRate', 'Average heart rate is 30 to 250 beats a minute.');
  if (e.Weight != null && (!isNumber(e.Weight) || e.Weight < 50 || e.Weight > 700)) add('Weight', 'Weight is 50 to 700 pounds.');
  if (e.Details != null && typeof e.Details !== 'string') add('Details', 'Comments must be text.');
  else if (e.Details && e.Details.length > MAX_DETAILS) add('Details', 'Comments can be up to ' + MAX_DETAILS + ' characters.');
  if (e.Intensity != null && (!isWhole(e.Intensity) || e.Intensity < 1 || e.Intensity > 10)) add('Intensity', 'Intensity is 1 to 10.');
  if (e.Calories != null && (!isNumber(e.Calories) || e.Calories < 0 || e.Calories > 20000)) add('Calories', 'Calories must be a number from 0 to 20,000.');
  if (e.Stroke != null && (typeof e.Stroke !== 'string' || e.Stroke.length > 20)) add('Stroke', 'Stroke must be a short word.');
  return problems;
}

// Only the fields an entry has; the server sets EntryID and DistanceYards.
// A swim has a course, a distance and maybe a stroke; another activity
// has neither course nor stroke, and a distance only if one was given.
export function cleanEntry(input) {
  const has = k => input[k] != null && input[k] !== '';
  const e = {
    Date: input.Date,
    ActivityType: has('ActivityType') ? input.ActivityType : SWIMMING,
    DurationMinutes: input.DurationMinutes,
    Details: input.Details == null ? '' : input.Details
  };
  if (e.ActivityType === SWIMMING) {
    e.RawDistance = input.RawDistance;
    e.RawDistanceUnit = input.RawDistanceUnit;
    e.RawDistanceCourse = input.RawDistanceCourse;
  } else if (has('RawDistance')) {
    e.RawDistance = input.RawDistance;
    e.RawDistanceUnit = input.RawDistanceUnit;
  }
  for (const k of ['Intensity', 'Calories', 'HeartRate', 'Weight'].concat(e.ActivityType === SWIMMING ? ['Stroke'] : [])) {
    if (has(k)) e[k] = input[k];
  }
  return e;
}

// What the server works out: DistanceYards, 0 for an activity logged
// without a distance
export function withDistanceYards(entry) {
  entry.DistanceYards = entry.RawDistance != null ? toYards(entry.RawDistance, entry.RawDistanceUnit) : 0;
  return entry;
}

export function preferencesProblems(p) {
  const problems = [];
  if (!VIEWS.includes(p.UserDefaultView)) problems.push({ field: 'UserDefaultView', message: 'Choose week or month.' });
  if (!COURSES.includes(p.UserDefaultCourse)) problems.push({ field: 'UserDefaultCourse', message: 'Choose a course.' });
  if (!TOTALS_UNITS.includes(p.UserDefaultDistance)) problems.push({ field: 'UserDefaultDistance', message: 'Choose yards, meters or miles.' });
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

// The month and year `date` falls in (up to that date), and lifetime. Each
// period's NumSessions, TotalMinutes and TotalYards are its swims (as
// before other activities); Other is everything else, { NumSessions,
// TotalMinutes } (their distances are in different sports, so not added up).
export function totals(record, date) {
  const period = entries => {
    const swims = sum(entries.filter(isSwim));
    const other = sum(entries.filter(e => !isSwim(e)));
    return { ...swims, TotalYards: Math.round(swims.TotalYards * 100) / 100, Other: { NumSessions: other.NumSessions, TotalMinutes: other.TotalMinutes } };
  };
  const lifetime = period(record.entries);
  if (record.prior) {
    lifetime.NumSessions += record.prior.NumSessions;
    lifetime.TotalMinutes += record.prior.TotalMinutes;
    lifetime.TotalYards = Math.round((lifetime.TotalYards + record.prior.TotalYards) * 100) / 100;
  }
  return {
    month: period(record.entries.filter(e => e.Date.slice(0, 7) === date.slice(0, 7) && e.Date <= date)),
    year: period(record.entries.filter(e => e.Date.slice(0, 4) === date.slice(0, 4) && e.Date <= date)),
    lifetime,
    firstLogDate: record.firstLogDate || record.entries.map(e => e.Date).sort()[0] || null
  };
}

// ---------- Virtual events ----------

// Each event and the swimmer's place in it. Go the Distance counts this
// year's swims (up to `date`) toward the goal.
// This year's events, each with the swimmer's place in it: signed up, or
// removed (they were in and took themselves out: they can re-enter), and
// for the distance events the goal and this year's swim yards up to `date`.
// Then past years' results, newest first.
export function eventsView(record, date) {
  const mine = record.events || {};
  const year = record.entries.filter(e => isSwim(e) && e.Date.slice(0, 4) === date.slice(0, 4) && e.Date <= date);
  const yearYards = Math.round(year.reduce((t, e) => t + e.DistanceYards, 0) * 100) / 100;
  const events = EVENTS.map(id => {
    const m = mine[id] || {};
    const e = { EventID: id, Name: EVENT_NAMES[id], SignedUp: !!m.SignedUp, Removed: !m.SignedUp && !!m.Removed };
    if (DISTANCE_EVENTS.includes(id)) {
      e.GoalMiles = id === 'gtd' ? (m.GoalMiles || null) : CHALLENGE_MILES[id];
      e.YearYards = yearYards;
    }
    return e;
  });
  const past = (record.pastEvents || [])
    .map(p => ({ ...p, Name: EVENT_NAMES[p.EventID] || p.EventID }))
    .sort((a, b) => b.Year - a.Year || EVENTS.indexOf(a.EventID) - EVENTS.indexOf(b.EventID));
  return { events, past };
}

export function eventProblems(id, input) {
  const problems = [];
  if (typeof input.SignedUp !== 'boolean') problems.push({ field: 'SignedUp', message: 'SignedUp is true or false.' });
  if (id === 'gtd' && input.SignedUp && (!isWhole(input.GoalMiles) || input.GoalMiles < 1 || input.GoalMiles > 5000)) {
    problems.push({ field: 'GoalMiles', message: 'Your goal is 1 to 5,000 miles.' });
  }
  return problems;
}

// Signing up, or removing yourself. A removal is kept (Removed), with Go the
// Distance's goal, so the page offers Re-enter with the same goal.
export function cleanEvent(id, input, before) {
  const was = before || {};
  if (input.SignedUp === true) return id === 'gtd' ? { SignedUp: true, GoalMiles: input.GoalMiles } : { SignedUp: true };
  const e = { SignedUp: false, Removed: !!(was.SignedUp || was.Removed) };
  if (id === 'gtd' && was.GoalMiles) e.GoalMiles = was.GoalMiles;
  return e;
}

export function nextEntryId(entries) {
  return entries.reduce((max, e) => Math.max(max, e.EntryID), 0) + 1;
}
