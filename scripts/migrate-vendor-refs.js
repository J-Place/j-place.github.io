// scripts/migrate-vendor-refs.js
// Reads scripts/vendor-manifest.json and rewrites each recorded template to
// reference the local vendored path instead of the live production URL —
// appending the current production version as a cache-busting query string
// (?v=<version>), e.g. /vendor/css/www.usms.org-usms.min.css?v=20260819.1.
//
// Deliberately separate from discover-vendor-urls.js so a human can review
// the manifest diff before this rewrite happens. Run once against the full
// manifest now; re-run (or hand-run for just the new entry) whenever
// discovery finds a URL introduced by a new page.
//
// This does NOT fetch/vendor the files themselves — run `npm run
// vendor:refresh` (or migrate first, then refresh) to actually populate
// src/vendor/. Also does not need network access itself, except to learn the
// current production version for the query string (same check
// detect-production-deploy.js does) unless --version=<x> is passed.
//
// Usage:
//   node scripts/migrate-vendor-refs.js
//   node scripts/migrate-vendor-refs.js --version=20260819.1   (skip the live fetch)

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'scripts', 'vendor-manifest.json');

const versionArg = process.argv.find((a) => a.startsWith('--version='));

function currentProductionVersion() {
  if (versionArg) return versionArg.split('=')[1];
  const html = execSync('curl -sL --fail "https://www.usms.org/"', { encoding: 'utf8', maxBuffer: 1024 * 1024 * 5 });
  const match = html.match(/\?version=([0-9.]+)/);
  if (!match) throw new Error('Could not determine current production version (pass --version=<x> to skip the live check)');
  return match[1];
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = currentProductionVersion();

let filesChanged = 0;
let refsChanged = 0;

// Group replacements by file so each file is only read/written once even
// though multiple URLs may point at the same template.
const byFile = new Map();
for (const [url, entry] of Object.entries(manifest.urls)) {
  const localRef = `${entry.localPath}?v=${version}`;
  for (const relFile of entry.files) {
    if (!byFile.has(relFile)) byFile.set(relFile, []);
    byFile.get(relFile).push([url, localRef]);
  }
}

for (const [relFile, replacements] of byFile) {
  const filePath = path.join(root, relFile);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileChanged = false;
  for (const [url, localRef] of replacements) {
    // Match the URL inside a quoted attribute so a bare substring elsewhere
    // (e.g. in a comment mentioning the URL) isn't touched.
    const quoted = new RegExp(`(["'])${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`, 'g');
    const before = content;
    content = content.replace(quoted, (m, q) => `${q}${localRef}${q}`);
    if (content !== before) {
      fileChanged = true;
      refsChanged += 1;
    }
  }
  if (fileChanged) {
    fs.writeFileSync(filePath, content);
    filesChanged += 1;
  }
}

manifest._meta.lastVendoredVersion = version;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

console.log(`Migrated ${refsChanged} reference(s) across ${filesChanged} file(s) to production version ${version}.`);
console.log('Run `npm run vendor:refresh` next to actually populate src/vendor/ with the fetched files.');
