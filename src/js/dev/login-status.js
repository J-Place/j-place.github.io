// ============================================================
// DEV ONLY — do not load in production
// Injects a swimmer-switcher <select> into the breadcrumb bar.
// Selecting a swimmer patches the page's data attributes and
// reloads so deferred scripts (addons.js) see the new values.
// ============================================================
(function () {
  var STORAGE_KEY = 'dev-swimmer-id';

  // ── Synchronous patch ─────────────────────────────────────
  // Runs before deferred scripts; overwrites template-rendered
  // data attributes on the add-ons wrapper with the stored swimmer.
  var savedId = sessionStorage.getItem(STORAGE_KEY);
  if (savedId) {
    var dataEl = document.getElementById('dev-swimmers-data');
    if (dataEl) {
      try {
        var data    = JSON.parse(dataEl.textContent);
        var swimmer = data.swimmers[savedId];
        if (swimmer) {
          var tier    = data.membershipTiers[swimmer.membership.tier] || {};
          var wrapper = document.querySelector('.masters-addons');
          if (wrapper) {
            wrapper.dataset.membershipLevel = swimmer.membership.tier;
            wrapper.dataset.vsaPrice        = tier.vsaPrice != null ? tier.vsaPrice : '';
            wrapper.dataset.swimmerName     = swimmer.firstName + ' ' + swimmer.lastName;
          }
          var swimmerInput = document.getElementById('swimmerId');
          if (swimmerInput) swimmerInput.value = swimmer.swimmerId;
        }
      } catch (e) {}
    }
  }

  // ── DOMContentLoaded: inject the select ───────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.breadcrumb-container');
    if (!header) return;

    var dataEl = document.getElementById('dev-swimmers-data');
    if (!dataEl) return;

    var data;
    try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }

    var swimmers = data.swimmers;
    var tierLabels = {
      usmsStandard:             'Standard Membership',
      usmsStandardEventLicense: 'Event License Standard',
      usmsPlus:                 'USMS+',
      usmsPlusEventLicense:     'Event License USMS+'
    };

    var currentId = sessionStorage.getItem(STORAGE_KEY) || '';

    var select = document.createElement('select');
    select.className = 'login-status__select';

    var defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '— Select Swimmer —';
    select.appendChild(defaultOpt);

    Object.keys(swimmers).forEach(function (id) {
      var s   = swimmers[id];
      var opt = document.createElement('option');
      opt.value       = id;
      opt.textContent = tierLabels[s.membership.tier] || s.membership.tier;
      if (id === currentId) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', function () {
      if (this.value) {
        sessionStorage.setItem(STORAGE_KEY, this.value);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      window.location.reload();
    });

    var div = document.createElement('div');
    div.className = 'login-status';
    div.appendChild(select);
    header.appendChild(div);
  });
})();
