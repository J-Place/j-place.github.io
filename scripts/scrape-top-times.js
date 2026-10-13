// scripts/scrape-top-times.js
// Scrapes usms.org's SCY Event Rankings (comp/meets/toptimes.php, whose form
// submits to eventrank.php) with Display set to 500: one search per season ×
// gender × SCY event × age group. Raw output goes to top-times-scrape/
// (gitignored); `npm run top-times:json` turns it into the static Top Times
// API files in src/data/top-times/ (docs/api/top-times.openapi.yaml).
//
// The page sits behind an Azure WAF JavaScript challenge that rejects a
// direct POST with a 403, so this drives the real form in headless Chromium:
// set each <select>, click Start Search, read table.meet_event-rank.
//
// Usage:
//   npm run top-times:scrape -- [--seasons N] [--sex M|F] [--ages 40-44,50-54]
//                               [--concurrency N] [--delay ms] [--limit N] [--out dir]
//   --seasons N   the N most recent seasons (default: all, back to 2003-04)
//   --sex         one gender (default: both)
//   --ages        age groups lo-hi, comma-separated (default: all 18, 18-24 to 105-109)
//   --concurrency browser tabs searching at once (default 1)
//   --delay       ms to wait after each search, per tab (default 3000)
//   --limit       stop after N searches (for a test run)
//
// Be gentle: every search is a heavy query on production. The full default
// set is about 18,000 searches. 440 (10 seasons, Men, 2 age groups) took
// about 40 minutes at the defaults, without being blocked.
//
// Resumable: each finished search is logged to done.jsonl and skipped on a
// rerun. If the WAF blocks or challenges a request the script exits
// (code 2) instead of retrying; rerun later to pick up where it stopped. To
// re-scrape searches already done, delete top-times-scrape/ first, or their
// rows end up in the CSV twice.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const flag = n => { const i = args.indexOf('--' + n); return i > -1 ? args[i + 1] : null; };
const num = (n, d) => (flag(n) != null ? Number(flag(n)) : d);
const LIMIT = num('limit', Infinity);
const CONCURRENCY = num('concurrency', 1);
const DELAY = num('delay', 3000);
const SEASONS = num('seasons', Infinity);
const SEXES = flag('sex') ? [flag('sex')] : ['M', 'F'];
const OUT_DIR = path.resolve(flag('out') || path.join(__dirname, '..', 'top-times-scrape'));

const FORM_URL = 'https://www.usms.org/comp/meets/toptimes.php';
const STROKES = { 1: 'Free', 2: 'Back', 3: 'Breast', 4: 'Fly', 5: 'IM' };
// Only the stroke/distance pairs swum in SCY; the form accepts any pair, but
// the others return "No results found."
const EVENTS = [
  ...[25, 50, 100, 200, 500, 1000, 1650].map(d => [1, d]),
  ...[2, 3, 4].flatMap(s => [25, 50, 100, 200].map(d => [s, d])),
  ...[100, 200, 400].map(d => [5, d]),
];
const AGES = flag('ages')
  ? flag('ages').split(',').map(r => r.split('-').map(Number))
  : [[18, 24], ...Array.from({ length: 17 }, (_, i) => [25 + i * 5, 29 + i * 5])];

class Blocked extends Error {}

async function checkBlocked(page, resp) {
  if ((resp && resp.status() === 403) || /Azure WAF/.test(await page.title().catch(() => ''))) {
    throw new Blocked(`WAF block or challenge at ${page.url()} (status ${resp && resp.status()})`);
  }
}

// The first eventrank form on the page is SCY (hidden CourseID 1); SCM and
// LCM follow with the same field names.
async function scyForm(page) {
  const form = page.locator('form[action*="eventrank"]').first();
  await form.waitFor({ timeout: 90000 }).catch(async e => { await checkBlocked(page); throw e; });
  if (await form.locator('input[name="CourseID"]').inputValue() !== '1') throw new Error('first eventrank form is not SCY');
  return form;
}

async function getSeasons(page) {
  // networkidle so the first load can finish the WAF challenge, which sets
  // the cookie every later request in the context reuses.
  await page.goto(FORM_URL, { waitUntil: 'networkidle', timeout: 90000 });
  return (await scyForm(page)).locator('select[name="Season"] option').evaluateAll(os => os.map(o => o.value));
}

async function search(page, c) {
  await checkBlocked(page, await page.goto(FORM_URL, { waitUntil: 'domcontentloaded', timeout: 90000 }));
  const form = await scyForm(page);
  const values = {
    Season: c.season, Sex: c.sex, StrokeID: String(c.stroke), Distance: String(c.distance),
    lowage: String(c.lowage), highage: String(c.highage), How_Many: '500',
  };
  for (const [name, value] of Object.entries(values)) await form.locator(`select[name="${name}"]`).selectOption(value);
  const [resp] = await Promise.all([
    page.waitForNavigation({ timeout: 120000, waitUntil: 'domcontentloaded' }),
    form.locator('input[type=submit]').click(),
  ]);
  await checkBlocked(page, resp);
  await page.waitForFunction(
    () => document.querySelector('table.meet_event-rank') || /No results found/.test(document.body.innerText),
    null, { timeout: 120000 });
  return page.$$eval('table.meet_event-rank tr', trs => trs.slice(1)
    .map(tr => [...tr.cells].map(td => td.innerText.trim()))
    .filter(cells => cells.length >= 6));
}

const csvCell = v => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const csvPath = path.join(OUT_DIR, 'scy-top500.csv');
  const donePath = path.join(OUT_DIR, 'done.jsonl');
  if (!fs.existsSync(csvPath)) fs.writeFileSync(csvPath, 'season,sex,stroke,distance,lowage,highage,rank,name,age,time,club,meet\n');
  const done = new Set(fs.existsSync(donePath)
    ? fs.readFileSync(donePath, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l).key)
    : []);

  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  let seasons;
  try {
    seasons = (await getSeasons(await ctx.newPage())).slice(0, SEASONS);
  } catch (e) {
    console.error(e instanceof Blocked ? `BLOCKED loading the form: ${e.message}` : e);
    await browser.close();
    process.exit(e instanceof Blocked ? 2 : 1);
  }

  const todo = [];
  for (const season of seasons) for (const sex of SEXES) for (const [stroke, distance] of EVENTS) {
    for (const [lowage, highage] of AGES) {
      const key = [season, sex, stroke, distance, lowage, highage].join('|');
      if (!done.has(key)) todo.push({ key, season, sex, stroke, distance, lowage, highage });
    }
  }
  todo.splice(LIMIT);
  console.log(`seasons ${seasons.join(',')} | sex ${SEXES.join(',')} | ages ${AGES.map(a => a.join('-')).join(',')}`);
  console.log(`${seasons.length * SEXES.length * EVENTS.length * AGES.length} searches, ${todo.length} to run ` +
    `(concurrency ${CONCURRENCY}, delay ${DELAY}ms) → ${path.relative(process.cwd(), OUT_DIR)}/`);

  let next = 0, finished = 0, failed = 0;
  const t0 = Date.now();
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    const page = await ctx.newPage();
    while (next < todo.length) {
      const c = todo[next++];
      let rows, err;
      for (let attempt = 1; attempt <= 3 && !rows; attempt++) {
        try {
          rows = await search(page, c);
        } catch (e) {
          if (e instanceof Blocked) {
            console.error(`BLOCKED on ${c.key}: ${e.message}. Stopping; rerun later to resume.`);
            process.exit(2);
          }
          err = e;
          await page.waitForTimeout(5000 * attempt);
        }
      }
      if (!rows) {
        failed++;
        console.error(`FAIL ${c.key}: ${err.message.split('\n')[0]}`);
        continue;
      }
      const lines = rows.map(([rank, name, age, time, club, meet]) =>
        [c.season, c.sex, STROKES[c.stroke], c.distance, c.lowage, c.highage, rank, name, age, time, club, meet]
          .map(csvCell).join(','));
      if (lines.length) fs.appendFileSync(csvPath, lines.join('\n') + '\n');
      fs.appendFileSync(donePath, JSON.stringify({ key: c.key, rows: rows.length, scraped: new Date().toISOString().slice(0, 10) }) + '\n');
      finished++;
      const hoursLeft = (Date.now() - t0) / finished / 3600000 * (todo.length - next);
      console.log(`[${finished}/${todo.length}] ${c.key} → ${rows.length} rows (~${hoursLeft.toFixed(1)}h left)`);
      await page.waitForTimeout(DELAY);
    }
  }));
  await browser.close();
  console.log(`Done: ${finished} searches, ${failed} failed${failed ? ' (rerun to retry them)' : ''}.`);
})();
