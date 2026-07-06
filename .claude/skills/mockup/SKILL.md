---
name: mockup
description: Build a mockup of a production USMS page. Resolves structure from production JSX, CSS from TDS item files, and labels from a live URL fetch or paste. Always starts in plan mode.
argument-hint: [https://www.usms.org/... | component or page name]
allowed-tools: WebFetch Bash(find *) Bash(grep *) Bash(curl *) Read Write Edit EnterPlanMode ExitPlanMode
---

You are running the production page mockup workflow for the USMS mockup project.

**Call `EnterPlanMode` immediately before doing anything else.**

---

## Overview

This skill builds faithful static Nunjucks mockups by reading production source files directly rather than relying on scraped HTML. The three inputs are:

| What | Source |
|---|---|
| HTML structure, class names, IDs, sub-components | Production JSX `render()` method |
| CSS files and load order | TDS rendering `.item` files + `Usms.cshtml` base stack |
| Label text, page title, breadcrumbs | Live URL fetch (curl) or user-supplied JSON blob |

A live page fetch or paste is only required for label strings and content — never for structure or CSS.

---

## Step 1 — COMPONENTS.md lookup

Read `COMPONENTS.md` from the project root.

Identify the **page-level view** entry and all **component entries** involved in this page. For each, note:
- Current status (Covered / Partial / Not Started / Out of Scope)
- Production JSX path (e.g. `production/src/App/views/Sanctions/SanctionsEditEvent.jsx`)
- Production TDS rendering item path (search using the JSX path as a key — see Step 2)

Report which components were found and their current status.

If no matching entries are found, note that this is new territory and continue.

---

## Step 2 — Read production JSX files

For each component found in Step 1 that is **Not Started** or **Partial**, read its JSX file from `production/src/App/views/`.

From each JSX file extract:

**Structure** — the `render()` method gives the complete HTML skeleton: div hierarchy, class names, IDs, data attributes.

**Sub-components** — `import` statements at the top list every child component. Read those files too if they are Not Started or Partial.

**Conditional states** — `state` variables and ternary/conditional expressions in `render()` reveal every UI variant (e.g. Pool vs. Open Water, loading vs. loaded, error vs. success). Note which state to represent in the static mockup — default to the primary happy-path state.

**Form fields** — `name`, `id`, and `type` attributes on inputs are declared directly in JSX. Validation method calls (e.g. `ValidateField(document.querySelector('input[name="eventInfoName"]'))`) name every required field.

**Mock data shape** — `PropTypes` declarations define every prop field, its type, and whether it is required. Use these to write realistic mock data for the template.

---

## Step 3 — Read TDS rendering item files for CSS

For each production component, find its TDS rendering `.item` file by searching for the JSX file path it references:

```bash
grep -rl "ComponentName.jsx" production/src --include="*.item"
```

From the `.item` file, read the **`Css assets`** field. This is the authoritative list of page-specific CSS files, in the order they will be injected into the page.

The complete CSS load order for this page is:

**Base stack** (from `Usms.cshtml`, always present):
1. `bootstrap.min.css` — Bootstrap 3 grid (`col-xs-*`, `col-md-*` etc.)
2. `bootstrap-3-usms-patch.css` — BS3 patches
3. Font Awesome `brands.min.css`
4. Font Awesome `all.min.css`
5. `common.min.css`
6. ← **Css assets field injects here** (page-specific files in TDS order)
7. `print.min.css`
8. `rteMasters.min.css`

**CSS framework note:** The grid is Bootstrap 3, but `usms.min.css` (and/or `common.min.css`) includes compiled Bootstrap 5 utility classes — `d-flex`, `flex-row`, `justify-content-*`, `align-items-*`, etc. work without loading a separate BS5 file. Use BS3 grid classes for columns, BS5 utility classes for alignment and spacing.

Compile the full ordered list for this page. Page-specific files go in `{% block pageCSS %}` of the layout or page template.

---

## Step 4 — Obtain label text and page content

Label strings (button text, section titles, validation messages, placeholders) and page content (breadcrumb text, page title, rich text body) live only in the Sitecore CMS — they are not in source files. Obtain them using the appropriate path below.

### Path A — Public URL (preferred)

If `$ARGUMENTS` starts with `http`, run:

```bash
curl -sL "$ARGUMENTS"
```

From the response, extract:

1. **React data blob** — find the `<script>` tag containing the JSON props object that Sitecore injects to hydrate the React component. It typically looks like:
   ```html
   <script>window.__reactData = {...}</script>
   ```
   or is embedded as a `data-` attribute on the React mount point. Extract the full JSON object — this contains every label string passed as props.

2. **Page title** — `<h1>` or `.page-title h1` content.

3. **Breadcrumb text** — `.breadcrumb` or `.breadcrumb__title` content.

4. **Any Sitecore-rendered body copy** — rich text regions outside the React mount point.

### Path B — Auth-required or inaccessible page

If the page requires authentication or is not publicly accessible, ask the user:

> "This page requires authentication so I can't fetch it automatically. Please paste either:
> - The JSON data blob from the page (right-click → View Source, find the `<script>` tag containing the React props object), or
> - Just the visible label strings you want to use (button text, section titles, etc.)
>
> Also paste the `<link rel='stylesheet'>` lines from the page `<head>` to verify CSS load order."

Wait for the response.

### Path C — No URL or content available

If neither a URL nor a paste is provided, proceed with:
- Label strings inferred from PropType names (e.g. `buttonSaveAndContinue` → "Save and Continue")
- A note in the plan that labels will need verification against the live page

---

## Step 5 — Check for an existing local file

Determine the target file path `$TARGET_PATH`:
- If `$ARGUMENTS` was a URL, suggest a path derived from the URL: `src/pages/<path-segments>.njk`
- Otherwise ask the user for the target path

Run:
```bash
find src -name "<filename>" 2>/dev/null
```

- **If a file exists at `$TARGET_PATH`:** Read it. Compare its structure against the JSX-derived structure and note meaningful differences (sections missing or added, class name changes).
- **If no file exists:** Note that this is a net-new page.

---

## Step 6 — Determine partial structure

For each production component that is **Not Started** or **Partial**, decide whether it becomes a new Nunjucks partial or is inlined. This is not a proposal — decide and commit. The plan summary (Step 8) will list the decisions for the user's awareness before building begins.

**Default rule: match the production model.** If production has a component as a separate file (JSX component or Razor partial), create a corresponding Nunjucks partial. This keeps the mockup's file structure parallel to production, making future audits and diffs easier.

**Create a new partial** if:
- Production has it as a separate JSX component or Razor partial (primary rule)
- It appears (or is likely to appear) on more than one page
- It maps to a clearly self-contained, named section of the UI

**Inline into parent** only if:
- Production itself inlines the markup (not a separate file)
- It is truly trivial markup (fewer than ~10 lines) with no structural identity of its own

Path for new partials: `src/_includes/partials/<Group>/<ComponentName>.njk`

---

## Step 7 — Strip production-only noise

From any fetched or pasted HTML, identify and plan to remove:
- Google Tag Manager blocks
- Pingdom RUM scripts
- Facebook SDK scripts
- Google Ad Manager / DFP blocks and slot divs
- Sitecore server/build comments (`<!-- /Sitecore/...-->`, `<!-- #BeginTemplate -->`)
- React hydration attributes (`data-reactid`, `data-reactroot`, `data-react-checksum`)
- Production inline `<style>` patch blocks
- **`cm.usms.org` image domains** — this is the Sitecore CMS origin, not the CDN; replace with `www-usms-hhgdctfafngha6hr.z01.azurefd.net` (path and query params stay identical)

---

## Step 8 — Present the build summary

Call `ExitPlanMode` to present the build summary. Frame this as "here is what I'm about to build" — not a proposal. The user can redirect if something looks wrong, but no approval of individual decisions is needed.

Include:

- **Target path:** `$TARGET_PATH` (new file or updating existing)
- **Production components involved:** each with current COMPONENTS.md status
- **CSS load order:** full ordered list for this page (base stack + TDS assets)
- **Key structural notes from JSX:** which conditional state is being represented, notable class names, accordion/section IDs
- **Label source:** live fetch / paste / inferred from PropTypes
- **Diff summary:** (if updating an existing file — sections added, removed, or changed)
- **Files to be created:**
  - New partials: path ← JSX source
  - Page template: path
  - CSS file (if needed): path
  - JS file (if needed): path
- **Inlined components:** component name ← reason (leaf sub-component of X)
- **COMPONENTS.md entries that will be updated** and their new status

Present this as a concise list. Wait for the user to confirm or redirect before writing any files.

---

## Step 9 — Build

After plan approval:

1. **Create new partials first.** For each partial identified in Step 6, build it using the JSX `render()` output as the structural source and the extracted labels for text content. Reference `src/_includes/partials/<Group>/` for naming.

2. **Write the page template at `$TARGET_PATH`:**
   - Extend the appropriate layout
   - Set `permalink` and other frontmatter
   - The page shell (doctype, `<html>`, `<head>`, meganav, footer, `<main>` wrapper) comes from layouts — do NOT reproduce it from production markup
   - Place cleaned content into the appropriate `{% block %}` regions only
   - Include new partials via `{% include %}` rather than inlining their markup
   - Do NOT embed `<style>` or `<script>` tags anywhere in templates or partials

3. **CSS:** If page-specific styles are needed beyond what production CSS already provides, create `src/css/<name>.css` and reference it in `{% block pageCSS %}`.

4. **JS:** If page-specific scripts are needed, create `src/js/<name>.js` and reference it in `{% block pageJS %}`.

5. **Modal normalization:** Production pages use Bootstrap's `data-bs-toggle="modal"` / `data-bs-target` / `data-bs-dismiss` because they load Bootstrap JS. This project uses a custom `modal.js` instead. For every modal in the production markup:
   - Convert trigger links from `data-bs-toggle="modal"` + `data-bs-target="#id"` → `data-modal-target="#id"`
   - Replace the modal element markup with `{% include "components/modal.njk" %}` using the appropriate `modalId`, `modalModifier`, and `modalBody` variables
   - The `modal.njk` close button uses `.js-modal-close` — do not include `data-bs-dismiss` on close buttons
   - Modal elements must be included in the same template block where the triggers live, or in a dedicated `{% block modals %}` if the layout supports it — never omit them

---

## Step 10 — Update COMPONENTS.md

After a successful build, update `COMPONENTS.md`:

- For components that moved from **Not Started** to built: update status to **Covered** or **Partial** as appropriate, and add the mockup partial path in the table
- For components that moved from **Partial** to more complete: update to **Covered** if now faithful
- For any new rows needed (components not previously listed): add them

---

## Step 11 — Structural verification

After the build, verify structural fidelity against the production page.

Re-use the production HTML already fetched in Step 4 (or re-fetch if needed). Extract every CSS class referenced in the production page's `<main>` content area:

```bash
grep -oP '(?<=class=")[^"]+' <(curl -sL "$URL") | tr ' ' '\n' | sort -u
```

Then check which of those classes are absent from the built `.njk` file(s):

```bash
comm -23 <(production_classes) <(grep -oP '(?<=class=")[^"]+' built_file.njk | tr ' ' '\n' | sort -u)
```

For each missing class:
- **Structural** (layout, component, or BEM block/element class — e.g. `club-location__facility--length`): note as a gap and fix before proceeding to Step 12
- **Dynamic / noise** (React hydration, GTM, Sitecore, ad slots, `data-react*`): note as expected-absent and skip

Fix any structural gaps, then proceed.

---

## Step 12 — Report

Tell the user:
- Files created or modified, with paths
- Which COMPONENTS.md entries were updated and their new status
- Result of Step 11 structural check: classes fixed, classes expected-absent
