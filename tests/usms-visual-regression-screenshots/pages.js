'use strict';

// Every page permalink built by Eleventy, mirrored from src/pages/**/*.njk frontmatter.
// Update this list when pages are added/removed/renamed — it is not auto-generated.
//
// Deliberately a small, hand-picked starting set (not one-per-page-in-the-site) — add more
// pages here one at a time as they're worth covering, rather than letting this re-accumulate
// near-duplicate coverage of the same template/component.
module.exports = [
  '/home/index.html',
  '/fitness-and-training/articles-and-videos/index.html',
  '/fitness-and-training/articles-and-videos/articles/masters-swimming-training-plan-for-former-competitive-swimmers/index.html',
  '/swimmer-magazine/index.html',
  '/swimmer-magazine/may-jun-2026/index.html',
  '/swimmer-magazine/may-jun-2026/how-to-do-butterfly-pull/index.html',
  '/events/index.html',
  '/events/events/2026-bumpy-jones-classic-long-course-meet-a1jpo00000abjhf2a3/index.html',
  // All three club pages below are pinned via ?lat=&long= for the same
  // reason: on the live site every one of them resolves a real visitor's
  // location through geo.js -> ipinfo.io (falling back to the Sarasota
  // default only if that lookup fails) — nothing here changes that, since
  // this query string only ever appears in this test fixture list, never in
  // a real link anywhere on the site. Pinning it explicitly here just makes
  // every page's test determinism the same mechanism instead of two of them
  // depending on the ipinfo.io route block below staying in place.
  //
  // Club Finder and Sarasota Sharks are pinned to geo.js's own Sarasota HQ
  // default (UsmsGeo.DEFAULT_LAT/DEFAULT_LNG, matching production's
  // GeoService.GetDefaultGeo()) — a no-op vs. the old bare URLs.
  '/clubs/index.html?lat=27.3288505&long=-82.5368164',
  '/clubs/sarasota-y-sharks-536.html?lat=27.3288505&long=-82.5368164',
  // Indy Aquatic Masters is pinned to a real Indianapolis coordinate
  // (verified against production's own Club Finder result for this exact
  // location) instead of the Sarasota default, which would show a ~900 mi
  // distance for every location — not a meaningful baseline.
  '/clubs/indy-aquatic-masters-1745.html?lat=39.76909&long=-86.158018',
  '/join-usms/join-or-renew/index.html',
  '/login-to-registration-page/index.html',
  // Pinned to the new-member persona explicitly (same default the page's own
  // frontmatter already sets), same pattern as the ?lat=&long=/?club= pins
  // above — keeps the baseline anchored to a named persona regardless of
  // sessionStorage.activeUser leftover from earlier navigation or future
  // frontmatter changes.
  '/registration/index.html?user=NEW',
  '/club-central/club-edit.html',
  '/events/event-central/event-dashboard/event-edit.html',
];
