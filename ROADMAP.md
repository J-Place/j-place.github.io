# USMS Mockup — Development Roadmap

Future work items that are intentionally deferred, pending external input or a future sprint.

---

## Membership pricing matrix — hidden inputs and data model refactor

**Blocked on:** Dev team delivering the complete pricing/product data matrix.

Production membership tiles contain hidden inputs (e.g., `<input type="hidden" class="usms-plus-cost--eligible">`) that production JavaScript populates with eligibility-resolved prices at runtime — the actual price a member pays depends on what they already hold, their lsid, and server-side eligibility rules. Our mockup currently hardcodes prices directly on tier data objects (`price`, `addonPrice`, `vsaPrice`).

When the pricing matrix arrives:

- Determine whether prices belong on the tier object at all, or whether they should be computed from a member-state + pricing-rule lookup.
- Revisit whether the 4-tier model (`usmsStandard`, `usmsStandardEventLicense`, `usmsPlus`, `usmsPlusEventLicense`) should be refactored to a base-tier + composable event-license add-on model, which is how production appears to be structured.
- Add the `--eligible` hidden inputs to `MembershipOptions.njk` if needed to support JS-driven price resolution.

**Related:** `src/_data/membershipTiers/`, `src/_data/siteUsers.json`, `src/js/registration.js`, `src/js/addons.js`, `src/_includes/partials/Forms/MembershipOptions.njk`.

---

## Dev overlay page list — migrate from JSON config to per-page frontmatter

**Current state:** Each overlay's config file in `src/_data/devOverlays/` includes a `pages` array listing which permalinks load the overlay. This is a central registry that drifts as pages are added or renamed.

**Target state:** Move the page list out of the JSON config and into frontmatter on each page template, so overlay inclusion is co-located with the page that uses it.

**Related:** `src/_data/devOverlays/`, `src/_includes/layouts/base.njk`, CLAUDE.md dev overlay docs.

---

## Add-ons page: wire ShowMagazineAddOn per persona

**Context:** Production added a server-side gate on the magazine add-on (PR 1610, 2026-07-01). The render condition in `MastersAddOns.jsx` changed to `data.ContactModel.Magazine !== 'Yes' && data.ShowMagazineAddOn` — previously the add-on appeared automatically for anyone without a subscription; now the server must explicitly set `ShowMagazineAddOn: true`.

**What to do:** When next working on the add-ons page, set `showMagazineAddon: true` on personas that should see the magazine offer (non-subscribers), and `false` on personas that already hold a subscription.

**Related:** `src/_data/siteUsers.json`, `src/js/addons.js`, production `MastersAddOns.jsx`, `AddonsModel.cs`.

---

## Membership tile date-availability windows — site-wide, not just Registration

**Data model:** Each file in `src/_data/membershipTiers/` carries an `availStart`/`availEnd` (month/day) window. `MembershipOptions.njk` renders these generically as `data-avail-start`/`data-avail-end` on every tile regardless of which page includes it — the markup is already page-agnostic.

| Tier | key | Price | Window | Competition eligible |
|---|---|---|---|---|
| Standard Membership | `usmsStandard` | $75 | Jan 1 – Dec 31 | No |
| Event License Standard | `usmsStandardEventLicense` | $75 | Jan 1 – Dec 31 | Yes |
| Event License Standard (standalone add-on) | `eventLicenseUpgrade` | $0 | Jan 1 – Dec 31 | Yes |
| USMS+ | `usmsPlus` | $249 (+$149 addon) | Jan 1 – Jun 30 | Yes |
| Year-Plus Membership | `usmsYearPlus` | $125 | Jul 1 – Dec 31 | No |
| Event License Year-Plus | `usmsYearPlusEventLicense` | $125 | Jul 1 – Dec 31 | Yes |

USMS+ (H1) and the Year-Plus pair (H2) are the seasonal counterparts of each other — a member should see one or the other depending on the date, never neither.

**Current implementation is inconsistent across pages:**

- **Registration (`registration.njk`):** All five tiers are in `membershipTierKeys`, and `registration.js`'s init IIFE reads `data-avail-start`/`data-avail-end` to hide out-of-window tiles based on real/simulated (`?date=YYYY-MM-DD`) today. Fully wired.
- **Add-Ons (`account/addons.njk`):** `membershipTierKeys` only lists `usmsPlus` and `eventLicenseUpgrade` — no Year-Plus/Event-License-Year-Plus counterpart exists on this page at all, so there's no H2 equivalent to USMS+. `addons.js` also has no date-availability init block, so even the `usmsPlus` tile it does show is never hidden outside Jan–Jun.

**Pending:** Confirm with product/dev whether Year-Plus tiers should appear on Add-Ons too, then (a) add `usmsYearPlusEventLicense` to `addons.njk`'s `membershipTierKeys`, and (b) port the date-availability filtering logic out of `registration.js` into a shared helper both pages can call, rather than duplicating the IIFE.

**Related:** `src/_data/membershipTiers/`, `src/_includes/partials/Forms/MembershipOptions.njk`, `src/js/registration.js`, `src/js/addons.js`, `src/pages/registration.njk`, `src/pages/account/addons.njk`.
