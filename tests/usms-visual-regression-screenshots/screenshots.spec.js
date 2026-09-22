const { test, expect } = require('@playwright/test');
const pages = require('./pages');
const liveEventsFixture = require('../../src/_data/events.json');
const { applyRegionChecks } = require('../lib/apply-region-checks');

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
    // Club Finder (clubs-filter.js), Calendar of Events (events-filter.js),
    // and Club Detail's distance-to-me display (club-detail-map.js) all
    // resolve the viewer's location the same way — via the shared
    // src/js/lib/geo.js — opening at "Sarasota, FL" (USMS HQ) then
    // overriding it with the runner's IP-based city via an ipinfo.io fetch.
    // That makes the location field, map centre / distance sort, filtered
    // results list, and club-detail distance figures non-deterministic
    // across machines/networks. Block that fetch so every run captures at
    // the Sarasota, FL default. Only geo.js calls ipinfo.io (all three
    // pages funnel through it), so a blanket abort is safe for every page.
    await page.route(/ipinfo\.io/, (route) => route.abort());
    // events-filter.js also fetches production's live event search API at
    // runtime (so the event list tracks production instead of a stale build-time
    // scrape) — production's real list changes daily, which would make the
    // Events baseline non-deterministic. Fulfill it from our committed scrape
    // (src/_data/events.json) instead so every run sees the same list. Only
    // events-filter.js calls this endpoint.
    await page.route(/\/apis\/v1\/ctsearch/, (route) =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify(liveEventsFixture) })
    );
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
    // Home hero carousel (carousel.js): default markup already sits on slide 0
    // (.carousel's inline `left: 0%`, nav item 0 already `--active`), and the
    // frozen clock keeps its setInterval from ever firing — so nothing here
    // should be required to stay on slide 0. Pin it anyway (belt-and-suspenders
    // against markup/JS drift) and pause slide 1's autoplay video so it can't
    // decode/paint a changing frame even though `.carousel-container`'s
    // overflow:hidden already clips it off-screen. This replaces masking the
    // whole carousel, which was hiding the hero text/typography along with the
    // animation — the real source of the old intermittent failures was more
    // likely slide 0's own background-image (a CSS property, not an <img>,
    // so uncovered by the image-await below) not consistently finishing its
    // load before capture, which the explicit wait added there now covers.
    await page.evaluate(() => {
      const carousel = document.querySelector('.carousel');
      if (!carousel) return;
      carousel.style.transition = 'none';
      carousel.style.left = '0%';
      const activeNav = document.querySelector('.carousel-nav__item--active');
      const firstNav = document.querySelector('#carousel-nav__item-0');
      if (activeNav && activeNav !== firstNav) activeNav.classList.remove('carousel-nav__item--active');
      if (firstNav) firstNav.classList.add('carousel-nav__item--active');
      document.querySelectorAll('.carousel__slide video').forEach((v) => v.pause());
    });
    // networkidle doesn't guarantee images have finished decoding/laying out —
    // wait explicitly so late-arriving images can't shift page height mid-capture.
    // Also covers the hero carousel's CSS background-image slides, which
    // aren't <img> elements and so aren't caught by document.images below.
    await page.evaluate(() => Promise.all([
      ...Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        })),
      ...Array.from(document.querySelectorAll('.carousel__slide-image'))
        .map((el) => {
          const match = el.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
          if (!match) return null;
          return new Promise((resolve) => {
            const img = new Image();
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
            img.src = match[1];
          });
        })
        .filter(Boolean),
    ]));
    // Regions excluded from the pixel comparison, plus structural fingerprint
    // assertions where the shared catalog has them populated — see
    // tests/lib/region-checks.js (plan Item 9) for the full selector list and
    // per-selector reasoning. This suite no longer hand-maintains its own
    // separate mask list; production-monitor's spec uses the same engine.
    const { maskSelectors, fingerprintFindings } = await applyRegionChecks(page);
    for (const finding of fingerprintFindings) {
      expect(finding.ok, `${finding.selector}: ${finding.detail}`).toBe(true);
    }
    const maskEl = maskSelectors.length ? page.locator(maskSelectors.join(', ')) : null;

    await expect(page).toHaveScreenshot(`${slug(pagePath)}.png`, {
      fullPage: true,
      mask: maskEl ? [maskEl] : [],
    });
  });
}
