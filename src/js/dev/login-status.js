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

          // Show/hide role-gated product groups based on selected swimmer's fields
          document.querySelectorAll('[data-requires-role]').forEach(function (el) {
            var role = el.dataset.requiresRole;
            el.style.display = swimmer[role] === true ? '' : 'none';
          });
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

    // If a filter list is present, restrict to those IDs only
    var filterEl = document.getElementById('dev-swimmer-filter');
    var allowedIds = null;
    if (filterEl) {
      try { allowedIds = JSON.parse(filterEl.textContent); } catch (e) {}
    }
    var swimmerIds = Object.keys(swimmers);
    if (allowedIds) swimmerIds = swimmerIds.filter(function (id) { return allowedIds.indexOf(id) !== -1; });

    var tierLabels = {
      usmsStandard:             'Standard Membership',
      usmsStandardEventLicense: 'Event License Standard',
      usmsPlus:                 'USMS+',
      usmsPlusEventLicense:     'Event License USMS+'
    };

    var currentId = sessionStorage.getItem(STORAGE_KEY) || '';

    var select = document.createElement('select');
    select.className = 'login-status__select';

    swimmerIds.forEach(function (id) {
      var s   = swimmers[id];
      var opt = document.createElement('option');
      opt.value       = id;
      opt.textContent = allowedIds ? id : (tierLabels[s.membership.tier] || s.membership.tier);
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
