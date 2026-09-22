'use strict';

// Plan Item 1 — runs only when production-watch's run-production-monitor job
// (now production-update.yml) fails. Reads the JSON reporter output, asks
// Claude to classify each failure's likely cause, writes the result to
// $GITHUB_OUTPUT as `summary` for the notify job to fold into its Slack line.
// Never runs on a clean pass — no API call spent on a no-op.

const { extractFailures, buildTriagePrompt } = require('./lib/triage-prompt');
const { summarize, writeGithubOutput } = require('./lib/call-claude');

const REPORT_PATH = 'production-monitor-report/results.json';
const FRAMING = "You're reviewing failures from a Playwright suite that screenshots pages on LIVE PRODUCTION (www.usms.org) and diffs each against ITS OWN prior snapshot — this is production's own drift versus its own earlier state, not our mockup being compared to production.";

function main() {
  const failures = extractFailures(REPORT_PATH);
  if (!failures.length) {
    writeGithubOutput('summary', '(triage found no failures in the JSON report — check production-monitor-report/ directly)');
    return;
  }

  const prompt = buildTriagePrompt(failures, FRAMING);
  const summary = summarize(prompt, {
    fallback: `${failures.length} check(s) failed (${failures.map((f) => f.title.replace(/^production monitor: /, '')).join(', ')}) — triage unavailable, see committed report.`,
  });
  writeGithubOutput('summary', summary);
}

main();
