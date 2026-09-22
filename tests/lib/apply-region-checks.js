'use strict';

// The shared engine (plan Item 9) that reads tests/lib/region-checks.js and
// applies it to a live page — used identically by both
// tests/usms-visual-regression-screenshots/screenshots.spec.js and
// tests/production-monitor/production-monitor.spec.js. Neither spec file
// should hand-roll its own mask-locator construction anymore; call this
// instead so both suites share one mechanism, even though they stay pointed
// at different environments (see playwright.config.js vs
// playwright.production-monitor.config.js's own separate, deliberate config).
//
// Additive, not destructive: this ADDS the shared catalog's auto-detected
// selectors on top of whatever page-specific selectors a caller already
// knows about (e.g. production-monitor/checks.js's per-check `mask:` array)
// — it doesn't require deleting anything page-specific to adopt.

const catalog = require('./region-checks');

/**
 * @param {import('@playwright/test').Page} page
 * @param {string[]} [extraMaskSelectors] - page-specific selectors from the
 *   caller (e.g. a checks.js entry's own `mask:` array) to union in, for
 *   anything not yet covered by the shared catalog.
 * @returns {Promise<{maskSelectors: string[], fingerprintFindings: Array<{selector: string, ok: boolean, detail: string}>}>}
 */
async function applyRegionChecks(page, extraMaskSelectors = []) {
  const maskSelectors = [...extraMaskSelectors];
  const fingerprintFindings = [];

  for (const entry of catalog) {
    const locator = page.locator(entry.selector);
    const count = await locator.count().catch(() => 0);
    if (!count) continue; // not present on this page — nothing to do

    maskSelectors.push(entry.selector);

    if (entry.fingerprint === false) continue; // permanently mask-only, no warning needed
    if (entry.fingerprint === null) {
      console.warn(`[region-checks] "${entry.selector}" is a fingerprint candidate with no assertions configured yet (${entry.reason}) — masked only for now. See Item 9 follow-up in the plan.`);
      continue;
    }

    // A populated fingerprint entry: { selector, fingerprint: [{ target, property, expected }, ...] }.
    // `target` is a selector for representative child element(s) *within* entry.selector;
    // `property` is read via getComputedStyle in-page; `expected` is the asserted value.
    for (const assertion of entry.fingerprint) {
      const targetLocator = locator.locator(assertion.target);
      const targetCount = await targetLocator.count().catch(() => 0);
      if (!targetCount) {
        fingerprintFindings.push({ selector: entry.selector, ok: false, detail: `target "${assertion.target}" not found — cannot check ${assertion.property}` });
        continue;
      }
      const actual = await targetLocator.first().evaluate(
        (el, prop) => getComputedStyle(el).getPropertyValue(prop),
        assertion.property
      );
      const ok = actual.trim() === assertion.expected.trim();
      fingerprintFindings.push({
        selector: entry.selector,
        ok,
        detail: ok
          ? `${assertion.target} ${assertion.property}: ${actual} (expected)`
          : `${assertion.target} ${assertion.property}: expected "${assertion.expected}", got "${actual}"`,
      });
    }
  }

  return { maskSelectors: [...new Set(maskSelectors)], fingerprintFindings };
}

module.exports = { applyRegionChecks };
