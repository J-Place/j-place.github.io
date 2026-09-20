// scripts/publish-production-monitor-report.js
// Publishes the most recent local production-monitor HTML report
// (production-monitor-report/, ephemeral, gitignored) into a committed
// directory (reports/production-monitor/) so it ships as static content on
// the next deploy. Run from .github/workflows/production-watch.yml only when
// the suite actually fails (a real diff) — a clean run needs nothing
// committed, the green Actions run is signal enough.
//
// Usage: npm run publish:production-monitor-report

'use strict';

const { publishReport } = require('./lib/publish-report');

try {
  const { stamp } = publishReport({
    sourceDir: 'production-monitor-report',
    destDir: 'reports/production-monitor',
    configPath: 'playwright.production-monitor.config.js',
  });
  console.log('Published production-monitor-report/ → reports/production-monitor/');
  console.log(stamp);
} catch (err) {
  console.error(err.message);
  console.error('Run `npm run monitor:prod` first.');
  process.exit(1);
}
