'use strict';

// Shared fetch-and-save primitives for pulling a copy of a production CSS/JS
// file onto disk. Originally lived only inside snapshot.js (as
// vendorOneCssFile, CSS-only, for freezing a single immutable snapshot);
// extracted here so the same fetch/rewrite logic can also back the main
// site's living, periodically-refreshed vendored copies (scripts/vendor-refresh.js)
// without the two diverging. Callers own the destDir/URL→local-path
// convention — these functions just fetch, sanity-check, and save, returning
// the bare filename saved under destDir (or null on failure, in which case
// the caller should leave whatever was already on disk untouched).

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// A bot-blocked / error-page response for a CSS or JS asset usually still
// answers 200 but with an HTML login/error page rather than a fetch error.
// Real CSS/JS won't start with a doctype or <html> tag.
function looksLikeHtmlNotAsset(content) {
  return /^\s*<(!doctype|html)/i.test(content);
}

function localNameFor(url, fallbackBase) {
  const parsed = new URL(url);
  const safeHost = parsed.hostname.replace(/[^a-z0-9.-]/gi, '-');
  const baseName = path.basename(parsed.pathname) || fallbackBase;
  return `${safeHost}-${baseName}`;
}

// Downloads one stylesheet and rewrites its internal url(...) references
// (fonts, background images) to absolute production URLs, since the file
// itself is moving but those referenced assets are not being vendored.
function vendorCssFile(url, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    console.warn(`  ! Not a valid URL: ${url}`);
    return null;
  }
  const origin = `${parsed.protocol}//${parsed.host}`;
  const originDir = new URL('.', url).href;
  const localName = localNameFor(url, 'style.css');

  try {
    let css = execSync(`curl -sL --fail "${url}"`, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 20 });
    if (looksLikeHtmlNotAsset(css)) {
      console.warn(`  ! ${url} did not look like CSS (got HTML) — leaving previous version in place`);
      return null;
    }
    css = css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (full, quote, ref) => {
      if (/^(data:|https?:|\/\/)/i.test(ref)) return full;
      const absolute = ref.startsWith('/') ? origin + ref : originDir + ref;
      return `url(${quote}${absolute}${quote})`;
    });
    fs.writeFileSync(path.join(destDir, localName), css);
    return localName;
  } catch (err) {
    console.warn(`  ! Failed to vendor CSS from ${url}: ${err.message}`);
    return null;
  }
}

// Downloads one script. No url(...) rewriting needed (unlike CSS), but strips
// a trailing sourceMappingURL comment since the referenced .map isn't
// vendored and would otherwise 404 in DevTools for no functional reason.
function vendorJsFile(url, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    console.warn(`  ! Not a valid URL: ${url}`);
    return null;
  }
  const localName = localNameFor(url, 'script.js');

  try {
    let js = execSync(`curl -sL --fail "${url}"`, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 20 });
    if (looksLikeHtmlNotAsset(js)) {
      console.warn(`  ! ${url} did not look like JS (got HTML) — leaving previous version in place`);
      return null;
    }
    js = js.replace(/\n?\/\/# sourceMappingURL=.*$/m, '\n');
    fs.writeFileSync(path.join(destDir, localName), js);
    return localName;
  } catch (err) {
    console.warn(`  ! Failed to vendor JS from ${url}: ${err.message}`);
    return null;
  }
}

module.exports = { vendorCssFile, vendorJsFile, localNameFor };
