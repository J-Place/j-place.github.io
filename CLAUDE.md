# USMS Mockup — Eleventy

Static prototype site for U.S. Masters Swimming, built with Eleventy (Nunjucks templates).

## Commands

```bash
npm run dev              # dev server at http://localhost:8080
npm run build            # build to _site/
npm run test:visual      # Playwright visual regression — manual only, see below
npm run test:visual:update  # accept new baselines
npm run test:visual:report  # open the HTML diff viewer for the last run
```

## Browser Verification

Playwright is configured for visual regression testing (`playwright.config.js`, `tests/usms-visual-regression-screenshots/`) — see `tests/usms-visual-regression-screenshots/screenshots.spec.js` for how pages are captured (clock frozen, images awaited, Google Maps embeds masked) and `tests/usms-visual-regression-screenshots/pages.js` for the page list.

**This is a manual-only process.** It does not run on `npm run build`, in the GitHub Actions deploy workflow, or anywhere else automatically — it only runs when someone explicitly invokes `npm run test:visual` (or `npx playwright test`). If that ever changes (e.g. wired into CI), update this note.

The most recently published report and baseline set *are* shipped as static content on the deployed site, but publishing is itself a separate, explicit, manual step — running the tests does not do it. After reviewing a local run (`npm run test:visual:report`), publish it with `npm run publish:visual-report` (copies `playwright-report/` → the committed `reports/visual-regression/`, replacing the previous "latest" report) and commit the result. The screenshot list (`src/pages/visual-regression-gallery.njk`, fed by `src/_data/visualBaselines.js`) needs no separate publish step — it renders directly from the already-committed baseline PNGs (plus hand-captured validation-state PNGs in `tests/usms-visual-regression-screenshots/manual-baselines/`) on every Eleventy build.

Do not install Playwright, Chromium, or any other browser-automation tooling beyond what's already configured here on your own initiative (e.g. `npm install playwright`, `npx playwright install`) just to visually verify a change. If visual verification in a real browser is needed for something the existing Playwright setup doesn't cover, and no browser tool is already available in the session, say so and ask the user rather than provisioning one — installing a browser is slow (large download, repeated per session since the scratchpad is ephemeral) and should be an explicit decision, not a fallback.

## Project Structure

```
src/
  pages/          # Page templates (.njk) — defines permalink, frontmatter, layout
  _includes/
    layouts/      # Base and page-type layouts (base, home, article, clubs, events, search, swimmer, swimmer-library)
    partials/     # Reusable HTML fragments (header, footer, page-header, head-css, head-js, etc.)
    components/   # Nunjucks macros/components (article-stepper)
  js/             # Local JS (megamenu.js, clubs.js, events.js, filters.js, home-personalize.js, search.js)
    dev/          # Dev-only JS overlays — not loaded in production
  css/            # Local CSS overrides (clubs.css, events.css, home.css)
    dev/          # Dev-only CSS for overlays — not loaded in production
public/           # Legacy Sergey mockup files — passthrough copied as-is
  college-club/   # EXCEPTION: edit directly here, not in the Sergey project (see below)
_site/            # Build output (gitignored)
```

## Updating Legacy Sergey Pages (`public/`)

Pages in `public/` originate from the separate Sergey repo at `~/USMS-Github-JPlace`. To make changes:

1. Edit source files in `~/USMS-Github-JPlace/`
2. Start the Sergey dev server if not already running: `cd ~/USMS-Github-JPlace && npm run dev` (serves at `http://localhost:8888`)
3. Fetch the compiled output from the dev server and write it to `public/`:
   ```bash
   curl -s http://localhost:8888/registration/welcome-member.html \
     > public/registration/welcome-member.html
   ```
4. Eleventy passthrough-copies `public/` into its own `_site/` unchanged

**Why curl and not `_site/`:** Sergey 0.0.13 only pre-builds `home/` and `index.html` to `_site/`. All other pages are compiled on-the-fly by the dev server as requests come in. Fetching from `localhost:8888` is the reliable way to get fully resolved HTML (all `<sergey-import>` tags expanded) for any page.

Do not edit files directly inside `public/` — they will be overwritten the next time a Sergey page is synced.

### Exception: `public/college-club/`

**Edit `public/college-club/` directly — do not use the Sergey project for college-club pages.**

The college-club section has been graduated from the Sergey workflow. The Sergey source at `/Users/jplace/dev/usms/sergey/college-club/` is no longer the canonical source. If asked to edit college-club files, work in `public/college-club/` directly. The Sergey project path is also `~/dev/usms/sergey/` (not `~/USMS-Github-JPlace/` as listed above).

## CSS Framework

The production site uses a **split Bootstrap strategy**:

- **Grid system: Bootstrap 3** — `col-xs-*`, `col-sm-*`, `col-md-*`, `col-lg-*` naming throughout. `bootstrap.min.css` and `bootstrap-3-usms-patch.css` provide this.
- **Utility classes: Bootstrap 5** — flex utilities (`d-flex`, `flex-row`, `justify-content-*`, `align-items-*`), spacing, and text utilities are compiled into `usms.min.css` (and/or `common.min.css`). No separate BS5 stylesheet is needed — these classes work out of the box.

When writing layout markup: use BS3 grid classes for columns, BS5 utility classes for alignment and spacing. Do not add a Bootstrap 5 CDN link — it is already present via the production bundles.

## Building Production Page Mockups

Use the `/mockup [url]` skill for all production page builds. It handles the full workflow: JSX structure, TDS CSS load order, live label fetch, structural verification. Do not build production pages manually.

Key rules that apply project-wide (not just inside the skill):

1. **Never use `public/` as a reference.** Files in `public/` are stale Sergey snapshots. Only open a file in `public/` if the user explicitly asks to work with that specific file.
2. **Production CSS is authoritative.** Production stylesheets (`usms.min.css`, `clubDetail.min.css`, etc.) load directly from `www.usms.org` in the mockup. Do not add rules to `src/css/` unless the gap is confirmed — remove the local rule and verify the page still looks correct before deciding it's needed. Audit local overrides page by page against the TDS CSS assets for that page.
3. **No embedded styles or scripts.** Never put `<style>` or `<script>` blocks directly in a page template. All page-specific CSS goes in `src/css/<name>.css` (referenced via `{% block pageCSS %}`); all page-specific JS goes in `src/js/<name>.js` (referenced via `{% block pageJS %}`).
4. **Faithful vs. intentional.** When a page needs both a faithful production copy and an improved version, snapshot the faithful build first — that snapshot URL is the permanent reference. The live page in `master` is then free to evolve.
5. **Name local override files after their production source, not the local page.** Production CSS is authored in per-component files (e.g. `production/src/App/views/Sanctions/sanctionsAddEvent.css`) but compiled into shared per-view bundles (`club2.min.css`, `sanctions.min.css`, etc.) — a single component file's rules can spill into multiple compiled bundles, and a single compiled bundle pulls from many component files. Grouping local overrides by *our* page (e.g. a catch-all `location-list-results.css` loaded on both `club-edit` and `event-edit`) erases that lineage and makes it impossible to tell which production source a rule actually came from without re-grepping `production/` from scratch. Instead: before adding a local override, `grep` `production/` for the exact selector to find its true source file, then place the override in a local file whose path mirrors that source (e.g. `src/css/Sanctions/sanctionsAddEvent.css`), and reference it from `{% block pageCSS %}` on every page that needs it — same as production reuses the source across bundles. Note the exact production file + line in a comment above the rule.

## Key Conventions

- All pages extend a layout via `{% extends "layouts/foo.njk" %}` and set `permalink` in frontmatter.
- The base layout (`layouts/base.njk`) wraps everything: loads shared CSS/JS, includes `header.njk` (meganav), wraps content in `<main role="main">`, includes footer, and loads `megamenu.js` deferred.
- Page-specific CSS/JS goes in `{% block pageCSS %}` / `{% block pageJS %}`.
- Page headers (breadcrumbs + hero) go in `{% block pageHeader %}` via the appropriate partial.
- Production USMS styles and scripts are loaded from `www.usms.org` and `usms-cdn.azureedge.net` — do not copy or vendor these. Local files in `src/css/` and `src/js/` are overrides and additions only.
  - Exception: the `/snapshot` workflow vendors a frozen copy of every referenced production stylesheet automatically at snapshot time (see `.claude/skills/snapshot/SKILL.md`), so a deployed snapshot's appearance can't drift if production CSS changes later. This applies only to built snapshot output, never to source templates.

## Layouts

| Layout | Used for | Page header partial |
|--------|----------|-------------------|
| `base.njk` | Root layout, not used directly | — |
| `home.njk` | Homepage | `home-carousel.njk` |
| `article.njk` | General articles | `page-header.njk` |
| `clubs.njk` | Club Finder | `page-header.njk` |
| `events.njk` | Events calendar | `page-header.njk` |
| `search.njk` | Search results | `page-header.njk` |
| `swimmer.njk` | SWIMMER Magazine articles | `swimmer-page-header.njk` |
| `swimmer-library.njk` | SWIMMER Magazine index/TOC | `swimmer-library-header.njk` |

## `filters.js` — Shared list-control UI

`src/js/filters.js` is loaded by the `clubs.njk` and `events.njk` layouts, and explicitly by `pool-lookup.njk`. It owns three generic UI behaviors shared across Club Finder, Events, and Pool Lookup:

1. **Mobile search toggle** — `.list-control-search-mobile__toggle` shows/hides `.list-control-search__content` (as `display:flex`) and the entire `.list-control-filter` section together. Collapsing always resets More Filters to closed.
2. **More Filters toggle** — `.toggle-filters` toggles `.show-filters` on `.list-control-filter`, animating the content in/out. Button text updates to "Fewer Filters" / "More Filters".
3. **Checkbox tag pills** — watches all `input[type="checkbox"]` inside `.list-control-filter__content`. On change or tag-pill click, syncs `.list-control-search--tags` and dispatches a `filtersChanged` custom event on `document`. Label text is read from the associated `<label>` element — no hardcoded value maps needed.

Page-specific filter logic (e.g. `pool-lookup.js`) listens for `filtersChanged` to re-run its own `applyFilters()`.

### Desktop filter display

By default, filters are always visible on desktop and the More Filters header is hidden via CSS. To opt a page into the desktop toggle (show/hide on desktop too), add `data-desktop-filters="toggle"` to the `.list-control-filter` element:

```html
<!-- Always open on desktop (default) -->
<div class="list-control-filter">

<!-- Toggle on desktop as well as mobile -->
<div class="list-control-filter" data-desktop-filters="toggle">
```

`filters.js` reads the attribute and adds `.filters--desktop-toggle` to the element; the page's CSS uses that class to re-enable the animated show/hide on desktop. Pool Lookup's desktop toggle CSS is in `src/css/pool/pool-list-control.css`; clubs/events would add equivalent rules to `src/css/clubs.css`.

## Megamenu (`src/js/megamenu.js`)

Custom JS replacement for the production React megamenu (from `common.min.js`). Matches production behavior:
- Click to open/close a dropdown
- Mouseleave from the nav items list closes the dropdown (150ms delay to bridge the gap to the overlay, which is a DOM sibling rather than a child of the `<ul>` like in the React version)
- Mouseenter on the overlay cancels the close timer
- Closes on scroll and on click outside the nav

## Dev Environment

### Switching dev/prod

`src/_data/dev.json` controls the environment for the entire site:

```json
{ "env": "dev" }   // dev overlays active
{ "env": "prod" }  // nothing dev loads anywhere
```

### Dev overlays

When `env === "dev"`, `base.njk` automatically loads any overlay whose page list includes the current `permalink`. Overlays live in:

```
src/_data/devOverlays/   # one JSON config per overlay
src/js/dev/              # overlay JS
src/css/dev/             # overlay CSS
```

Each config file defines which pages the overlay loads on:

```json
{
  "js": "/js/dev/my-overlay.js",
  "css": "/css/dev/my-overlay.css",
  "pages": ["/account/some-page.html"]
}
```

To add a new overlay: create the JS, CSS, and JSON config files — no changes to `base.njk` or any page template needed.

**Current overlays:**

| Overlay | Pages | Purpose |
|---|---|---|
| `login-status` | addons, addons-ncc | Shows current swimmer ID and membership tier in the breadcrumb bar |

## Deployment

GitHub Actions deploys `_site/` to `gh-pages` on push to `master`.

## Custom Skills

| Skill | Command | Purpose |
|---|---|---|
| Mockup | `/mockup [url]` | Build a mockup of a production page. Pass a URL to auto-fetch, or paste markup when prompted. Strips noise, diffs against any existing local version, asks for target path, then builds. |
| Snapshot | `/snapshot [/path/to/page] [--dev]` | Build and deploy a finished page as an immutable Netlify alias, then update `snapshot-registry.json` and commit. `--dev` includes dev overlays (e.g. login-status). The index page auto-generates from the registry — no separate link step needed. |
| Audit | `/audit [/path/to/page]` | Bidirectional structural audit of a local Nunjucks page against its production JSX. Finds gaps (production has, we don't), extras (we have, production doesn't), suspect CSS overrides, and JS selector drift. |
| Compare | `/compare [path-a] [path-b]` | Bidirectional structural diff between two local mockup pages. Finds class, attribute, and hierarchy differences without a production source of truth. |
| Commit | `/commit` | Review uncommitted changes, group into logical commits with messages, and commit immediately |
