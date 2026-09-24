'use strict';

// Plan Item 4 — manual-only (code-review.yml, workflow_dispatch). Originally
// ran on every push to `development`; converted off that trigger because
// `development` is pushed to constantly under this project's branching
// model, and a Claude API call on every push was pure cost for reviews
// nobody had asked to see. Runs /code-review against the requested range
// (or the latest commit, if none given) and posts the result to Slack.
// Never pass --comment or --fix here — `development` is a direct-push branch
// in normal use, so there's frequently no open PR for --comment to attach to,
// and this is advisory-only by design (see the plan's guardrail tripwires).
//
// SECURITY FIX (found by this same review job, on itself): originally used
// --permission-mode bypassPermissions, believing --allowedTools would still
// scope it to read-only git/Read/Grep. That's wrong — bypassPermissions
// disables the allowlist entirely ("Allow rules have no effect in
// bypassPermissions", confirmed against Claude Code's own docs), so the
// agent actually had full tool access, including Write/Edit/arbitrary Bash,
// while processing untrusted pushed-diff content. The correct pattern for
// non-interactive CI is --permission-mode dontAsk + --allowedTools: dontAsk
// auto-denies anything outside the allowlist (never hangs waiting for a
// prompt that can't come, never silently grants what isn't listed) — so
// --allowedTools is now an actual enforced boundary, not decoration.
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
  // From the workflow_dispatch `range` input — blank means "just the latest
  // commit on whatever branch this was run against".
  const requested = (process.env.REVIEW_RANGE || '').trim();
  return requested || 'HEAD~1...HEAD';
}

function main() {
  if (!process.env.ANTHROPIC_FEDERATION_RULE_ID && !process.env.ANTHROPIC_API_KEY) {
    console.warn('No Anthropic auth configured — skipping review.');
    writeGithubOutput('review', '');
    return;
  }

  const range = resolveRange();
  console.log(`Reviewing range: ${range}`);
  writeGithubOutput('range', range);

  let result = '';
  try {
    const output = execFileSync('claude', [
      '-p', `/code-review ${range} --effort medium`,
      '--output-format', 'json',
      '--allowedTools', 'Bash(git diff:*) Bash(git log:*) Bash(git show:*) Read Grep',
      '--permission-mode', 'dontAsk',
    ], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, timeout: 300000 });
    result = JSON.parse(output).result || '';
  } catch (err) {
    console.warn('Code review call failed:', err.message.split('\n')[0]);
  }

  writeGithubOutput('review', result);
}

main();
