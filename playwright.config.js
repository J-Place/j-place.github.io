const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/usms-visual-regression-screenshots',
  fullyParallel: true,
  // Testing against a live network target (GitHub Pages, third-party CDNs/Maps),
  // so allow one retry for timing-based flakiness before treating it as a real diff.
  retries: 1,
  reporter: [['html', { open: 'never' }]],
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
      // that zero-noise floor while staying well under a real visible change.
      maxDiffPixels: 100,
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
