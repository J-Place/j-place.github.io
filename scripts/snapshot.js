// scripts/snapshot.js
// Builds a single-page immutable snapshot, vendors local CSS/JS alongside it,
// and optionally deploys to Netlify with a permanent alias URL.
//
// Usage:
//   node scripts/snapshot.js --page=/path/to/page [--name=my-name] [--deploy]
//   npm run build:snapshot --page=/events/event-central/usms-measured-pools
//   npm run deploy:snapshot --page=/events/event-central/usms-measured-pools

'use strict';

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

// ── Parse args ────────────────────────────────────────────────────────────────

const cliArgs = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [key, ...rest] = a.replace(/^--/, '').split('=');
      return [key, rest.length ? rest.join('=') : true];
    })
);

const page   = cliArgs.page   || process.env.npm_config_page;
const deploy = cliArgs.deploy === true || process.env.npm_config_deploy === 'true';

if (!page) {
  console.error('Usage: node scripts/snapshot.js --page=</path/to/page> [--name=<name>] [--deploy]');
  console.error('Example: node scripts/snapshot.js --page=/events/event-central/usms-measured-pools');
  process.exit(1);
}

// ── Derive name from page slug + today's date if not supplied ─────────────────

function todayIso() {
  const d = new Date();
  const yy = String(d.getUTCFullYear()).slice(2);
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return yy + mm + dd; // YYMMDD
}

function pageSlug(pagePath) {
  // /events/event-central/usms-measured-pools → usms-measured-pools
  return pagePath.replace(/\/$/, '').split('/').pop();
}

const name = (cliArgs.name || process.env.npm_config_name) || (pageSlug(page) + '-' + todayIso());

// ── Paths ──────────────────────────────────────────────────────────────────────

const root        = path.resolve(__dirname, '..');
const devJsonPath = path.join(root, 'src/_data/dev.json');
const siteDir     = path.join(root, '_site');
const outDir      = path.join(root, 'dist/snapshots', name);

const normalizedPage = page.replace(/^\//, '').replace(/\/$/, '');
// Support both directory-style permalinks (_site/foo/bar/index.html)
// and flat-file permalinks (_site/foo/bar.html → copied as index.html).
// Prefer the flat file when it exists, to avoid accidentally matching a
// same-named passthrough directory (e.g. public/account/addons/).
const pageSiteDir    = path.join(siteDir, normalizedPage);
const pageSiteFile   = normalizedPage.endsWith('.html')
  ? path.join(siteDir, normalizedPage)
  : path.join(siteDir, normalizedPage + '.html');
const useFlatFile    = !normalizedPage.endsWith('.html') &&
                       fs.existsSync(pageSiteFile) &&
                       fs.statSync(pageSiteFile).isFile();

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

  if (useFlatFile) {
    // flat-file permalink (e.g. /account/addons.html)
  } else if (!fs.existsSync(pageSiteDir) || !fs.statSync(pageSiteDir).isDirectory()) {
    throw new Error(
      `Page not found in build output: ${pageSiteDir}\n` +
      `Check that --page matches the page's permalink (without trailing slash).`
    );
  }

  // ── Extract and vendor ───────────────────────────────────────────────────────

  console.log(`\nPackaging snapshot "${name}"...`);

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  if (useFlatFile) {
    fs.copyFileSync(pageSiteFile, path.join(outDir, 'index.html'));
  } else {
    copyDir(pageSiteDir, outDir);
  }
  copyDir(path.join(siteDir, 'css'), path.join(outDir, 'css'));
  copyDir(path.join(siteDir, 'js'),  path.join(outDir, 'js'));

  console.log(`\nSnapshot ready: dist/snapshots/${name}`);

  // ── Deploy ───────────────────────────────────────────────────────────────────

  if (deploy) {
    console.log(`\nDeploying to Netlify as alias "${name}"...`);
    execSync(
      `netlify deploy --dir="${outDir}" --alias="${name}" --message="${name}"`,
      { cwd: root, stdio: 'inherit' }
    );
  } else {
    console.log(`\nTo deploy:`);
    console.log(`  netlify deploy --dir=dist/snapshots/${name} --alias=${name} --message=${name}`);
    console.log(`  → https://${name}--usms-mockup.netlify.app`);
  }

} finally {
  if (wasDevMode) {
    fs.writeFileSync(devJsonPath, JSON.stringify(devJson, null, 2));
    console.log('\nRestored dev.json');
  }
}
