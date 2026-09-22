'use strict';

// Plan Item 2 — auto-chained onto the end of `npm run test:visual` (see
// package.json), and also runnable standalone as `npm run test:visual:triage`
// against a stale playwright-report/ without rerunning the suite. Local-only:
// reads whatever `claude` CLI auth is already configured on this machine —
// no GitHub secret, no WIF, none of production-update.yml's auth wiring
// applies here.
//
// HARD CONSTRAINT, enforced by omission, not just stated: this script never
// invokes `playwright test --update-snapshots`, never writes to any
// *-snapshots/ directory, never prompts "accept? y/n". Text output only — a
// human still runs `npm run test:visual:update` themselves, per the
// project's existing baseline-approval rule (see feedback_visual_baseline_approval
// in memory). Do not add an auto-accept path here, ever.

const { extractFailures, buildTriagePrompt } = require('./lib/triage-prompt');
const { summarize } = require('./lib/call-claude');

const REPORT_PATH = 'playwright-report/results.json';
const FRAMING = "You're reviewing failures from a Playwright suite that screenshots pages on OUR OWN mockup site and diffs each against OUR OWN previously-committed baseline — this is a regression check against our own prior work, not against production.";

function main() {
  const failures = extractFailures(REPORT_PATH);
  if (!failures.length) {
    console.log('No failures — nothing to triage.');
    return;
  }

  console.log(`${failures.length} failure(s) found. Diff images (if you want to look yourself):`);
  for (const f of failures) {
    if (f.diffImagePath) console.log(`  ${f.title}: ${f.diffImagePath}`);
  }
  console.log('');

  const prompt = buildTriagePrompt(failures, FRAMING);
  const summary = summarize(prompt, {
    fallback: `${failures.length} failure(s) found (${failures.map((f) => f.title.replace(/^visual: /, '')).join(', ')}) — triage unavailable (no claude CLI auth configured on this machine).`,
  });
  console.log(summary);
  console.log('\nThis is advisory only — decide for yourself whether to run `npm run test:visual:update`.');
}

main();
