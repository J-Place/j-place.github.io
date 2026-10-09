// scripts/check-redundant-overrides.js
// Lists local CSS override rules (src/css/**) that the vendored production bundles
// (src/vendor/css/) now already contain — i.e. production shipped the fix or enhancement, and the
// local copy is a candidate to delete. Run it after `npm run vendor:refresh` / merging a
// Production Update back into development.
//
// Report only — never edits anything, always exits 0. A match means production has the same
// selector + declaration in the same @media/@supports context; it does NOT prove the local rule is
// a no-op (another production rule in between could still be what the local rule wins over).
// Delete the candidate on development, then confirm with a full localhost visual run before
// merging — an unchanged baseline is the real proof.
//
// Only bundles that actually load alongside the local file count: the built _site/ pages are
// scanned for <link rel="stylesheet">, and a production rule covers a local one only if its bundle
// is loaded on every page that loads the local file (so a site-wide override isn't "redundant"
// just because one page-specific bundle happens to contain the same rule). Needs a current build —
// run `npm run build` first. Local files no built page loads are listed separately.
//
// Matching is per individual selector (a local `.a, .b {}` is redundant only if both are covered)
// with light normalization so minified production output still matches hand-written local CSS
// (whitespace, case, #ffffff → #fff, 0.5 → .5, 0px → 0).
//
// Retiring a match keeps it around instead of deleting it: a fully duplicated file is renamed to
// *.retired.css (and its <link> commented out), a duplicated rule inside a live file is commented
// out in place — both with a "RETIRED <date>" note naming the production bundle and version.
// Retired files and commented-out rules are skipped here.
//
// Usage: node scripts/check-redundant-overrides.js [--partial]
//   --partial  also list rules where only some declarations are covered by production

'use strict';

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const postcssNested = require('postcss-nested');

const ROOT = path.resolve(__dirname, '..');
const LOCAL_DIR = path.join(ROOT, 'src/css');
const VENDOR_DIR = path.join(ROOT, 'src/vendor/css');
const SITE_DIR = path.join(ROOT, '_site');
const SHOW_PARTIAL = process.argv.includes('--partial');

// Tooling pages for this repo, not production overrides
const SKIP_LOCAL = new Set(['visual-regression-gallery.css', 'visual-regression-viewer.css']);

function listCss(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listCss(full);
    return entry.name.endsWith('.css') ? [full] : [];
  });
}

function listHtml(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'reports' ? [] : listHtml(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

// Local file (repo-relative) → Set of vendored bundle names loaded on every page that loads it
function bundlesAlongside() {
  const pagesByLocal = new Map();
  for (const page of listHtml(SITE_DIR)) {
    const html = fs.readFileSync(page, 'utf8');
    const locals = [];
    const vendored = new Set();
    for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
      if (!/rel\s*=\s*["']?stylesheet/i.test(tag)) continue;
      const href = (tag.match(/href\s*=\s*["']([^"']+)["']/i) || [])[1];
      if (!href) continue;
      const urlPath = href.split(/[?#]/)[0];
      if (urlPath.startsWith('/vendor/css/')) vendored.add(path.basename(urlPath));
      else if (urlPath.startsWith('/css/')) locals.push(path.join('src', urlPath));
    }
    for (const local of locals) {
      if (!pagesByLocal.has(local)) pagesByLocal.set(local, []);
      pagesByLocal.get(local).push(vendored);
    }
  }
  const result = new Map();
  for (const [local, pageSets] of pagesByLocal) {
    result.set(local, new Set([...pageSets[0]].filter(name => pageSets.every(s => s.has(name)))));
  }
  return result;
}

function normSelector(sel) {
  return sel
    .replace(/\s+/g, ' ')
    .replace(/\s*([>+~,])\s*/g, '$1')
    .replace(/::(before|after)\b/g, ':$1')
    .trim()
    .toLowerCase();
}

function normValue(val) {
  return val
    .replace(/\s+/g, ' ')
    .replace(/\s*([,()/])\s*/g, '$1')
    .replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3\b/gi, '#$1$2$3')
    .replace(/(^|[\s,(-])0+\.(\d)/g, '$1.$2')
    .replace(/(^|[\s,(])0(?:px|em|rem|%)(?=$|[\s,)])/g, '$10')
    .trim()
    .toLowerCase();
}

// @media/@supports chain the rule sits in, e.g. "@media(min-width:768px)"
function context(node) {
  const parts = [];
  for (let p = node.parent; p && p.type !== 'root'; p = p.parent) {
    if (p.type === 'atrule') parts.unshift('@' + p.name + p.params.replace(/\s+/g, '').toLowerCase());
  }
  return parts.join(' ');
}

function declKey(decl) {
  return decl.prop.toLowerCase() + ':' + normValue(decl.value) + (decl.important ? '!important' : '');
}

// Splits a selector list on top-level commas only (not inside :is()/:not() etc.)
function splitSelectors(selector) {
  const out = [];
  let depth = 0;
  let current = '';
  for (const ch of selector) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out.map(normSelector).filter(Boolean);
}

// context + selector → Map(declKey → Set(vendored file names))
function indexVendored() {
  const index = new Map();
  for (const file of listCss(VENDOR_DIR)) {
    const name = path.basename(file);
    const root = postcss.parse(fs.readFileSync(file, 'utf8'), { from: file });
    root.walkRules(rule => {
      if (rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
      const ctx = context(rule);
      for (const sel of splitSelectors(rule.selector)) {
        const key = ctx + '|' + sel;
        if (!index.has(key)) index.set(key, new Map());
        const decls = index.get(key);
        rule.walkDecls(decl => {
          const k = declKey(decl);
          if (!decls.has(k)) decls.set(k, new Set());
          decls.get(k).add(name);
        });
      }
    });
  }
  return index;
}

function checkLocal(index, alongside) {
  const redundant = [];
  const partial = [];
  const unloaded = [];
  for (const file of listCss(LOCAL_DIR)) {
    // *.retired.css: already retired (kept for reference, no longer linked)
    if (SKIP_LOCAL.has(path.basename(file)) || file.endsWith('.retired.css')) continue;
    const rel = path.relative(ROOT, file);
    const loadedWith = alongside.get(rel);
    if (!loadedWith) {
      unloaded.push(rel);
      continue;
    }
    const source = fs.readFileSync(file, 'utf8');
    // Flatten nesting so selectors compare like-for-like; source positions survive the transform
    const root = postcss([postcssNested]).process(source, { from: file }).root;
    root.walkRules(rule => {
      if (rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
      const decls = rule.nodes.filter(n => n.type === 'decl');
      if (!decls.length) return;
      const ctx = context(rule);
      const sels = splitSelectors(rule.selector);
      const covered = [];
      const uncovered = [];
      const sources = new Set();
      for (const decl of decls) {
        const k = declKey(decl);
        const hits = sels.map(sel => {
          const names = [...(index.get(ctx + '|' + sel)?.get(k) || [])].filter(n => loadedWith.has(n));
          return names.length ? names : null;
        });
        if (hits.every(Boolean)) {
          covered.push(decl);
          hits.forEach(h => h.forEach(n => sources.add(n)));
        } else {
          uncovered.push(decl);
        }
      }
      if (!covered.length) return;
      const entry = {
        loc: `${rel}:${rule.source?.start?.line ?? '?'}`,
        selector: rule.selector.replace(/\s+/g, ' '),
        context: ctx,
        sources: [...sources].sort(),
        covered,
        uncovered,
      };
      (uncovered.length ? partial : redundant).push(entry);
    });
  }
  return { redundant, partial, unloaded };
}

function printEntry(entry, showDecls) {
  console.log(`  ${entry.loc}  ${entry.selector}${entry.context ? '  [' + entry.context + ']' : ''}`);
  console.log(`      in production: ${entry.sources.join(', ')}`);
  if (showDecls) {
    for (const d of entry.covered) console.log(`      = ${d.prop}: ${d.value}${d.important ? ' !important' : ''}`);
    for (const d of entry.uncovered) console.log(`      ≠ ${d.prop}: ${d.value}${d.important ? ' !important' : ''}  (local only)`);
  }
}

if (!fs.existsSync(SITE_DIR)) {
  console.error('No _site/ build found — run `npm run build` first (the check reads which stylesheets each page loads).');
  process.exit(0);
}

const index = indexVendored();
const { redundant, partial, unloaded } = checkLocal(index, bundlesAlongside());

if (!redundant.length) {
  console.log('No local override rules are fully duplicated by the vendored production CSS.');
} else {
  console.log(`${redundant.length} local rule(s) fully duplicated by vendored production CSS — candidates to delete:\n`);
  redundant.forEach(e => printEntry(e, false));
}

if (SHOW_PARTIAL && partial.length) {
  console.log(`\n${partial.length} local rule(s) partly duplicated (= in production, ≠ local only):\n`);
  partial.forEach(e => printEntry(e, true));
} else if (partial.length) {
  console.log(`\n${partial.length} more rule(s) are partly duplicated — rerun with --partial to list them.`);
}

if (unloaded.length) {
  console.log(`\n${unloaded.length} local CSS file(s) not loaded by any built page (dead, or the build is stale):\n`);
  unloaded.forEach(rel => console.log(`  ${rel}`));
}

console.log('\nCandidates only: delete on development, then run the full visual suite against localhost to confirm no diff.');
