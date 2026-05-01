// ============================================================
// DEV ONLY — do not load in production
// Injects a user-switcher <select> into the page.
// Selecting a user patches data attributes and form fields,
// then reloads so deferred scripts see the new values.
// ============================================================
(function () {
  var STORAGE_KEY = 'dev-swimmer-id';

  // ── Helpers ───────────────────────────────────────────────

  function setVal(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.value = value;
  }

  function setSelectByValue(id, value) {
    var el = document.getElementById(id);
    if (!el || value == null) return;
    for (var i = 0; i < el.options.length; i++) {
      if (el.options[i].value == value) {
        el.selectedIndex = i;
        return;
      }
    }
  }

  // Populate contact + club fields from a swimmer profile.
  // birthYear is excluded here — call populateBirthYear() separately
  // after registration.js has added year <option> elements.
  function populateRegistrationFields(profile) {
    if (!profile) return;
    var reg = document.querySelector('.full-registration-form');
    if (!reg) return;

    // Only set fields that exist on the profile — partial profiles (e.g. new
    // members) only carry account-creation fields (name, sex, DOB).
    setVal('firstName',    profile.firstName);
    setVal('lastName',     profile.lastName);
    setVal('middleInitial', profile.middleInitial);
    if (profile.email)  setVal('email', profile.email);
    if (profile.zip)    setVal('zipUs', profile.zip);

    setSelectByValue('Gender', profile.gender);
    if (profile.phone)   setVal('phone', profile.phone);
    if (profile.address) setVal('address', profile.address);
    if (profile.city)    setVal('city', profile.city);
    if (profile.state)   setSelectByValue('SelectedState', profile.state);
    if (profile.lmsc) setSelectByValue('selectedLmsc', profile.lmsc.toLowerCase());

    if (profile.birthDate) {
      var parts = profile.birthDate.split('/'); // MM/DD/YYYY
      setSelectByValue('BirthMonth', parseInt(parts[0], 10));
      setSelectByValue('BirthDay',   parseInt(parts[1], 10));
    }
  }

  function populateBirthYear(profile) {
    if (!profile || !profile.birthDate) return;
    if (!document.querySelector('.full-registration-form')) return;
    var parts = profile.birthDate.split('/');
    setSelectByValue('BirthYear', parseInt(parts[2], 10));
  }

  // Must run after registration.js (deferred) has attached coach-interest listeners.
  function populateCoachInterests(profile) {
    if (!profile || profile.coachSelfIdentified == null) return;
    if (!document.querySelector('.full-registration-form')) return;
    var val = profile.coachSelfIdentified ? 'true' : 'false';
    var radio = document.querySelector('input[name="checkbox-interests-self-identified-coach"][value="' + val + '"]');
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    }
  }

  // Must run after registration.js (deferred) has attached the LMSC change
  // listener that populates club options. Triggers the change event on the
  // already-set LMSC select, then sets the club value once options exist.
  function populateClub(profile) {
    if (!profile || !profile.lmsc) return;
    if (!document.querySelector('.full-registration-form')) return;
    var lmscEl = document.getElementById('selectedLmsc');
    if (!lmscEl) return;
    lmscEl.dispatchEvent(new Event('change'));
    if (profile.club) {
      var abbr    = '(' + profile.club + ')';
      var clubEl  = document.getElementById('selectedClub');
      if (clubEl) {
        for (var i = 0; i < clubEl.options.length; i++) {
          if (clubEl.options[i].textContent.indexOf(abbr) !== -1) {
            clubEl.selectedIndex = i;
            break;
          }
        }
      }
    }
  }

  // ── Synchronous patch ─────────────────────────────────────
  // Runs before deferred scripts; patches data attributes and
  // most form fields. BirthYear is handled in DOMContentLoaded.
  var dataEl = document.getElementById('dev-swimmers-data');
  var data;
  if (dataEl) {
    try { data = JSON.parse(dataEl.textContent); } catch (e) {}
  }

  var savedId = sessionStorage.getItem(STORAGE_KEY);
  var defaultIdEl = document.getElementById('dev-default-user');
  var defaultId = null;
  if (defaultIdEl) {
    try { defaultId = JSON.parse(defaultIdEl.textContent); } catch (e) {}
  }
  var activeId = savedId || defaultId;

  if (data && activeId) {
    var siteUser = data.siteUsers[activeId];
    if (siteUser) {
      var tier       = data.membershipTiers[siteUser.membershipTier] || {};
      var profile    = siteUser.swimmerId ? (data.swimmers[siteUser.swimmerId] || null) : null;
      var swimmerName = profile ? profile.firstName + ' ' + profile.lastName : '';

      // Patch add-ons wrapper
      var addonsWrapper = document.querySelector('.masters-addons');
      if (addonsWrapper) {
        addonsWrapper.dataset.membershipLevel         = siteUser.membershipTier || '';
        addonsWrapper.dataset.vsaPrice                = tier.vsaPrice != null ? tier.vsaPrice : '';
        addonsWrapper.dataset.swimmerName             = swimmerName;
        addonsWrapper.dataset.competitionEligible     = tier.competitionEligible ? 'true' : 'false';
        addonsWrapper.dataset.eventLicenseUpgradePrice = tier.eventLicenseUpgradePrice != null ? tier.eventLicenseUpgradePrice : '';
      }

      // Patch registration form wrapper
      var regWrapper = document.querySelector('.full-registration-form');
      if (regWrapper) {
        regWrapper.dataset.membershipLevel = siteUser.membershipTier || '';
        regWrapper.dataset.renew     = siteUser.renew     ? 'true' : 'false';
        regWrapper.dataset.isLapsed  = siteUser.isLapsed  ? 'true' : 'false';
      }

      // Patch hidden swimmerId input
      var swimmerInput = document.getElementById('swimmerId');
      if (swimmerInput) swimmerInput.value = siteUser.swimmerId || '';

      // Show/hide role-gated product groups
      document.querySelectorAll('[data-requires-role]').forEach(function (el) {
        var role = el.dataset.requiresRole;
        el.style.display = siteUser[role] === true ? '' : 'none';
      });

      // Patch nav login state
      var loginWrapper = document.querySelector('.mega-main-menu__actions-login--wrapper');
      if (loginWrapper) {
        var loggedIn = siteUser.loggedIn === true;
        loginWrapper.dataset.loggedIn = loggedIn ? 'true' : 'false';

        if (loggedIn) {
          // Logged in: remove <a> wrapper if present, update label
          var loginLink = loginWrapper.querySelector('a');
          if (loginLink) {
            while (loginLink.firstChild) loginWrapper.insertBefore(loginLink.firstChild, loginLink);
            loginWrapper.removeChild(loginLink);
          }
          var loginLabel = loginWrapper.querySelector('label');
          if (loginLabel) loginLabel.textContent = profile ? profile.firstName.substring(0, 7) : '';
        } else {
          // Logged out: wrap content in <a> if not already
          if (!loginWrapper.querySelector('a')) {
            var a = document.createElement('a');
            a.href = '/account/myusmslogin';
            while (loginWrapper.firstChild) a.appendChild(loginWrapper.firstChild);
            loginWrapper.appendChild(a);
          }
          var loginLabel = loginWrapper.querySelector('label');
          if (loginLabel) loginLabel.textContent = 'Log In';
        }
      }

      // Pre-populate registration form fields (all except BirthYear)
      populateRegistrationFields(profile);
    }
  }

  // ── DOMContentLoaded ──────────────────────────────────────
  // Runs after deferred scripts (including registration.js which
  // populates BirthYear options). Injects the switcher select
  // and sets BirthYear.
  document.addEventListener('DOMContentLoaded', function () {
    // BirthYear and club — options now available after registration.js ran
    if (data && activeId) {
      var siteUser = data.siteUsers[activeId];
      if (siteUser && siteUser.swimmerId) {
        var profile = data.swimmers[siteUser.swimmerId] || null;
        populateBirthYear(profile);
        populateClub(profile);
        populateCoachInterests(profile);
      }
    }

    // Inject user-switcher select
    if (!data) return;
    var siteUsers = data.siteUsers;

    var filterEl = document.getElementById('dev-swimmer-filter');
    var allowedIds = null;
    if (filterEl) {
      try { allowedIds = JSON.parse(filterEl.textContent); } catch (e) {}
    }
    var userIds = Object.keys(siteUsers);
    if (allowedIds) userIds = userIds.filter(function (id) { return allowedIds.indexOf(id) !== -1; });

    var currentId = savedId || defaultId || '';

    var select = document.createElement('select');
    select.className = 'login-status__select';

    userIds.forEach(function (id) {
      var u   = siteUsers[id];
      var opt = document.createElement('option');
      opt.value       = id;
      opt.textContent = u.label || id;
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

    var container = document.createElement('div');
    container.className = 'login-status';

    var inner = document.createElement('div');
    inner.className = 'usms-container';
    inner.appendChild(select);
    container.appendChild(inner);
    document.body.appendChild(container);
  });
})();
