// scripts/detect-production-deploy.js
// Checks whether production has redeployed by reading the `?version=` query
// string production itself stamps onto every CSS/JS URL on every page (e.g.
// `usms.min.css?version=20260819.1`) — confirmed identical across multiple
// pages, so it's one global, site-wide deploy stamp, not per-file. No
// authentication needed and no Azure DevOps access required: this reads
// production's own self-reported version directly, which is a more direct
// signal for "did the deployed assets change" than either watching git
// commits (production/'s YAML pipelines only build+publish an artifact —
// actual deployment happens via an opaque Classic Release pipeline in the
// ADO portal) or querying that Release pipeline's API (accurate, but needs
// broader PAT scope and a manual definition-ID discovery step).
//
// Usage:
//   node scripts/detect-production-deploy.js
//   LAST_SEEN_VERSION=20260819.1 node scripts/detect-production-deploy.js
//
// Prints a JSON result to stdout. When run inside GitHub Actions (GITHUB_OUTPUT
// set), also writes changed/identifier/previous/status as step outputs.

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');

const PRODUCTION_URL = 'https://www.usms.org/';
const VERSION_RE = /\?version=([0-9.]+)/;

function detect() {
  const lastSeen = process.env.LAST_SEEN_VERSION || '';

  let html;
  try {
    html = execSync(`curl -sL --fail "${PRODUCTION_URL}"`, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 5 });
  } catch (err) {
    return { status: 'error', reason: `fetch failed: ${err.message}`, changed: false, identifier: lastSeen, previous: lastSeen };
  }

  const match = html.match(VERSION_RE);
  if (!match) {
    return { status: 'error', reason: 'version query string not found in production HTML', changed: false, identifier: lastSeen, previous: lastSeen };
  }

  const current = match[1];

  // No prior state (first run since this workflow was installed, or the repo
  // variable hasn't been set yet) — treat as changed so the user gets an
  // immediate baseline run instead of silently waiting for the next deploy.
  if (!lastSeen) {
    return { status: 'ok', changed: true, identifier: current, previous: null };
  }

  return { status: 'ok', changed: current !== lastSeen, identifier: current, previous: lastSeen };
}

const result = detect();
console.log(JSON.stringify(result, null, 2));

if (process.env.GITHUB_OUTPUT) {
  const lines = [
    `changed=${result.changed}`,
    `identifier=${result.identifier || ''}`,
    `previous=${result.previous || ''}`,
    `status=${result.status}`,
  ];
  fs.appendFileSync(process.env.GITHUB_OUTPUT, lines.join('\n') + '\n');
}

if (result.status === 'error') {
  console.warn(`::warning::Production deploy check inconclusive — ${result.reason}. Treating as no change; will retry next run.`);
}
