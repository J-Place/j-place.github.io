// scripts/discover-vendor-urls.js
// Scans src/**/*.njk for production CSS/JS URLs that should be vendored
// locally (see CLAUDE.md's vendoring policy), and writes/updates the
// committed scripts/vendor-manifest.json: url -> { type, localPath, files }.
//
// Re-run whenever a new page (e.g. via the /mockup skill) introduces a new
// production URL. Deliberately separate from migrate-vendor-refs.js so a
// human can review the manifest diff before the template rewrite happens.
//
// Usage: node scripts/discover-vendor-urls.js  (npm run vendor:discover)

'use strict';

const fs = require('fs');
const path = require('path');
const { localNameFor } = require('./lib/vendor-assets');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const manifestPath = path.join(root, 'scripts', 'vendor-manifest.json');

// In-scope hosts/paths only: production's own compiled CSS/JS. Explicitly
// excludes third-party CDN libraries (jquery, bootstrap.js, Font Awesome —
// never change on a USMS deploy, vendoring them is pointless churn) and all
// <img src="www.usms.org/...">  references (existing, deliberate, unrelated
// "images stay live" policy — see CLAUDE.md's Snapshot CSS vendoring note).
const CSS_RE = /href="(https:\/\/www\.usms\.org\/styles\/[^"]+\.css)"/g;
const JS_RE = /src="(https:\/\/(?:www\.usms\.org\/scripts|usms-cdn\.azureedge\.net\/scripts)\/[^"]+\.js)"/g;

function walk(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else if (entry.name.endsWith('.njk')) files.push(p);
  }
  return files;
}

function stripQuery(url) {
  return url.split('?')[0];
}

// Preserve _meta (tracks the last vendored production version, used by
// migrate-vendor-refs.js and vendor-refresh.js for cache-busting query
// strings) across re-runs — discovery only regenerates the `urls` map.
let existingMeta = { lastVendoredVersion: null };
if (fs.existsSync(manifestPath)) {
  try {
    const existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (existing._meta) existingMeta = existing._meta;
  } catch {
    // Corrupt/old-format manifest — start fresh rather than fail discovery.
  }
}

const templateFiles = walk(srcDir, []);
const manifest = {};

for (const file of templateFiles) {
  const relFile = path.relative(root, file);
  // Strip Nunjucks comment blocks first — a URL referenced only inside
  // {# ... #} (dead/commented-out markup, e.g. the two mastersAddons.min.js
  // refs in account/addons.njk and addons-ncc.njk) isn't actually live and
  // shouldn't be vendored.
  const content = fs.readFileSync(file, 'utf8').replace(/\{#[\s\S]*?#\}/g, '');

  for (const [re, type, subdir] of [[CSS_RE, 'css', 'css'], [JS_RE, 'js', 'js']]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(content))) {
      const url = stripQuery(m[1]);
      if (!manifest[url]) {
        manifest[url] = {
          type,
          localPath: `/vendor/${subdir}/${localNameFor(url, type === 'css' ? 'style.css' : 'script.js')}`,
          files: [],
        };
      }
      if (!manifest[url].files.includes(relFile)) {
        manifest[url].files.push(relFile);
      }
    }
  }
}

const sortedUrls = Object.fromEntries(
  Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
);

const output = { _meta: existingMeta, urls: sortedUrls };
fs.writeFileSync(manifestPath, JSON.stringify(output, null, 2) + '\n');
console.log(`Wrote ${Object.keys(sortedUrls).length} URL(s) to ${path.relative(root, manifestPath)}`);
