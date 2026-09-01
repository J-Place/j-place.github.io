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
      // 1512x982 is the default logical resolution of a 14" MacBook Pro (2x Retina,
      // native 3024x1964). Height kept at 800 (full-page screenshots capture the
      // actual page height regardless).
      use: { ...devices['Desktop Chrome'], viewport: { width: 1512, height: 800 } },
    },
    {
      name: 'Mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
