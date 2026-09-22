# Page Audit Status

Tracks which local mockup pages have been assessed and rebuilt using the source-first `/mockup` workflow (production JSX structure, TDS CSS load order, live fetch for labels).

**Why this exists:** many of these pages were built before the source-first workflow existed. Their local CSS overrides may be redundant (already covered by production CSS), their markup may drift from production's actual structure, and their CSS load order may not match production. Each page needs to be individually re-assessed against production and either confirmed faithful or deliberately rebuilt.

This is a different axis from `COMPONENTS.md`: that file tracks whether a production *component* has a structural mockup counterpart at all (Covered/Partial/Not Started/Out of Scope). This file tracks whether a *page* has been through the current source-first audit-and-rebuild process — a page can show "Covered" in `COMPONENTS.md` (something exists and structurally matches) while still being "Not Started" here, because it was built before this process existed and hasn't been re-verified against it yet. That's expected, not a contradiction.

Once assessed, snapshot the faithful version before applying any intentional changes (see the `/snapshot` skill).

**Known gap (2026-09-22):** this list covers the 37 pages tracked as of the original audit checklist. A comparison against the current `src/pages/` tree found ~20 additional real pages built since then and never added here (all of Club Central except `club-dashboard.njk`, all of Volunteer Central, `clubs/indy-aquatic-masters-1745.njk`, `join-usms/membership-comparison.njk`, `lmsc/lmsc-florida.njk`, three `registration/*` confirmation/receipt pages, and root `index.njk`). Deliberately left out of the tables below for now — add them when this list is next revisited, not before.

## Status Key

| Status | Meaning |
|---|---|
| **Not Started** | Not yet assessed or rebuilt against the source-first workflow |
| **F** | Faithful — assessed, should closely match current production |
| **I** | Intentional — assessed, deliberate design improvements or fixes over production |
| **✓** | The source-first rebuild itself is complete (appears alongside F or I once done — a page can be labeled F/I as a target before the rebuild is finished) |

---

## Account / Auth

| Page | Status | Notes |
|---|---|---|
| `account/my-account.njk` | Not Started | |
| `account/myusmslogin.njk` | Not Started | `COMPONENTS.md` marks `Login.jsx` → this page as Covered — pre-source-first build, still needs re-audit |
| `account/addons.njk` | Not Started | |
| `account/addons-ncc.njk` | Not Started | |
| `account/addons-all.njk` | Not Started | |
| `login-to-registration-page.njk` | Not Started | |
| `registration.njk` | Not Started | |

## Clubs

| Page | Status | Notes |
|---|---|---|
| `clubs/fort-worth-area-swim-team-608.njk` | F ✓ | Built 2026-05-29, source-first |
| `clubs/index.njk` (Club Finder) | Not Started | `COMPONENTS.md` marks `Clubs.jsx` → this page as Covered — pre-source-first build, still needs re-audit |
| `clubs/sarasota-y-sharks-536.njk` | Not Started | |
| `clubs/south-end-rowing-club-580.njk` | Not Started | |
| `clubs/swim-fort-lauderdale-1877.njk` | Not Started | |

## Events

| Page | Status | Notes |
|---|---|---|
| `events/index.njk` (Events calendar) | Not Started | |
| `events/events/2026-bumpy-jones-*.njk` (Event detail) | Not Started | |
| `events/event-central/event-dashboard/index.njk` | Not Started | |
| `events/event-central/event-dashboard/event-add.njk` | Not Started | |
| `events/event-central/event-dashboard/event-edit.njk` | Not Started | |
| `events/event-central/usms-measured-pools.njk` | Not Started | |
| `events/event-central/usms-measured-pools-alt.njk` | Not Started | |
| `events/pool-lookup-archive.njk` | Not Started | |

## Club Central

| Page | Status | Notes |
|---|---|---|
| `club-central/club-dashboard.njk` | Not Started | |

## Join / Renew

| Page | Status | Notes |
|---|---|---|
| `join-usms/join-or-renew.njk` | Not Started | `COMPONENTS.md` marks `Renew.jsx` → this page as Partial (not Covered) — consistent signal this page needs work |
| `join-usms/join-or-renew-tms.njk` | Not Started | |

## Results

| Page | Status | Notes |
|---|---|---|
| `event-results/swimmer.njk` | Not Started | |

## SWIMMER Magazine

| Page | Status | Notes |
|---|---|---|
| `swimmer-magazine/index.njk` | Not Started | |
| `swimmer-magazine/mar-apr-2026/index.njk` | Not Started | |
| `swimmer-magazine/mar-apr-2026/4-wrong-ways-to-swim.njk` | Not Started | |
| `swimmer-magazine/may-jun-2026/index.njk` | Not Started | |
| `swimmer-magazine/may-jun-2026/how-to-do-butterfly-pull.njk` | Not Started | |

## Search / Content

| Page | Status | Notes |
|---|---|---|
| `search/index.njk` | Not Started | |
| `fitness-and-training/articles-and-videos.njk` | Not Started | |

## LMSC

| Page | Status | Notes |
|---|---|---|
| `lmsc/ohio-masters-swimming.njk` | Not Started | |

## Other

| Page | Status | Notes |
|---|---|---|
| `about/contact-lmsc.njk` | Not Started | |
| `about/contact-us.njk` | Not Started | |
| `about/swimmer-magazine.njk` | Not Started | |
| `about/usms-style-guide.njk` | Not Started | |
| `home.njk` | Not Started | `COMPONENTS.md` marks `Home.jsx` → this page as Covered — pre-source-first build, still needs re-audit |
