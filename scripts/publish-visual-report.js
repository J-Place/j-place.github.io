// scripts/publish-visual-report.js
// Publishes the most recent local Playwright HTML report (playwright-report/, ephemeral,
// gitignored) into a committed directory (reports/visual-regression/) so it ships as static
// content on the next deploy. This is a deliberate, explicit, manual step — nothing runs this
// automatically. Review the report locally first (npm run test:visual:report), then run this.
//
// Usage: npm run publish:visual-report

'use strict';

const { publishReport } = require('./lib/publish-report');

try {
  const { stamp } = publishReport({
    sourceDir: 'playwright-report',
    destDir: 'reports/visual-regression',
    configPath: 'playwright.config.js',
  });
  console.log('Published playwright-report/ → reports/visual-regression/');
  console.log(stamp);
  console.log('Remember to review the report before committing, then:');
  console.log('  git add reports/visual-regression');
  console.log('  git commit -m "Publish latest visual regression report"');
} catch (err) {
  console.error(err.message);
  console.error('Run `npm run test:visual` (or `npm run test:visual:update`) first.');
  process.exit(1);
}
