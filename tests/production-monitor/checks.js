'use strict';

// Structural checks against live production (www.usms.org) — a personal change
// monitor, not visual regression against our own work. Day-to-day content churn
// (news, events, promos, club/event listings) is masked out so a real dev-team
// layout/component change is what surfaces as a diff, not routine content
// updates.
//
// `clip`: CSS selector to screenshot in isolation instead of the full page —
//   use for chrome that should be checked on its own, so (e.g.) a nav-only
//   change doesn't get lost/averaged away inside a full-page diff.
// `mask`: CSS selectors excluded from the pixel comparison on a full-page or
//   clipped check.
//
// Full-page + mask works here the same way it does in the mockup suite's
// screenshots.spec.js EXCEPT where the masked region's ITEM COUNT (not just
// its content) varies between visits — e.g. a news module or search-results
// grid that renders a different number of cards. When that happens the page
// height itself drifts run to run and masking can't fix it (confirmed
// empirically while building club-finder-layout/events-calendar-layout — see
// git history — which is why those became `-filters` clip checks below
// instead of full-page ones). The full-page checks here are a deliberate
// second attempt, expected to need occasional re-baselining if a listing's
// length genuinely pushes page height around; that's an accepted cost of
// watching real production content rather than a fixture.
//
// A few pages.js pages don't appear here at all:
//   - /registration/, /club-central/club-edit.html,
//     /events/event-central/event-dashboard/event-edit.html — require a
//     logged-in club-admin/event-admin production session (not yet wired up).
//   - /swimmer-magazine/ (root index) and the specific SWIMMER article —
//     confirmed (via curl) that production redirects both to
//     /myusmslogin?returnUrl=... — also auth-gated. The magazine ISSUE index
//     itself (swimmer-magazine-issue below) is NOT gated and is included.
// Two more pages.js URLs were retired on production (confirmed 404): the
// specific fitness article and the specific event. Swapped in currently-live
// equivalents instead — the event one especially will need periodic
// swapping as events expire off the calendar.
module.exports = [
  {
    name: 'global-nav',
    path: '/home/',
    clip: '.mega-main-menu',
  },
  {
    name: 'global-footer',
    path: '/home/',
    clip: '#footerOverlay',
  },
  {
    name: 'club-finder-filters',
    path: '/clubs/',
    // The filter/search form chrome (shared with Events via filters.js) —
    // fixed structure, not data-driven, unlike the results list/map below it.
    clip: '.list-control',
  },
  {
    name: 'events-calendar-filters',
    path: '/events/',
    clip: '.list-control',
  },
  {
    name: 'home-full',
    path: '/home/',
    // .carousel-container   hero carousel — rotates slides/video, not pinnable
    // .image-slider         partner-logo strip — auto-scrolls, loads from a CDN
    // .latest-content       "Latest News" module — content changes routinely
    // .personalize          personalized CTA module — varies by guest/member state
    mask: ['.carousel-container', '.image-slider', '.latest-content', '.personalize'],
  },
  {
    name: 'fitness-articles-listing',
    path: '/fitness-and-training/articles-and-videos/',
    // .results-content  article grid — which articles show/what order can change
    mask: ['.results-content'],
  },
  {
    name: 'fitness-article-detail',
    // Retired on production: pages.js's masters-swimming-training-plan-for-
    // former-competitive-swimmers no longer resolves (404). This is a
    // currently-live article instead — single fixed article, not a listing,
    // so no masking needed.
    path: '/fitness-and-training/articles-and-videos/articles/the-5-best-freestyle-workouts/',
  },
  {
    name: 'join-or-renew',
    path: '/join-usms/join-or-renew/',
  },
  {
    name: 'login-to-registration-page',
    // The identity-lookup form itself is public — only submitting it requires
    // being a matched member. Safe to screenshot without logging in.
    path: '/login-to-registration-page/',
  },
  {
    name: 'swimmer-magazine-issue',
    // The issue table-of-contents is public even though the magazine root
    // index and individual articles both redirect to /myusmslogin.
    path: '/swimmer-magazine/may-jun-2026/',
  },
  {
    name: 'events-full',
    path: '/events/',
    // .results-list  event results — new events/dates added routinely
    mask: ['.results-list'],
  },
  {
    name: 'event-detail',
    // Retired on production: pages.js's 2026-bumpy-jones-classic event is
    // gone (404, expired off the calendar). This is a currently-live event
    // instead — will itself need swapping out again once it passes.
    path: '/events/events/2026-shark-tank-scm-meet-a1jpo00000b0m5r2av/',
  },
  {
    name: 'clubs-full',
    path: '/clubs/',
    // .club-list-new           search results — club data/order changes routinely
    // .club-map-new-container  map embed — live tiles
    mask: ['.club-list-new', '.club-map-new-container'],
  },
  {
    name: 'club-detail-sarasota',
    // Real production URL has no .html suffix (confirmed via clubs.json's
    // own scraped `url` field) — unlike this project's local permalink for
    // the same page.
    path: '/clubs/sarasota-y-sharks-536',
    mask: ['#club-detail-map'],
  },
  {
    name: 'club-detail-indy',
    path: '/clubs/indy-aquatic-masters-1745',
    mask: ['#club-detail-map'],
  },
];
