// FLOG API: one web-standard handler, (Request) => Response, the same shape
// as a Next.js route handler. Netlify runs it (netlify/functions/flog.mjs,
// Blobs storage) and so does the local dev server (.eleventy.js, a JSON
// file per visitor). The contract is docs/api/flog.openapi.yaml.
//
// Who's asking: in production, the login's SwimmerId. In the mockup,
//   X-Flog-Swimmer  the ?user= persona (users.json key)
//   X-Flog-Visitor  a random id the browser keeps, so each visitor gets
//                   their own copy of the sample data
//   X-Flog-Empty: 1 the first-time state (no sample swims)
import {
  MAX_ENTRIES, cleanEntry, cleanPreferences, entriesBetween, entriesPage, entryProblems,
  isDate, isoDate, nextEntryId, preferencesProblems, recordFromSeed, toYards, totals
} from './core.mjs';

const BASE = '/api/flog';
const SWIMMER = /^[A-Za-z0-9]{1,20}$/;
const VISITOR = /^[A-Za-z0-9-]{8,64}$/;
const MAX_BODY = 16 * 1024;

// store: { get(key) → record | null, set(key, record), delete(key) }
// seed: { anchor, swimmers } (scripts/flog-seed.js)
// origins: browser origins allowed to call across sites (CORS)
export function createHandler({ store, seed, origins = [], today = () => isoDate(new Date()) }) {
  function cors(request) {
    const origin = request.headers.get('Origin');
    if (!origin || !origins.includes(origin)) return {};
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Flog-Swimmer, X-Flog-Visitor, X-Flog-Empty',
      'Access-Control-Max-Age': '600',
      Vary: 'Origin'
    };
  }

  return async function handle(request) {
    const headers = { 'Cache-Control': 'no-store', ...cors(request) };
    const json = (body, status = 200) => new Response(body === null ? null : JSON.stringify(body), {
      status,
      headers: body === null ? headers : { ...headers, 'Content-Type': 'application/json; charset=utf-8' }
    });
    const problem = (status, message, field = null) => json({ problems: [{ field, message }] }, status);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '');
    if (!path.startsWith(BASE)) return problem(404, 'Not found.');
    const parts = path.slice(BASE.length).split('/').filter(Boolean);

    const swimmer = request.headers.get('X-Flog-Swimmer') || '';
    const visitor = request.headers.get('X-Flog-Visitor') || '';
    const empty = request.headers.get('X-Flog-Empty') === '1';
    if (!SWIMMER.test(swimmer)) return problem(401, 'Who is this? Send X-Flog-Swimmer (in production, the login says).');
    if (!VISITOR.test(visitor)) return problem(400, 'Send X-Flog-Visitor: 8 to 64 letters, digits or dashes.');
    const key = visitor + '/' + swimmer + (empty ? '-empty' : '');

    async function load() {
      return (await store.get(key)) || recordFromSeed(seed, swimmer, today(), empty);
    }
    async function body() {
      const text = await request.text();
      if (text.length > MAX_BODY) throw Object.assign(new Error('Too large'), { status: 413 });
      try {
        const value = JSON.parse(text);
        if (value && typeof value === 'object' && !Array.isArray(value)) return value;
      } catch (e) {
        // falls through
      }
      throw Object.assign(new Error('Send a JSON object.'), { status: 400 });
    }

    try {
      const [resource, id, extra] = parts;
      const method = request.method;
      if (extra) return problem(404, 'Not found.');

      // /entries
      if (resource === 'entries' && !id) {
        if (method === 'GET') {
          const q = url.searchParams;
          const record = await load();
          if (q.has('from') || q.has('to')) {
            if (!isDate(q.get('from')) || !isDate(q.get('to'))) return problem(400, 'from and to are dates, YYYY-MM-DD.', 'from');
            return json(entriesBetween(record.entries, q.get('from'), q.get('to'), q.get('course')));
          }
          const limit = Number(q.get('limit') || 20);
          if (!Number.isInteger(limit) || limit < 1 || limit > 200) return problem(400, 'limit is 1 to 200.', 'limit');
          if (q.has('before') && !isDate(q.get('before'))) return problem(400, 'before is a date, YYYY-MM-DD.', 'before');
          return json(entriesPage(record.entries, limit, q.get('before')));
        }
        if (method === 'POST') {
          const record = await load();
          const entry = cleanEntry(await body());
          const problems = entryProblems(entry, today());
          if (problems.length) return json({ problems }, 400);
          if (record.entries.length >= MAX_ENTRIES) return problem(409, 'This log is full (a mockup limit). Reset it from Preferences.');
          entry.EntryID = nextEntryId(record.entries);
          entry.DistanceYards = toYards(entry.RawDistance, entry.RawDistanceUnit);
          record.entries.push(entry);
          await store.set(key, record);
          return json(entry, 201);
        }
        return problem(405, 'Use GET or POST.');
      }

      // /entries/{EntryID}
      if (resource === 'entries') {
        const entryId = Number(id);
        const record = await load();
        const i = record.entries.findIndex(e => e.EntryID === entryId);
        if (i < 0) return problem(404, 'We couldn’t find that swim.');
        if (method === 'GET') return json(record.entries[i]);
        if (method === 'PUT') {
          const entry = cleanEntry(await body());
          const problems = entryProblems(entry, today());
          if (problems.length) return json({ problems }, 400);
          entry.EntryID = entryId;
          entry.DistanceYards = toYards(entry.RawDistance, entry.RawDistanceUnit);
          record.entries[i] = entry;
          await store.set(key, record);
          return json(entry);
        }
        if (method === 'DELETE') {
          record.entries.splice(i, 1);
          await store.set(key, record);
          return json(null, 204);
        }
        return problem(405, 'Use GET, PUT or DELETE.');
      }

      // /totals?date=
      if (resource === 'totals' && !id) {
        if (method !== 'GET') return problem(405, 'Use GET.');
        const date = url.searchParams.get('date') || today();
        if (!isDate(date)) return problem(400, 'date is YYYY-MM-DD.', 'date');
        return json(totals(await load(), date));
      }

      // /preferences
      if (resource === 'preferences' && !id) {
        if (method === 'GET') return json((await load()).preferences);
        if (method === 'PUT') {
          const prefs = cleanPreferences(await body());
          const problems = preferencesProblems(prefs);
          if (problems.length) return json({ problems }, 400);
          const record = await load();
          record.preferences = prefs;
          await store.set(key, record);
          return json(prefs);
        }
        return problem(405, 'Use GET or PUT.');
      }

      // /reset (mockup only): back to the sample data
      if (resource === 'reset' && !id) {
        if (method !== 'POST') return problem(405, 'Use POST.');
        await store.delete(key);
        return json(null, 204);
      }

      return problem(404, 'Not found.');
    } catch (err) {
      if (err.status === 400 || err.status === 413) return problem(err.status, err.status === 413 ? 'That’s too much data.' : err.message);
      console.error('flog api:', err);
      return problem(500, 'Something went wrong on our side. Try again.');
    }
  };
}
