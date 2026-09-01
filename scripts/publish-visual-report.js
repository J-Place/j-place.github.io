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

if (!fs.existsSync(sourceDir)) {
  console.error(`No playwright-report/ found at ${sourceDir}.`);
  console.error('Run `npm run test:visual` (or `npm run test:visual:update`) first.');
  process.exit(1);
}

fs.rmSync(destDir, { recursive: true, force: true });
fs.mkdirSync(path.dirname(destDir), { recursive: true });
fs.cpSync(sourceDir, destDir, { recursive: true });

console.log(`Published playwright-report/ → reports/visual-regression/`);
console.log('Remember to review the report before committing, then:');
console.log('  git add reports/visual-regression');
console.log('  git commit -m "Publish latest visual regression report"');
