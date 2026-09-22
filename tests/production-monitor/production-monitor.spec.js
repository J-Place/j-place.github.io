const { test, expect } = require('@playwright/test');
const checks = require('./checks');
const { applyRegionChecks } = require('../lib/apply-region-checks');

// Several pages here are rendered client-side by production's React app
// (login-to-registration-page, swimmer-magazine-issue) — the initial HTML
// document loads fast, then real content mounts and grows the page in
// afterward. A fixed settle delay after 'load' isn't a reliable signal for
// that: it caught two pages mid-render outright (captured at exactly the
// viewport's own height, i.e. before any content had mounted) and was
// probably also contributing to smaller height-drift diffs on other pages.
// Poll document height instead and wait for it to stop changing.
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

for (const check of checks) {
  test(`production monitor: ${check.name}`, async ({ page }) => {
    // Freeze JS timers so any auto-advancing carousel/slider on the live page
    // can't move between load and capture.
    await page.clock.install();
    // Club Finder and Calendar of Events both resolve the visitor's city via an
    // ipinfo.io fetch and use it for distance sort / "near you" chrome text —
    // non-deterministic per machine/network. Block it so that chrome text is
    // stable run to run (same fix as the mockup suite's screenshots.spec.js).
    await page.route(/ipinfo\.io/, (route) => route.abort());
    // Google ad slots (.advertising-dc, masked per-check in checks.js where
    // present) don't just show different creative between loads — their
    // IFRAME'S OWN HEIGHT varies with whatever ad happens to fill it, which
    // shifts every element below it on the page. A pixel mask can't
    // compensate for a masked element's bounding box itself changing size
    // (confirmed: fitness-article-detail swung 300-380px run to run with the
    // ad slot masked but still loading). Block gpt.js and the ad-serving
    // domains outright so the slot never populates and stays at its natural
    // empty-container height, every run, on every page — not just the ones
    // checks.js currently masks. (googletagmanager.com is left unblocked —
    // that's analytics, not what's causing the layout shift.)
    await page.route(/doubleclick\.net|googlesyndication\.com|googletagservices\.com/, (route) => route.abort());
    // 'networkidle' times out on production — chat widgets, ads, and analytics
    // beacons (GA, GTM, etc.) keep issuing background requests indefinitely, so
    // the network never truly goes idle (confirmed: 3 outright failures + 2
    // retry-flaky on 'networkidle' in first-run testing here). 'load' plus the
    // explicit image-await below is what the network-idle wait was actually
    // trying to approximate, without depending on trackers ever going quiet.
    const response = await page.goto(check.path, { waitUntil: 'load' });
    // A non-2xx response (bot/rate-limit protection serving a 403, a 5xx
    // blip, etc.) is not a real content diff — fail with a message that says
    // so plainly instead of letting it fall through into a confusing wall-of-
    // red pixel-diff against the real baseline. The suite's existing
    // `retries: 1` re-runs the whole test, which is exactly the right
    // response to a transient block.
    if (!response || !response.ok()) {
      throw new Error(
        `Production returned ${response ? response.status() : 'no response'} for ${check.path} — `
        + 'likely bot/rate-limit protection or a transient error, not a real content change.',
      );
    }
    await page.locator(check.clip || 'body').first().waitFor({ state: 'visible' });
    // Wait for images to finish decoding/laying out so late-arriving images
    // can't shift page height mid-capture.
    await page.evaluate(() => Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }))
    ));
    // Web fonts loading late can reflow text by a pixel or two right at
    // capture time — document.fonts.ready is a stronger signal than the
    // 'load' event for this.
    await page.evaluate(() => document.fonts.ready);
    await waitForStableHeight(page);

    // Structural presence checks, run before the screenshot and reported
    // separately from it: `mask` intentionally blinds the pixel comparison
    // to a region's ever-changing content (a different article, a different
    // ad, a different hero slide), which also means a totally empty/broken
    // masked region would look identical to a healthy one under a pixel
    // diff. `presence` closes that gap — assert the region still contains
    // real, expected content (without caring what it says), independent of
    // whatever's actually rendered there today.
    for (const { selector, min } of check.presence || []) {
      const count = await page.locator(selector).count();
      expect(count, `expected at least ${min} "${selector}" but found ${count}`).toBeGreaterThanOrEqual(min);
    }

    // Shared engine with the mockup suite (tests/lib/apply-region-checks.js,
    // plan Item 9) — this check's own `mask` array (above, in checks.js) is
    // unioned in as page-specific extras on top of the shared catalog's
    // auto-detected selectors, not replaced by it.
    const { maskSelectors, fingerprintFindings } = await applyRegionChecks(page, check.mask || []);
    for (const finding of fingerprintFindings) {
      expect(finding.ok, `${finding.selector}: ${finding.detail}`).toBe(true);
    }
    const maskLocator = maskSelectors.length ? page.locator(maskSelectors.join(', ')) : null;
    const mask = maskLocator && (await maskLocator.count()) ? [maskLocator] : [];

    if (check.clip) {
      await expect(page.locator(check.clip)).toHaveScreenshot(`${check.name}.png`, { mask });
    } else {
      await expect(page).toHaveScreenshot(`${check.name}.png`, { fullPage: true, mask });
    }
  });
}
