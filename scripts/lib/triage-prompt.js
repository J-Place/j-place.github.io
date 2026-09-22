'use strict';

// Shared between scripts/triage-production-monitor.js (Item 1) and
// scripts/triage-visual-regression.js (Item 2) — both read a Playwright JSON
// reporter file and build a triage prompt from its failures, differing only
// in which report file and which "framing" sentence they use. Schema below
// confirmed against a real Playwright JSON reporter run (not guessed):
// data.suites[].specs[].tests[].results[] with .status/.error.message/.attachments[].

const fs = require('fs');

function parseDiffPixels(message) {
  if (!message) return null;
  const m = message.match(/([\d,]+) pixels \(ratio ([\d.]+)/);
  if (!m) return null;
  return { count: parseInt(m[1].replace(/,/g, ''), 10), ratio: parseFloat(m[2]) };
}

function walkSuites(suites, failures) {
  for (const suite of suites || []) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const lastResult = test.results[test.results.length - 1];
        if (!lastResult || (lastResult.status !== 'failed' && lastResult.status !== 'timedOut')) continue;
        const message = lastResult.error?.message || '(no error message)';
        const diffImage = (lastResult.attachments || []).find((a) => a.name.endsWith('-diff.png'));
        failures.push({
          title: spec.title,
          errorMessage: message.split('\n')[0], // first line only — the rest is ANSI-coded call-log noise
          diffPixels: parseDiffPixels(message),
          diffImagePath: diffImage ? diffImage.path : null,
        });
      }
    }
    walkSuites(suite.suites, failures);
  }
}

/** @returns {Array<{title: string, errorMessage: string, diffPixels: {count: number, ratio: number}|null, diffImagePath: string|null}>} */
function extractFailures(jsonReportPath) {
  if (!fs.existsSync(jsonReportPath)) return [];
  const data = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
  const failures = [];
  walkSuites(data.suites, failures);
  return failures;
}

/** @param {string} framing - one sentence establishing what's being compared against what */
function buildTriagePrompt(failures, framing) {
  return [
    framing,
    '',
    'For each failure below, classify it as most likely one of:',
    '- "ad-slot/dynamic-content noise" — third-party or routinely-changing content',
    '- "font/timing reflow" — sub-pixel text rendering or a late-loading-font shift',
    '- "genuine content/layout change" — a real structural or content change worth a human look',
    '',
    'One sentence of reasoning per failure. Be concise — this is a Slack/terminal summary, not a report.',
    '',
    ...failures.map((f, i) => [
      `${i + 1}. ${f.title}`,
      `   ${f.diffPixels ? `${f.diffPixels.count} px differ (ratio ${f.diffPixels.ratio})` : 'no pixel-diff data'}`,
      `   Error: ${f.errorMessage}`,
    ].join('\n')),
  ].join('\n');
}

module.exports = { extractFailures, buildTriagePrompt };
