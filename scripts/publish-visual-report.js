// scripts/publish-visual-report.js
// Publishes the most recent local Playwright HTML report (playwright-report/, ephemeral,
// gitignored) into a committed directory (reports/visual-regression/) so it ships as static
// content on the next deploy. This is a deliberate, explicit, manual step — nothing runs this
// automatically. Review the report locally first (npm run test:visual:report), then run this.
//
// Usage: npm run publish:visual-report

'use strict';

const fs = require('fs');
const path = require('path');

const root       = path.resolve(__dirname, '..');
const sourceDir   = path.join(root, 'playwright-report');
const destDir     = path.join(root, 'reports/visual-regression');
const indexFile   = path.join(destDir, 'index.html');

if (!fs.existsSync(sourceDir)) {
  console.error(`No playwright-report/ found at ${sourceDir}.`);
  console.error('Run `npm run test:visual` (or `npm run test:visual:update`) first.');
  process.exit(1);
}

fs.rmSync(destDir, { recursive: true, force: true });
fs.mkdirSync(path.dirname(destDir), { recursive: true });
fs.cpSync(sourceDir, destDir, { recursive: true });

// Stamp the report with when it ran and what it ran against, so a stakeholder
// opening the deployed page later can tell a fresh result from a stale one —
// the report itself carries no visible timestamp otherwise. The report's own
// index.html mtime (set by Playwright when it wrote the report) is a closer
// proxy for "when the run happened" than "now" (this publish step can happen
// any time after the run). Target comes from the same config/env the run
// itself used, so it stays correct if PW_BASE_URL is ever overridden.
const ranAt = fs.statSync(path.join(sourceDir, 'index.html')).mtime;
const target = require(path.join(root, 'playwright.config.js')).use.baseURL;
const stamp = `Last run: ${ranAt.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', hour: 'numeric', minute: '2-digit' })} — against ${target}`;

const banner = `<div style="position:sticky;top:0;z-index:9999;padding:6px 16px;background:#fff3cd;color:#664d03;border-bottom:1px solid #ffe69c;font:13px -apple-system,BlinkMacSystemFont,sans-serif;">${stamp} — published snapshot, not live</div>`;
const html = fs.readFileSync(indexFile, 'utf8').replace(/<body([^>]*)>/, `<body$1>${banner}`);
fs.writeFileSync(indexFile, html);

console.log(`Published playwright-report/ → reports/visual-regression/`);
console.log(stamp);
console.log('Remember to review the report before committing, then:');
console.log('  git add reports/visual-regression');
console.log('  git commit -m "Publish latest visual regression report"');
