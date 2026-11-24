// FLOG API tests: node --test api/ (npm run test:api)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from './handler.mjs';
import { memoryStore } from './stores.mjs';

const TODAY = '2026-11-07';
const seed = {
  anchor: '2026-11-01',
  swimmers: {
    KT2JH: {
      preferences: { UserDefaultView: 'month', UserDefaultCourse: 'SCY', UserDefaultDistance: 'Y' },
      prior: { NumSessions: 10, TotalMinutes: 600, TotalYards: 30000 },
      firstLogDate: '2012-01-09',
      events: { gtd: { SignedUp: true, GoalMiles: 300 } },
      pastEvents: [
        { EventID: 'gtd', Year: 2024, GoalMiles: 250, Miles: 262.4 },
        { EventID: 'vc', Year: 2025 },
        { EventID: 'gtd', Year: 2025, GoalMiles: 300, Miles: 288.1 }
      ],
      entries: [
        { EntryID: 1, Date: '2026-10-30', RawDistance: 3000, RawDistanceUnit: 'Y', RawDistanceCourse: 'SCY', DistanceYards: 3000, DurationMinutes: 60, Details: '' },
        { EntryID: 2, Date: '2026-10-31', RawDistance: 1, RawDistanceUnit: 'mi', RawDistanceCourse: 'OW', DistanceYards: 1760, DurationMinutes: 35, Details: 'Lake' }
      ]
    }
  }
};

function api(options = {}) {
  const handle = createHandler({ store: memoryStore(), seed, origins: ['https://j-place.github.io'], today: () => TODAY, ...options });
  return (method, path, { body, visitor = 'visitor-0001', swimmer = 'KT2JH', headers = {} } = {}) =>
    handle(new Request('http://localhost' + path, {
      method,
      headers: { 'X-Flog-Visitor': visitor, 'X-Flog-Swimmer': swimmer, ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body)
    }));
}

const swim = over => ({ Date: '2026-11-06', RawDistance: 2000, RawDistanceUnit: 'M', RawDistanceCourse: 'LCM', DurationMinutes: 45, Details: 'Test', ...over });

test('starts from the seed, moved forward to today', async () => {
  const call = api();
  const res = await call('GET', '/api/flog/entries?from=2026-11-01&to=2026-11-30');
  assert.equal(res.status, 200);
  const entries = await res.json();
  // anchor 11-01 → today 11-07: six days later
  assert.deepEqual(entries.map(e => e.Date), ['2026-11-05', '2026-11-06']);
  assert.equal((await (await call('GET', '/api/flog/preferences')).json()).UserDefaultView, 'month');
});

test('logs a swim: the server sets EntryID and DistanceYards', async () => {
  const call = api();
  const res = await call('POST', '/api/flog/entries', { body: swim({ RawDistance: 1.2, RawDistanceUnit: 'mi', RawDistanceCourse: 'OW', Intensity: 7, EntryID: 999, DistanceYards: 1 }) });
  assert.equal(res.status, 201);
  const saved = await res.json();
  assert.equal(saved.EntryID, 3);
  assert.equal(saved.DistanceYards, 2112);
  assert.equal(saved.Intensity, 7);
  const back = await call('GET', '/api/flog/entries/3');
  assert.deepEqual(await back.json(), saved);
});

test('meters convert to yards', async () => {
  const saved = await (await api()('POST', '/api/flog/entries', { body: swim() })).json();
  assert.equal(saved.DistanceYards, 2187.23);
});

test('says what is wrong with a swim', async () => {
  const res = await api()('POST', '/api/flog/entries', { body: { Date: '2026-12-25', RawDistance: -1, RawDistanceUnit: 'km', RawDistanceCourse: 'Lake', DurationMinutes: 1.5, Intensity: 11 } });
  assert.equal(res.status, 400);
  const fields = (await res.json()).problems.map(p => p.field).sort();
  assert.deepEqual(fields, ['Date', 'DurationMinutes', 'Intensity', 'RawDistance', 'RawDistanceCourse']);
});

test('a pool swim is in its own unit; open water in any', async () => {
  const call = api();
  const bad = await call('POST', '/api/flog/entries', { body: swim({ RawDistanceCourse: 'SCY', RawDistanceUnit: 'mi', RawDistance: 1 }) });
  assert.equal(bad.status, 400);
  assert.deepEqual((await bad.json()).problems, [{ field: 'RawDistanceUnit', message: 'A SCY swim is in yards.' }]);
  assert.equal((await call('POST', '/api/flog/entries', { body: swim({ RawDistanceCourse: 'LCM', RawDistanceUnit: 'Y' }) })).status, 400);
  assert.equal((await call('POST', '/api/flog/entries', { body: swim({ RawDistanceCourse: 'OW', RawDistanceUnit: 'M' }) })).status, 201);
});

test('other activities: no course or stroke, distance optional and in their units', async () => {
  const call = api();
  const run = await (await call('POST', '/api/flog/entries', { body: { Date: '2026-11-06', ActivityType: 3, RawDistance: 5, RawDistanceUnit: 'km', RawDistanceCourse: 'SCY', Stroke: 'Free', DurationMinutes: 28, HeartRate: 148 } })).json();
  assert.equal(run.ActivityType, 3);
  assert.equal(run.RawDistanceCourse, undefined);
  assert.equal(run.Stroke, undefined);
  assert.equal(run.DistanceYards, 5468.07);
  assert.equal(run.HeartRate, 148);
  const weights = await (await call('POST', '/api/flog/entries', { body: { Date: '2026-11-06', ActivityType: 2, DurationMinutes: 40, Weight: 172.5 } })).json();
  assert.equal(weights.DistanceYards, 0);
  assert.equal(weights.Weight, 172.5);
  const bad = await call('POST', '/api/flog/entries', { body: { Date: '2026-11-06', ActivityType: 3, RawDistance: 5, RawDistanceUnit: 'Y', DurationMinutes: 28, HeartRate: 20, Weight: 10 } });
  assert.deepEqual((await bad.json()).problems.map(p => p.field).sort(), ['HeartRate', 'RawDistanceUnit', 'Weight']);
  assert.equal((await call('POST', '/api/flog/entries', { body: { Date: '2026-11-06', ActivityType: 99, DurationMinutes: 10 } })).status, 400);
  assert.equal((await call('POST', '/api/flog/entries', { body: { Date: '2026-11-06', ActivityType: 7, RawDistance: 2, RawDistanceUnit: 'mi', DurationMinutes: 10 } })).status, 400);
});

test('allows tomorrow (a swimmer ahead of the server’s time zone), not later', async () => {
  const call = api();
  assert.equal((await call('POST', '/api/flog/entries', { body: swim({ Date: '2026-11-08' }) })).status, 201);
  assert.equal((await call('POST', '/api/flog/entries', { body: swim({ Date: '2026-11-09' }) })).status, 400);
});

test('edits and deletes a swim', async () => {
  const call = api();
  const put = await call('PUT', '/api/flog/entries/1', { body: swim({ DurationMinutes: 50 }) });
  assert.equal(put.status, 200);
  assert.equal((await put.json()).EntryID, 1);
  assert.equal((await call('DELETE', '/api/flog/entries/1')).status, 204);
  assert.equal((await call('GET', '/api/flog/entries/1')).status, 404);
  assert.equal((await call('DELETE', '/api/flog/entries/1')).status, 404);
});

test('pages the list newest first, never splitting a day', async () => {
  const call = api();
  await call('POST', '/api/flog/entries', { body: swim({ Date: '2026-11-05' }) });
  const first = await (await call('GET', '/api/flog/entries?limit=1')).json();
  // 11-06 seed swim; then 11-05 has two (seed + new), kept together
  assert.deepEqual(first.entries.map(e => e.Date), ['2026-11-06']);
  assert.equal(first.hasMore, true);
  const second = await (await call('GET', '/api/flog/entries?limit=1&before=' + first.nextBefore)).json();
  assert.deepEqual(second.entries.map(e => e.Date), ['2026-11-05', '2026-11-05']);
  assert.equal(second.hasMore, false);
  assert.equal(second.nextBefore, null);
});

test('totals: month, year, lifetime with what came before', async () => {
  const t = await (await api()('GET', '/api/flog/totals?date=2026-11-07')).json();
  assert.deepEqual(t.month, { NumSessions: 2, TotalMinutes: 95, TotalYards: 4760, Other: { NumSessions: 0, TotalMinutes: 0 } });
  assert.equal(t.lifetime.NumSessions, 12);
  assert.equal(t.lifetime.TotalYards, 34760);
  assert.equal(t.firstLogDate, '2012-01-09');
});

test('totals: swims, and other workouts apart', async () => {
  const call = api();
  await call('POST', '/api/flog/entries', { body: { Date: '2026-11-06', ActivityType: 5, RawDistance: 20, RawDistanceUnit: 'mi', DurationMinutes: 70 } });
  const t = await (await call('GET', '/api/flog/totals?date=2026-11-07')).json();
  assert.deepEqual(t.month, { NumSessions: 2, TotalMinutes: 95, TotalYards: 4760, Other: { NumSessions: 1, TotalMinutes: 70 } });
});

test('events: this year’s events with the swimmer’s place in each, then past years', async () => {
  const call = api();
  const { events, past } = await (await call('GET', '/api/flog/events')).json();
  assert.deepEqual(events.map(e => e.EventID), ['gtd', 'nile', 'atlantic', 'world', 'vc']);
  assert.deepEqual(events[0], { EventID: 'gtd', Name: 'Go the Distance', SignedUp: true, Removed: false, GoalMiles: 300, YearYards: 4760 });
  assert.deepEqual(events[1], { EventID: 'nile', Name: 'Swim the Nile', SignedUp: false, Removed: false, GoalMiles: 4132, YearYards: 4760 });
  assert.deepEqual(events[4], { EventID: 'vc', Name: 'Virtual Championships', SignedUp: false, Removed: false });
  // Newest first, then in the events' order
  assert.deepEqual(past.map(p => p.EventID + p.Year), ['gtd2025', 'vc2025', 'gtd2024']);
  assert.equal(past[0].Name, 'Go the Distance');
});

test('events: sign up, remove yourself, re-enter', async () => {
  const call = api();
  const nile = await call('PUT', '/api/flog/events/nile', { body: { SignedUp: true } });
  assert.equal((await nile.json()).SignedUp, true);
  assert.equal((await call('PUT', '/api/flog/events/gtd', { body: { SignedUp: true, GoalMiles: 0 } })).status, 400);
  assert.equal((await call('PUT', '/api/flog/events/nope', { body: { SignedUp: true } })).status, 404);
  // Removed keeps the goal, so Re-enter can offer it
  const left = await (await call('PUT', '/api/flog/events/gtd', { body: { SignedUp: false } })).json();
  assert.deepEqual(left, { EventID: 'gtd', Name: 'Go the Distance', SignedUp: false, Removed: true, GoalMiles: 300, YearYards: 4760 });
  const back = await (await call('PUT', '/api/flog/events/gtd', { body: { SignedUp: true, GoalMiles: 320 } })).json();
  assert.deepEqual([back.SignedUp, back.Removed, back.GoalMiles], [true, false, 320]);
  // Never in: not removed
  const vc = await (await call('PUT', '/api/flog/events/vc', { body: { SignedUp: false } })).json();
  assert.equal(vc.Removed, false);
  // Another swimmer, with no sign-ups or past events in the seed
  const none = await (await call('GET', '/api/flog/events', { swimmer: 'SHARK' })).json();
  assert.equal(none.events.every(e => !e.SignedUp), true);
  assert.deepEqual(none.past, []);
});

test('each visitor has their own copy, and reset brings back the seed', async () => {
  const call = api();
  await call('DELETE', '/api/flog/entries/1', { visitor: 'visitor-aaaa' });
  assert.equal((await call('GET', '/api/flog/entries/1', { visitor: 'visitor-bbbb' })).status, 200);
  assert.equal((await call('GET', '/api/flog/entries/1', { visitor: 'visitor-aaaa' })).status, 404);
  assert.equal((await call('POST', '/api/flog/reset', { visitor: 'visitor-aaaa' })).status, 204);
  assert.equal((await call('GET', '/api/flog/entries/1', { visitor: 'visitor-aaaa' })).status, 200);
});

test('X-Flog-Empty: the first-time state, kept apart from the sample log', async () => {
  const call = api();
  const empty = await (await call('GET', '/api/flog/totals', { headers: { 'X-Flog-Empty': '1' } })).json();
  assert.equal(empty.lifetime.NumSessions, 0);
  assert.equal(empty.firstLogDate, null);
  const full = await (await call('GET', '/api/flog/totals')).json();
  assert.equal(full.lifetime.NumSessions, 12);
});

test('preferences: saved, and checked', async () => {
  const call = api();
  const ok = await call('PUT', '/api/flog/preferences', { body: { WorkoutsPublic: true, MeasurementsPublic: 0, UserDefaultView: 'week', UserDefaultCourse: 'OW', UserDefaultDistance: 'mi' } });
  assert.deepEqual(await ok.json(), { WorkoutsPublic: 1, MeasurementsPublic: 0, UserDefaultView: 'week', UserDefaultCourse: 'OW', UserDefaultDistance: 'mi' });
  const bad = await call('PUT', '/api/flog/preferences', { body: { UserDefaultView: 'list', UserDefaultCourse: 'SCY', UserDefaultDistance: 'Y' } });
  assert.equal(bad.status, 400);
});

test('who is asking, and safe keys', async () => {
  const call = api();
  assert.equal((await call('GET', '/api/flog/preferences', { swimmer: '' })).status, 401);
  assert.equal((await call('GET', '/api/flog/preferences', { visitor: '../../etc' })).status, 400);
  assert.equal((await call('GET', '/api/flog/preferences', { swimmer: '../x' })).status, 401);
  // A member with no sample log starts empty
  assert.deepEqual(await (await call('GET', '/api/flog/entries?from=2026-01-01&to=2026-12-31', { swimmer: 'SHARK' })).json(), []);
});

test('bad requests', async () => {
  const call = api();
  assert.equal((await call('POST', '/api/flog/entries', { body: 'not json' })).status, 400);
  assert.equal((await call('POST', '/api/flog/entries', { body: 'x'.repeat(20000) })).status, 413);
  assert.equal((await call('GET', '/api/flog/entries?from=2026-11-01')).status, 400);
  assert.equal((await call('GET', '/api/flog/nothing')).status, 404);
  assert.equal((await call('PATCH', '/api/flog/entries')).status, 405);
});

test('CORS: allowed origins only, and preflight', async () => {
  const call = api();
  const pre = await call('OPTIONS', '/api/flog/entries', { headers: { Origin: 'https://j-place.github.io' } });
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get('Access-Control-Allow-Origin'), 'https://j-place.github.io');
  assert.match(pre.headers.get('Access-Control-Allow-Headers'), /X-Flog-Visitor/);
  const other = await call('GET', '/api/flog/preferences', { headers: { Origin: 'https://example.com' } });
  assert.equal(other.headers.get('Access-Control-Allow-Origin'), null);
});
