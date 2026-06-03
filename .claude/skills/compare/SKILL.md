---
name: compare
description: Bidirectional structural diff between two local mockup pages. Finds class, attribute, and hierarchy differences without a production source of truth.
argument-hint: [path-a] [path-b]
allowed-tools: Read Bash
---

You are doing a structural comparison of two local mockup pages in the USMS Eleventy project.

Do NOT enter plan mode. Read the files and report findings directly.

Neither page is authoritative — differences are reported neutrally. The goal is to surface structural drift, not assign blame.

---

## Step 1 — Identify files

Parse `$ARGUMENTS` as two page paths (e.g. `/lmsc/general-committee/` and `/about/contact-us`). If either is missing, ask the user for them before proceeding.

For each path, locate:
- The page `.njk` file under `src/pages/` (match by permalink or directory/filename)
- All partials it includes via `{% include "..." %}` — read them recursively
- Any page-specific JS in `src/js/` and CSS in `src/css/` that the page references

Read every file identified for both pages. Label them **Page A** and **Page B** throughout the report.

---

## Step 2 — Bidirectional class comparison

Extract every `class="..."` value from each page's full template tree (page file + all included partials). Split compound class strings into individual tokens.

Build three lists:
- **Only in A** — classes present in A's tree but not B's
- **Only in B** — classes present in B's tree but not A's
- **Shared** — classes present in both (no action needed; confirm as consistent)

For each class in "Only in A" and "Only in B", note the element it appears on and the file/partial where it lives.

---

## Step 3 — Structural hierarchy comparison

Pick the three or four most structurally significant sections of each page (e.g. the form container, the main content wrapper, a list item, a header block). Compare div depth and wrapper element sequence between A and B.

Flag any level that is present in one but absent in the other — this is where missing wrapper bugs and extra nesting accumulate.

---

## Step 4 — Attribute comparison

For equivalent elements across the two pages, check for divergence in:
- `data-*` attributes (especially `data-val`, `data-sc-field-key`, `data-valmsg-for`)
- `aria-*` attributes
- `id` on inputs, forms, and interactive elements
- `name` on form inputs
- `type` on buttons and inputs

Report attributes present on an element in one page but missing from the equivalent element in the other.

---

## Step 5 — Report

Structure the report as five sections. Be specific: include the class name or attribute, the element, and the file + partial for every finding.

### Only in A
Classes, attributes, or structural elements present in Page A but not Page B.

### Only in B
Classes, attributes, or structural elements present in Page B but not Page A.

### Structural divergence
Nesting or wrapper differences between the two pages.

### Attribute differences
Attributes present on equivalent elements in one page but absent in the other.

### Summary verdict
One of:
- **Consistent** — no meaningful structural differences
- **Minor drift** — small cosmetic or content differences only
- **Structural differences** — list actionable items
