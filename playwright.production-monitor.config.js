const { defineConfig, devices } = require('@playwright/test');

// Personal GhostInspector-style monitor against LIVE PRODUCTION (www.usms.org) —
// catches changes the USMS dev team deploys, not changes to our own mockup.
// Deliberately fully separate from playwright.config.js / the
// tests/usms-visual-regression-screenshots/ suite: own testDir, own baseURL, own
// output/report folders (so snapshots auto-namespace under
// tests/production-monitor/*-snapshots/, never touching the mockup suite's
// baselines) and its own npm script (monitor:prod). Never point this config at
// the mockup's testDir or vice versa.
module.exports = defineConfig({
  testDir: './tests/production-monitor',
  fullyParallel: true,
  // Lower than the mockup suite's 3 — this hits a real production site we don't
  // own/control the load on, not our own GitHub Pages deploy. Keep it polite.
  workers: 2,
  // Live network target — allow one retry for timing-based flakiness before
  // treating it as a real diff.
  retries: 1,
  timeout: 120000,
  // 'list' prints every check with pass/fail/skip to the console; 'html' writes
  // to its own report folder (never the mockup suite's playwright-report/).
  // 'json' feeds scripts/triage-production-monitor.js (plan Item 1) — additive,
  // doesn't change what 'list'/'html' already do for anyone reading the report.
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'production-monitor-report' }], ['json', { outputFile: 'production-monitor-report/results.json' }]],
  outputDir: 'test-results/production-monitor',
  use: {
    baseURL: process.env.PROD_MONITOR_BASE_URL || 'https://www.usms.org',
  },
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      // 'css' (not the mockup suite's 'device') — this suite is a change
      // detector, not a source of baselines for human visual review, so
      // robustness matters more than HiDPI crispness. Switching from
      // 'device' removed most Mobile drift (fractional 2.625x DPR rounding),
      // but the footer check — by far the tallest, most text-dense region
      // watched here — still occasionally reflows by a single CSS pixel of
      // total height (real remote-webfont line-height rendering noise, not
      // a rounding artifact at this scale), which cascades into ~7500
      // differing pixels (ratio ~0.008) across the whole capture. A genuine
      // content-driven structural regression measured ~360000 (ratio
      // ~0.16) during calibration — 20000 sits well clear of both.
      maxDiffPixels: 20000,
      threshold: 0.3,
      animations: 'disabled',
    },
  },
  projects: [
    {
      name: 'Desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1512, height: 800 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: 'Mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
