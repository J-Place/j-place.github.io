---
name: Member registration user journey
description: Defined user journey for the USMS registration flow, covering all known/unknown user states
type: project
---

The registration flow begins at the site root. User states drive which path is taken.

**Why:** Needed to inform refactor of registration and login-to-registration-page mockup pages.

**How to apply:** Use this to determine what copy, pre-population, and flow variations the JS needs to handle on the registration page.

## Journey

1. **Unknown user** (no cookies/session) — visits site. Some content is available (articles, club finder, events calendar). Other content requires login.
2. User clicks **Log In** → `/myusmslogin`
3. From `/myusmslogin`:
   - **Has valid credentials** → `/account/my-account`
   - **No account or wants to join** → clicks **Join Now** → `/join-usms/join-or-renew`
4. From `/join-usms/join-or-renew`:
   - **Returning member** uses "Renew with a USMS Account" → enters credentials → registration page with stored profile data pre-populated
   - **New member** completes "Create a USMS My Account" → registration page with only new account data populated (name, email, etc.)

## User states

| State | Known? | `renew` | `isLapsed` | Notes |
|-------|--------|---------|------------|-------|
| Unknown | No | — | — | Cleared cookies or brand new; limited content access |
| Account created, reg incomplete | Partially | false | false | Has first/last/sex/DOB; triggers "Is this you?" modal on return |
| New member (completing reg) | Yes | false | false | Registration pre-populated from account creation fields |
| Current member | Yes | true | false | Active membership |
| Lapsed member | Yes | true | true | Had membership, now expired; must re-select tier |
| Coach (active cert) | Yes | true | false | Subset of member; may see coach section in registration (TBD) |
| Coach (expired cert) | Yes | true | false | Sees coach section in registration (TBD) |
| Club admin | Yes | varies | varies | May be irrelevant to registration flow |

## Key notes

- Membership STATUS (none/current/lapsed) should be modeled separately from membership TIER (standard/plus/etc.)
- Lapsed members re-select their tier from scratch; their previous tier is not pre-selected
- `login-to-registration-page` is the bridge between account creation/login and the registration page; "Is this you?" modal lives there — flag for later development, not in current refactor scope
- Account creation form fields (Create a USMS My Account): first name, middle (optional), last name, sex (Female/Male/I Prefer Not to Say), DOB — pre-populated for new members on registration
- "Renew with a USMS Account" form is email + password only; system pulls full stored profile on auth — all stored fields pre-populated for returning/lapsed members
- New members arrive at registration with first/middle/last/sex/DOB pre-populated; all other fields (email, phone, address, etc.) are blank
- "Account created, incomplete registration" users: stored data is same as account creation fields (first/middle/last/sex/DOB)
- Registration form inputs will change as part of the refactor (fields TBD) — hold off on touching partials
- Coach is a subset of member, not a separate top-level state; coach cert can expire while membership is current
