'use strict';

// Shared logic for publishing a Playwright HTML report (ephemeral, gitignored)
// into a committed directory so it ships as static content on the next
// deploy: copy it, stamp it with a "Last run ... — against ..." banner (read
// from the report's own embedded run metadata, not re-derived from whatever
// happens to be in the shell at publish time), and patch the report's native
// timestamp to render mm/dd/yyyy regardless of viewer locale.
//
// Originally written only for the mockup's own visual-regression suite
// (playwright-report/ → reports/visual-regression/); extracted here so
// scripts/publish-production-monitor-report.js can reuse it for
// production-monitor-report/ → reports/production-monitor/ without the two
// copies drifting apart. Both callers stay thin — this holds the logic.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..', '..');

// The report embeds its own full run data as a base64-zipped blob (Playwright's
// self-contained HTML report format) — including the `metadata.baseURL` that
// the relevant playwright config recorded at the moment that specific run
// started. Reading it back from here, rather than re-requiring the config, is
// what makes this correct: a fresh require() would just re-resolve the env
// var from *this* shell at publish time, which is often unset even when the
// run being published was against a different target.
function readReportBaseURL(indexHtmlPath) {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  const match = html.match(/id="playwrightReportBase64"[^>]*>([^<]+)</);
  if (!match) return null;
  const zipPath = path.join(os.tmpdir(), `pw-report-${Date.now()}.zip`);
  try {
    fs.writeFileSync(zipPath, Buffer.from(match[1].trim().split(',')[1], 'base64'));
    const reportJson = JSON.parse(execFileSync('unzip', ['-p', zipPath, 'report.json'], { encoding: 'utf8' }));
    return (reportJson.metadata && reportJson.metadata.baseURL) || null;
  } catch (err) {
    console.warn(`Could not read baseURL from the report's embedded data (${err.message}); falling back to the config's current default.`);
    return null;
  } finally {
    fs.rmSync(zipPath, { force: true });
  }
}

// sourceDir/destDir: relative to the repo root (e.g. 'playwright-report',
// 'reports/visual-regression'). configPath: relative to the repo root, the
// playwright config whose use.baseURL is the fallback if the report's own
// embedded metadata can't be read.
function publishReport({ sourceDir, destDir, configPath }) {
  const absSource = path.join(root, sourceDir);
  const absDest = path.join(root, destDir);
  const indexFile = path.join(absDest, 'index.html');

  if (!fs.existsSync(absSource)) {
    throw new Error(`No ${sourceDir}/ found at ${absSource}. Run the corresponding test suite first.`);
  }

  fs.rmSync(absDest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(absDest), { recursive: true });
  fs.cpSync(absSource, absDest, { recursive: true });

  // Stamp the report with when it ran and what it ran against, so a
  // stakeholder opening the deployed page later can tell a fresh result from
  // a stale one — the report's own native timestamp (top of its header)
  // isn't reliable for this: it's locale-dependent (see localeFix below),
  // and since this publish step can run any time after the actual test run,
  // "now" would be wrong too. The report's own index.html mtime (set by
  // Playwright when it wrote the report) is a closer proxy for "when the run
  // happened."
  const ranAt = fs.statSync(path.join(absSource, 'index.html')).mtime;
  const target = readReportBaseURL(indexFile) || require(path.join(root, configPath)).use.baseURL;
  const stamp = `Last run: ${ranAt.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', hour: 'numeric', minute: '2-digit' })} — against ${target}`;

  const banner = `<div style="position:sticky;top:0;z-index:9999;padding:6px 16px;background:#fff3cd;color:#664d03;border-bottom:1px solid #ffe69c;font:13px -apple-system,BlinkMacSystemFont,sans-serif;">${stamp} — published snapshot, not live</div>`;

  // The report's own header also shows a run timestamp (report.js:
  // `new Date(e.startTime).toLocaleString()`), separate from our banner
  // above. That call passes no locale, so it renders in whatever locale the
  // *viewer's* browser reports — dd/mm/yyyy for anyone outside the US. Patch
  // Date.prototype before report.js's bundle runs so that one call shape (no
  // args) always renders mm/dd/yyyy, regardless of viewer locale; anything
  // that explicitly passes its own locale/options (like our banner string
  // above, already computed server-side) is left alone.
  const localeFix = `<script>(function(){var o=Date.prototype.toLocaleString;Date.prototype.toLocaleString=function(locales,options){if(locales===undefined&&options===undefined){return o.call(this,'en-US',{month:'2-digit',day:'2-digit',year:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit'});}return o.apply(this,arguments);};})();</script>`;

  const html = fs.readFileSync(indexFile, 'utf8')
    .replace(/<head([^>]*)>/, `<head$1>${localeFix}`)
    .replace(/<body([^>]*)>/, `<body$1>${banner}`);
  fs.writeFileSync(indexFile, html);

  return { stamp, destDir };
}

module.exports = { publishReport };
