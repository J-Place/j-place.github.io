/**
 * Event Edit — Save & Submit Preview
 *
 * #submitEdit ("Save & Submit") has no real submit target in this mockup —
 * the only local script for this page is event-edit-locations.js, scoped
 * entirely to the Location search/select behavior, and production's real
 * sanctions.min.js doesn't bind anything visible to this button here. Wires
 * it to the same validation-preview sweep Club Edit uses (validation-
 * preview.js) so required-field error content/position can be reviewed the
 * same way on both pages.
 *
 * Unlike club-edit.js, this page uses genuine Bootstrap 5 (loaded from CDN,
 * same one event-edit-locations.js already drives via bootstrap.Modal) with
 * no BS3 coexistence conflict, so opening/closing sections here goes through
 * the real bootstrap.Collapse API instead of club-edit's manual class
 * toggling workaround.
 */
(function () {
  var _validationDisplayed = false;

  function accordionSections() {
    return document.querySelectorAll('#accordion .section__content.collapse');
  }

  function openSection(content) {
    if (window.bootstrap && window.bootstrap.Collapse) {
      window.bootstrap.Collapse.getOrCreateInstance(content, { toggle: false }).show();
    } else {
      content.classList.add('show');
    }
  }

  function closeSection(content) {
    if (window.bootstrap && window.bootstrap.Collapse) {
      window.bootstrap.Collapse.getOrCreateInstance(content, { toggle: false }).hide();
    } else {
      content.classList.remove('show');
    }
  }

  // Exposed for the visual-regression suite
  // (tests/usms-visual-regression-screenshots/screenshots.spec.js), which
  // calls window.expandAllSections() before capturing this page so every
  // section's inputs are visible in the baseline — same global name Club Edit
  // exposes for the same purpose, no validation flagging involved here.
  window.expandAllSections = function () {
    accordionSections().forEach(openSection);
  };

  function previewEventValidation(e) {
    if (e) e.preventDefault();

    // Second click — dev-only reset: clear all flags and collapse every
    // section back down except Event Name, matching club-edit's showValidation()
    // reset behavior.
    if (_validationDisplayed) {
      window.clearValidationPreview({ root: '#accordion' });
      accordionSections().forEach(function (content) {
        if (content.id !== 'event-name__content') closeSection(content);
      });
      _validationDisplayed = false;
      return;
    }
    _validationDisplayed = true;

    accordionSections().forEach(openSection);

    window.runValidationPreview({
      root: '#accordion',
      atLeastOne: [
        { container: '#savedLocationItems', helpBlock: '.help-block--selectLocation' }
      ]
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var submitBtn = document.getElementById('submitEdit');
    if (submitBtn) submitBtn.addEventListener('click', previewEventValidation);
  });
}());
