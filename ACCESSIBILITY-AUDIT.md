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

| # | Issue | Detail |
|---|---|---|
| 14 | 2 image-slider buttons with no accessible name | `button.image-slider__button-previous` / `button.image-slider__button-next` in the "Latest Content" carousel — screen reader users hear "button" with no indication of what it does |
| 15 | 6 related-content thumbnail links with no accessible name | `.latest-content-event__image-container > a` and `.latest-content__image-container > a` (5 instances) — image-only links wrapping a photo with no alt text, aria-label, or visible text |

Found via WAVE + Lighthouse against `https://j-place.github.io/home/` (2026-08-29) while verifying the meganav fixes — not yet triaged for a fix.

| # | Issue | Detail | Resolution |
|---|---|---|---|
| 16 | Color contrast, 7 instances | "View More" article link (2.98:1), 5× author-name text (2.85:1 — Alex Ewart ×2, Elaine K. Howley ×2, Marty Munson ×1), footer "JOIN NOW" button (4.44:1) — all below the 4.5:1 AA threshold. All three patterns confirmed live on production today, not mockup-only bugs. | **Fixed** — see Changelog #16. |
| 17 | Heading order | `<h4>` "Workout Library" in the personalize section is out of sequence, skipping a level. | Open |
| 18 | Touch target size, 2 instances | Hero carousel nav dots are 10×10px with minimal spacing (WCAG 2.5.8 wants ≥24×24px). | Open |
| 19 | Hero carousel background video has no captions (Lighthouse `video-caption`, informative/manual) | `production/src/App/views/Media/Carousel.jsx:188-190` — video is `autoplay loop muted`, no `controls`, no `<track>` in production either. Confirmed by ear: no audio track, purely decorative — functions as a background image, not meaningful video content. | **Fixed** — added `aria-hidden="true"` to the `<video>` element (`src/_includes/partials/Media/Carousel.njk`), the standard technique for marking decorative embedded media (equivalent to `alt=""` on a decorative image). Makes the "no captions needed" conclusion explicit in markup for screen readers and future automated scans, rather than only living in this doc. Safe with no `tabindex` pairing since the video has no `controls` and isn't in the tab order to begin with. Verified with axe-core: 0 new violations, `aria-hidden-focus` unaffected. |

### [7] — Empty footer subscribe heading/paragraph
**Date:** 2026-08-31
**Files changed:** `src/_includes/partials/Navigation/Footer.njk`, `src/_includes/layouts/lmsc.njk`
**What changed:** Confirmed intent by checking production's real component (`production/src/App/views/Social/Subscribe.jsx:10-11`): the `<h4 class="subscribe__header">` and following `<p>` have real, hardcoded copy in production ("Subscribe To See More" / "Send us you email to see more articles and track your Fitness Logs.") — our mockup dropped that text entirely when the markup was first built. This was a faithful-reproduction gap, not an ambiguous design decision, so restored the text verbatim. Left the button (`Join Now` → `/login-to-registration-page/`) untouched, since that was already an intentional adaptation for this mockup — production's own button here ("subscribe" → `/en`) looks like unrelated placeholder content in production itself.
**Why:** A heading with no text prevents screen reader users from getting any information about the section's structure at that point.
**Verified by:** axe-core (`empty-heading`) against both `http://localhost:8080/home/` (uses `Footer.njk`) and `http://localhost:8080/lmsc/ohio-masters-swimming/` (uses `lmsc.njk`): 0 violations on both, previously failing on both.

### [19] — Hero carousel video marked decorative
**Date:** 2026-08-31
**Files changed:** `src/_includes/partials/Media/Carousel.njk`
**What changed:** Lighthouse flags the hero banner's background video for missing captions (`video-caption`, informative/manual — automated tools can't determine whether captions are actually needed). Listened to the source file directly: it's audio-free and purely decorative, functioning as a background image rather than meaningful video content — no `controls`, `autoplay loop muted`. Added `aria-hidden="true"` to the `<video>` element, the standard technique for marking decorative embedded media, so the "no captions needed" conclusion is explicit in markup rather than only recorded in this doc.
**Why:** Without an explicit signal, a screen reader user or a future automated scan has no way to tell "decorative, intentionally silent" apart from "developer forgot captions."
**Verified by:** axe-core against `http://localhost:8080/home/`: 0 new violations; `aria-hidden-focus` unaffected since the video has no `controls` and wasn't in the tab order to begin with.

### [17] — Homepage personalize cards: heading order
**Date:** 2026-08-31
**Files changed:** `src/_includes/partials/Homepage/Personalize.njk`, `src/css/Home/personalize.css`
**What changed:** The four CTA cards ("Workout Library", "Calendar of Events", "Club Finder", "Training and Technique") were `<h4>`, immediately following the hero's `<h1>` — skipping h2 and h3 entirely. The checked-out `production/` repo's `PersonalizeContentItem.jsx:158` shows an intervening `<h3 className="personalize__form-header">` section title, which would have made this a "faithful copy of a more complex widget" situation — but that checkout turned out to be stale/not reflective of current behavior: fetching the live site directly (`curl https://www.usms.org/`) shows the exact same heading sequence as ours, h1 straight to four `h4.personalize__content-column-header` cards, with `personalize__form-header` absent from the live HTML entirely. Production has the identical bug live right now — same category as #1/#2–6/#5, not a simplification tradeoff. Promoted the four cards from `<h4>` to `<h2>` — a valid one-level descent from the hero's `<h1>`, and semantically accurate since these are the primary content sections following it. Retargeted the matching CSS selector (`.personalize__content-column h4` → `h2`) in the local override that duplicates production's bare-element-selector styling; declarations unchanged.
**Why:** Screen reader users navigating by heading level get a page outline that skips levels, which is confusing regardless of visual layout.
**Verified by:** Full heading sequence extracted from the built homepage: now `h1 → h1 → h2×4 → h3×15 → h4`, fully sequential. axe-core (`heading-order`): 0 violations (previously 1). Computed styles confirmed pixel-identical before/after (font-size, color, margin) — only the tag name changed.

### [16] — Homepage/article color contrast: View More link, author names, footer Join Now button
**Date:** 2026-08-31
**Files changed:** `src/css/PageContent/LatestContentArticle.css` (new), `src/css/PageContent/LatestContentEvent.css` (new), `src/css/Navigation/Footer.css` (new), `src/_includes/layouts/home.njk`, `src/pages/fitness-and-training/articles-and-videos/articles/masters-swimming-training-plan-for-former-competitive-swimmers.njk`, `src/_includes/layouts/base.njk`
**What changed:** Three separate contrast failures, each fixed differently:
- **"View More" article link** (`.latest-content-event__detail-link`, production `LatestContentEvent.css:77-81`): static color `#30a0ce` is 2.98:1 on white. The link already had a generic `a:hover { color: var(--bs-link-hover-color) }` rule resolving to `#0c6f97` (5.62:1, passing) via `bootstrap-3-usms-patch.css`. Swapped static and hover: `#0c6f97` is now the resting color, `#30a0ce` is now hover-only — the always-visible state passes; hover is a transient, mouse-only state most keyboard/AT users never trigger.
- **Author-name text** (`.latest-content__author-name` / `.latest-content__author p`, production `LatestContentArticle.css:61,69-70`): `#999` is 2.85:1 on white. Darkened to `#707070` (4.95:1).
- **Footer "JOIN NOW" button** (`.subscribe a.btn-primary` inside `Footer.njk`/`lmsc.njk`): reported at `#dae2e9` on `#0e69a8` (4.44:1) by both WAVE and axe-core, even though the button's own declared colors are white on `#0068ad` (5.86:1 — passing on paper). Root cause: `.footer-right { opacity: 0.8 }` (production `Footer.css:48`) composites every descendant color toward the dark backdrop behind it, so the *rendered* pixels are darker/muddier than the *declared* colors — confirmed by comparing `getComputedStyle` (passing) against axe-core's pixel-sampled contrast (failing), and confirmed the identical failure exists on the live production site today. Rather than remove the opacity (would change the whole panel's look), darkened just this button's background to `#003a5c` so it still clears 4.5:1 after the 0.8 blend (~7.86:1 composited). Scoped narrowly to `.subscribe a.btn-primary` so the unrelated, already-passing hero "JOIN NOW" button (site-wide `.btn-primary` default) is untouched.
**Why:** Text/controls below 4.5:1 are hard to read for low-vision users; the footer button case specifically shows why a "does the color look right in the inspector" check isn't enough — ancestor opacity/blend effects only show up in the actual rendered pixels.
**Correction to an earlier conclusion:** Earlier in this pass, the footer "Join Now" button's contrast finding was checked with `getComputedStyle` only, found passing, and written off as a stale-snapshot artifact (see the `home-260817` CSS-vendoring gap noted separately). That was wrong — the getComputedStyle check simply didn't account for `.footer-right`'s ancestor opacity. Re-verified with axe-core's pixel-based sampling against both our build and live production, confirmed the failure is real and still live in production today, and fixed it above.
**Verified by:** axe-core (`color-contrast`) against `http://localhost:8080/home/`: 0 violations (previously 1, the footer button — the link/author-name instances weren't independently flagged by axe on this page but were confirmed via the WCAG contrast formula directly). Also checked `http://localhost:8080/lmsc/ohio-masters-swimming/` and the article page: footer button violation gone on both (remaining violations on those pages are an unrelated third-party reCAPTCHA badge, out of scope). Screenshot-checked the fixed button still reads as a normal blue "Join Now" call-to-action, not degraded.

### [1] — Mobile viewport zoom disabled to hide RTE table overflow
**Date:** 2026-08-29
**Files changed:** `src/_includes/partials/head-meta.njk`, `src/_includes/layouts/college-club.njk`, `src/css/Common/Html.css` (new), `src/_includes/layouts/base.njk`
**What changed:** The `<meta viewport>` tag disabled pinch-zoom (`maximum-scale=1.0, user-scalable=0`) site-wide — inherited verbatim from production (`Usms.cshtml:34`), not something specific to this mockup. Per institutional knowledge, this was a workaround for tables authored in rich-text (RTE) content breaking the mobile viewport's bounds and causing horizontal scroll. Investigated production's own RTE component (`Html.jsx`/`Html.css`) and its site-wide `body { overflow-x: hidden; }` (`rteMasters.css:90-99`, `style.css:3-7`) — production never actually fixed the overflow; it clips it at the body level and blocks zoom so the clipping is never visible. Removed the zoom restriction and added `.html-container table { display: block; overflow-x: auto; }` so an oversized table scrolls within its own box instead of forcing the whole viewport wider.
**Why:** Disabling zoom is itself a WCAG 1.4.4 (Resize Text) / 1.4.10 (Reflow) violation, regardless of the reason — it trades a symptom (horizontal scroll on some content) for blocking every low-vision user from zooming any page, including ones with no table at all.
**Verified by:** Build output inspection — confirmed `maximum-scale`/`user-scalable` removed from the rendered `<meta viewport>` on both layouts, and the new CSS rule compiled and linked correctly. No page currently in the mockup contains an RTE-authored table, so the containment rule couldn't be exercised against real content this round — flag for a visual check if/when such a page is built.

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

### [2, 6] — Meganav dropdown triggers: keyboard and screen-reader access
**Date:** 2026-08-28
**Files changed:** `src/_includes/partials/Navigation/MegaMainMenu.njk`, `src/js/megamenu.js`, `src/css/Navigation/MegaMainMenu.css` (new), `src/_includes/layouts/base.njk`
**What changed:** The Training / Events / About Us dropdown triggers were a non-interactive `<li>`/`<span>` with a click-only handler — no `tabindex`, no ARIA. Converted them to native `<button>` elements with `aria-expanded`, `aria-haspopup="true"`, and `aria-controls="mega-menu-overlay"`; added an `Escape` handler that closes the open panel and returns focus to its trigger. Existing hover/click behavior for mouse users is unchanged — the same open/close logic just moved from the `<li>` onto the nested `<button>`.
**Why:** Keyboard and screen-reader users could not reach or operate 3 of the site's 6 primary nav menus — the triggers weren't part of the tab order and had no announced state.
**Verified by:** Manual keyboard walkthrough (Chromium via Playwright, driven against `npm run dev`): Tab reaches the button, Enter opens the panel (`aria-expanded` flips to `true`, overlay populates), Escape closes it (`aria-expanded` flips back to `false`) and returns focus to the trigger.

### [3] — Meganav search toggle: keyboard access
**Date:** 2026-08-28
**Files changed:** `src/_includes/partials/Navigation/MegaMainMenu.njk`, `src/js/megamenu.js`, `src/css/Navigation/MegaMainMenu.css`
**What changed:** The search toggle was a click-only `<div>`. Converted it to a native `<button>` with `aria-expanded` and `aria-controls="mega-main-menu-search"` (new id on the search panel), and added an `Escape` handler that closes the panel and returns focus to the button. Mouse/click behavior unchanged.
**Why:** Keyboard users had no way to open the search box at all.
**Verified by:** Manual keyboard walkthrough: Tab reaches the button, Enter opens the panel (`aria-expanded` → `true`, panel opacity → `1`, focus moves into the search input — pre-existing behavior, unchanged), Escape closes it (`aria-expanded` → `false`) and returns focus to the button.

### [5, 6] — Meganav account trigger: keyboard and screen-reader access
**Date:** 2026-08-30
**Files changed:** `src/_includes/partials/Navigation/MegaMainMenu.njk`, `src/js/megamenu.js`, `src/css/Navigation/MegaMainMenu.css`
**What changed:** Investigated production's actual two-state design (`MegaMainMenu.jsx:373-390`) rather than assuming a single shared bug: production's **logged-out** state is a plain `<a href>` with no `aria-hidden` — already fine — but its **logged-in** state is a non-interactive `<div onClick>` with `aria-hidden` and no anchor at all, opening the account dropdown with no keyboard access whatsoever. Our mockup had merged both states into one always-`aria-hidden="true"` wrapper, so the bug leaked into the logged-out state too, which is what WAVE/Lighthouse actually flagged (tested against `data-logged-in="false"`). Fixed by branching the markup to match production's real logic: logged-out keeps its already-fine `<a>`; logged-in becomes a native `<button>` with `aria-expanded`/`aria-haspopup="true"`/`aria-controls="login-list"` (new id added to `.login__list`), matching the established meganav-trigger pattern. Added an `Escape` handler that closes the dropdown and returns focus to the trigger.
**Why:** Keyboard and screen-reader users who are logged in had no way to reach their account menu at all — the entire control was hidden from the accessibility tree.
**Verified by:** Rebuilt with `home.njk`'s test fixture temporarily switched to a logged-in user (`swimmerId: "standardCurrent"`), then reverted. axe-core (`aria-hidden-focus`): 0 violations in both the logged-out and logged-in renders (previously failing). Manual keyboard walkthrough on the logged-in render: Tab reaches the button, Enter opens the dropdown (`aria-expanded` → `true`), Escape closes it (`aria-expanded` → `false`) and returns focus to the button.
**Before reference:** `home-loggedin-pre-wcag` snapshot (see `snapshot-registry.json`) — the logged-in homepage built from `master` (i.e. with none of this branch's fixes), frozen for a future WAVE/Lighthouse before/after comparison specific to this finding.

### [14] — Homepage image-slider buttons: no accessible name
**Date:** 2026-08-29
**Files changed:** `src/_includes/partials/Homepage/ImageSlider.njk`
**What changed:** Added `aria-label="Previous partner logo"` / `aria-label="Next partner logo"` to the partner-logo carousel's prev/next buttons, which previously contained only a decorative icon with no text. This matches production (`production/src/App/views/Media/ImageSlider.jsx`), which has the identical bug — no aria-label there either, so there was no production pattern to copy.
**Why:** Screen reader users heard "button" with no indication of what either control did.
**Verified by:** axe-core (`@axe-core/playwright`) against `http://localhost:8080/home/`, `button-name` rule: 0 violations (previously 2).

### [15] — Homepage/Related-Articles thumbnail links: no accessible name
**Date:** 2026-08-29
**Files changed:** `src/_includes/partials/Homepage/Latest.njk` (6 instances), `src/_includes/partials/PageContent/RelatedContent.njk` (1 templated instance, applies per rendered article)
**What changed:** Each "Latest from USMS" / "Related Articles" card wraps its thumbnail image in an `<a>` with no `alt`/label (images are CSS `background-image` divs, not `<img>`), immediately followed by a second `<a>` to the identical URL with visible text (the title, or "More Live Coverage"). Same bug in production's `LatestContentArticle.jsx` and `LatestContentEvent.jsx` — no production pattern to copy. Rather than inventing a duplicate label, added `aria-hidden="true" tabindex="-1"` to the image-only link so it's removed from the tab order and the accessibility tree; the adjacent, already-labeled text link provides full access to the same destination. This is the standard remediation for a redundant image+text link pair, not a workaround.
**Why:** Screen reader/keyboard users hit an unlabeled stop with no indication of its destination immediately before reaching a properly labeled link to the same place.
**Verified by:** axe-core against `http://localhost:8080/home/`, `link-name` rule: 0 violations (previously 6). `RelatedContent.njk` shares the same production component (`LatestContentArticle`) but wasn't itself flagged by WAVE/Lighthouse on the homepage — fixed anyway since it's the same underlying bug, not yet independently verified live (no page currently renders `RelatedContent.njk` with real data in the sampled scans).

### [4] — Mobile submenu accordions: keyboard access
**Date:** 2026-08-28
**Files changed:** `src/_includes/partials/Navigation/MegaMainMenu.njk`, `src/js/megamenu.js`, `src/css/Navigation/MobileMenuOverlayItem.css` (new)
**What changed:** The Training/Events/About Us mobile accordion triggers were click-only `<div>`s. Converted to native `<button>` elements with `aria-expanded` and `aria-controls` pointing at their submenu container's new `id`. Leaf items with no submenu (Club Finder, Workout Library, Join) were left as-is since they already use a real `<a>`. Existing click/animation behavior unchanged.
**Why:** Keyboard and screen-reader users could not expand any of the 3 mobile nav submenus.
**Verified by:** Manual keyboard walkthrough at a mobile viewport: Tab reaches the button, Enter expands it (`aria-expanded` → `true`, submenu `max-height` opens), Enter again collapses it (`aria-expanded` → `false`, `max-height` → `0px`).
