# Club Central — End-to-End Redesign Spec

*Meeting: Thu Jun 11, 2026 · Status: In development*

---

## Context

The Club Dashboard is being redesigned from a single-purpose club-registration screen into a full club management hub. Currently:

- `club-dashboard.njk` is an empty shell
- `club-edit.njk` does not exist
- Club-detail pages are static hardcoded `.njk` files with no data source
- `clubs.json` (1,096 clubs) is scraped production data — must not be modified

This spec covers the full end-to-end workflow: **Club Dashboard → Club Select → Club Edit → Club Detail**, plus two new member-management pages. Locally-created test data lives in separate files that follow the same schema as the production-scraped data.

---

## Phasing

### Phase 1 — Faithful production build (on `master`)

Build a faithful recreation of the existing production Club Dashboard (`ClubDashboard.cshtml`) using `clubsLocal.json` as the data source. Snapshot it. This is the audited baseline and the permanent reference URL for comparison.

**Production structure** (from `ClubDashboard.cshtml`):
```
form.form-horizontal
  div.button-row__content.club-dashboard.align-center
    h3  "Choose a Club to Register or Renew"
    [for each club in clubsLocal.clubs]
    div.club-button-wrapper
      [enabled regular]  a.btn.btn-outline.club-link-button  href="?clubId=X"
      [enabled WOG]      a.btn.btn-outline.club-link-button  href="?clubId=X&wog=X"
      [disabled regular] div.disabled-club > div.btn.btn-outline.club-link-button + span "Club Disabled"
      [disabled WOG]     div.disabled-club > div.btn.btn-outline.club-link-button + span "Parent Club Not Registered"
  div.button-row__footer
    a.btn  "Register a New Club"
```

CSS: `Club.min.css` from `www.usms.org`. Local override file (`src/css/club-central/club-dashboard.css`) only if `.button-row__footer` styles need an unscoped rule.

Once built and snapshotted, mark Club Dashboard as **✅ Revised** in the audit checklist.

### Phase 2 — Redesign (on a feature branch)

Branch from `master` after the faithful snapshot. Implement the three-tile layout, Club Select intermediate view, Manage Members, and Non-Members pages per the specs below. The snapshot URL from Phase 1 serves as the "before" reference.

---

## Data Files

### Naming convention

Existing files use camelCase: `clubs.json`, `locations.json`. Local variants follow the same pattern.

> **`locations.json` note:** this file is the Pool Lookup dataset (measured facilities) — a separate concern from club locations. Club locations are embedded within each club record. A `locationsLocal.json` is deferred until Pool Lookup needs local test data.

---

### `src/_data/clubsLocal.json`

Full records for locally-created test clubs. No API-response wrapper (unlike `clubs.json` which wraps in `{ "data": { "clubs": [...] } }`).

```json
{
  "clubs": [ ...club objects... ]
}
```

**Field set** — combines two production models per club record:

| Source model | Fields |
|---|---|
| `ClubListItem` (finder / detail display) | `id`, `title`, `abbreviation`, `url`, `description`, `practiceTimes`, `location[]`, `badges[]`, `isGold`, `trialMembership`, `tryMasters`, `fitnessSeries`, `altsMonth`, `sslf`, `lastModified`, `salesforceId`, `poolTypes[]`, `poolLengths[]` |
| `ClubEditModel` (edit form) | `website`, `socialFacebook`, `socialTwitter`, `socialInstagram`, `clubImage`, `clubHeaderImage`, `newMemberNotification`, `isWog`, `parentClubId`, `lmsc`, `certifiedCoach`, `altsInstructor`, `lgbtqFocus`, `isGoldClub`, `doNotDisplayOnClubFinder`, `regionalClub`, `disabled`, `contact{}` |

**Embedded `location[]` shape** — matches `clubs.json` exactly (camelCase, lat/long as strings):

```json
{
  "name": "string",
  "address1": "string",
  "address2": null,
  "city": "string",
  "state": "XX",
  "zip": "string",
  "lat": "string",
  "long": "string",
  "poolType": "ip | op | ow | null",
  "indoorPoolLength": null,
  "outdoorPoolLength": null,
  "distance": 0
}
```

**Seed data** — minimum two clubs to cover all dashboard states:
1. Enabled regular club — multiple locations, coach badge, Gold
2. Enabled workout group — `isWog: true`, `parentClubId` set, single location
3. (Optional) Disabled club — demonstrates `.disabled-club` treatment in Club Select

---

### `src/_data/membersLocal.json`

Sample member data for the Manage Members page, keyed by club.

```json
{
  "members": [
    {
      "clubId": "local-001",
      "autoRenew": [
        {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "swimmerId": "string",
          "membershipType": "string",
          "expirationDate": "YYYY-MM-DD",
          "isPending": false
        }
      ],
      "yearPlus": [ ...same shape... ],
      "expiring": [ ...same shape... ]
    }
  ]
}
```

---

### `src/_data/nonMembersLocal.json`

Sample non-member / prospect data for the Non-Members page, keyed by club.

```json
{
  "nonMembers": [
    {
      "clubId": "local-001",
      "expired": [
        {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "contactOrigin": "expired",
          "contactDate": "YYYY-MM-DD",
          "contacted": false
        }
      ],
      "trialForms": [
        {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "contactOrigin": "TMS contact form",
          "contactDate": "YYYY-MM-DD",
          "contacted": false
        }
      ],
      "contactForms": [ ...same shape, contactOrigin: "Club contact form"... ]
    }
  ]
}
```

---

## Eleventy Data Access

All three files auto-load as global Eleventy data: `clubsLocal.clubs`, `membersLocal.members`, `nonMembersLocal.nonMembers`. No JS data cascade file needed.

For pages that need to filter to a specific club by ID (club-edit, manage-members, non-members): the full local array is serialized into a `<script>` data island in the template so JS can locate the right record by matching `?clubId=` from the URL. Same pattern as production (clubId passed via query string).

---

## Page Architecture

| Page | Route | Status |
|---|---|---|
| Club Dashboard | `/club-central/club-dashboard.html` | Needs rebuild |
| Club Select (intermediate view) | `/club-central/select-club.html` | New |
| Club Edit | `/club-central/club-edit.html` | New |
| Club Detail (local, data-driven) | `/clubs/[abbr]-local.html` | New (pagination) |
| Manage Members | `/club-central/manage-members.html` | New |
| Non-Members | `/club-central/non-members.html` | New |

CSS: `src/css/club-central/<page>.css` · JS: `src/js/club-central/<page>.js`

All pages extend `layouts/base.njk` with breadcrumb and page-header blocks.

---

## Page 1: Club Dashboard

**Data:** `clubsLocal.clubs[]`

Three action tiles at the top of the page (most-used first):

| Tile | Label | Single-club destination | Multi-club destination |
|---|---|---|---|
| 1 | Manage Club | `/club-central/club-edit.html?clubId=X` | `/club-central/select-club.html?action=edit` |
| 2 | Manage Members | `/club-central/manage-members.html?clubId=X` | `/club-central/select-club.html?action=members` |
| 3 | Manage Non-Members | `/club-central/non-members.html?clubId=X` | `/club-central/select-club.html?action=non-members` |

Below the tiles: **"Register a New Club"** CTA button (`button-row__footer`) linking to `/club-central/club-edit.html` (no `clubId`).

**Single-club contacts** — tiles link directly to their destination with `?clubId=` pre-attached. No intermediate step.

**Multi-club contacts** — tiles link to the Club Select intermediate view with `?action=` indicating where to send the user after club selection.

**Production CSS:** load `Club.min.css` from `www.usms.org`. The `button-row__footer` styles in production are scoped under `.usms-container.form__container` (in `Login.css`) — add a local unscoped rule to `src/css/club-central/club-dashboard.css` if they don't apply.

---

## Page 2: Club Select (intermediate view)

**Data:** `clubsLocal.clubs[]`

Modeled after `src/pages/events/event-central/event-dashboard/event-add.njk` — a full page (not a modal) that presents the contact's clubs as selectable option tiles. Same column grid pattern (`col-xs-12 col-lg-4` per club).

```
section.section-full.bg-gray  (page-header)
  h1  "Choose a Club"  (or action-specific variant)

div.usms-container
  div.row
    [for each club in clubsLocal.clubs]
    div.col-xs-12.col-lg-4
      div
        a.btn.btn-md.btn-outline  href="[destination]?clubId=X"
          [Club abbreviation]
      div
        p  [Club full name · City, State]
    [disabled clubs]
      div.disabled-club treatment — no link, opacity, reason label
```

**JS (`select-club.js`):** reads `?action=` from the URL on load and wires each club button to the correct destination:
- `action=edit` → `/club-central/club-edit.html?clubId=X`
- `action=members` → `/club-central/manage-members.html?clubId=X`
- `action=non-members` → `/club-central/non-members.html?clubId=X`

---

## Page 3: Club Edit

**Data:** `clubsLocal.clubs[]` filtered by `?clubId=` URL param

**Production source:** `production/src/Feature/Club2.0/code/Views/ClubRegistration/ClubEdit.cshtml` + `ClubEditModel.cs`

Multi-section form. Sections from `ClubEditModel`:

1. Club Identity — name, abbreviation, LMSC
2. Description & Practice Times
3. Locations — list of embedded locations; add / edit per location
4. Coaches & ALT Instructors
5. Contact Information
6. Website & Social Links
7. Gold Club / Certifications / Affiliations

**JS (`club-edit.js`):** reads `?clubId=` on load, finds matching club in data island, pre-populates all form fields. "View Club Detail" button links to `club.url`.

---

## Page 4: Club Detail (local, data-driven)

**Data:** `clubsLocal.clubs[]` via Eleventy pagination

Existing club-detail pages (`sarasota-y-sharks-536.njk`, etc.) are hardcoded and stay as-is. Local clubs get auto-generated pages via pagination:

```yaml
# src/pages/clubs/local.njk
pagination:
  data: clubsLocal.clubs
  size: 1
  alias: club
permalink: "/clubs/{{ club.abbreviation | lower }}-local.html"
```

One club-detail page generated per entry in `clubsLocal.json`, using the same `club-detail` layout as existing pages. The `url` field in each `clubsLocal.json` entry should match the generated permalink so Club Edit's "View Club Detail" link resolves correctly.

---

## Page 5: Manage Members

**Data:** `membersLocal.members[]` filtered by `?clubId=`

### Member groupings

Three groups with a visual divider between them, displayed in this order on both mobile and desktop:

| Order | Group | Checkboxes | Bulk-reg eligible |
|---|---|---|---|
| 1 | Auto-renew | No | No |
| 2 | Year-plus | No | No |
| 3 | Expiring | Yes | Yes |

- **Auto-renew:** Members in automatic renewal. Read-only. "Is pending" members (auto-renewal completed, waiver not yet re-signed) fold into this group — flagged visually (color badge or sub-group label). Exact treatment TBD during build.
- **Year-plus:** Multi-year members not currently up for renewal. Read-only.
- **Expiring:** Annual members expiring at year end. Preferred label: *"Expiring — memberships expire December 31, [year]"*. Checkbox per row. Bulk registration targets. **Expired members are not listed here** — they appear on the Non-Members page.

### Bulk registration

Applies only to the Expiring group. "Register Selected" (or similar) CTA at the bottom of the expiring section. The exact post-submit flow (payment, invoice, confirmation email) will be iterated on during build.

### Columns (per row)

Name, membership type/tier, expiration date. Additional columns added as bulk-reg flow is defined.

---

## Page 6: Non-Members

**Data:** `nonMembersLocal.nonMembers[]` filtered by `?clubId=`

Renamed from "Prospective Members" — a broader bucket covering anyone who is not a current active member but has a connection to the club.

### Sub-lists

Ordered highest to lowest conversion likelihood:

| Order | Sub-list | Source | Retention |
|---|---|---|---|
| 1 | Expired members | Registration system | Until re-join or archive |
| 2 | Trial membership submissions | TMS contact form | 30-day rolling |
| 3 | Club contact form submissions | Club detail contact form | ~1 year, then drops |

Trial and contact form submissions are currently emailed to the club contact only — not shown on-site. This page is the first UI surface for that data.

### Columns (per row)

| Column | Notes |
|---|---|
| Name | First + last |
| Email | Primary contact email |
| Contact origin | "Club contact form" / "TMS contact form" / "Expired member" |
| Contact date | Form submission date or membership expiration date |
| Contacted | Checkbox / button |

### "Contacted" action

Marks the record as contacted → removes it from the active list (soft-hide). Underlying record stays in the DB for reporting. No undo UI in the mockup.

### National USM pipeline

If a non-member opts into USMS communications, they roll into the national prospect cohort automatically. Backend only — no separate UI sub-list.

---

## Build Sequence

### Phase 1 — on `master`

| Step | Deliverable | Notes |
|---|---|---|
| 1 | `clubsLocal.json` | Seed: enabled regular club, enabled WOG, optional disabled club |
| 2 | Club Dashboard (faithful) | Production button-grid structure from `ClubDashboard.cshtml` |
| 3 | `/snapshot` + `/link-snapshot` | Permanent baseline URL; mark audit checklist ✅ Revised |

### Phase 2 — on feature branch

| Step | Deliverable | Notes |
|---|---|---|
| 4 | Club Dashboard redesign | Three tiles + single/multi-club routing (replaces button grid) |
| 5 | Club Select intermediate view | `select-club.njk` + `select-club.js` |
| 6 | `src/pages/clubs/local.njk` | Pagination-driven club-detail for local clubs |
| 7 | `membersLocal.json` + Manage Members page | Groups, checkboxes, bulk-reg stub |
| 8 | `nonMembersLocal.json` + Non-Members page | Three sub-lists, contacted action |
| 9 | Club Edit page | Largest build — separate task |

Steps 4–6 form a coherent end-to-end workflow deliverable (dashboard → select → detail). Steps 7–8 add member management. Step 9 closes the loop with edit capability.

---

## Verification

1. `npm run dev` — all new pages render without errors
2. Single-club contact: dashboard tiles link directly to destination with `?clubId=`
3. Multi-club contact: dashboard tiles route through Club Select; club buttons resolve to correct destination
4. Club Edit: `?clubId=` pre-populates form fields from `clubsLocal.json`; "View Club Detail" navigates to generated local club-detail page
5. Manage Members: three groups visible with dividers; expiring group has checkboxes; is-pending member visually flagged in auto-renew group
6. Non-Members: three sub-lists visible; "Contacted" removes record from active list
7. No regressions on existing Club Finder, club-detail pages, or Club Edit production path
