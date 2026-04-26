// scripts/snapshot.js
// Builds a single-page immutable snapshot and vendors local CSS/JS alongside it.
//
// Usage:
//   node scripts/snapshot.js --name=my-snapshot --page=/path/to/page
//   npm run build:snapshot --name=my-snapshot --page=/path/to/page

'use strict';

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

// ── Parse args ────────────────────────────────────────────────────────────────
// Supports both `node snapshot.js --name=foo --page=/bar` and npm config vars.

const cliArgs = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => a.replace(/^--/, '').split('='))
);

const name = cliArgs.name || process.env.npm_config_name;
const page = cliArgs.page || process.env.npm_config_page;

if (!name || !page) {
  console.error('Usage: node scripts/snapshot.js --name=<name> --page=</path/to/page>');
  console.error('Example: node scripts/snapshot.js --name=pool-lookup-v1 --page=/events/event-central/usms-measured-pools');
  process.exit(1);
}

// ── Paths ──────────────────────────────────────────────────────────────────────

const root        = path.resolve(__dirname, '..');
const devJsonPath = path.join(root, 'src/_data/dev.json');
const siteDir     = path.join(root, '_site');
const outDir      = path.join(root, 'dist/snapshots', name);

// Resolve page path → _site subdirectory
// e.g. /events/event-central/usms-measured-pools → _site/events/event-central/usms-measured-pools
const normalizedPage = page.replace(/^\//, '').replace(/\/$/, '');
const pageSiteDir    = path.join(siteDir, normalizedPage);

// ── Helpers ────────────────────────────────────────────────────────────────────

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

// ── Build ──────────────────────────────────────────────────────────────────────

const devJson    = JSON.parse(fs.readFileSync(devJsonPath, 'utf8'));
const wasDevMode = devJson.env !== 'prod';

if (wasDevMode) {
  fs.writeFileSync(devJsonPath, JSON.stringify({ env: 'prod' }, null, 2));
  console.log('Temporarily switched dev.json → prod');
}

try {
  console.log(`\nBuilding site...`);
  execSync('npm run build', { cwd: root, stdio: 'inherit' });

  if (!fs.existsSync(pageSiteDir)) {
    throw new Error(
      `Page not found in build output: ${pageSiteDir}\n` +
      `Check that --page matches the page's permalink (without trailing slash).`
    );
  }

  // ── Extract and vendor ───────────────────────────────────────────────────────

  console.log(`\nPackaging snapshot "${name}"...`);

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  // Copy the page's HTML (index.html and any sub-pages)
  copyDir(pageSiteDir, outDir);

  // Vendor local CSS and JS so they're frozen with this snapshot
  copyDir(path.join(siteDir, 'css'), path.join(outDir, 'css'));
  copyDir(path.join(siteDir, 'js'),  path.join(outDir, 'js'));

  console.log(`\nSnapshot ready: dist/snapshots/${name}`);
  console.log(`\nDeploy with:`);
  console.log(`  netlify deploy --dir=dist/snapshots/${name} --alias=${name}`);

} finally {
  if (wasDevMode) {
    fs.writeFileSync(devJsonPath, JSON.stringify(devJson, null, 2));
    console.log('\nRestored dev.json');
  }
}
