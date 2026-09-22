'use strict';

// Shared by scripts/triage-production-monitor.js, scripts/summarize-vendor-diff.js,
// and scripts/triage-visual-regression.js — the common "call claude -p for a
// pure-summarization task, soft-fail if auth isn't configured or the call
// errors" pattern, so no caller needs its own try/catch for this. An optional
// LLM step must never take down the deterministic pipeline around it (plan
// guiding principle #7) — every call here returns a fallback string instead
// of throwing.

const { execFileSync } = require('child_process');
const fs = require('fs');

/**
 * @param {string} prompt
 * @param {{model?: string, fallback: string}} opts - fallback is required:
 *   callers must decide what "triage unavailable" should say for their case.
 * @returns {string}
 */
function summarize(prompt, { model = 'haiku', fallback }) {
  // WIF (plan's revised auth approach) sets ANTHROPIC_FEDERATION_RULE_ID;
  // a plain ANTHROPIC_API_KEY also still works if ever used instead.
  const hasAuth = process.env.ANTHROPIC_FEDERATION_RULE_ID || process.env.ANTHROPIC_API_KEY;
  if (!hasAuth) {
    console.warn('[call-claude] No Anthropic auth configured (neither WIF federation vars nor ANTHROPIC_API_KEY) — skipping, using fallback.');
    return fallback;
  }
  try {
    const output = execFileSync(
      'claude',
      ['-p', '--output-format', 'json', '--tools', '', '--model', model],
      { input: prompt, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, timeout: 60000 }
    );
    const parsed = JSON.parse(output);
    return parsed.result || fallback;
  } catch (err) {
    console.warn('[call-claude] Call failed:', err.message.split('\n')[0]);
    return fallback;
  }
}

/** Writes a (possibly multi-line) value to $GITHUB_OUTPUT and echoes it locally; no-ops outside CI. */
function writeGithubOutput(name, value) {
  console.log(`--- ${name} ---\n${value}`);
  if (!process.env.GITHUB_OUTPUT) return;
  const delimiter = `EOF_${Math.random().toString(36).slice(2)}`;
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<${delimiter}\n${value ?? ''}\n${delimiter}\n`);
}

module.exports = { summarize, writeGithubOutput };
