# Swim Tools v2 — handoff notes

Status as of 2026-10-12: built and working locally, **nothing committed**. Page: `/fitness-and-training/swim-tools-v2/`. It is a redesign of `/fitness-and-training/swim-tools/` (v1, left untouched), adapted from the "Race Deck" design export (`~/Downloads/2 · Race Deck — premium dark command center-html/CommandCenter.dc.html`) and restyled to the USMS brand. It is a design prototype, not a production mockup, so the `/mockup` "follow production" rules don't apply. Brand, project CSS rules and `modal.njk` still do.

## Files

| File | Role |
|---|---|
| `src/pages/fitness-and-training/swim-tools-v2.njk` | Page shell: ribbon, the three sections, the Race Planning controls. Frontmatter holds `swimmerId: KT2JH` (default persona), `courses`, `strokes`, `ageGroups`. |
| `src/_includes/partials/SwimToolsV2/` | `YourSwim` (Training Metrics panel), `PaceConversion`, `RacePredictor`, `RaceHistory` (Your Races, and embeds race data), `RaceSplits`, `TopTens`, `ConvertTime`, `CourseConversion`, `AgeRank`, `AgeConversion`, `Editors` (modals), `TimeField` (macro). |
| `src/js/swim-tools-v2.js` | All behavior (~1240 lines, one IIFE, one `state` object, one `render()`). |
| `src/css/pages/swim-tools-v2.css` | All styles (~1540 lines), tokens `--sd-*`. |
| `src/_data/raceHistory.json` | Real race history per persona (see Data). |
| `src/_data/topTens.json` | USMS Top 10 `lists`, one per course, gender and age group. So far only **SCY Men 50–54**, for 1976, 1986, 1996, 2006, 2016 and 2026 (see Data). |
| `src/_data/averageTimes.json` | **Sample** SCY 25–29 averages by stroke and distance; used for events a swimmer hasn't raced. Needs real USMS data eventually. |
| `src/_data/users.json` | Personas; `SHARK` (Rick B Walker) and `RDS0X` (Tracy L Grilli) were added for this page. |

Unrelated uncommitted changes in the tree (`addons.css`, `swim-tools.css`, `affiliate-club-information.njk`, `membership-comparison.njk`, `docs/headless-cms-poc.md`) aren't part of this work. Separate them when committing.

## Page structure

1. **Header** ("Swim Tools" plus intro).
2. **Section ribbon**: Training Metrics / Race Planning / Time Conversions. Clicking one **reorders** the sections so it comes first. It never scrolls (`showFirst`).
3. **Training Metrics**: one bordered `.swim-panel`.
   - **Light-blue input band** (`YourSwim.njk`), with labels above the controls:
     - Distance (number; arrows step by 25; label "Distance (yards)" with the unit in regular weight).
     - Course (SCY/SCM/LCM).
     - Time, then "or", then Pace (per 100). These are two-way: changing either updates the other. Nothing is cleared, and `metrics.source` records which one was entered last.
     - Stroke (optional; none means a mixed workout).
     - **Add to Log**: an outline button (`btn btn-outline`), 44px tall and right-aligned. Below 1100px it wraps to its own bottom row, left-aligned.
   - **White results band**, as KPI tiles:
     - Calorie burn: 1/6 width, red icon, estimated at 165 lb (no weight input).
     - Training pace: 1/6 width, orange icon.
     - Pace conversion: 1/3 width, orange icon. It shows only the **two other** courses, with a vertical divider between them and no "/100" label.
     - The tiles' numbers share a baseline.
   - Add to Log opens `#swimDeckLog`, showing the stats as static text, a date input, and Cancel / Save to Log. Entries are saved to localStorage `swimTools.log`. There's no log view yet.
4. **Race Planning**: one panel.
   - **Blue band**, with labels above the controls:
     - Age group select (`data-input="ageGroup"`), shown as a blue pill.
     - Course.
     - Distance: select with a blue pill, numbers only (no "yd"/"m").
     - Stroke.
     - Time "or" Pace (per 100, minutes and seconds only): the goal for Your Event. Time and pace are two-way.
     - Goal errors show in red (`goalHint`).
   - **Tools band**:
     - Race Time Predictor (chart or table) with **Your Races** beneath it, at col-md-8.
     - Race Splits (Even / Fast start / Negative), at col-md-4.
     - **Top 10 by Decade**, full width (col-xs-12) beneath both.
5. **Time Conversions**: one panel.
   - **Convert a Time band**: course, distance, stroke, time, and **Your age**.
   - Cards: Course Conversion and Rank in Age Group (stacked, col-md-5), and Age Conversion (col-md-7). Age Conversion shows your group plus three younger and three older.

## Behavior rules worth keeping

- **Race Time Predictor chart** has three lines:
  1. **Age-group average**: always shown, as a grey dashed line.
  - **Age group range**: very light red shading with no outline, from the USMS **A** cut time (top 15%) to the **B** cut time (top 55%) for the selected age group and the swimmer's gender (`ageGroupRange`). The data is real: `src/_data/timeStandards.json` (usms.org event rankings, 2025–2026 season, SCY, 18–24 to 80–84), trimmed to A and B by `src/_data/ageGroupRanges.js`. The cut times are all "top X%" tiers with nothing for the slower half, so the old middle half (25th–75th percentile) can't be drawn; A to B is the nearest match. SCM and LCM are converted from SCY the same way as the average (course factor, yards/meters equivalent distance). With no data for the group (85+, or a blank gender) there's no band and no legend item. Drawn under the Top 10 band.
  - **Top 10 range**: light blue shading between 1st and 10th place with no outline (`topTenRange`), drawn under every line. It uses the latest season of the list matching the chart's course and the swimmer's age group and gender (`topTenList`; gender from `users.json`, and a blank gender matches nothing). With no matching list there's no band and no legend item, and the lists aren't converted between courses. The legend reads "Top ten range", and the table gets a "Top 10" column showing 1st–10th.
  2. **Your line**:
     - Raced distances are solid dots.
     - Unraced distances are estimates scaled from the average by your race ratios, drawn as hollow dots and a dashed line.
  3. **Goal line**: shown only when a goal is set. Thin, dashed and lighter, with **one dot**, at Your Event. It applies the goal improvement with falloff `GOAL_FALLOFF = ln 4`: the full ratio at the event, fading with distance. The baseline uses known races only and never the goal.
- **Known times** come from the fastest race per distance in the context course and stroke. Races in other courses are **not converted** (user's call, 2026-10-12): an LCM chart shows only LCM races, and an SCY chart only SCY races. **They only count races whose `age` falls in the selected Age group** (`inAgeGroup`), so a long history predicts current speed. Races without an age always count. With no races in that group, the chart shows only the average.
- **Top 10 by Decade** (`renderTopTens`):
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
- **Your Races**:
  - Sorted by date, newest first.
  - **Filters**: two selects in the header. Stroke (`racesStroke`) offers All, Free, Breast, Back, Butterfly, IM. Distance (`racesDistance`) offers All plus only the distances raced in the chosen stroke, and resets to All when the stroke has none. There's no Add a Race button here; races are added from the predictor's + button.
  - Shows the newest 5, then "Show all"; expanded lists over 20 scroll inside the card.
  - Each row is one line: remove × at the **start**, course, event, date, then time. The list is two columns only from 1200px, where both dates fit. Below about 380px a long event's date truncates with an ellipsis.
- **Time fields** (`TimeField.njk` macro):
  - Three boxes `mm : ss . hh`; paces have no hundredths.
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
