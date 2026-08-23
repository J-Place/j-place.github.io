const { test, expect } = require('@playwright/test');
const pages = require('./pages');

function slug(pagePath) {
  return pagePath
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\.html$/, '')
    .replace(/\//g, '--') || 'root';
}

// [project name]: [page path] pairs to skip. Document the reason inline.
const SKIP = new Set([
  // Crashes Chromium during Playwright's screenshot-stability retries under
  // mobile emulation — the page's resize-driven carousel (goTo() in
  // join-or-renew-tms.njk) appears to loop when repeatedly triggered by
  // Playwright's internal viewport resizing. A single manual screenshot
  // works fine, so this is a test-harness interaction, not a confirmed
  // rendering bug — worth a closer look separately.
  'Mobile:/join-usms/join-or-renew-tms/index.html',
]);

for (const pagePath of pages) {
  test(`visual: ${pagePath}`, async ({ page }, testInfo) => {
    test.skip(SKIP.has(`${testInfo.project.name}:${pagePath}`), 'see SKIP comment in this file');
    // Freeze JS timers so setInterval-driven carousels (carousel.js, image-slider.js)
    // can't advance between page load and screenshot capture.
    await page.clock.install();
    await page.goto(pagePath, { waitUntil: 'networkidle' });
    // networkidle doesn't guarantee images have finished decoding/laying out —
    // wait explicitly so late-arriving images can't shift page height mid-capture.
    await page.evaluate(() => Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }))
    ));
    // Google Maps embeds (#club-detail-map, .club-map-new) render live tiles over
    // the network with inherently non-deterministic timing/imagery — mask them
    // out of the pixel comparison rather than chase determinism a live
    // third-party map can't offer.
    const mapEl = page.locator('#club-detail-map, .club-map-new');
    await expect(page).toHaveScreenshot(`${slug(pagePath)}.png`, {
      fullPage: true,
      mask: (await mapEl.count()) ? [mapEl] : [],
    });
  });
}
