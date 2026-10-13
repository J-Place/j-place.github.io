# Headless CMS POC (Sitecore + Next.js)

**Status:** Not started. Discussed 2026-10-10. Nothing gets built until it's explicitly kicked off.

**Goal:** Take ownership of the USMS front-end. The dev team's board mentions "headless Sitecore". This project would build a near-complete, working proof-of-concept site that proves the approach.

## Decisions so far

- **A new repo in Next.js.** It is not built inside this Eleventy project.
- **A site redesign at the same time.** The component architecture stays similar to production's, but all markup and CSS are new. The POC reuses the *logic* in production's JSX (state, validation, API calls) but not its markup. Storybook takes over the prototyping role Eleventy has today.
- **Login comes from a separate identity provider, not Sitecore auth.**
  - POC: Clerk with test users.
  - Production: probably Entra External ID, since USMS is an Azure shop.
  - Sitecore 9.1 can trust that provider over OIDC (`Sitecore.Owin.Authentication` is present), which allows a phased cutover.
  - The final choice is a dev team / IT decision.

## What `production/` shows

These findings were current on 2026-10-10. Re-check them before relying on them, because `production/` can lag the live release branch.

- The site runs Sitecore **9.1.0**. **No JSS, Layout Service or GraphQL** is installed. Pages render with Razor plus ReactJS.NET (`this.React("/views/...jsx")`).
- Members are Sitecore membership accounts in the `usms\` domain with **SHA1** password hashes. Moving them to a new provider requires checking first that those hashes can be imported.
- There are about **26 custom JSON endpoints**, registered in `Project/USMS/code/Pipelines/Initialize/RegisterApiRoutes.cs`.
- TDS contains:
  - about 1,100 template items
  - about 400 renderings
  - about 190 placeholder settings
  - default layouts for each page type, in each template's `__Standard Values` `__Renderings` field

  TDS does **not** contain content items or per-page layout overrides. Those have to come from scrapes.
- Sitecore PowerShell Extensions (SPE) is installed. The team's own scripts are under `system/Modules/PowerShell/Script Library/USMS/`.

## Planned architecture

1. **Content model:** parse TDS into a `content-model.json`.
2. **Mock Sitecore API:** a hosted service that serves the scraped content. It returns the exact JSON shape of Sitecore's Layout Service and mirrors the real `/apis/v1/*` routes.
3. **Next.js app:** uses Sitecore's official SDK. Its component map is keyed by the real rendering names, so moving to a real Sitecore backend means swapping the endpoint, not rewriting components.
4. **Spec for the dev team:** document the mock API as a Bruno or Postman collection.
5. **Data:** fake personas only. Never use scraped member PII.

## First steps (once kicked off)

1. **Inventory before building anything.** Before any of this, decide whether the LMSC sites are in scope.
   1. Run static analysis on TDS and the code to find renderings, placeholders and rendering parameters that may be dead.
   2. The dev team runs a read-only SPE script that reports how much each of them is actually used across `/sitecore/content`. Optionally weight the counts by analytics traffic.
   3. Sort everything into dead, rare, duplicate and core.
2. **Size the POC.** Build a TDS parser that produces a rendering inventory for each page type.

## Open questions for the dev team

- What does "headless" mean on their board: XM Cloud, or JSS on 9.1?
- Which systems have to share one login?
- Can the SHA1 password hashes be migrated?
- Can they provide a non-production Sitecore CM instance with Headless Services enabled and an API key?

## Main risk

A new platform, a redesign and a new login together are really three projects at once. One way to contain that is to roll out section by section, using Azure Front Door path routing to send each finished section to the new site.
