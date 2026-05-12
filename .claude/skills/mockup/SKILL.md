---
name: mockup
description: Build a mockup of a production USMS page. Accepts a live URL or pasted HTML. Fetches source, strips production noise, diffs against any existing local version, asks for the target file path, then builds.
argument-hint: [https://www.usms.org/... | paste markup below]
allowed-tools: WebFetch Bash(find *) Bash(grep *) Read Write Edit
---

You are running the production page mockup workflow for the USMS mockup project.

## What this skill does

Walks through the full "Building Production Page Mockups" process defined in CLAUDE.md:
1. Obtains the production HTML (fetch or paste)
2. Determines the target file path in the repo
3. Strips production-only noise
4. Diffs against any existing local version
5. Reports the plan and waits for confirmation before writing anything

---

## Step 1 — Ask for the target file path

Ask the user:
> "What file path should I create in the repo? (e.g. `src/pages/swimmer-magazine/index.njk`)"

Wait for the answer. Store it as `$TARGET_PATH`.

---

## Step 2 — Obtain the production HTML

Check `$ARGUMENTS`:

- **If `$ARGUMENTS` starts with `http`** — fetch it automatically:
  ```
  WebFetch(url: $ARGUMENTS)
  ```
  Confirm to the user: "Fetched `<url>` — `<N>` bytes."

- **If `$ARGUMENTS` is empty or is not a URL** — ask the user:
  > "Paste the production HTML below and send it when ready."
  Wait for the user to paste markup before continuing.

Store the raw HTML as `$SOURCE_HTML`.

---

## Step 3 — Check for an existing local file

Run:
```
find src -name "<filename from $TARGET_PATH>" 2>/dev/null
```

- **If a file exists at `$TARGET_PATH`:** Read it. Note that a diff will follow.
- **If no file exists:** Note that this is a net-new page.

---

## Step 4 — Strip production-only noise

From `$SOURCE_HTML`, identify and plan to remove:
- Google Tag Manager — `<noscript><iframe src="//www.googletagmanager.com/...">` and GTM `<script>` blocks
- Pingdom RUM — `<script>` blocks referencing `rum-static.pingdom.net`
- Facebook SDK — `<script>` blocks referencing `connect.facebook.net`
- Google Ad Manager / DFP — `googletag` script blocks and slot `<div>`s
- Sitecore server/build HTML comments — `<!-- /Sitecore/...-->`, `<!-- #BeginTemplate -->`, `<!-- #EndEditable -->`
- React hydration attributes — `data-reactid`, `data-reactroot`, `data-react-checksum`
- Production inline `<style>` patch blocks added by the CMS at render time

List what you found and will strip.

---

## Step 5 — Diff against existing file (if one exists)

If an existing local file was found in Step 3, compare the cleaned production HTML against it and report:
- Structural sections present in production but missing locally
- Structural sections present locally but not in production
- Notable class or attribute differences

Keep the diff summary concise — call out meaningful differences only, not whitespace or comment noise.

---

## Step 6 — Report plan and confirm

Before writing anything, tell the user:

- Target path: `$TARGET_PATH`
- Production noise stripped: [list]
- Diff summary (if applicable): [list]
- New CSS file: `src/css/<page-or-component>.css` (if page-specific styles are needed)
- New JS file: `src/js/<page-or-component>.js` (if page-specific scripts are needed)
- Layout to extend (best guess from page type)

Then ask:
> "Ready to build? Any adjustments before I start?"

Wait for confirmation before writing any files.

---

## Step 7 — Build the mockup

After confirmation:

1. Write the Nunjucks page template at `$TARGET_PATH`:
   - Extend the appropriate layout
   - Set `permalink` and other frontmatter
   - Adapt the cleaned production HTML into Nunjucks blocks
   - Keep the custom dropdown or other interactive components from the local codebase where they exist
   - Do NOT embed `<style>` or `<script>` tags in the page template

2. If page-specific styles are needed, create `src/css/<name>.css` and reference it in `{% block pageCSS %}`.

3. If page-specific scripts are needed, create `src/js/<name>.js` and reference it in `{% block pageJS %}`.

4. Reference any new CSS/JS files in the page template's `{% block pageCSS %}` / `{% block pageJS %}` blocks — never inline styles or scripts in the template body.

---

## Step 8 — Report

Tell the user what was created or modified, with file paths.
