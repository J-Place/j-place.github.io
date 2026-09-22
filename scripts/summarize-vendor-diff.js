'use strict';

// Plan Item 3 — runs after `npm run vendor:refresh` inside
// production-update.yml's refresh-vendored-assets job, before the vendored
// files are committed. Summarizes what actually changed in human terms,
// consumed as a second commit-message body line and folded into the Slack
// notify message. Soft-fails to a generic count-based message — this job's
// deterministic vendor-refresh work must never be blocked by the optional
// LLM step.

const { execSync } = require('child_process');
const { summarize, writeGithubOutput } = require('./lib/call-claude');

const MAX_DIFF_LINES = 400; // vendored CSS/JS diffs can be huge — bound the prompt

function main() {
  let diff;
  try {
    // Unstaged diff — this script runs before `git add`, matching the
    // workflow step order (Refresh vendored assets -> Summarize -> Commit).
    diff = execSync('git diff -- src/vendor scripts/vendor-manifest.json', { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  } catch (err) {
    console.warn('git diff failed:', err.message.split('\n')[0]);
    writeGithubOutput('summary', '');
    return;
  }

  if (!diff.trim()) {
    // The downstream "Commit vendored assets" step's own `git diff --cached
    // --quiet` check is the real no-op guard — this is just a cheap early
    // exit so no API call is spent when there's nothing to summarize.
    writeGithubOutput('summary', '');
    return;
  }

  const lines = diff.split('\n');
  const truncated = lines.length > MAX_DIFF_LINES;
  const boundedDiff = truncated
    ? lines.slice(0, MAX_DIFF_LINES).join('\n') + `\n... (truncated, ${lines.length - MAX_DIFF_LINES} more lines)`
    : diff;

  const prompt = [
    'Summarize what changed in this vendored production CSS/JS diff, in human terms — e.g.',
    '"updated jQuery 3.6.1->3.6.4, added a new .membership-badge utility class, no core layout changes."',
    'Do not restate the diff mechanically. One or two sentences. This becomes a git commit message body and a Slack line.',
    '',
    boundedDiff,
  ].join('\n');

  const fileCount = (diff.match(/^diff --git/gm) || []).length;
  const summary = summarize(prompt, {
    fallback: `${fileCount} vendored file(s) changed (no AI summary available).`,
  });
  writeGithubOutput('summary', summary);
}

main();
