// src/_data/productionMonitorBaselines.js
// Enumerates the current production-monitor baseline screenshots (live
// www.usms.org) at build time, for src/pages/production-monitor-gallery.njk.
// Same idiom as src/_data/visualBaselines.js, which does this for the
// mockup's own baselines.

'use strict';

const fs = require('fs');
const path = require('path');

const checks = require('../../tests/production-monitor/checks.js');

const PRODUCTION_ORIGIN = 'https://www.usms.org';

// Human-readable label shown on the gallery page in place of the check name.
// Worded to match visualBaselines.js's LABELS for the same page.
const LABELS = {
  'home-full': 'Homepage',
  'fitness-articles-listing': 'Articles and Videos',
  'fitness-article-detail': 'Article - Masters Swimming Training Plan ...',
  'join-or-renew': 'Join or Renew',
  'login-to-registration-page': 'Login to Registration',
  'swimmer-magazine-issue': 'SWIMMER Magazine TOC',
  'events-full': 'Calendar of Events',
  'event-detail': 'Event - Bumpy Jones',
  'clubs-full': 'Club Finder',
  'club-detail-sarasota': 'Club - Sarasota Sharks',
  'club-detail-indy': 'Club - Indy Masters',
};

module.exports = function () {
  const snapshotsDir = path.join(__dirname, '../../tests/production-monitor/production-monitor.spec.js-snapshots');

  const available = new Set(
    fs.existsSync(snapshotsDir) ? fs.readdirSync(snapshotsDir) : []
  );

  return checks.map((check) => ({
    pageUrl: PRODUCTION_ORIGIN + check.path,
    label: LABELS[check.name] || check.name,
    items: ['Desktop', 'Mobile']
      .map((viewport) => ({ viewport, filename: `${check.name}-${viewport}-darwin.png` }))
      .filter(({ filename }) => available.has(filename))
      .map(({ viewport, filename }) => ({ label: viewport, viewport, path: `production-monitor-baselines/${filename}` })),
  }));
};
