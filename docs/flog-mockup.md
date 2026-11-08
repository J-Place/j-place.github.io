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
- **`scripts/flog-seed.js`** (`npm run flog:seed [-- --anchor=YYYY-MM-DD]`): writes `api/flog/seed.mjs`, which is generated, so don't edit it. Every logged-in member persona gets a made-up log. KT2JH and GAT0R get 14 months of it, with lifetime totals from before that (`prior`, `firstLogDate`); the rest get 3 months. KT2JH swims yards. GAT0R swims long course and short course meters, with open water in miles. Both have two-swim days, long comments, and the optional fields on some swims. The run is seeded, so the same anchor writes the same file.

## Data: our own FLOG API

Built in two stages: on 2026-11-07 the pages ran on local data behind `flog-api.js` (stage 1), and the same day that module switched to `fetch()` calls to our own API (stage 2), with no change to the pages. Today's FLOG has no API, and Training Tools and the Workout Generator need one to log swims into FLOG and read them back, so the API is also the model we offer Bonfire.

### The pages' side: `flog-api.js`

The only file that knows where data comes from. Each function returns a Promise, uses FLOG's field names, and makes one call:

| Function | Call |
|---|---|
| `getEntries({from, to, course})` | `GET /api/flog/entries?from=&to=[&course=]` |
| `getEntriesPage({limit, before})` | `GET /api/flog/entries?limit=&before=` (newest first; never splits a day across pages) |
| `getEntry(id)` | `GET /api/flog/entries/{EntryID}` |
| `saveEntry(entry)` | `POST /api/flog/entries`, or `PUT /api/flog/entries/{EntryID}` when it has one |
| `deleteEntry(id)` | `DELETE /api/flog/entries/{EntryID}` |
| `getTotals(date)` | `GET /api/flog/totals?date=` |
| `getPreferences()` / `savePreferences(p)` | `GET` / `PUT /api/flog/preferences` |
| `reset()` | `POST /api/flog/reset` (mockup only) |

- **Where it calls:** `/api/flog` on the same site (the dev server, Netlify, snapshots). On GitHub Pages (`j-place.github.io`) it calls `https://usms-mockup.netlify.app/api/flog`, which needs `deploy:prototype` to have run with the function.
- **Who's asking:** `X-Flog-Swimmer` (the `?user=` persona), `X-Flog-Visitor` (a random id kept in `localStorage` as `flog.visitor`, so each browser gets its own copy of the sample data) and `X-Flog-Empty: 1` for `?empty=1`.
- **Errors:** a failed call rejects with `{ status, problems: [{ field, message }] }`, the API's own body (`status` 0 when it couldn't be reached). The form shows the problems in a summary that links to each field, and under the field itself.

### The server's side: `api/flog/`

- **Contract:** `docs/api/flog.openapi.yaml`. Postman can import it (servers: the Netlify site and `localhost:8080`).
- **`api/flog/core.mjs`:** the rules, pure. Validation (dates not in the future, with a day's grace for swimmers ahead of the server's time zone; whole minutes 1 to 1440; at most 100,000 yards; comments up to 2,000 characters), `DistanceYards`, totals, paging, and moving the seed's dates forward so the latest swim is yesterday.
- **`api/flog/handler.mjs`:** one web-standard `(Request) => Response` handler, the same shape as a Next.js route handler: routing, the headers above (checked, so they're safe as storage keys), JSON errors, CORS for `https://j-place.github.io` and `http://localhost:8080`, a 16 KB body limit and 3,000 swims per visitor.
- **`api/flog/stores.mjs`:** one record per visitor and swimmer (`<visitor>/<swimmer>`, `-empty` for the first-time state), copied from the seed on first use. Three adapters with the same calls: memory (tests), a JSON file (`.data/flog/`, gitignored; the dev server) and Netlify Blobs (store `flog`).
- **Where it runs:** `netlify/functions/flog.mjs` on Netlify (`config.path` `/api/flog/*`; `netlify.toml` `[functions]`), so `deploy:prototype` and every snapshot carry it. On the dev server, `.eleventy.js`'s `flogApi` middleware runs the same handler. A change to `api/flog/` needs a dev server restart.
- **Tests:** `npm run test:api` (`node --test`): seed dates, logging, conversions, validation, editing and deleting, paging, totals, per-visitor copies and reset, the empty state, preferences, bad requests, unsafe keys and CORS.

**Changing data:**
- **Everyone's starting data:** edit `scripts/flog-seed.js` and run `npm run flog:seed`. Reset picks up the new seed.
- **One live record:** use the API from Postman, `netlify blobs:get` / `netlify blobs:set flog <key>` from the Mac, or the files in `.data/flog/` locally.

**Other tools on the same log (2026-11-08):** Training Tools' Add to Log and Training Metrics (`race-tools.js`, through `flog-api.js`) and the Workout Generator's Add to Log (the Swim Tools app's static adapter, given `flogApi` by `src/js/swim-tools-host.js`) all use this API, so one log feeds every tool.

**Can't be tested from the container:** Netlify itself (the firewall blocks it). On the Mac, after `deploy:prototype`: Postman against `https://usms-mockup.netlify.app/api/flog`, and the GitHub Pages FLOG pages calling it without CORS errors.

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
