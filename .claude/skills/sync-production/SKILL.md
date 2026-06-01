---
name: sync-production
description: Clone or pull the USMS Sitecore production repo into production/ so the mockup skill has up-to-date JSX and TDS files.
allowed-tools: Bash(git *) Bash(echo *) Bash(rm *) Bash(mv *)
---

You are syncing the USMS production Sitecore repo into `production/` for use by the mockup skill.

The repo URL is: `https://dev.azure.com/usms-devops/Usms%20Sitecore/_git/Usms-Sitecore`
The PAT is read from the env var `AZURE_DEVOPS_PAT`.

---

## Step 1 — Check prerequisites

Run:
```bash
echo ${AZURE_DEVOPS_PAT:0:5}
```

If the output is blank or fewer than 5 characters, stop and tell the user:
> `AZURE_DEVOPS_PAT` is not set. Run `source ~/.zshrc` or open a new terminal and try again.

---

## Step 2 — Check production/ state

Run:
```bash
git -C production remote get-url origin 2>/dev/null || echo "no-remote"
```

- If the URL contains `dev.azure.com/usms-devops` → the remote is correct, go to **Step 3 (pull)**.
- Otherwise (wrong remote, no remote, or directory missing) → go to **Step 4 (fresh clone)**.

---

## Step 3 — Pull (remote already correct)

Run:
```bash
git -C production pull --ff-only
```

Report the result: last commit hash, author, date, and commit message. If already up to date, say so. Done.

---

## Step 4 — Fresh clone

The `production/` directory exists but has the wrong remote (or is missing). Do a fresh clone.

**4a.** Remove the stale directory:
```bash
rm -rf production/
```

**4b.** Clone using the PAT. Use a shallow clone (`--depth=1`) to avoid pulling full history:
```bash
git clone --depth=1 \
  "https://pat:${AZURE_DEVOPS_PAT}@dev.azure.com/usms-devops/Usms%20Sitecore/_git/Usms-Sitecore" \
  production/
```

**4c.** Strip the PAT from the stored remote URL so it isn't saved in `.git/config`:
```bash
git -C production remote set-url origin \
  "https://dev.azure.com/usms-devops/Usms%20Sitecore/_git/Usms-Sitecore"
```

**4d.** Verify `production/src` exists:
```bash
ls production/src
```

If it doesn't exist, report the error output from the clone step and stop.

---

## Step 5 — Report

Tell the user:
- Whether this was a pull or a fresh clone
- Last commit: hash, author, date, message
- Path confirmed: `production/src/App/` exists (yes/no)
