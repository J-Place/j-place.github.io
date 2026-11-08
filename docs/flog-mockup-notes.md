# Fitness Log (FLOG) mockup: notes for Bonfire

These notes go with the FLOG mockup snapshot. The pages are U.S. Masters Swimming prototype pages, with the site's header, meganav and footer around FLOG's own part.

## Pages

| Page | Path in the snapshot | What it does |
|---|---|---|
| Home | `/` | Week, month and list views. `?view=week\|month\|list&date=YYYY-MM-DD` |
| Log a swim | `/log-swim/` | `?date=` pre-fills the date (from a day's "Log a swim") |
| Edit a swim | `/edit-swim/?id=EntryID` | Same form, filled in, with Delete and an in-page "are you sure?" |
| Totals | `/totals/` | This month, this year, lifetime |
| Preferences | `/preferences/` | Sharing, default unit, course and calendar view, plus a demo-only reset |

On the prototype site they live at `/myusms/flog/`.

To see other states:
- `?user=GAT0R` shows another member, who logs in meters, long course and open water.
- `?user=NEW01` shows a non-member.
- `?user=NEW` shows a logged-out visitor.
- `?empty=1` shows the first-time state with no swims.

## Which files are FLOG's

Everything else in the snapshot is the site's chrome, which you already have.

- `css/pages/flog/tokens.css`: every color, font size, radius and spacing step, as custom properties scoped to `.flog`. Nothing else uses a raw color.
- `css/pages/flog/flog.css`: all of FLOG's styles, scoped under `.flog`, phone-first (375px) with breakpoints at 576, 768 and 992px.
- `js/flog/app.js`: the pages. Each repeated thing has one render function, which takes data and returns HTML. Each one is meant to become one React component:
  - `renderSwim`
  - `renderDay`
  - `renderWeek`
  - `renderMonth`
  - `renderList`
  - `renderTotals`
  - `renderSwimForm`
  - `renderPreferences`
- `js/flog/flog-api.js`: the **only** place that knows where data comes from. Every function returns a Promise and uses FLOG's field names. Each function's comment names the REST call it stands for (for example `GET /api/flog/entries?from=&to=`). Today it calls our own mockup API (below). Replace this one file with however the real FLOG serves its data, and the pages don't change.
- The icons are Lucide, as one inline SVG sprite at the top of each page (`#flog-i-*`).

## Data

Entries use the Fitness Log's own field names:
- `EntryID`
- `Date` (`YYYY-MM-DD`, a plain calendar date)
- `RawDistance`
- `RawDistanceUnit` (`Y`, `M` or `mi`)
- `RawDistanceCourse` (`SCY`, `SCM`, `LCM`, `OW` or `Other`)
- `DistanceYards`
- `DurationMinutes`
- `Details`

`DistanceYards` is set by the data source, never by the page:
- meters × 1.0936
- miles × 1760

Preferences are `WorkoutsPublic`, `MeasurementsPublic`, `UserDefaultView` (`week` or `month`), `UserDefaultCourse` and `UserDefaultDistance`.

Totals are `NumSessions`, `TotalMinutes` and `TotalYards` for the month, the year and lifetime, plus `firstLogDate`.

Left out on purpose:
- `ActivityType`, because the log is swims only.
- `Value1` and `Value2`, because we don't know what they hold.
- `SwimmerId`, which should come from the login, never from the page.

## What the design shows that isn't in the primer's data

These are **new, optional fields**. A swim without them is complete.

- `Intensity` (1 to 10): how hard the swim felt. The page shows a word with it: 1–2 Very easy, 3–4 Easy, 5–6 Moderate, 7–8 Hard, 9 Very hard, 10 Max. Training Tools' Training Effect uses the same scale.
- `Stroke`: the swim's main stroke (`Free`, `Back`, `Breast`, `Fly`, `IM`, `Mixed`).
- `Calories`: a whole number. Members can enter it from a watch, and Training Tools' pace and calories calculator could fill it in later.

Also not in the primer's data, but worked out on the page from what's there:
- The week and month summary lines (swims, distance, time).
- The "Average swim" on Totals (`TotalYards / NumSessions`).

## Token changes

The primer's brand tokens are used as given. The mockup adds:

- `--flog-ink: #262627`: body text, the site's own ink color.
- `--flog-on-color: #ffffff`: text on blue and red.
- `--flog-red-tint: #fdeced` and `--flog-red-dark: #a8141f`: the delete confirmation's background, and the red button's hover.
- Type sizes (14, 16, 20, 28, 36px), spacing steps (4–32px), a 44px minimum tap size, and the focus ring.

Gold (`--flog-gold`) marks today. It sits behind dark text, never as text on white, because it's too light for that.

## Our mockup API: a model for the new FLOG's

Today's FLOG has no API, and the other tools need one, so the mockup runs on a working API of our own with made-up data, served by the snapshot itself at `/api/flog/`. Its contract is an OpenAPI file, `flog.openapi.yaml`, sent alongside this snapshot (Postman can import it). It's REST, in FLOG's field names:

| Call | What it does |
|---|---|
| `GET /api/flog/entries?from=&to=` | Swims in a date range (week, month) |
| `GET /api/flog/entries?limit=&before=` | The newest swims, a page at a time |
| `GET`, `PUT`, `DELETE /api/flog/entries/{EntryID}` | One swim |
| `POST /api/flog/entries` | Log a swim |
| `GET /api/flog/totals?date=` | Month, year and lifetime totals |
| `GET`, `PUT /api/flog/preferences` | Preferences |

- The server sets `EntryID` and `DistanceYards`.
- Errors are `{ "problems": [{ "field", "message" }] }`, with messages written for the swimmer.
- In the mockup, headers say who's asking (`X-Flog-Swimmer`, and `X-Flog-Visitor` so each tester gets their own copy). In production the login should say, and the page shouldn't send it.
- `POST /api/flog/reset` is for the mockup only.

Build it your own way if it suits your app better. If you do, a short note of your calls would let us point Training Tools and the Workout Generator at them.

## Open questions

1. **GTD isn't in this handoff.** The current FLOG's Go The Distance pieces (the progress card, Events, Monthly Progress) aren't mocked up. Keep them as they are, or tell us if you want them in the new look.
2. **How the other tools reach FLOG.** Training Tools and the Workout Generator both let members log a swim, and Training Tools reads the log back for its Training Metrics. Will the new FLOG take swims and give them back through an API, or should those tools link to FLOG's Log a swim page, pre-filled? In the mockup they already do: both post swims to our API and Training Tools reads them back (see the API, below).
3. **`Value1` and `Value2`**: what do they hold, and does anything still use them?
4. **Details length**: is there a limit on comments?
