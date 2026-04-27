---
name: snapshot
description: Build and deploy an immutable snapshot of a prototype page to Netlify, then update snapshot-registry.json. Use this when delivering a finished page as a permanent Netlify URL.
argument-hint: [/path/to/page]
allowed-tools: Bash(npm run deploy:snapshot*) Bash(git *) Read Write Edit
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

## Step 2 — Capture current branch

Run:
```
git branch --show-current
```

Record the branch name for the registry entry.

---

## Step 3 — Run the deploy

Run the deploy script, capturing all output:

```
npm run deploy:snapshot -- --page=<page-path> [--dev] --deploy
```

Include `--dev` only if the flag was set in Step 1.

Wait for the command to complete. The Netlify CLI will print a deploy URL in the format:
```
Website URL:  https://<name>--usms-mockup.netlify.app
```

Extract:
- The **alias name** (the `<name>` segment before `--mockup`)
- The **full URL**

If the command fails, stop and show the error to the user. Do not continue to the registry step.

---

## Step 4 — Update snapshot-registry.json

Read the current contents of `snapshot-registry.json`.

Add a new entry using the alias name as the key:

```json
"<alias-name>": {
  "page": "<page-path>",
  "url": "<full-url>",
  "date": "<today's date as YYYY-MM-DD>",
  "branch": "<branch name from Step 2>"
}
```

Write the updated file. Do not remove existing entries.

---

## Step 6 — Report

Tell the user:
- The permanent URL
- The registry key that was written
