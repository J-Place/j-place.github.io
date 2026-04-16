// ============================================================
// DEV ONLY — do not load in production
// Injects a .login-status overlay showing the current swimmer's
// ID and membership tier, read from existing DOM elements.
// ============================================================
(function () {
  var header    = document.querySelector('.breadcrumb-container');
  var wrapper   = document.querySelector('.masters-addons[data-membership-level]');
  var swimmerId = document.querySelector('input#swimmerId');
  if (!header || !wrapper) return;

  var tierLabels = {
    usmsStandard:             'Standard Membership',
    usmsStandardEventLicense: 'Event License Standard',
    usmsPlus:                 'Event License USMS+',
    usmsPlusEventLicense:     'Event License USMS+'
  };
  var tier = wrapper.dataset.membershipLevel;
  var tierLabel = tierLabels[tier] || tier;

  var div = document.createElement('div');
  div.className = 'login-status';
  div.innerHTML =
    '<p>' +
      wrapper.dataset.swimmerName + ' (' + (swimmerId ? swimmerId.value : '') + ') — ' + tierLabel +
    '</p>';

  header.appendChild(div);
})();
