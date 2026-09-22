'use strict';

// Manually-invoked diagnostic (plan Item 10) — NOT part of `npm run test:visual`
// or `npm run monitor:prod`, never runs automatically, no new schedule. Captures
// a page TWICE in immediate succession, with no masks applied, and diffs the two
// captures directly against each other (not against any committed baseline) to
// find genuinely non-deterministic regions on a page — carousels, ad slots, live
// content — informing Item 9's mask-vs-style-fingerprint catalog. Run this when
// adding a new page to either suite, or when chasing unexplained flakiness.
//
// Usage:
//   node scripts/detect-flaky-regions.js --suite=mockup
//   node scripts/detect-flaky-regions.js --suite=production-monitor --pages=home-full,clubs-full
//   node scripts/detect-flaky-regions.js --suite=mockup --project=Mobile
//   node scripts/detect-flaky-regions.js --suite=mockup --project=all
//
// What's replicated from the real suites, and what isn't (read before trusting
// a "clean" result too far):
//   - REPLICATED, both suites: page.clock.install() (freezes JS timers so a
//     setInterval carousel/slider can't advance mid-run), blocking ipinfo.io
//     (geo lookups), image decode + document.fonts.ready + a stable-height
//     poll before capturing. These are suite-wide and page-independent, so
//     skipping them would just flood the output with already-solved noise.
//   - REPLICATED, mockup only: fulfilling /apis/v1/ctsearch from the committed
//     events.json fixture (screenshots.spec.js does this; without it the
//     Events pages would show real day-to-day production drift, which is a
//     content-freshness problem, not a masking one).
//   - REPLICATED, production-monitor only: blocking the known ad-serving
//     domains (doubleclick.net, googlesyndication.com, googletagservices.com).
//   - NOT replicated: page-specific DOM hacks in screenshots.spec.js
//     (EXPAND_ALL_SECTIONS, CLICK_MORE_FILTERS, the home hero carousel's
//     explicit slide-0 pin). Those are bespoke per-page overrides — mirroring
//     all of them here would duplicate logic that already exists once and
//     drifts. This means pages relying on them get scanned in their default
//     (unpinned/uninteracted) state, which is a valid, internally-consistent
//     pair of captures — it just may not exercise the same DOM state the real
//     suite's baseline does. If a page you expect to be clean shows noise
//     here, check whether it's one of these before assuming it's a new gap.

const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('@playwright/test');
const { PNG } = require('pngjs');
// pixelmatch v7+ is ESM-only with CJS interop — the callable function is the
// `default` export, not the module object itself.
const pixelmatch = require('pixelmatch').default;

function parseArgs(argv) {
  const args = { project: 'Desktop' };
  for (const arg of argv) {
    const m = arg.match(/^--([^=]+)=(.*)$/);
    if (m) args[m[1]] = m[2];
  }
  if (!args.suite || !['mockup', 'production-monitor'].includes(args.suite)) {
    console.error('Usage: node scripts/detect-flaky-regions.js --suite=mockup|production-monitor [--pages=name1,name2] [--project=Desktop|Mobile|all]');
    process.exit(1);
  }
  args.pages = args.pages ? args.pages.split(',').map((s) => s.trim()) : null;
  args.projects = args.project === 'all' ? ['Desktop', 'Mobile'] : [args.project];
  return args;
}

function slug(pagePath) {
  const [p, query] = pagePath.split('?');
  const base = p.replace(/^\//, '').replace(/\/$/, '').replace(/\.html$/, '').replace(/\//g, '--') || 'root';
  return query ? `${base}--${query.replace(/[&=]/g, '-')}` : base;
}

function loadPageList(suite) {
  if (suite === 'mockup') {
    const pages = require('../tests/usms-visual-regression-screenshots/pages.js');
    return pages.map((p) => ({ name: slug(p), navPath: p }));
  }
  const checks = require('../tests/production-monitor/checks.js');
  return checks.map((c) => ({ name: c.name, navPath: c.path }));
}

const DEVICE_CONFIG = {
  Desktop: { viewport: { width: 1512, height: 800 }, deviceScaleFactor: 2, userAgent: devices['Desktop Chrome'].userAgent },
  Mobile: { ...devices['Pixel 7'] },
};

const BASE_URL = {
  mockup: process.env.PW_BASE_URL || 'https://j-place.github.io',
  'production-monitor': process.env.PROD_MONITOR_BASE_URL || 'https://www.usms.org',
};

async function prepPage(page, suite) {
  await page.clock.install();
  await page.route(/ipinfo\.io/, (route) => route.abort());
  if (suite === 'mockup') {
    const liveEventsFixture = require('../src/_data/events.json');
    await page.route(/\/apis\/v1\/ctsearch/, (route) =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify(liveEventsFixture) })
    );
  } else {
    await page.route(/doubleclick\.net|googlesyndication\.com|googletagservices\.com/, (route) => route.abort());
  }
}

async function waitForStableHeight(page, { stableReadsRequired = 4, intervalMs = 200, maxWaitMs = 6000 } = {}) {
  const deadline = Date.now() + maxWaitMs;
  let lastHeight = -1;
  let stableReads = 0;
  while (Date.now() < deadline && stableReads < stableReadsRequired) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    stableReads = height === lastHeight ? stableReads + 1 : 0;
    lastHeight = height;
    await page.waitForTimeout(intervalMs);
  }
}

async function settleAndCapture(page) {
  await page.evaluate(() => Promise.all(
    Array.from(document.images)
      .filter((img) => !img.complete)
      .map((img) => new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      }))
  ));
  await page.evaluate(() => document.fonts.ready);
  await waitForStableHeight(page);
  return page.screenshot({ fullPage: true, type: 'png' });
}

// Grid-based connected-component bounding boxes, not pixel-level flood fill —
// full-page 2x-DPR screenshots can be several thousand px tall (Club/Event
// Edit run ~6800px logical, ~13600px at 2x), so cell-level clustering keeps
// this fast while still giving a usefully-located "roughly here" box, which
// is all a diagnostic candidate-list needs.
function boundingBoxesFromDiff(diffPng, width, height, cellSize = 20) {
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const marked = new Uint8Array(cols * rows);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // pixelmatch writes fully-opaque red (255,0,0,255) at every differing pixel by default.
      if (diffPng.data[idx] === 255 && diffPng.data[idx + 1] === 0 && diffPng.data[idx + 2] === 0 && diffPng.data[idx + 3] === 255) {
        marked[Math.floor(y / cellSize) * cols + Math.floor(x / cellSize)] = 1;
      }
    }
  }
  const visited = new Uint8Array(cols * rows);
  const boxes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (!marked[i] || visited[i]) continue;
      // BFS over the small cell grid, not the pixel grid.
      let minC = c, maxC = c, minR = r, maxR = r;
      const queue = [i];
      visited[i] = 1;
      while (queue.length) {
        const cur = queue.pop();
        const cr = Math.floor(cur / cols), cc = cur % cols;
        minC = Math.min(minC, cc); maxC = Math.max(maxC, cc);
        minR = Math.min(minR, cr); maxR = Math.max(maxR, cr);
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          const ni = nr * cols + nc;
          if (marked[ni] && !visited[ni]) { visited[ni] = 1; queue.push(ni); }
        }
      }
      boxes.push({
        x: minC * cellSize, y: minR * cellSize,
        width: (maxC - minC + 1) * cellSize, height: (maxR - minR + 1) * cellSize,
      });
    }
  }
  return boxes;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const allPages = loadPageList(args.suite);
  const targets = args.pages ? allPages.filter((p) => args.pages.includes(p.name)) : allPages;
  if (args.pages && targets.length !== args.pages.length) {
    const found = new Set(targets.map((p) => p.name));
    const missing = args.pages.filter((n) => !found.has(n));
    console.error(`Unknown page name(s) for --suite=${args.suite}: ${missing.join(', ')}`);
    process.exit(1);
  }

  const baseURL = BASE_URL[args.suite];
  const outDir = path.join(__dirname, '..', 'test-results', 'flaky-scan', args.suite);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  for (const projectName of args.projects) {
    const context = await browser.newContext({ ...DEVICE_CONFIG[projectName], baseURL });
    for (const { name, navPath } of targets) {
      const page = await context.newPage();
      try {
        await prepPage(page, args.suite);
        await page.goto(navPath, { waitUntil: args.suite === 'mockup' ? 'networkidle' : 'load', timeout: 60000 });
        const bufA = await settleAndCapture(page);
        const bufB = await settleAndCapture(page);

        const pngA = PNG.sync.read(bufA);
        const pngB = PNG.sync.read(bufB);

        if (pngA.width !== pngB.width || pngA.height !== pngB.height) {
          results.push({ project: projectName, name, status: 'UNSTABLE HEIGHT/WIDTH', detail: `${pngA.width}x${pngA.height} vs ${pngB.width}x${pngB.height}` });
          console.log(`[${projectName}] ${name}: UNSTABLE DIMENSIONS (${pngA.width}x${pngA.height} vs ${pngB.width}x${pngB.height}) — page size itself isn't settling, check before anything else`);
          continue;
        }

        const { width, height } = pngA;
        const diff = new PNG({ width, height });
        const numDiffPixels = pixelmatch(pngA.data, pngB.data, diff.data, width, height, { threshold: 0.1 });

        if (numDiffPixels === 0) {
          results.push({ project: projectName, name, status: 'stable', numDiffPixels: 0 });
          console.log(`[${projectName}] ${name}: stable (0 differing pixels)`);
          continue;
        }

        const boxes = boundingBoxesFromDiff(diff, width, height);
        const diffPath = path.join(outDir, `${projectName}-${name}-diff.png`);
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
        results.push({ project: projectName, name, status: 'FLAKY', numDiffPixels, ratio: (numDiffPixels / (width * height)).toFixed(4), boxes, diffPath });
        console.log(`[${projectName}] ${name}: FLAKY — ${numDiffPixels} px differ (ratio ${(numDiffPixels / (width * height)).toFixed(4)}), ${boxes.length} region(s):`);
        for (const b of boxes) console.log(`    x:${b.x} y:${b.y} w:${b.width} h:${b.height}`);
        console.log(`    diff image: ${path.relative(process.cwd(), diffPath)}`);
      } catch (err) {
        results.push({ project: projectName, name, status: 'ERROR', detail: err.message });
        console.log(`[${projectName}] ${name}: ERROR — ${err.message}`);
      } finally {
        await page.close();
      }
    }
    await context.close();
  }

  await browser.close();

  const flaky = results.filter((r) => r.status === 'FLAKY' || r.status === 'UNSTABLE HEIGHT/WIDTH');
  const stable = results.filter((r) => r.status === 'stable');
  const errored = results.filter((r) => r.status === 'ERROR');
  console.log(`\n${'-'.repeat(60)}`);
  console.log(`${stable.length} stable, ${flaky.length} flaky/unstable, ${errored.length} errored — out of ${results.length} checked.`);
  if (flaky.length) {
    console.log('Flaky/unstable: ' + flaky.map((r) => `${r.project}/${r.name}`).join(', '));
  }
  process.exitCode = flaky.length || errored.length ? 1 : 0;
}

main();
