/**
 * Validation Preview — display-only "turn on every required-field error" sweep.
 *
 * NOT real validation: every `.required` element found is flagged
 * unconditionally, regardless of its current value, so error message content
 * and position can be reviewed in place. Real per-field validation lives
 * separately in each page's own script (e.g. club-edit.js's
 * validateField/setInputStatus) — this file never calls into it, so a change
 * to one can't silently affect the other.
 *
 * Shared between Club Edit and Event Edit's "click-to-preview" trigger
 * buttons (see club-edit.js's showValidation() and event-edit.js's
 * previewEventValidation()). Each page's own script still owns opening and
 * closing its own accordion sections — their collapse mechanics differ
 * (club-edit re-implements open/close to work around a BS3/BS5 conflict;
 * event-edit uses native Bootstrap 5 collapse) — this file only flags fields
 * once a section is already visible.
 */
(function () {
  // Help-block lookup prefers a sibling inside the same .required wrapper
  // over a name-derived selector — production's own markup isn't always
  // consistent (Club Edit's agreeTerms checkbox is name="agree-terms" but
  // help-block--agreeTerms, copied faithfully from production), so deriving
  // the class from the control's name attribute isn't reliable everywhere.
  function resolveHelpBlock(wrapper, name) {
    return wrapper.querySelector('.help-block')
      || (name && document.querySelector('span.help-block--' + name))
      || null;
  }

  function flagInvalid(wrapper, control) {
    if (!control || control.disabled) return;
    try {
      control.classList.remove('has-success');
      control.classList.add('has-error');
      if (control.parentNode && control.parentNode.classList.contains('form-group')) {
        control.parentNode.classList.remove('has-success');
        control.parentNode.classList.add('has-error');
      }
      var helpBlock = resolveHelpBlock(wrapper, control.name);
      if (helpBlock) helpBlock.classList.add('has-error');
    } catch (err) { /* ignore traversal errors on unexpected markup */ }
  }

  // A single required checkbox (e.g. agreeTerms) — no group name to key off,
  // just flag whatever help-block lives in the same wrapper.
  function flagCheckbox(wrapper) {
    var helpBlock = resolveHelpBlock(wrapper, null);
    if (helpBlock) helpBlock.classList.add('has-error');
  }

  // Radio groups have no single control to redden — no CSS in either page's
  // bundle keys off has-error on a radio input itself — so only the message
  // location gets flagged. Club Edit overrides _validateRequiredRadioGroup
  // for four groups to flag their section header instead of the help-block;
  // routing through it here (in force mode) picks that up automatically.
  // Event Edit doesn't define the function at all, so it falls back to the
  // plain name-derived help-block (reliable for radio groups — unlike the
  // checkbox case above, every radio group's shared `name` consistently
  // matches its help-block suffix across both pages).
  function flagRadioGroup(name) {
    if (typeof window._validateRequiredRadioGroup === 'function') {
      window._validateRequiredRadioGroup(name, true);
      return;
    }
    var helpBlock = document.querySelector('.help-block--' + name);
    if (helpBlock) helpBlock.classList.add('has-error');
  }

  // Catches display:none (directly or via an ancestor — collapses both
  // dimensions to 0) and this codebase's animated collapse pattern
  // (height:0; opacity:0; overflow:hidden — used by .location-details,
  // .lookup-confirm, etc., which only collapses height; width stays at the
  // parent's available width since block layout doesn't shrink it). Either
  // dimension being 0, or opacity being 0, means nothing is actually visible
  // here — offsetParent alone would miss the height:0 case, since an element
  // with display:block still has a valid offsetParent regardless of height.
  function isHidden(el) {
    if (el.closest('.section--disabled')) return true;
    var rect = el.getBoundingClientRect();
    return rect.width === 0 || rect.height === 0 || getComputedStyle(el).opacity === '0';
  }

  window.runValidationPreview = function (options) {
    options = options || {};
    var root = options.root ? document.querySelector(options.root) : document;
    if (!root) return;

    root.querySelectorAll('.required').forEach(function (el) {
      if (isHidden(el)) return;

      // Radio-group-header requirements — the header itself carries
      // .required; the group's radios live alongside it under a shared
      // ancestor, not inside the header.
      if (el.classList.contains('radio-group-header')) {
        var groupControl = el.parentElement
          && el.parentElement.querySelector('input[type="radio"], input[type="checkbox"]');
        if (!groupControl || groupControl.disabled) return;
        if (groupControl.type === 'checkbox') {
          flagCheckbox(el.parentElement);
        } else {
          flagRadioGroup(groupControl.name);
        }
        return;
      }

      var control = el.querySelector('input, select, textarea');
      if (!control || control.disabled) return;

      if (control.type === 'radio') {
        flagRadioGroup(control.name);
      } else if (control.type === 'checkbox') {
        flagCheckbox(el);
      } else {
        flagInvalid(el, control);
      }
    });

    // "At least one item" requirements (e.g. Location must have a selected
    // card, Club Contact must have an added contact) can't be discovered
    // from markup — there's no required-class equivalent for "this list
    // must be non-empty" — so the caller supplies them explicitly. Only the
    // .section--disabled guard applies here, not the full isHidden() check
    // used above — an empty list container is *legitimately* zero-size
    // (that's the exact condition being tested for), so checking its own
    // bounding rect would always read as hidden and skip the check entirely.
    (options.atLeastOne || []).forEach(function (rule) {
      var container = document.querySelector(rule.container);
      if (!container || container.closest('.section--disabled')) return;
      var hasItem = container.querySelector('.list-item') !== null;
      var helpBlock = document.querySelector(rule.helpBlock);
      if (helpBlock) helpBlock.classList.toggle('has-error', !hasItem);
    });
  };

  window.clearValidationPreview = function (options) {
    options = options || {};
    var root = options.root ? document.querySelector(options.root) : document;
    if (!root) return;
    root.querySelectorAll('.has-error, .has-success').forEach(function (el) {
      el.classList.remove('has-error', 'has-success');
    });
  };
}());
