'use strict';

// Sitewide chrome captured once each, as an element screenshot on a single
// representative page, instead of inside every page test (page tests mask
// these via tests/lib/region-checks.js). Selectors must stay in sync with
// that entry.
// Read by screenshots.spec.js and src/_data/visualBaselines.js (gallery).
module.exports = [
  {
    name: 'header',
    label: 'Site Header',
    page: '/login-to-registration-page/index.html',
    selector: '#main-container > header.header-static',
  },
  {
    name: 'footer',
    label: 'Site Footer',
    page: '/login-to-registration-page/index.html',
    selector: 'body > footer',
  },
];
