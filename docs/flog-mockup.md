# Fitness Log (FLOG) mockup

The new Fitness Log replaces today's PHP FLOG. **Bonfire builds it** in their React/Next.js app. This repo builds the mockup they convert, working from their brief (`FLOG-MOCKUP-PRIMER.md`, sent 2026-11-07; not in the repo). It's a set of real prototype pages with the site's chrome, handed over as a locked snapshot with `docs/flog-mockup-notes.md` served as `/NOTES.md`.

Like Race Tools, Training Tools and the Workout Generator, FLOG is a stand-alone tool: its own pages, under no other tool.

## Pages

| Page | URL | File |
|---|---|---|
| Home (week, month, list) | `/myusms/flog/?view=&date=` | `src/pages/myusms/flog/index.njk` |
| Log a swim | `/myusms/flog/log-swim/?date=` | `log-swim.njk` |
| Edit a swim | `/myusms/flog/edit-swim/?id=` | `edit-swim.njk` |
| Totals | `/myusms/flog/totals/` | `totals.njk` |
| Preferences | `/myusms/flog/preferences/` | `preferences.njk` |

My Account's Fitness Log link already points to `/myusms/flog/`.

**Page structure:**
- Each page extends `layouts/base.njk` and fills the breadcrumb block: Home / My USMS / Fitness Log.
- `src/pages/myusms/flog/flog.json` gives every page `swimmerId: KT2JH` and `flogRoot: /myusms/flog/`.
- `partials/Flog/Page.njk` holds the shared body: the icon sprite, `partials/Flog/Header.njk` (title, whose log it is, Log a swim, FLOG's nav), and the mount point that `app.js` renders into.

**Who's visiting:** the `?user=` persona, then `sessionStorage.activeUser`, then the page's `swimmerId` (the same order as `current-user.js`).
- A logged-out visitor (`NEW`) gets a log-in prompt.
- A non-member (`NEW01`) gets a join prompt.
- `?empty=1` shows the first-time state for any member, with its own empty data.

**GTD isn't part of the mockup:** no Go The Distance card, Events or Monthly Progress.

## Files

- **`src/css/pages/flog/tokens.css`:** every colour, type size, radius and spacing step, scoped to `.flog`. The primer's brand tokens come first; the mockup's additions are listed in the notes.
- **`src/css/pages/flog/flog.css`:**
  - Uses tokens only; `grep -E "#[0-9a-f]{3,6}|rgb\(" flog.css` must find nothing.
  - Phone first, with breakpoints at 576, 768 and 992px. At 992px the week becomes seven columns.
  - Uses `.flog__container` and a plain `<section class="flog">`, because production styles `.usms-container p`/`li` at 2rem and makes `.section` a table.
- **`src/js/flog/app.js`:**
  - Helpers: local dates, `formatDistance` (the one place distances are shown, always in `UserDefaultDistance`), `formatDuration`, and `esc`. Comments are typed by swimmers, so they're escaped before they go into HTML.
  - Render functions: `renderSwim`, `renderDay`, `renderWeek`, `renderMonth`, `renderList`, `renderTotals`, `renderSwimForm`, `renderPreferences`.
  - One small controller per page.
- **`src/js/flog/flog-api.js`:** see Data, below.
- **`src/js/flog/seed-data.js`:** generated, so don't edit it.
- **`scripts/flog-seed.js`** (`npm run flog:seed [-- --anchor=YYYY-MM-DD]`): writes `seed-data.js`. Every logged-in member persona gets a made-up log. KT2JH and GAT0R get 14 months of it, with lifetime totals from before that (`prior`, `firstLogDate`); the rest get 3 months. KT2JH swims yards. GAT0R swims long course and short course meters, with open water in miles. Both have two-swim days, long comments, and the optional fields on some swims. The run is seeded, so the same anchor writes the same file.

## Data: two stages

### Stage 1 (now): local data behind an API-shaped module

`flog-api.js` is the only file that knows where data comes from. Each function returns a Promise and uses FLOG's field names:

| Function | Stands for |
|---|---|
| `getEntries({from, to, course})` | `GET /api/flog/entries?from=&to=[&course=]` |
| `getEntriesPage({limit, before})` | `GET /api/flog/entries?limit=&before=` (newest first; never splits a day across pages) |
| `getEntry(id)` | `GET /api/flog/entries/{EntryID}` |
| `saveEntry(entry)` | `POST /api/flog/entries`, or `PUT /api/flog/entries/{EntryID}` when it has one |
| `deleteEntry(id)` | `DELETE /api/flog/entries/{EntryID}` |
| `getTotals(date)` | `GET /api/flog/totals?date=` |
| `getPreferences()` / `savePreferences(p)` | `GET` / `PUT /api/flog/preferences` |
| `reset()` | `POST /api/flog/reset` (mockup only) |

How the stand-in data works:
- **Dates track the calendar.** The seed's dates are moved forward by the days since its anchor, so the latest swim is always yesterday and today has none.
- **Changes stay in the browser.** A visitor's changes are saved in `localStorage` under `flog.v1.<persona>` (or `….empty`). Preferences' "Reset demo data" removes them.
- **Validation lives here for now.** Errors come back as `{ status: 400, problems: [{ field, message }] }`, and the form shows them in a summary that links to each field and under the field itself.
- **Every call waits 120 ms**, so the pages' loading states get exercised.

### Stage 2 (next): our own API

A working API with synthetic data, offered to Bonfire as a model. Today's FLOG has no API, and Training Tools and the Workout Generator will need one to log swims into FLOG and read them back.
- **Spec:** `docs/api/flog.openapi.yaml`, REST with FLOG's field names. Postman can import it.
- **Server:** `netlify/functions/flog.mjs`, one web-standard `(Request) => Response` handler, the same shape as a Next.js route handler.
  - Validation, unit conversion and totals move into it.
  - It identifies the swimmer from `X-Flog-Swimmer`. `X-Flog-Visitor`, a random id kept in `localStorage`, gives each visitor their own copy.
  - Storage is Netlify Blobs, or a JSON file in a gitignored `.data/flog/` locally.
- **Local dev:** the dev server routes `/api/flog/*` to the handler.
- **Deploys:** `netlify.toml` gets the function and a redirect. The GitHub Pages copy calls the Netlify-hosted API (CORS).
- **The switch:** each function in `flog-api.js` becomes a `fetch()`. The pages don't change.

**Changing data (Stage 2):**
- **Everyone's starting data:** edit `scripts/flog-seed.js` and run `npm run flog:seed`. Reset picks up the new seed.
- **One live record:** use the API from Postman, `netlify blobs:get` / `netlify blobs:set flog <key>` from the Mac, or the files in `.data/flog/` locally.

## Snapshot

```
npm run build:snapshot -- --page=/myusms/flog --notes=docs/flog-mockup-notes.md
```

This packages the whole `/myusms/flog/` folder:
- Links within it are rebased for the alias root (`/myusms/flog/totals/` → `/totals/`), along with `data-flog-root`.
- `docs/flog-mockup-notes.md` is copied into the snapshot as `/NOTES.md`.

Deploy it from the Mac (`--deploy`, or `/snapshot /myusms/flog`). The container's firewall blocks Netlify and the CSS vendoring.

## Checks

Playwright at 375px and 1280px, as KT2JH, GAT0R, NEW01, NEW and with `?empty=1`. Checks:
- No console errors (in the container, ignore the unreachable outside hosts).
- No sideways scroll from FLOG. The site footer overflows by 5px on phones on every page.
- Visible focus.
- Every field labelled.

The flows:
1. **Log a swim:** an open-water swim in miles shows in week, month, list and Totals, and is still there after a reload.
2. **Edit, then delete:** delete uses the in-page confirm, and Keep it puts focus back on Delete.
3. **Preferences:** a new default view and unit change Home.
4. **Reset** brings back the samples.
5. **Errors:** an empty form shows the error summary, with focus on it.
