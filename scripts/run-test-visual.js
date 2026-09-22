'use strict';

// Wrapper for `npm run test:visual`, so `npm run test:visual -- --grep foo`
// keeps working. Verified empirically: `npm run <script> -- <args>` appends
// <args> as literal TEXT to the end of the whole script string, not as real
// positional parameters — `"$@"` inside a multi-command shell one-liner
// (playwright test; ...; exit $ec) never receives them at all; the appended
// text just lands after whatever the last command happens to be (was
// silently turning `-- --update-snapshots` into `exit $ec --update-snapshots`,
// a no-op flag on `exit`, with Playwright never seeing it). A real Node
// process's argv doesn't have this problem, since this is now a single
// command — npm's append-to-end lands the args exactly where a normal CLI
// invocation would expect them.

const { spawnSync } = require('child_process');

const extraArgs = process.argv.slice(2);

const playwright = spawnSync('npx', ['playwright', 'test', ...extraArgs], { stdio: 'inherit' });
spawnSync('node', ['scripts/triage-visual-regression.js'], { stdio: 'inherit' });

process.exit(playwright.status ?? 1);
