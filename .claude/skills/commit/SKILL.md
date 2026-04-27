---
name: commit
description: Review all uncommitted changes, group them into logical commits with meaningful messages, and commit each group immediately. Use this when the user has accumulated changes across multiple files and wants them organized into clean, intentional commits.
allowed-tools: Bash(git *) Read
---

You are organizing uncommitted changes into logical git commits for the USMS mockup project.

## Step 1 — Assess current state

Run these in parallel:
- `git status` — list all modified, added, and deleted files
- `git diff` — see unstaged changes
- `git diff --cached` — see staged changes
- `git log --oneline -5` — see recent commit style for this repo

If there is nothing to commit, tell the user and stop.

## Step 2 — Analyze and group

Read any changed files you need to understand what the changes actually do. Then group the changes into logical commits — each group should represent one coherent unit of work.

Rules for grouping:
- Changes to the same feature or concern belong together
- Documentation/registry updates that accompany a code change belong in the same commit
- Skill files (`.claude/skills/`) can be grouped together or with the feature they support
- Config changes (package.json, netlify.toml, .gitignore) belong with the feature they enable, not in a catch-all

## Step 3 — Commit each group

For each group, stage only those specific files and commit:

```
git add <file1> <file2> ...
git commit -m "<message>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

Do not use `git add .` or `git add -A` — always stage specific files.

After all commits, run `git log --oneline -5` and show the user the result.

## Step 5 — Offer to push

Ask: "Push to origin?"

Only push if the user confirms.
