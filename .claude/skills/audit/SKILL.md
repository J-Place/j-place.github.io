---
name: audit
description: Bidirectional structural audit of a local Nunjucks page against its production JSX source. Finds both gaps (production has, we don't) and extras (we have, production doesn't), plus CSS override necessity checks.
argument-hint: [/path/to/page or partial name]
allowed-tools: Bash(find *) Bash(grep *) Bash(cat *) Read
---

You are running a bidirectional structural audit for the USMS mockup project.

Do NOT enter plan mode. Read files and report findings directly.

---

## Purpose

This skill catches two classes of drift that a one-directional audit misses:

| Direction | Example |
|---|---|
| **Gap** — production has it, we don't | Missing `list--nostyle` on `<ul>` |
| **Extra** — we have it, production doesn't | Double `form-group is-flex` on outer wrapper |

Both are treated as findings. Neither is inherently more important than the other.

---

## Ground rules (from mockup rules)

- **Production JSX `render()` is the structural source of truth.** Class names, element hierarchy, IDs, data attributes, and element types must match JSX unless there is a documented intentional deviation.
- **Production CSS is authoritative.** Local rules in `src/css/` are overrides and additions only. A local rule is only justified if the production stylesheet genuinely does not cover that case.
- **No embedded `<style>` or `<script>` blocks** in templates or partials — ever.
- **`public/` is stale and must never be used as a reference.**
- Intentional deviations (modal normalization, `initClubMap` callback pattern, Nominatim autocomplete, IP seeding, etc.) are expected differences — note them as intentional, not as gaps.

---

## Step 1 — Identify the files

From `$ARGUMENTS`, identify:

1. **Local Nunjucks files** — the page template and all partials it includes, plus any JS and CSS files specific to this page. Use:
   ```bash
   find src -name "*.njk" | xargs grep -l "<partial-name>\|<page-keyword>"
   ```

2. **Production JSX files** — search `production/src/App/views/` for the matching component(s):
   ```bash
   find production/src/App/views -name "*.jsx" | xargs grep -l "<keyword>"
   ```

Read every local Nunjucks file and every production JSX `render()` method involved.

---

## Step 2 — Bidirectional class audit

### 2a — Extract classes from production JSX

From each JSX `render()` method, collect every `className` value. Flatten compound expressions:
- `className="foo bar"` → `foo`, `bar`
- `` className={`foo ${condition ? 'bar' : 'baz'}`} `` → `foo`, `bar`, `baz` (all branches)
- `className={styles.foo}` → note as CSS-module (skip)

### 2b — Extract classes from local Nunjucks

From each `.njk` file, collect every `class="..."` value. Include both static markup and any JS renderer functions in the corresponding `src/js/` file (e.g. `renderClub()` in `clubs-filter.js`).

### 2c — Compare

**Gaps** (in production, absent from ours):
- List each missing class, the element it belongs to in JSX, and the likely location it should appear in our template.

**Extras** (in ours, absent from production):
- List each extra class, the element it appears on in our template, and whether it looks intentional (e.g. a mockup-only helper) or an error.

### 2d — Structural hierarchy check

Beyond individual classes, check the **nesting structure** of the three or four most complex sections of the page (e.g. filter columns, club list item, map container). Compare div depth and wrapper elements between JSX and Nunjucks. Flag any level that is present in one but absent in the other — this is where double-wrapper bugs like the `form-group is-flex` issue hide.

---

## Step 3 — Element and attribute audit

Check for these specific attributes in production JSX that are easy to miss:

- `id` attributes (especially on inputs and buttons — affects JS selectors)
- `name` attributes on form inputs
- `type` on buttons (`type="button"` vs. default submit)
- `autocomplete`, `maxlength`, `placeholder` on inputs
- `aria-*` attributes
- `data-*` attributes that drive JS behavior
- `disabled` on buttons in specific states

Report any that are present in production but missing from our templates.

---

## Step 4 — CSS override audit

Read the local CSS file(s) for this page (e.g. `src/css/Club/clubs.css`).

For each rule, assess:

- **Justified** — fills a genuine gap not covered by production CSS (e.g. a new UI element we added like `.club-map-new`, `.location-ac`)
- **Suspect** — overrides something production CSS likely already handles; may be masking a structural error rather than filling a real gap
- **`!important`** — flag every use; note whether it is fighting a specificity battle that a structural fix would resolve

---

## Step 5 — JS selector audit

Read the page's JS file (e.g. `src/js/clubs-filter.js`).

Check every `querySelector` / `getElementById` / `querySelectorAll` selector against the current Nunjucks markup. Flag any selector that targets a class or ID that doesn't exist in the template, or that has drifted from the production element it was modeled on.

---

## Step 6 — Report

Structure the report as four sections. Be specific: include the class name, element, file, and line reference for every finding.

### Gaps
Production has → we don't. For each:
- Class / attribute / element
- Where in production JSX (file + approximate line)
- Where it should appear in our template

### Extras
We have → production doesn't. For each:
- Class / attribute / element
- Where in our template
- Assessment: **intentional deviation** | **likely error** | **needs investigation**

### CSS overrides
For each local rule:
- Selector + property
- Assessment: **justified** | **suspect** | **uses !important (note why)**

### JS selector drift
For each mismatched selector:
- Selector string
- What it targets vs. what the template actually has

### Summary verdict
One of:
- **Clean** — no structural findings
- **Minor** — only cosmetic or content differences
- **Needs fixes** — list the actionable items
