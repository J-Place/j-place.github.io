const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/visual',
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
      maxDiffPixelRatio: 0.01,
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
