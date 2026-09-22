'use strict';

// Plan Item 4 — runs on every push to `development` (deploy-development.yml's
// `review` job, parallel to `deploy`, never blocking or delaying it). Runs
// /code-review against the pushed range and posts the result to Slack.
// Read-only by construction: the job's own `permissions: contents: read`
// plus this script's own --allowedTools scope (read-only git + Read/Grep)
// mean it can inspect the diff but never write anything. Never pass
// --comment or --fix here — `development` is a direct-push branch in normal
// use, so there's frequently no open PR for --comment to attach to, and this
// is advisory-only by design (see the plan's guardrail tripwires).
//
// Unlike the pure-summarization scripts (triage-*.js, summarize-vendor-diff.js),
// this doesn't use scripts/lib/call-claude.js's summarize() helper — that
// helper disables tools entirely (--tools ""), but /code-review needs real
// git/file access, so it uses --allowedTools instead. Two different
// invocation shapes for two different kinds of task (plan's own framing).
//
// On failure or missing auth: post nothing, rather than a "review
// unavailable" message on every push — a silent skip is less noisy than a
// recurring placeholder Slack message.

const { execFileSync } = require('child_process');
const { writeGithubOutput } = require('./lib/call-claude');

function resolveRange() {
  const before = process.env.GITHUB_EVENT_BEFORE;
  const sha = process.env.GITHUB_SHA;
  // All-zeros `before` happens on a branch's first-ever push (and some
  // force-push cases) — there's no real prior commit to diff against.
  const isEmptyBefore = !before || /^0+$/.test(before);
  return isEmptyBefore ? `${sha}~1...${sha}` : `${before}...${sha}`;
}

function main() {
  if (!process.env.ANTHROPIC_FEDERATION_RULE_ID && !process.env.ANTHROPIC_API_KEY) {
    console.warn('No Anthropic auth configured — skipping review.');
    writeGithubOutput('review', '');
    return;
  }

  const range = resolveRange();
  console.log(`Reviewing range: ${range}`);

  let result = '';
  try {
    const output = execFileSync('claude', [
      '-p', `/code-review ${range} --effort medium`,
      '--output-format', 'json',
      '--allowedTools', 'Bash(git diff:*) Bash(git log:*) Bash(git show:*) Read Grep',
      '--permission-mode', 'bypassPermissions',
    ], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, timeout: 300000 });
    result = JSON.parse(output).result || '';
  } catch (err) {
    console.warn('Code review call failed:', err.message.split('\n')[0]);
  }

  writeGithubOutput('review', result);
}

main();
