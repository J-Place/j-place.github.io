---
name: link-snapshot
description: Add a link to a snapshot on the Eleventy site index page (src/pages/index.njk). Run after /snapshot to register the deploy URL in the index.
argument-hint: [alias-name]
allowed-tools: Bash(git *) Read Write Edit
---

You are adding a snapshot link to the USMS mockup index page.

## Step 1 — Determine the alias

If `$ARGUMENTS` contains a value, use it as the alias name (e.g. `addons-260427`).

If `$ARGUMENTS` is empty, read `snapshot-registry.json` and use the first key (most recently added entry) as the alias.

## Step 2 — Look up the snapshot

Read `snapshot-registry.json`. Find the entry matching the alias. Extract:
- `page` — the page path (e.g. `/account/addons`)
- `url` — the full Netlify URL
- `date` — the date string (YYYY-MM-DD)

## Step 3 — Get the page title

The page path maps to a `.njk` source file under `src/pages/`. For example:
- `/account/addons` → `src/pages/account/addons.njk`
- `/events/event-central/usms-measured-pools` → `src/pages/events/event-central/usms-measured-pools.njk`

Read the frontmatter of that file. Use `pageTitle` if present, otherwise fall back to `title` (stripping any ` | U.S. Masters Swimming` suffix).

## Step 4 — Format the link text

Format the date from YYYY-MM-DD to MM/DD/YY (e.g. `2026-04-27` → `04/27/26`).

Link text: `<pageTitle> <MM/DD/YY>` (e.g. `Add-Ons and Upgrades 04/27/26`)

## Step 5 — Insert the link into index.njk

Read `src/pages/index.njk`.

First, check whether any existing `<li>` in the file contains an `href` that includes the page's path (e.g. a Netlify URL containing `usms-measured-pools`). Use the last segment(s) of the page path as the match pattern — enough to uniquely identify the page.

- **If a matching `<li>` is found:** Insert the new `<li>` immediately before the first matching one. This groups all snapshots for the same page together, newest first.
- **If no match is found:** Insert the new `<li>` immediately before the `<!-- snapshot-links -->` comment.

The new `<li>` format in both cases:

```html
          <li style="padding: 3px 0; font-size: 15px;"><a href="<url>"><link text></a></li>
```

Write the updated file.

## Step 6 — Report

Tell the user the link text and URL that were added.
