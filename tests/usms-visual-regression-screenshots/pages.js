'use strict';

// Curated subset of pages for visual regression — not the full site (see git
// history for that version). Update this list deliberately when the set of
// pages under review changes; it is not auto-generated.
module.exports = [
  '/home/index.html',
  '/fitness-and-training/articles-and-videos/index.html',
  '/fitness-and-training/articles-and-videos/articles/masters-swimming-training-plan-for-former-competitive-swimmers/index.html',
  '/events/index.html',
  '/events/events/2026-bumpy-jones-classic-long-course-meet-a1jpo00000abjhf2a3/index.html',
  '/clubs/index.html',
  '/clubs/sarasota-y-sharks-536.html',
  '/login-to-registration-page/index.html',
  '/registration/index.html',
  // Add-a-new-club mode (blank form) — the default. Do not add ?mode=edit
  // here: "edit an existing club" is a dev-overlay-only scenario
  // (club-edit-mode.js), so it can't be captured with dev off and it drags
  // in a populated club persona. Club Edit is always tested in add mode.
  '/club-central/club-edit.html',
  '/search/index.html',
  '/events/event-central/event-dashboard/event-edit.html',
];
