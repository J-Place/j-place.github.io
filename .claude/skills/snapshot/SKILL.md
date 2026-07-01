---
name: snapshot
description: Build and deploy an immutable snapshot of a prototype page to Netlify, then update snapshot-registry.json. Use this when delivering a finished page as a permanent Netlify URL.
argument-hint: [/path/to/page]
allowed-tools: Bash(npm run deploy:snapshot*) Bash(netlify deploy*) Bash(git *) Read Write Edit
---

You are running the snapshot deployment workflow for the USMS mockup project.

## What this skill does

1. Determines the target page path
2. Runs `npm run deploy:snapshot` to build and deploy to Netlify
3. Reads the resulting deploy URL from CLI output
4. Updates `snapshot-registry.json` with the new entry

---

## Step 1 — Determine the page path and dev flag

If `$ARGUMENTS` contains a value, parse it for:
- A page path (starts with `/`) → use as `--page` argument
- The flag `--dev` → pass `--dev` to the deploy command (builds with dev overlays active)

If no page path is found in `$ARGUMENTS`, ask the user:
> "Which page should I snapshot? Provide the page path (e.g. `/events/event-central/usms-measured-pools`)"

Wait for the user's response before continuing.

---

## Step 1b — Short alias for article pages

If the page path contains `/articles-and-videos/articles/`, ask the user:

> "Article page paths produce long Netlify aliases that can exceed the 63-character DNS limit. Provide a short alias for this snapshot (e.g. `training-plan-css-260701`), or leave blank to use the auto-generated one:"

If the user provides a value, store it as `<custom-alias>`. If blank, proceed without a custom alias.

---

## Step 2 — Capture current branch

Run:
```
git branch --show-current
```

Record the branch name for the registry entry.

---

## Step 3 — Run the deploy

### If a custom alias was provided (Step 1b):

Run the build and package step **without** deploying:

```
npm run deploy:snapshot -- --page=<page-path> [--dev]
```

From the output, extract the auto-generated dist folder name from the line:
```
Packaging snapshot "<dist-name>"...
```

Then deploy manually with the custom alias:

```
netlify deploy --alias=<custom-alias> --dir=dist/snapshots/<dist-name>
```

Extract the full URL from the `Draft URL:` line in the output.

### If no custom alias:

Run the deploy script with the `--deploy` flag:

```
npm run deploy:snapshot -- --page=<page-path> [--dev] --deploy
```

Extract the full URL from the `Draft URL:` line in the output.

---

If either command fails, stop and show the error to the user. Do not continue to the registry step.

---

## Step 4 — Update snapshot-registry.json

Read the current contents of `snapshot-registry.json`.

The registry key is:
- `<custom-alias>` if one was provided in Step 1b
- Otherwise the auto-generated dist folder name from Step 3

Add a new entry:

```json
"<key>": {
  "page": "<page-path>",
  "url": "<full-url>",
  "date": "<today's date as YYYY-MM-DD>",
  "branch": "<branch name from Step 2>"
}
```

Write the updated file. Do not remove existing entries.

---

## Step 5 — Report

Tell the user:
- The permanent URL
- The registry key that was written
- The index page auto-generates from `snapshot-registry.json`, so no `/link-snapshot` step is needed
