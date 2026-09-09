// src/_data/visualBaselines.js
// Enumerates the current visual-regression baseline screenshots at build time, for the
// screenshot-list gallery page (src/pages/visual-regression-gallery.njk). Same
// fs.readdirSync-at-build-time idiom as src/_data/swimmerResults.js.

'use strict';

const fs = require('fs');
const path = require('path');

const pages = require('../../tests/usms-visual-regression-screenshots/pages.js');

// Mirrors the slug() transform in tests/usms-visual-regression-screenshots/screenshots.spec.js —
// keep these in sync if that function ever changes. Not `require`d directly: that file calls
// Playwright's test() at module load time, which throws outside the test runner.
function slug(pagePath) {
  return pagePath
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\.html$/, '')
    .replace(/\//g, '--') || 'root';
}

// Manual (hand-captured) validation-state screenshots, shown as variants of their base page.
// Not produced by the automated slug-based naming convention, so mapped by hand.
const MANUAL_VARIANTS = {
  '/club-central/club-edit.html': [
    { file: 'club-edit-validation-baseline.png', label: 'Validation (manual variant)' },
  ],
  '/events/event-central/event-dashboard/event-edit.html': [
    { file: 'event-edit-validation-after.png', label: 'Validation (manual variant)' },
  ],
};

module.exports = function () {
  const snapshotsDir = path.join(__dirname, '../../tests/usms-visual-regression-screenshots/screenshots.spec.js-snapshots');
  const manualDir    = path.join(__dirname, '../../tests/usms-visual-regression-screenshots/manual-baselines');

  const availableAutomated = new Set(
    fs.existsSync(snapshotsDir) ? fs.readdirSync(snapshotsDir) : []
  );
  const availableManual = new Set(
    fs.existsSync(manualDir) ? fs.readdirSync(manualDir) : []
  );

  return pages.map((pagePath) => {
    const pageSlug = slug(pagePath);
    const items = [];

    for (const viewport of ['Desktop', 'Mobile']) {
      const filename = `${pageSlug}-${viewport}-darwin.png`;
      if (availableAutomated.has(filename)) {
        items.push({
          label: viewport,
          path: `visual-regression-baselines/${filename}`,
        });
      }
    }

    for (const variant of MANUAL_VARIANTS[pagePath] || []) {
      if (availableManual.has(variant.file)) {
        items.push({
          label: variant.label,
          path: `visual-regression-baselines/manual/${variant.file}`,
        });
      }
    }

    return { pagePath, items };
  });
};
