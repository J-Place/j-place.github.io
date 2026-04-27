# USMS Mockup — Eleventy

Static prototype site for U.S. Masters Swimming, built with Eleventy (Nunjucks templates).

## Commands

```bash
npm run dev     # dev server at http://localhost:8080
npm run build   # build to _site/
```

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
public/           # Legacy Sergey mockup files — passthrough copied as-is, do not modify here
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

## Key Conventions

- All pages extend a layout via `{% extends "layouts/foo.njk" %}` and set `permalink` in frontmatter.
- The base layout (`layouts/base.njk`) wraps everything: loads shared CSS/JS, includes `header.njk` (meganav), wraps content in `<main role="main">`, includes footer, and loads `megamenu.js` deferred.
- Page-specific CSS/JS goes in `{% block pageCSS %}` / `{% block pageJS %}`.
- Page headers (breadcrumbs + hero) go in `{% block pageHeader %}` via the appropriate partial.
- Production USMS styles and scripts are loaded from `www.usms.org` and `usms-cdn.azureedge.net` — do not copy or vendor these. Local files in `src/css/` and `src/js/` are overrides and additions only.

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
| Snapshot | `/snapshot [/path/to/page]` | Build and deploy a finished page as an immutable Netlify alias, then update `snapshot-registry.json` and commit |
| Commit | `/commit` | Review uncommitted changes, group into logical commits with messages, and commit after approval |
