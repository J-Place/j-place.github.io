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

## Year-Plus and Event License Year-Plus tiles

**Current state:** These tiles (`usmsYearPlus`, and the production `membership-length--competition-nextYear` tile) are present in production Registration markup but hidden by default (`display: none`). They are not currently included in the mockup Registration tier keys.

**Pending:** Confirm with product/dev whether these tiers are still offered in 2026 and under what conditions they should appear. Add to `registration.njk` `membershipTierKeys` and implement show/hide logic if needed.
