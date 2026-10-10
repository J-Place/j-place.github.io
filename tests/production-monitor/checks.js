'use strict';

// Structural checks against live production (www.usms.org) — a personal change
// monitor, not visual regression against our own work. Day-to-day content churn
// (news, events, promos, club/event listings) is masked out so a real dev-team
// layout/component change is what surfaces as a diff, not routine content
// updates.
//
// This list is meant to mirror the mockup's own
// tests/usms-visual-regression-screenshots/pages.js — same set of pages,
// minus whichever ones require a logged-in production session (this suite
// has no auth wired up). One check per pages.js page, all full-page (no
// clipped/partial-component checks — those don't exist in pages.js either,
// and mixing "whole page" and "one element" checks in the same list made it
// harder to tell at a glance what's actually being watched).
//
// `mask`: CSS selectors excluded from the pixel comparison on a full-page
// check, for content that legitimately changes day to day.
//
// `style`: optional CSS injected after load, before the height-settle wait
// and screenshot — for pinning a masked region's size when its content
// changes height between loads (a mask hides pixels, not layout shift).
//
// Full-page + mask works here the same way it does in the mockup suite's
// screenshots.spec.js EXCEPT where the masked region's ITEM COUNT (not just
// its content) varies between visits — e.g. a news module or search-results
// grid that renders a different number of cards. When that happens the page
// height itself drifts run to run and masking can't fix it; that's an
// accepted cost of watching real production content rather than a fixture.
//
// pages.js pages NOT included here, and why:
//   - /registration/, /club-central/club-edit.html,
//     /events/event-central/event-dashboard/event-edit.html — require a
//     logged-in club-admin/event-admin production session (not yet wired up).
//   - /swimmer-magazine/ (root index) and the specific SWIMMER article —
//     confirmed (via curl) that production redirects both to
//     /myusmslogin?returnUrl=... — also auth-gated. The magazine ISSUE index
//     itself (swimmer-magazine-issue below) is NOT gated and is included.
//
// club-detail-sarasota/club-detail-indy and event-detail/fitness-article-detail
// use production's real slugs from pages.js's equivalent entries, not our
// mockup's local `.html` permalinks. event-detail/fitness-article-detail
// deliberately have NO trailing slash on the detail-page path — confirmed
// via curl that production 404s these specific article/event URLs *with* a
// trailing slash but 200s without one (unlike the listing pages, which do
// want the trailing slash). Get this wrong and the check fails with a
// misleading "page not found" instead of ever reaching the screenshot
// comparison — cost real debugging time once already, worth getting it
// right rather than swapping in a different slug next time this trips.
module.exports = [
  {
    name: 'home-full',
    path: '/home/',
    // .carousel-container       hero carousel — rotates slides/video, not pinnable
    // .image-slider             partner-logo strip — auto-scrolls, loads from a CDN
    // .latest-content__container  "Latest News" module's actual card grid — content
    //                           changes routinely. NOT .latest-content itself: that
    //                           outer element's own bounding box collapses to just its
    //                           42px title bar (confirmed via a real browser — its
    //                           floated/positioned children don't contribute to its
    //                           height), so masking it left the real grid, 807px of
    //                           it, fully exposed and unmasked. __container is the
    //                           child that actually wraps the visible cards.
    // .personalize              personalized CTA module — varies by guest/member state
    // .advertising-dc           Google-Publisher-Tag ad slots (2 on this page) — creative
    //                           rotates every load, not something we serve/control
    mask: ['.carousel-container', '.image-slider', '.latest-content__container', '.personalize', '.advertising-dc'],
    // The Latest grid's height follows whichever articles are featured
    // (measured 2026-10-09: 764–807px Desktop, 2345–2367px Mobile), shifting
    // everything below it — pinned larger than any measured load.
    style: `.latest-content__container { height: 850px !important; overflow: hidden !important; }
      @media (max-width: 767px) { .latest-content__container { height: 2450px !important; } }`,
    // Confirmed against the live DOM (raw HTML — all server-rendered, no
    // client-side wait needed beyond what's already above):
    //   .carousel__slide                    hero carousel's actual slide(s)
    //   .image-slider__container            partner-logo strip's track
    //   .latest-content-event__image-container  the one always-present featured item
    //   .latest-content__article            the regular grid of article cards (5 today)
    //   .personalize__content-column        the personalized CTA's content column(s)
    presence: [
      { selector: '.carousel__slide', min: 1 },
      { selector: '.image-slider__container', min: 1 },
      { selector: '.latest-content-event__image-container', min: 1 },
      { selector: '.latest-content__article', min: 1 },
      { selector: '.personalize__content-column', min: 1 },
    ],
  },
  {
    name: 'fitness-articles-listing',
    path: '/fitness-and-training/articles-and-videos/',
    // .results-content  article grid — which articles show/what order can change.
    //                   Client-rendered (Algolia-style search widget, confirmed
    //                   via a real browser render — not present in the raw HTML).
    // .advertising-dc   1 ad slot on this page — creative rotates every load.
    mask: ['.results-content', '.advertising-dc'],
    // Grid height follows article title wrapping (measured 2026-10-09: 6112px
    // Desktop, 11532px Mobile, but drifted 94px vs the 09-19 baseline) —
    // pinned with headroom.
    style: `.results-content { height: 6300px !important; overflow: hidden !important; }
      @media (max-width: 767px) { .results-content { height: 11800px !important; } }`,
    presence: [{ selector: '.results-list__item', min: 1 }],
  },
  {
    name: 'fitness-article-detail',
    // No trailing slash — see file header. Single fixed article, so
    // .results-content-style masking isn't needed, but this page has its own
    // pair of ad slots (a leaderboard + a sidebar unit with a variable-height
    // iframe, "USMS_Rec_2:3_9-3" — confirmed via a real browser render) that
    // were left unmasked until diagnosed: swings of 300+ px between runs as
    // different ad creative loaded, which masking a static class doesn't
    // normally need to account for but a variable-height iframe genuinely does.
    // Same article as pages.js's article entry, so the mockup and the
    // monitor watch the exact same page body (was "the-5-best-freestyle-
    // workouts" until 2026-10-08 — same template, different content).
    path: '/fitness-and-training/articles-and-videos/articles/masters-swimming-training-plan-for-former-competitive-swimmers',
    // .related-content__container  "Related Articles" cards — production picks
    //                   a different set on each load (confirmed 2026-10-09: a
    //                   run minutes after regenerating the baseline failed only
    //                   in this strip). The __header title bar stays unmasked.
    //                   Masking alone isn't enough: the random cards' titles
    //                   wrap differently, so the strip's height varies too
    //                   (measured 349–392px Desktop, ~1612px Mobile), which
    //                   shifts the whole page below it. `style` pins it to a
    //                   fixed height larger than any measured load.
    mask: ['.advertising-dc', '.related-content__container'],
    style: `.related-content__container { height: 420px !important; overflow: hidden !important; }
      @media (max-width: 767px) { .related-content__container { height: 1700px !important; } }`,
  },
  {
    name: 'join-or-renew',
    path: '/join-usms/join-or-renew/',
    // .advertising-dc  1 ad slot on this page.
    mask: ['.advertising-dc'],
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
    // .results-list  event results — new events/dates added routinely. Same
    // underlying search-widget component as fitness-articles-listing above
    // (shares the .results-list__item card class).
    mask: ['.results-list'],
    presence: [{ selector: '.results-list__item', min: 1 }],
  },
  {
    name: 'event-detail',
    // No trailing slash — see file header. Same event as pages.js's event
    // entry (was Shark Tank until 2026-10-08). It's a past event, but
    // production keeps past event detail pages reachable by URL (confirmed
    // 200 on 2026-10-08), so it doesn't need swapping as the calendar moves
    // on — if it ever 404s, change it here and in pages.js together.
    // .advertising-dc  1 ad slot on this page.
    path: '/events/events/2026-bumpy-jones-classic-long-course-meet-a1jpo00000abjhf2a3',
    mask: ['.advertising-dc'],
  },
  {
    name: 'clubs-full',
    path: '/clubs/',
    // .club-list-new           search results — club data/order changes routinely.
    //                          Client-rendered (React, confirmed via a real
    //                          browser render — not present in the raw HTML).
    // .club-map-new-container  map embed — live tiles
    mask: ['.club-list-new', '.club-map-new-container'],
    presence: [{ selector: '.club-list-item-new', min: 1 }],
  },
  {
    name: 'club-detail-sarasota',
    // Real production URL has no .html suffix (confirmed via clubs.json's
    // own scraped `url` field) — unlike this project's local permalink for
    // the same page.
    // .club-location__map-pin--distance  distance-to-me per location —
    //   computed server-side from the requester's IP (confirmed 2026-10-09:
    //   22 / 109 / 8 mi across runs/networks), so it's not stable. Blocking
    //   ipinfo.io client-side doesn't affect it.
    path: '/clubs/sarasota-y-sharks-536',
    mask: ['#club-detail-map', '.club-location__map-pin--distance'],
  },
  {
    name: 'club-detail-indy',
    path: '/clubs/indy-aquatic-masters-1745',
    mask: ['#club-detail-map', '.club-location__map-pin--distance'],
  },
];
