// scripts/snapshot.js
// Builds a single-page immutable snapshot, vendors local CSS/JS alongside it,
// and optionally deploys to Netlify with a permanent alias URL.
//
// Usage:
//   node scripts/snapshot.js --page=/path/to/page [--name=my-name] [--dev] [--deploy]
//   npm run build:snapshot --page=/events/event-central/usms-measured-pools
//   npm run deploy:snapshot --page=/events/event-central/usms-measured-pools
//
// --dev  Build with env=dev so dev overlays (e.g. login-status) are included.

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
const devMode = cliArgs.dev   === true || process.env.npm_config_dev   === 'true';

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
  // /public/search/content-hub-2.html → content-hub-2
  const slug = pagePath.replace(/\/$/, '').split('/').pop().replace(/\.html$/, '');
  // Netlify alias + "--usms-mockup" must fit in a 63-char DNS label.
  // "--usms-mockup" = 13 chars; date suffix "-YYMMDD" = 7 chars → slug max = 43 chars.
  return slug.slice(0, 43).replace(/-+$/, '');
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
const useFlatFile    = fs.existsSync(pageSiteFile) &&
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

// Snapshots must be immutable: production stylesheets (www.usms.org,
// usms-cdn.azureedge.net, cdnjs, etc.) can change or disappear at any time,
// which would silently alter or break a deployed snapshot's appearance.
// Fetch every <link rel="stylesheet"> that points at an external URL, save a
// frozen copy alongside the snapshot, and rewrite the HTML to reference it.
function vendorExternalCss(snapshotDir) {
  const htmlFiles = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.html')) htmlFiles.push(p);
    }
  })(snapshotDir);

  const vendorDir = path.join(snapshotDir, 'vendor', 'css');
  const linkTagRe = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi;
  const hrefRe = /href=["']([^"']+)["']/i;
  const urlToLocalHref = new Map();

  for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    const externalUrls = new Set();
    let m;
    while ((m = linkTagRe.exec(html))) {
      const hrefMatch = m[0].match(hrefRe);
      if (hrefMatch && /^https?:\/\//i.test(hrefMatch[1])) {
        externalUrls.add(hrefMatch[1]);
      }
    }
    linkTagRe.lastIndex = 0;

    for (const url of externalUrls) {
      if (!urlToLocalHref.has(url)) {
        urlToLocalHref.set(url, vendorOneCssFile(url, vendorDir));
      }
      const localHref = urlToLocalHref.get(url);
      if (localHref) {
        html = html.split(`"${url}"`).join(`"${localHref}"`)
                   .split(`'${url}'`).join(`'${localHref}'`);
      }
    }
    fs.writeFileSync(file, html);
  }
}

// Downloads one stylesheet and rewrites its internal url(...) references
// (fonts, background images) to absolute production URLs, since the file
// itself is moving but those referenced assets are not being vendored.
// Returns the site-relative href to use in place of the original URL, or
// null if the fetch failed (original remote URL is left in place).
function vendorOneCssFile(url, vendorDir) {
  fs.mkdirSync(vendorDir, { recursive: true });
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const origin = `${parsed.protocol}//${parsed.host}`;
  const originDir = new URL('.', url).href;
  const safeHost = parsed.hostname.replace(/[^a-z0-9.-]/gi, '-');
  const baseName = path.basename(parsed.pathname) || 'style.css';
  const localName = `${safeHost}-${baseName}`;

  try {
    let css = execSync(`curl -sL --fail "${url}"`, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 20 });
    css = css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (full, quote, ref) => {
      if (/^(data:|https?:|\/\/)/i.test(ref)) return full;
      const absolute = ref.startsWith('/') ? origin + ref : originDir + ref;
      return `url(${quote}${absolute}${quote})`;
    });
    fs.writeFileSync(path.join(vendorDir, localName), css);
    console.log(`  Vendored ${url} → vendor/css/${localName}`);
    return `/vendor/css/${localName}`;
  } catch (err) {
    console.warn(`  ! Failed to vendor CSS from ${url}, leaving remote link in place: ${err.message}`);
    return null;
  }
}

// ── Build ──────────────────────────────────────────────────────────────────────

const devJson        = JSON.parse(fs.readFileSync(devJsonPath, 'utf8'));
const originalEnv    = devJson.env;
const targetEnv      = devMode ? 'dev' : 'prod';
const needsEnvChange = originalEnv !== targetEnv;

if (needsEnvChange) {
  fs.writeFileSync(devJsonPath, JSON.stringify({ env: targetEnv }, null, 2));
  console.log(`Temporarily switched dev.json → ${targetEnv}`);
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

  // For public/ pages, the HTML references assets relative to the Sergey
  // project root (e.g. /search/css/..., /css/..., /js/...). Copy Sergey's
  // global css/js layers first so Eleventy's overrides win on conflict.
  if (normalizedPage.startsWith('public/')) {
    copyDir(path.join(siteDir, 'public', 'css'), path.join(outDir, 'css'));
    copyDir(path.join(siteDir, 'public', 'js'),  path.join(outDir, 'js'));
    // Copy the page's sibling directory (e.g. _site/public/search/ → outDir/search/)
    // so paths like /search/css/ResultList.css resolve correctly.
    const pageSubdir = normalizedPage.split('/')[1];
    if (pageSubdir) {
      copyDir(path.join(siteDir, 'public', pageSubdir), path.join(outDir, pageSubdir));
    }
  }

  copyDir(path.join(siteDir, 'css'), path.join(outDir, 'css'));
  copyDir(path.join(siteDir, 'js'),  path.join(outDir, 'js'));
  copyDir(path.join(siteDir, 'img'), path.join(outDir, 'img'));

  console.log(`\nVendoring production CSS...`);
  vendorExternalCss(outDir);

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
  if (needsEnvChange) {
    fs.writeFileSync(devJsonPath, JSON.stringify({ env: originalEnv }, null, 2));
    console.log('\nRestored dev.json');
  }
}
