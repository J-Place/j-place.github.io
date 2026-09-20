// scripts/vendor-refresh.js
// The only vendoring script meant to run unattended/repeatedly (from
// .github/workflows/production-watch.yml, gated on a detected production
// deploy). Reads scripts/vendor-manifest.json, re-fetches every recorded
// URL into src/vendor/{css,js}/, and bumps the ?v=<version> cache-busting
// query string in every referencing template to match.
//
// A failed fetch for one asset does NOT fail the whole run — it logs a
// warning, leaves the previously-vendored file untouched (stale beats
// missing), and is tallied in the final summary. Content that doesn't look
// like real CSS/JS (e.g. a bot-block/error HTML page returned with a 200) is
// rejected the same way, via lib/vendor-assets.js's heuristic check.
//
// Usage:
//   node scripts/vendor-refresh.js
//   ASSET_VERSION=20260819.1 node scripts/vendor-refresh.js   (skip the live fetch for the version)

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { vendorCssFile, vendorJsFile } = require('./lib/vendor-assets');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'scripts', 'vendor-manifest.json');
const vendorRoot = path.join(root, 'src', 'vendor');

function currentProductionVersion() {
  if (process.env.ASSET_VERSION) return process.env.ASSET_VERSION;
  const html = execSync('curl -sL --fail "https://www.usms.org/"', { encoding: 'utf8', maxBuffer: 1024 * 1024 * 5 });
  const match = html.match(/\?version=([0-9.]+)/);
  if (!match) throw new Error('Could not determine current production version (set ASSET_VERSION to skip the live check)');
  return match[1];
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const newVersion = currentProductionVersion();
const oldVersion = manifest._meta.lastVendoredVersion;

let succeeded = 0;
let failed = 0;
const failures = [];

for (const [url, entry] of Object.entries(manifest.urls)) {
  const destDir = path.join(vendorRoot, entry.type);
  const localName = entry.type === 'css' ? vendorCssFile(url, destDir) : vendorJsFile(url, destDir);
  if (localName) {
    succeeded += 1;
  } else {
    failed += 1;
    failures.push(url);
  }
}

// Bump the cache-busting query string in every referencing template — only
// the version suffix changes, never the path, so this is a narrow, fully
// scripted edit rather than the kind of hand-maintained template churn the
// manifest-driven design exists to avoid.
if (oldVersion && oldVersion !== newVersion) {
  const byFile = new Map();
  for (const entry of Object.values(manifest.urls)) {
    for (const relFile of entry.files) {
      if (!byFile.has(relFile)) byFile.set(relFile, new Set());
      byFile.get(relFile).add(entry.localPath);
    }
  }
  for (const [relFile, localPaths] of byFile) {
    const filePath = path.join(root, relFile);
    let content = fs.readFileSync(filePath, 'utf8');
    for (const localPath of localPaths) {
      const escaped = localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp(`${escaped}\\?v=${oldVersion}`, 'g'), `${localPath}?v=${newVersion}`);
    }
    fs.writeFileSync(filePath, content);
  }
}

manifest._meta.lastVendoredVersion = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

const summary = `Vendor refresh (${oldVersion || 'unset'} → ${newVersion}): ${succeeded} succeeded, ${failed} failed`
  + (failures.length ? `\nFailed: ${failures.join(', ')}` : '');
console.log(summary);

if (failed > 0) {
  console.warn(`::warning::${failed} asset(s) failed to refresh — previous versions retained. See list above.`);
}

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `failed_count=${failed}\nsucceeded_count=${succeeded}\n`);
}
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n${summary}\n`);
}
