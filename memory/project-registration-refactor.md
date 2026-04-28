---
name: Registration flow refactor
description: Active refactor of member registration and login-to-registration-page on branch refactor/member-registration-2026-april
type: project
---

Refactoring the registration flow. Changes will affect `src/pages/registration.njk` and `src/pages/login-to-registration-page.njk`. Work includes re-ordering sections and moving terms agreements out of the Payment section into a different section.

**Why:** UX improvement to the registration step order and terms placement.

**Branch:** `refactor/member-registration-2026-april`

**How to apply:** When resuming this work, check out that branch. All registration partials live in `src/_includes/partials/Forms/`.

## Registration page structure (as of 2026-04-28)

`registration.njk` → `FullRegistrationForm.njk` → 10 partials in two groups:

**Group 1 — Pre-payment (each has own `<form>`):**
1. `ContactInformation.njk` — Name, sex, DOB, email, phone, address
2. `ClubInformation.njk` — LMSC, club, workout group
3. `Interests.njk` — Coach questions
4. `Liability.njk` — Liability waiver + Agree/Disagree radios

**Group 2 — Payment step (single `<form class="form-membership-length">`):**
5. `Participation.njk` — Plans to participate in events? Yes/No
6. `MembershipOptions.njk` — Tier cards (iterates `membershipTierKeys` frontmatter)
7. `CompetitionCert.njk` — Competition category cert (hidden; shown by JS for event-license tiers)
8. `Vsa.njk` — Video Stroke Analysis add-on
9. `Donations.njk` — Learn-to-Swim, Hall of Fame, LMSC donations
10. `Payment.njk` — Payment summary, card fields, 3 terms checkboxes, Register button

**Terms checkboxes in Payment.njk (targets of refactor):**
- `agree-terms` — Standard: factual info, Privacy Policy, non-refundable. Always shown once tier selected.
- `agree-usmsplus-terms` — USMS+ data sharing. Shown for usmsPlus tiers.
- `agree-terms-competition` — Competition category policy. Shown for event-license tiers.
