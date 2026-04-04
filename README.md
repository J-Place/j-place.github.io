# USMS Mockup — Eleventy Build

Static prototype site for U.S. Masters Swimming, built with Eleventy.

## Structure

- `src/pages/` — Eleventy page templates (.njk)
- `src/_includes/` — Partials and layouts
- `public/` — Legacy Sergey mockup files (passthrough copied as-is)
- `_site/` — Build output (gitignored)

## Commands

```bash
npm run dev     # local dev server at http://localhost:8080
npm run build   # production build to _site/
```

## Deployment

GitHub Actions deploys `_site/` to `gh-pages` branch on push to `master`.
