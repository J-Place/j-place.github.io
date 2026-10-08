'use strict';

// Interaction states captured as extra full-page screenshots of a page that's
// already in pages.js — the page is loaded the same way as its base test, then
// the named action (defined in screenshots.spec.js's STATE_ACTIONS) puts it in
// the state before capture. Shown in the gallery as variants of the base page.
// Read by screenshots.spec.js and src/_data/visualBaselines.js (gallery).
module.exports = [
  {
    name: 'club-edit--validation',
    label: 'Validation',
    page: '/club-central/club-edit.html',
  },
  {
    name: 'event-edit--validation',
    label: 'Validation',
    page: '/events/event-central/event-dashboard/event-edit.html',
  },
];
