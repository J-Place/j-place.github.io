const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/usms-visual-regression-screenshots',
  fullyParallel: true,
  // Testing against a live network target (GitHub Pages, third-party CDNs/Maps),
  // so allow one retry for timing-based flakiness before treating it as a real diff.
  retries: 1,
  // 'list' prints every test (each page × project) with its pass/fail/skip
  // status to the console — always show the full page-by-page result, not
  // just a summary count. 'html' keeps the diff viewer for failures.
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PW_BASE_URL || 'https://j-place.github.io',
  },
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      // Fixed pixel budget rather than maxDiffPixelRatio — a ratio scales with
      // page height, so the same real layout shift gets more slack on long
      // pages (e.g. Club Edit/Event Edit at ~6800px) than short ones. Measured
      // a 1rem margin change at 977 differing pixels on Event Edit; identical
      // re-captures (localhost and live) measured 0. 100px gives headroom over
      // that zero-noise floor while staying well under a real visible change
      // (a 5px margin shift still lands around ~300px at this same scale).
      maxDiffPixels: 100,
      // Per-pixel color-difference tolerance passed to pixelmatch (0 = strict,
      // 1 = lax; default 0.2) — separate from maxDiffPixels above, which caps
      // the *count* of differing pixels. Text anti-aliasing produces lots of
      // pixels with tiny color deltas along glyph edges against a live font
      // renderer; bumped up from the default to stop those from registering
      // as "different" at all, without masking a real content shift — moved
      // text/controls contrast against their background by a lot more than
      // this, so they still count either way.
      threshold: 0.3,
      animations: 'disabled',
    },
  },
  projects: [
    {
      name: 'Desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'Mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
