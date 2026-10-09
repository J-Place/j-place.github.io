// scripts/check-asset-hosts.js
// Post-build check: collects every external host the built site loads resources from (img/script
// src, srcset, <link> href, CSS url(...)) and fails if any of them no longer resolves in DNS.
// Catches a dead CDN/media host across every page at once — e.g. usms-cdn.azureedge.net going
// away on 2026-10-08, which otherwise only surfaced where a visual-regression screenshot happened
// to include a broken image.
//
// Only checks that each host resolves, not that each URL returns 200 — fast, and it's the failure
// mode that takes out a whole host. Plain <a href> links aren't checked (outbound links to club
// websites etc. aren't resources the page depends on). JS files aren't scanned.
//
// Known dead hosts that can't be fixed locally (e.g. referenced by vendored production CSS, which
// is overwritten on every vendor refresh) are acknowledged in scripts/asset-hosts-known-dead.json,
// scoped to path prefixes under _site/ — a new reference anywhere else still fails.
//
// Runs as part of `npm run build` (postbuild). Usage: node scripts/check-asset-hosts.js [siteDir]

'use strict';

const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

const SITE_DIR = path.resolve(process.argv[2] || '_site');
const KNOWN_DEAD = require('./asset-hosts-known-dead.json');

// Playwright report bundles — generated test output, not site resources
const SKIP_DIRS = ['reports'];
const SCAN_EXTS = new Set(['.html', '.css']);
// Resolved first; if this fails we're offline (or DNS is down), so skip rather than fail
const CANARY_HOST = 'www.usms.org';
const CONCURRENCY = 16;

const RESOURCE_PATTERNS = [
  // src, srcset, data-src, poster attributes
  /\b(?:src|srcset|data-src|data-srcset|poster)\s*=\s*["']([^"']+)["']/gi,
  // <link ... href="..."> (stylesheets, preloads, icons)
  /<link\b[^>]*?\bhref\s*=\s*["']([^"']+)["']/gi,
  // CSS url(...), in stylesheets and style attributes
  /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi,
];
const HOST_RE = /(?:https?:)?\/\/([a-z0-9][a-z0-9.-]*\.[a-z]{2,})(?=[/:?#]|$)/gi;

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === SITE_DIR && SKIP_DIRS.includes(entry.name)) continue;
      walk(full, out);
    } else if (SCAN_EXTS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

// host -> Set of _site-relative file paths that reference it
function collectHosts(files) {
  const hosts = new Map();
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(SITE_DIR, file);
    for (const pattern of RESOURCE_PATTERNS) {
      for (const match of text.matchAll(pattern)) {
        for (const hostMatch of match[1].matchAll(HOST_RE)) {
          const host = hostMatch[1].toLowerCase();
          if (!hosts.has(host)) hosts.set(host, new Set());
          hosts.get(host).add(rel);
        }
      }
    }
  }
  return hosts;
}

async function resolves(host) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await dns.lookup(host);
      return { ok: true };
    } catch (err) {
      if (attempt === 0) await new Promise((r) => setTimeout(r, 1000));
      else return { ok: false, code: err.code };
    }
  }
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function isAcknowledged(host, file) {
  return KNOWN_DEAD.some((entry) =>
    entry.host === host && entry.paths.some((prefix) => file.startsWith(prefix)));
}

async function main() {
  if (!fs.existsSync(SITE_DIR)) {
    console.error(`check-asset-hosts: ${SITE_DIR} not found — run the build first.`);
    process.exit(1);
  }

  if (!(await resolves(CANARY_HOST)).ok) {
    console.warn(`check-asset-hosts: couldn't resolve ${CANARY_HOST} — looks offline, skipping check.`);
    return;
  }

  const hosts = collectHosts(walk(SITE_DIR, []));
  const names = [...hosts.keys()].sort();
  const results = await mapLimit(names, CONCURRENCY, resolves);

  const failures = [];
  const acknowledged = [];
  const unchecked = [];
  names.forEach((host, i) => {
    const result = results[i];
    if (result.ok) return;
    const files = [...hosts.get(host)].sort();
    // ENOTFOUND is a definitive "no such host"; anything else (timeouts, SERVFAIL) is inconclusive
    if (result.code !== 'ENOTFOUND') {
      unchecked.push({ host, code: result.code });
      return;
    }
    const unacked = files.filter((f) => !isAcknowledged(host, f));
    if (unacked.length) failures.push({ host, files: unacked });
    else acknowledged.push({ host, count: files.length });
  });

  console.log(`check-asset-hosts: ${names.length} external resource hosts checked.`);
  acknowledged.forEach(({ host, count }) =>
    console.log(`  known dead (acknowledged): ${host} — ${count} file(s)`));
  unchecked.forEach(({ host, code }) =>
    console.warn(`  couldn't check ${host} (${code}) — not failing the build for it`));

  if (failures.length) {
    console.error('\ncheck-asset-hosts: these hosts no longer resolve in DNS:');
    for (const { host, files } of failures) {
      console.error(`\n  ${host} — referenced in ${files.length} file(s):`);
      files.forEach((f) => console.error(`    ${f}`));
    }
    console.error('\nPoint those references at a live host, or — if they can\'t be fixed locally —');
    console.error('acknowledge them in scripts/asset-hosts-known-dead.json (scoped to the paths involved).');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
