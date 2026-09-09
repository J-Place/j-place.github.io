const { test, expect } = require('@playwright/test');
const pages = require('./pages');

function slug(pagePath) {
  const [path, query] = pagePath.split('?');
  const base = path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\.html$/, '')
    .replace(/\//g, '--') || 'root';
  return query ? `${base}--${query.replace(/[&=]/g, '-')}` : base;
}

// Pages whose sections should be forced open (no validation) before capture,
// via window.expandAllSections() — exposed by club-edit.js, event-edit.js,
// and registration.js for this purpose — so every input is visible in the
// baseline instead of just whichever section happens to be open/selected by
// default.
const EXPAND_ALL_SECTIONS = new Set([
  '/club-central/club-edit.html',
  '/events/event-central/event-dashboard/event-edit.html',
  '/registration/index.html',
]);

// Pages whose "More Filters" panel should be expanded before capture, so the
// filter checkboxes are visible in the baseline rather than collapsed. Only
// meaningful on Mobile: neither page opts into data-desktop-filters="toggle",
// so on Desktop the filter content is already fully shown by CSS and the
// toggle buttons are display:none (nothing to click, and clicking would
// error). On Mobile, the whole filter section is hidden behind the mobile
// search toggle first, then the filter content itself behind "More Filters".
//
// Sets the resulting DOM state directly (classes/inline style) rather than
// clicking through filters.js's real toggle buttons — investigated a real
// flakiness where filters.js's mobile-toggle click listener doesn't reliably
// end up attached to the DOM node present by click time (reproduced on both
// localhost and the live deployed site; root cause not identified, may be
// worth a separate look). This produces the same end visual state as a
// successful click without depending on that unreliable interaction.
const CLICK_MORE_FILTERS = new Set([
  '/clubs/index.html',
  '/events/index.html',
]);

for (const pagePath of pages) {
  test(`visual: ${pagePath}`, async ({ page }, testInfo) => {
    // Freeze JS timers so setInterval-driven carousels (carousel.js, image-slider.js)
    // can't advance between page load and screenshot capture.
    await page.clock.install();
    // Club Finder (clubs-filter.js) opens at "Sarasota, FL" (USMS HQ) then
    // overrides it with the runner's IP-based city via an ipinfo.io fetch —
    // which makes the location field, map centre, and filtered results list
    // non-deterministic across machines/networks. Block that fetch so every
    // run captures Club Finder at the Sarasota, FL default. Only clubs-filter.js
    // calls ipinfo.io, so a blanket abort is safe for every page.
    await page.route(/ipinfo\.io/, (route) => route.abort());
    await page.goto(pagePath, { waitUntil: 'networkidle' });
    if (EXPAND_ALL_SECTIONS.has(pagePath)) {
      await page.evaluate(() => window.expandAllSections());
    }
    if (testInfo.project.name === 'Mobile' && CLICK_MORE_FILTERS.has(pagePath)) {
      await page.evaluate(() => {
        const content = document.querySelector('.list-control-search__content');
        const toggle = document.querySelector('.list-control-search-mobile__toggle');
        const filterSection = document.querySelector('.list-control-filter');
        const filterToggle = document.querySelector('.toggle-filters');
        if (content) content.classList.add('is-flex');
        if (toggle) toggle.classList.add('show-search');
        if (filterSection) {
          filterSection.style.display = 'block';
          filterSection.classList.add('show-filters');
        }
        if (filterToggle) filterToggle.textContent = 'Fewer Filters';
      });
    }
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
    // Regions excluded from the pixel comparison — each is live or animated in
    // a way the frozen clock and image-await can't make deterministic, and each
    // has a fixed height so masking it doesn't shift page layout:
    //   #club-detail-map, .club-map-new  Google Maps embeds — live tiles
    //   .carousel-container              home hero carousel — carousel.js
    //                                    rotates slides (image vs autoplay
    //                                    video); which slide/frame shows on
    //                                    capture isn't pinnable
    //   .image-slider                    home partner-logo strip —
    //                                    image-slider.js scrolls it and the
    //                                    logos load from a CDN
    const maskEl = page.locator(
      '#club-detail-map, .club-map-new, .carousel-container, .image-slider',
    );

    await expect(page).toHaveScreenshot(`${slug(pagePath)}.png`, {
      fullPage: true,
      mask: (await maskEl.count()) ? [maskEl] : [],
    });
  });
}
