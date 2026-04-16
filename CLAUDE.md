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
public/           # Legacy Sergey mockup files — passthrough copied as-is, do not modify
_site/            # Build output (gitignored)
```

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
