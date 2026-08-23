/**
 * Club Edit — Website Check Mock
 *
 * Production's .club-website__check button (Details.js validateWebsiteUrl())
 * fires a real fetch against the entered URL to show a pass/fail icon. That
 * endpoint isn't available in this mockup, so for testing, clicking the
 * check icon instead cycles through a fixed sequence on every click:
 * reset -> red X -> green check -> reset -> ...
 *
 * Reuses the exact class names production's real check toggles (Details.js)
 * so clubEdit.min.css styles the states with no local CSS needed:
 * has-error/has-success on #clubWebsite and .clubWebsite-icon, fa-times/
 * fa-check on the icon's <i>.
 *
 * Wired via the check icon's onclick in ClubEditDetails.njk, replacing the
 * format-only validateWebsiteUrl() call there — the input's onblur still
 * calls validateWebsiteUrl() for real format validation, untouched.
 */
var _websiteCheckMockState = 0;

function mockWebsiteCheckCycle() {
  var input = document.querySelector('#clubWebsite');
  var iconSpan = document.querySelector('.clubWebsite-icon');
  var icon = iconSpan ? iconSpan.querySelector('i.fa') : null;

  _websiteCheckMockState = (_websiteCheckMockState + 1) % 3;

  if (input) input.classList.remove('has-success', 'has-error');
  if (iconSpan) iconSpan.classList.remove('has-success', 'has-error');
  if (icon) icon.classList.remove('fa-check', 'fa-times');

  if (_websiteCheckMockState === 1) {
    if (input) input.classList.add('has-error');
    if (iconSpan) iconSpan.classList.add('has-error');
    if (icon) icon.classList.add('fa-times');
  } else if (_websiteCheckMockState === 2) {
    if (input) input.classList.add('has-success');
    if (iconSpan) iconSpan.classList.add('has-success');
    if (icon) icon.classList.add('fa-check');
  }
}
