'use strict';

// Shared region catalog (plan Item 9) — the ONE place both
// tests/usms-visual-regression-screenshots/screenshots.spec.js and
// tests/production-monitor/production-monitor.spec.js look up which selectors
// need masking and/or structural fingerprint assertions, instead of each
// suite keeping its own separate, drifting mask list.
//
// Every entry always contributes its selector to the pixel-diff mask list —
// content inside genuinely varies, so the screenshot comparison has to ignore
// it regardless. What `fingerprint` adds is EXTRA structural assertions run
// before the screenshot (same pattern checks.js's existing `presence` checks
// already use) — so a masked region isn't just a blind spot, it's still
// checked for "did the layout/sizing break," just not "does the content match."
//
// The dividing line for whether `fingerprint` is worth populating: can THIS
// PROJECT'S markup/CSS be asserted against at all? Third-party content whose
// shape (not just text) is outside our control — ad creative, live map tiles —
// has nothing stable of ours to check, so those stay mask-only, permanently.
// Everything else is our own markup; only the content inside varies.
//
// Populated from tests/production-monitor/checks.js's existing mask list plus
// tests/usms-visual-regression-screenshots/screenshots.spec.js's, deduplicated,
// plus Item 10's actual scan findings (2026-09-22): the hero carousel and the
// home page's "Latest" content grid are confirmed flaky on BOTH suites, not
// assumed.
//
// `fingerprint: null` means: cataloged as a fingerprint candidate (our own
// markup, worth asserting), but the actual expected computed-style values
// haven't been determined yet — inspecting each one's real CSS/JSX to get
// real numbers (not fabricated placeholders) is follow-up work, tracked in
// the plan. Until populated, the engine (apply-region-checks.js) falls back
// to mask-only for these with a console warning, so the suites keep running
// correctly in the meantime rather than breaking on an incomplete catalog.

module.exports = [
  {
    selector: '.advertising-dc',
    fingerprint: false, // permanently mask-only — see file header
    reason: "Third-party ad creative — even the slot's own container height moves with whatever fills it (confirmed in production-monitor.spec.js's own history). No stable structure of ours to assert.",
  },
  {
    selector: '#club-detail-map, .club-map-new, .club-map-new-container',
    fingerprint: false, // permanently mask-only — see file header
    reason: "Google's own live map tiles, rendered inside an iframe we don't control.",
  },
  {
    selector: '.personalize',
    fingerprint: false, // needs a case-by-case look before promoting — see Item 9 in the plan
    reason: 'Varies by guest/member state — unclear yet whether it renders a structurally stable component with varying content, or genuinely different component shapes per segment. Left mask-only until checked; do not assume either way.',
  },
  // NOTE: .carousel-container / .carousel is deliberately NOT in this shared
  // catalog. Found the hard way (2026-09-22): screenshots.spec.js already has
  // a working, non-masking solution for it — pins the carousel to slide 0
  // instead of masking, specifically so hero typography stays visible in the
  // baseline (see that file's own comments). Adding it here masked a region
  // the existing committed baseline didn't mask, producing a ~44% page-wide
  // diff that had nothing to do with genuine flakiness — pure masking-scheme
  // mismatch against stale baselines. Item 10's detector found this region
  // "flaky," but that scan deliberately doesn't replicate the pin (documented
  // in its own header) — so it can't tell you whether the REAL, pinned suite
  // still has a problem here. Production-monitor has no pinning capability
  // against live production, so it still masks .carousel-container via its
  // own existing checks.js `mask:` array, untouched by this file. Don't add
  // the carousel back here without first checking whether the mockup suite's
  // pin is actually still working — this needs suite-specific treatment
  // (pin vs. mask), not one universal catalog entry.
  {
    selector: '.image-slider',
    fingerprint: null, // TODO
    reason: 'Our own partner-logo slider markup (Media/ImageSlider.jsx -> partials/Homepage/ImageSlider.njk) — auto-scrolls, logos load from a CDN. Real fingerprint values not yet determined.',
  },
  {
    selector: '.latest-content__container',
    fingerprint: null, // TODO — confirmed flaky by Item 10's scan (2026-09-22) on our OWN mockup's home page, not just production-monitor's copy; do not assume our mockup is static here
    reason: "Our own \"Latest\" module card grid (PageContent/LatestContent.jsx -> partials/Homepage/Latest.njk) — which articles/events show varies. Real fingerprint values not yet determined.",
  },
  {
    selector: '.results-content, .results-list',
    fingerprint: null, // TODO
    reason: 'Our own results/article listing (Results/*.jsx -> partials/Results/*.njk) — card content varies. On our own mockup, verify per-page whether this is actually live (needs fingerprint) or static-baked (needs nothing) before assuming — Articles & Videos was confirmed fully static (ResultsContentArticles.njk hardcodes 3 articles), do not assume other pages using this selector are the same.',
  },
  {
    selector: '.club-list-new',
    fingerprint: null, // TODO
    reason: 'Our own club search results list (Club/ClubFinderList.jsx -> partials/Club/ClubList.njk) — which clubs/order shows varies. Real fingerprint values not yet determined.',
  },
  {
    selector: '.articleStepper',
    fingerprint: null, // TODO
    reason: 'SWIMMER "Also in this Issue" strip — slick-carousel autoplay, which related-article slide shows isn\'t pinnable. Real fingerprint values not yet determined.',
  },
];
