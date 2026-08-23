# Accessibility Audit — Test Plan & Findings

Tracks accessibility issues found in the mockup, the before/after evidence for each fix, and a running changelog to hand off to the dev team. Findings here are scoped to **practical, real-user-impact issues** (keyboard operability, screen-reader access, contrast, form labels) — not a strict legal/VPAT compliance pass.

---

## Test Plan

### Tools

- **WAVE** — the hosted tool at wave.webaim.org now works directly, since the pages under test are deployed to permanent public URLs (no need for the browser extension or `localhost`).
- **Google Lighthouse** (Chrome DevTools → Lighthouse panel, Accessibility category only, or PageSpeed Insights against the snapshot URL). Run once with the **Desktop** device preset and once with **Mobile**, since Lighthouse's a11y checks can differ slightly by viewport (e.g. touch target size, tap target spacing).

### Pages under test

Chosen to cover the three primary layout types plus one page with a custom interactive widget (accordion), which is the same class of issue as the meganav dropdown findings below, plus the homepage as the highest-traffic entry point to the site. All five share the global header/footer, so meganav and footer fixes get validated on every page without needing a separate page for them.

Each page below is a **frozen static snapshot** deployed via the `/snapshot` skill, representing the pre-WCAG-update state of this branch (`feature/club-edit-remove-gold-club`) as of 2026-08-17. These URLs are immutable — later fixes will not change them — so the "before" evidence stays stable no matter how much the branch changes while fixes land. Registered in `snapshot-registry.json`.

| Page | Snapshot URL | Local source | Why it's in the set |
|---|---|---|---|
| Homepage | https://home-260817--usms-mockup.netlify.app | `/home/index.html` | Highest-traffic entry point; carousel, personalization modules |
| Registration | https://registration-260817--usms-mockup.netlify.app | `/registration/index.html` | Transactional form flow; membership pricing, payment fields |
| Article | https://article-training-plan-260817--usms-mockup.netlify.app | `/fitness-and-training/articles-and-videos/articles/masters-swimming-training-plan-for-former-competitive-swimmers/index.html` | Content/reading page; byline, related-content links, newsletter signup |
| Content page | https://contact-us-260817--usms-mockup.netlify.app | `/about/contact-us.html` | Static content + form + third-party embed (reCAPTCHA) |
| Club Edit | https://club-edit-260817--usms-mockup.netlify.app/?mode=edit&clubId=local-001 | `/club-central/club-edit.html` | Custom accordion/toggle components — active branch, same interaction pattern as the meganav keyboard issue |

### Methodology

1. **Before:** run WAVE and both Lighthouse passes against the 4 frozen snapshot URLs above. Record:
   - Lighthouse Accessibility score (0–100), desktop and mobile
   - WAVE error / contrast error / alert counts, and the specific item list (screenshot or exported summary)
2. **Fix:** implement one issue (or one logical group of issues) at a time, on the live branch (not the snapshots — those stay frozen as the "before" reference).
3. **After:** once fixes are ready, deploy a second round of snapshots (same `/snapshot` workflow, new date suffix) and re-run the same tool, same page, same viewport against those. Confirm the specific flagged item is gone and the score moved — don't just eyeball the aggregate score, since a score can stay flat while trading one issue for another.
4. Log every change in the **Changelog** section below as it lands, regardless of whether the before/after re-test has been done yet — the changelog is the dev-team deliverable and should stay current with the branch.

### Known limitation

WAVE and Lighthouse are automated scanners — they catch roughly 30–40% of WCAG success criteria (contrast, missing labels, missing alt text, ARIA misuse) but can't detect whether a custom widget is actually keyboard-operable. The meganav dropdown-trigger issue below was found by manual keyboard testing + DOM inspection, not by an automated scan — expect WAVE/Lighthouse to come back clean on that class of issue even after this plan's baseline runs. Manual keyboard walkthroughs remain necessary for any custom interactive component (accordions, toggles, custom dropdowns).

---

## Baseline (Before) Results

_Fill in after running WAVE + Lighthouse on the branch as of the date below, before any fixes land._

**Baseline date:** 2026-08-17
**Branch / commit:** `feature/club-edit-remove-gold-club` — snapshot URLs above are immutable regardless of later commits on this branch

| Page | Lighthouse a11y (Desktop) | Lighthouse a11y (Mobile) | WAVE errors | WAVE contrast errors | WAVE alerts |
|---|---|---|---|---|---|
| Homepage | | | | | |
| Registration | | | | | |
| Article | | | | | |
| Content page | | | | | |
| Club Edit | | | | | |

---

## Findings

Carried over from the manual + axe-core review of registration, article, and content-page templates, plus a manual keyboard/DOM audit of the meganav. Each item notes the file(s) to change and the practical user impact — see "Known limitation" above for why some of these won't show up in the WAVE/Lighthouse baseline.

### Site-wide (shared partials — one fix, every page benefits)

| # | Issue | File | Impact |
|---|---|---|---|
| 1 | Mobile viewport disables pinch-zoom (`maximum-scale=1.0, user-scalable=0`) | `src/_includes/partials/head-css.njk` (or wherever the `<meta viewport>` tag lives in the base layout) | Low-vision users on mobile cannot zoom at all |
| 2 | Meganav dropdown triggers (Training / Events / About Us) are `<li>` with no `tabindex`/`role`/`aria-expanded`, click-only handler | `src/_includes/partials/Navigation/MegaMainMenu.njk:44-58`, `src/js/megamenu.js:132` | Keyboard/screen-reader users cannot open 3 of 6 primary nav menus |
| 3 | Meganav search toggle is a click-only `<div>`, not focusable | `MegaMainMenu.njk:82`, `megamenu.js:202` | No keyboard way to open search |
| 4 | Mobile submenu accordions are click-only, no keyboard support | `megamenu.js:267` | Same pattern as #2/#3, on mobile |
| 5 | Login/account link wrapper is `aria-hidden="true"` but wraps a real focusable `<a>` with a click-toggle handler | `MegaMainMenu.njk:87`, `megamenu.js:161` | Screen reader users get no indication the Log In / account control exists |
| 6 | No `aria-expanded` on any of the above triggers | `MegaMainMenu.njk`, `megamenu.js` | Even once focusable, open/closed state isn't announced |
| 7 | Empty `<h4 class="subscribe__header">` in the footer subscribe widget | `src/_includes/partials/Navigation/Footer.njk:156`, `src/_includes/layouts/lmsc.njk:202` | Likely a template bug (heading with no text) rather than a fundamental a11y issue — verify intent |

### Registration page

| # | Issue | Detail |
|---|---|---|
| 8 | Hall of Fame donation input has no label at all | `<input name="swimming-hall-of-fame" class="form-control currency" value="0.00">` — screen reader users can't tell what the field is for |
| 9 | Color contrast, 21 instances | Membership pricing/promo text (`.current-year-promo`, `.currentYear-cost`, plan description labels) |

### Article page

| # | Issue | Detail |
|---|---|---|
| 10 | 4 image links with no accessible name | `.latest-content__image-container > a` — related-article thumbnail links wrap an image with no alt text and no link text |
| 11 | Email signup input has no label | `#emailAddress` newsletter input |
| 12 | Color contrast, 8 instances | Byline date, Sign Up button, related-article author names |

### Content page (Contact Us)

| # | Issue | Detail |
|---|---|---|
| 13 | Color contrast, 4 instances | Footer/legal-style links |
| — | reCAPTCHA widget flags (`aria-toggle-field-name`, `aria-prohibited-attr`, contrast on the reCAPTCHA logo/footer links) | Third-party Google markup — not actionable in our templates, excluded from scope |

### Club Edit page

_Not yet audited — pending baseline run. Expect the same accordion-keyboard-operability pattern as the meganav (#2–4) given the recent accordion-toggle work on this branch._

### Homepage

_Not yet audited — pending baseline run._

### Deprioritized (not in scope for this pass)

- `heading-order` (h2→h4 jumps on author byline, address heading) — cosmetic, doesn't block task completion
- `landmark-unique` on `.mega-main-menu` nav — structural nitpick, not user-facing

---

## Changelog (dev-team deliverable)

_One entry per fix, added as it lands. This section is the standalone summary to hand to the dev team — it should make sense without reading the rest of this file._

<!--
Template for each entry:

### [finding #] — short title
**Date:** YYYY-MM-DD
**Files changed:** path/to/file.njk, path/to/file.js
**What changed:** one or two sentences, before → after
**Why:** the user-facing problem this fixes
**Verified by:** WAVE / Lighthouse / manual keyboard test — page(s), before/after score or specific check
-->

_(none yet — fixes not started)_
