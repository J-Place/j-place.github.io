/**
 * Club Edit — Radio Group Header Validation
 *
 * club-edit.js's _validateRequiredRadioGroup() marks a required radio
 * group's failure by adding .has-error to its .help-block--{name} sibling.
 * For this allowlist of four groups, the product wants the error marked on
 * the group's own .input-group-header.radio-group-header.required element
 * instead — the help-block for these fields must never receive .has-error.
 *
 * Overrides the global _validateRequiredRadioGroup() for just these names;
 * every other required radio group (e.g. the club bundle tiers) keeps the
 * default help-block behavior untouched. Must load after club-edit.js.
 */
(function () {
  var HEADER_ERROR_GROUPS = [
    'usmsLiabilityInsurance',
    'membershipRequired',
    'usaSwimmingAffiliation',
    'clubTrialMembership',
  ];

  var defaultValidateRequiredRadioGroup = window._validateRequiredRadioGroup;

  window._validateRequiredRadioGroup = function (name) {
    if (HEADER_ERROR_GROUPS.indexOf(name) === -1) {
      return defaultValidateRequiredRadioGroup(name);
    }

    var radio = document.querySelector('input[name="' + name + '"]');
    var inputGroup = radio ? radio.closest('.input-group') : null;
    var header = inputGroup
      ? inputGroup.querySelector('.input-group-header.radio-group-header.required')
      : null;
    var answered = !!document.querySelector('input[name="' + name + '"]:checked');

    if (header) header.classList.toggle('has-error', !answered);

    return answered;
  };
})();
