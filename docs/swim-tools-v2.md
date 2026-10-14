# Swim Tools v2 — handoff notes

Status as of 2026-10-12: built and working locally, **nothing committed**. Page: `/fitness-and-training/swim-tools-v2/`. It is a redesign of `/fitness-and-training/swim-tools/` (v1, left untouched), adapted from the "Race Deck" design export (`~/Downloads/2 · Race Deck — premium dark command center-html/CommandCenter.dc.html`) and restyled to the USMS brand. It is a design prototype, not a production mockup, so the `/mockup` "follow production" rules don't apply. Brand, project CSS rules and `modal.njk` still do.

## Files

| File | Role |
|---|---|
| `src/pages/fitness-and-training/swim-tools-v2.njk` | Page shell: ribbon, the three sections, the Race Planning controls. Frontmatter holds `swimmerId: KT2JH` (default persona), `courses`, `ageGroups`. |
| `src/_includes/partials/SwimToolsV2/` | `YourSwim` (Training Metrics panel), `PaceConversion` (retired 2026-10-13, not included; kept for reuse), `RelativeEffort`, `StrokeSelect` (macro), `RacePredictor`, `RaceHistory` (Your Races, and embeds race data), `RankTier` (Rank and Tier), `RaceSplits`, `TopTens` (retired 2026-10-14, not included; kept for reuse), `ConvertTime`, `CourseConversion`, `AgeRank`, `AgeConversion`, `Editors` (modals), `TimeField` (macro). |
| `src/js/swim-tools-v2.js` | All behavior (~1240 lines, one IIFE, one `state` object, one `render()`). |
| `src/css/pages/swim-tools-v2.css` | All styles (~1540 lines), tokens `--sd-*`. |
| `src/_data/raceHistory.json` | Real race history per persona (see Data). |
| `src/_data/topTens.json` | USMS Top 10 `lists`, one per course, gender and age group. So far only **SCY Men 50–54**, for 1976, 1986, 1996, 2006, 2016 and 2026 (see Data). |
| `src/_data/averageTimes.json` | **Sample** SCY 25–29 averages by stroke and distance; used by Rank in Age Group (the predictor uses Top Times rankings). Needs real USMS data eventually. |
| `src/_data/users.json` | Personas; `SHARK` (Rick B Walker) and `RDS0X` (Tracy L Grilli) were added for this page. |

Unrelated uncommitted changes in the tree (`addons.css`, `swim-tools.css`, `affiliate-club-information.njk`, `membership-comparison.njk`, `docs/headless-cms-poc.md`) aren't part of this work. Separate them when committing.

## Page structure

1. **Header**: "Swim Tools" and the greeting on the left; on the right, the section tabs then the sex and age-group pill (or the age group select when the age isn't known).
2. **Section tabs** (`.swim-ribbon`, in the header): icon-only buttons in light grey circles, named by `aria-label` and `title`, in page order: Race Planning / Time Conversions / Training Metrics. Clicking one **reorders** the sections so it comes first. It never scrolls (`showFirst`). Page order (since 2026-10-13): Race Planning, Time Conversions, then Training Metrics.
3. **Training Metrics**: one bordered `.swim-panel`.
   - **Light-blue input band** (`YourSwim.njk`), with labels above the controls:
     - Distance (number; arrows step by 25; label "Distance (yards)" with the unit in regular weight).
     - Course (SCY/SCM/LCM).
     - Time (its Pace field was removed 2026-10-14; the pace shows in the Training pace tile).
     - Stroke (optional select, "Any" means a mixed workout).
     - **Effort** (optional, 1–10): how hard the swim felt, after Stroke on the same row. A **slider** (`.swim-slider`, a native `input type="range"` styled for WebKit and Firefox), "1" and "10" at its ends, its track shaded like the Relative Effort bar; the thumb's ring takes the rating's shade (`FELT_SHADES`). Not rated: the track is faded and has no thumb, and clicking or dragging anywhere on it rates. Arrow keys step; the mouse wheel steps it only while it's focused (so it doesn't take over page scrolling); × clears. The × keeps its space while hidden so rating doesn't widen the row and wrap Add to Log. The label shows the RPE word (`FELT_WORDS`: 1–2 Very easy, 3–4 Easy, 5–6 Moderate, 7–8 Hard, 9 Very hard, 10 Max), "(optional)" when not rated. Shown as "You rated it 7/10" in the Relative effort tile, adjusts Calorie burn, and saved with Add to Log (`effort`, a number or null).
     - **Add to Log**: an outline button (`btn btn-outline`), 44px tall and right-aligned. Below 1100px it wraps to its own bottom row, left-aligned.
   - **White results band**, as KPI tiles:
     - Calorie burn: 1/6 width, red icon, estimated at 165 lb (no weight input). Pace sets the intensity; an Effort rating then adjusts it (`effortFactor`: none at 5–6, about 4% a step, so 1 is about −18% and 10 about +18%), noted "At effort 7/10". Add to Log saves the adjusted figure.
     - Training pace: 1/6 width, orange icon.
     - Relative effort: the rest of the row (2/3 width), red gauge icon. See Relative Effort below.
     - Pace conversion: **retired 2026-10-13** (not included; `PaceConversion.njk` kept for reuse, and `renderMetrics` still fills it). It showed only the **two other** courses, with a vertical divider between them and no "/100" label.
     - The tiles' numbers share a baseline.
   - Add to Log opens `#swimDeckLog`, showing the stats as static text, a date input, and Cancel / Save to Log. Entries are saved to localStorage `swimTools.log`. There's no log view yet.
4. **Race Planning**: one panel.
   - **Blue band**, with labels above the controls:
     - Distance: select with a blue pill, numbers only (no "yd"/"m").
     - Stroke.
     - Course.
     - Time: the goal for Your Event (its Pace field was removed 2026-10-14). The age group select is in the page header, only when the age isn't known.
     - Goal errors show in red (`goalHint`).
   - **Tools band**:
     - Race Time Predictions (chart or table) with **Your Races** beneath it, at col-md-8.
     - Race Splits (Even / Fast start / Negative, with Practice this), then **Rank and Tier**, stacked at col-md-4.
     - Top 10 by Decade: **retired 2026-10-14** (`TopTens.njk` kept; `renderTopTens` skips drawing while it isn't on the page).
5. **Time Conversions**: one panel.
   - **Convert a Time band**: distance, stroke, course, then Time "or" Pace (per 100, minutes and seconds only; added 2026-10-14). Time and pace are two-way: changing either updates the other, and `conv.source` records which was entered last. Your age comes from the profile, or the header's age group.
   - **Course Conversion** follows the source: a time shows as the matching event's time in each course (same distance or its yards/meters equivalent); a pace shows as the pace per 100 in each course, each labelled "/100 yd" or "/100 m". Age Conversion and Rank in Age Group always use the time (worked out from the pace when that was entered).
   - Cards: Course Conversion and Rank in Age Group (stacked, col-md-5), and Age Conversion (col-md-7). Age Conversion shows your group plus three younger and three older.

## Behavior rules worth keeping

- **Race Time Predictions** works as v4's (since 2026-10-13), with the v4 styling under `swim-pred*` classes:
  - **Data**: your age group's USMS rankings from the Top Times files (`/data/top-times/`, `docs/api/top-times.openapi.yaml`), fetched per event as the card needs them (`groupRank`), using `available.json` (fetched at start). A course with no files uses SCY's, converted. Age group is the profile's or the select's; gender is the persona's (`swimmerGender`), and with no gender there's no ranking. Synthetic rankings add "· synthetic data" to the subtitle.
  - **Chart**: pace per 100 by distance, slower higher. Age-group lines: fastest (1st), top ten (10th), median and slowest (outliers dropped, `typicalSlowest`), with grey fills beneath. Your bests in your current age group are triangles, solid line between neighboring distances. Unraced distances are projected (open dots, dotted line): an older swim age-adjusted (`ageAdjust`), else the same distance in another course converted, else your nearest distance scaled by how the median slows (`project`). Your Event's label is bold. A "Projected Winner" pill and note show where your time is as fast as this season's fastest.
  - **Skeleton** while the rankings load (`.is-loading` on the card, when there are no rankings yet and `pending()`): a grey shimmer behind the plot (your own dots still show over it), grey bars in place of the summary (two lines on desktop, five on phones) and grey pills in place of the legend, sized so the card doesn't change height when the data arrives (exact on desktop, within a few px on phones). Static when motion is reduced; screen readers hear "Loading USMS rankings…". Skeletons are new to the site (production uses spinners).
  - **Legend pills** turn each line off and on (`state.predHidden`). **Table view** shows every value with its pace.
  - **Insight** under the chart: where your pace is closest to and furthest from the median.
  - No goal line any more. Your Event's default time (splits, goal placeholders) is your best, else your projected time, else the median.
- **Relative Effort** (Training Metrics, `renderEffort`): the Your Swim pace as a share of your race pace at the swim's distance (race pace / swim pace; 100% = race effort). Race pace comes from the predictor's rows for the swim's course and stroke (Free when Any): the nearest event with your best or projected time, scaled to the swim's distance by Riegel's 1.06; with no races in that stroke, the age group's median. Zones (`EFFORT_ZONES`): Recovery under 70%, Easy 70, Moderate 80, Hard 90, Race pace 97, Faster than race pace from 104 (the reference pace is stale or undersells you). The bar runs 50–105%.
- **Your Races** (since 2026-10-14, as v4's; `renderRaces`): every race, newest first, each with its course, date, and a badge against your best at that event (course, distance and stroke): "Best", or "+0.42 vs best". The newest 6 (`RACES_SHOWN`); Show all lists every race, scrolling inside the card. No filters and no remove buttons (v2's earlier version had both); races are still added from the predictor's +. On phones the badge drops under the event.
- **Rank and Tier** (since 2026-10-14, as v4's; `renderTier`, `RankTier.njk`), below Race Splits: Your Event's time (your goal, else best, projected time or the age-group median, the same time Race Splits uses) on your age group's latest Top Times ranking: a Fastest reference row, then Top 10, 11th–25%, 26–50%, 51–75% and 76–100% with each tier's cut, yours outlined; then the next rung, where the time would place, and how far to go. Non-members (not logged in, or no membership tier) see it blurred under a join prompt. Grey rungs while rankings load. Its link to Top 10 by Decade is retired with that card.
- **Which races count** (since 2026-10-13, v2 and v4 alike): only the last 8 years' (`WINDOW_YEARS`; undated races count). Within that, races from your current age group are real bests (`inAgeGroup`; races without an age count as current), and earlier ones are age-adjusted into it. A real current-group swim beats an adjusted older one at the same distance, even a faster one. If none of the window's races are in Your Event's stroke, every race in the stroke is used, age-adjusted, and the subtitle and insight say they're from races over 8 years ago (`predPool`). The insight compares real and age-adjusted swims, not times projected from other distances.
- **Top 10 by Decade** (`renderTopTens`; retired 2026-10-14, notes kept for when it returns):
  - **Its own Stroke and Distance** filters sit in the card header (`data-tens` / `data-tens-input`, `state.tens`), with distances in the lists' course (SCY).
  - **Following Your Event**: the card starts on Your Event, and switches back to it whenever Your Event's course, distance or stroke changes (`followEvent`). A meters event maps to its yards equivalent (400 m → 500 yd) through `convertRace`. The subtitle says "Your event" while the two match.
  - **Columns**: one per season, each a bar from 1st to 10th with every time as a dot. 1st is solid and labelled bold above the bar, and 10th is labelled below it. A pale band joins the seasons, with a line along the 1st-place times. Fastest is at the top, the reverse of the predictor (where slower is higher).
  - **No line for your own time.** It was removed at the user's request, along with its row of places, and so were the race/estimate on Your Event and the "Your best" on other events.
  - **Goal**: a dashed line plus a `Goal` place row, shown only on Your Event when a goal is set.
  - **Which list**: the one for the swimmer's age group and gender. With none, it falls back to the first list and a note says so.
  - **Notes**: one says when your goal was converted to SCY, and another says when the card is showing a fallback list.
  - **Size**: the viewBox is 960 wide, not 720, because the card spans the row. Its height grows by 16 when the goal's place row shows. Below 720px it scrolls inside the card.
- **Personas**:
  - **Which persona**: the active one is `?user=`, then `sessionStorage.activeUser`, then the page's `swimmerId` (KT2JH). This is the same resolution order as `current-user.js`.
  - **What it sets on load**:
    - Age and Age group: today's age from `users.json` `birthDate` (`ageOn`).
    - Your Event: the event they've swum most, with the latest winning a tie (`startFromSwimmer`).
  - **No race history** (e.g. `?user=COACH`): empty races, averages only.
- **Saved races**: races added or removed are stored per persona in localStorage `swimTools.races.<id>`, which then replaces that persona's seed list. The old unscoped `swimTools.races` key is ignored. New races get an `age` computed from the birth date.
- **Time fields** (`TimeField.njk` macro):
  - Three inputs `mm : ss . hh` in one outlined box; paces have no hundredths. Clicking into the box starts at minutes.
  - Typing auto-advances between boxes.
  - Up/Down arrows or the wheel step a box, wrapping at 0–59 (hundredths 0–99).
  - Focusing a box selects its contents.
  - Leaving a box pads it (5 seconds → 05, 5 hundredths → 50). **Leaving an empty hundredths box fills it with `00`** if minutes or seconds have a value.
  - Empty fields show the prediction as placeholders.
- **Distance changes**: the distance always snaps to a real event for the course and stroke (`fitDistance`), keeping yards/meters equivalents (500↔400, 1000↔800, 1650↔1500).
- **Changing Your Event** (course, distance or stroke) clears the goal.
- **Modals** use the project `modal.njk` with `modalModifier="swim-deck-modal"`. The page JS adds Escape, closing on a backdrop click, and returning focus to the opener.

## Data

`raceHistory.json` → `{ _comment, swimmers: { <users.json key>: { name, races: [ {course, distance, stroke, time, date, age} ] } } }`, sorted oldest first. Embedded on the page as `#race-history-data`, together with the page's default persona.

| `?user=` | Swimmer | Races | Opens on |
|---|---|---|---|
| (default) KT2JH | Jay Place | 13 | 50–54, age 53, SCY 50 Free |
| GAT0R | Kyle Deery | 125 | 40–44, age 43, SCY 50 Breast |
| SHARK | Rick B Walker | 631 | 75–79, age 76, SCY 500 Free |
| RDS0X | Tracy L Grilli | 826 | 65–69, age 69, SCY 200 Free |

- **Source**: parsed from the user's saved USMS individual results pages (`comp/meets/indresults.php?SwimmerID=…`, saved to `~/Downloads/USMS Individual Meet Results for *.html`). The parser is a scratch Python script and isn't kept. To redo it:
  - Split the page on `<a name="SCY|LCM|SCM">`.
  - Read the 8 cells of each `<tr align="left" valign="top">` row.
  - Drop relay and split swims (`Place == Split`), DQ/EXH entries, events the tools don't offer (25s) and exact duplicates.
  - Every row on the four pages was accounted for.
- **Getting the pages**: usms.org results pages sit behind an **Azure WAF that returns 403 to curl and WebFetch, even over the VPN**. Don't try to get around it. Ask the user to save the page from their browser.
- **Top 10 lists** (`topTens.json` → `{ _comment, lists: [ { course, gender: Men|Women, ageGroup (youngest age), ageGroupLabel, seasons: { <year>: { <stroke>: { <distance>: [times, fastest first] } } } } ] }`): parsed from the user's saved Top 10 individual-event pages (`~/Downloads/<year> USMS Top 10 SCY for Men 50-54.html`). Each event is an `<h3 id="Event…">` followed by a `table.toptenlist`, and the time is the 6th cell. Ties make some lists 11 long, and one is 9. 1976 has no 1000 Free, so that column shows "No list". Only times are kept, no names. To add an age group, gender or course, save its Top 10 pages, parse them the same way and append an entry to `lists`. No JS change is needed.
- **Estimated birth dates** for Rick (05/15/1950) and Tracy (04/01/1957) come from their results ages. The SCM age column is age on Dec 31, so ignore SCM rows when working out birth dates. Their gender is left blank.
- **Kyle's birth date may be a year off.** `users.json` has 06/15/1983, but his results suggest mid-1984.
- **Key collision**: `SHARK` is both Rick's users.json key and the Sarasota Sharks club abbreviation in `clubsLocal.json`. These don't conflict (`?user=` vs `?club=`), but keep it in mind.
- **Sample factors**: the course factors (`COURSES`), the age-group slowdown factors (`AGE_GROUPS`), calorie constants and the rank model (`RANK_*`) are all sample values, not USMS data. The footer disclaimer says race history is real and averages are sample data.

## Styling rules learned the hard way

- **Production `section{display:table}`** breaks widths and made the page overflow to 612px on mobile. `.swim-deck__section` and `.swim-deck-page` are forced to `display:block`.
- **Production `.usms-container p/li` sizes** win over page styles unless selectors are prefixed with `.swim-deck`. Grid items also need `width:100%; justify-self:stretch`.
- **Production `.btn-md`** is `height: 32px !important`.
- **Rem base is 10px** (`html` font-size).
- **Specificity**: the error color needs `.swim-deck .swim-deck__note.swim-deck__note-error`.
- **Baseline alignment** of the tile numbers uses `margin-bottom: -0.167em` on the units.
- **Colors** live in tokens on the root (`--sd-blue #0068ad`, `--sd-red`, `--sd-orange #ff7f00`, `--sd-tint` light blue, …). `--sd-yellow` is currently unused.
- **No inline `<style>`/`<script>`** in templates. JSON data islands are fine.

## How to check it

- **Build** to scratch without touching the user's `_site/`: `npx @11ty/eleventy --output=<scratchpad>/site`.
- **Serve** that folder: `python3 -m http.server 8765`.
- **Drive it** with the project's Playwright via `NODE_PATH=$PWD/node_modules node script.js`. Don't install browsers.
- **Measure pixels**, when needed, with Python PIL.
- **Visual regression**: the page isn't in `tests/usms-visual-regression-screenshots/pages.js`, so the visual suite doesn't cover it.

## Open / not done

- No "Your Log" view for saved workouts.
- A duplicate "Log this swim" header button was flagged earlier and not resolved.
- No way to reset to the seed races once a viewer has edited their list (they'd have to clear localStorage).
- `averageTimes.json` and all the factors still need real USMS data.
- Top 10 data covers SCY Men 50–54 only. Other age groups, Women, and LCM/SCM need their pages saved and parsed into `lists`.
- Not committed; nothing deployed.
