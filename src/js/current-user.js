// ============================================================
// Loaded on every page, both dev and prod env (like club-edit-mode.js).
// Resolves the simulated "current user" from ?user=<swimmerId> in the URL,
// falling back to sessionStorage, falling back to the page's own
// server-rendered default (swimmers[swimmerId] baked in by base.njk) —
// same URL-param-first / sessionStorage-carry-forward pattern as
// ?club= (see club-edit-mode.js, club-manage.js).
// ============================================================
(function () {
  var STORAGE_KEY = 'activeUser';

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

  // Populate contact + club fields from a swimmer record.
  // birthYear is excluded here — call populateBirthYear() separately
  // after registration.js has added year <option> elements.
  function populateRegistrationFields(swimmer) {
    if (!swimmer) return;
    var reg = document.querySelector('.full-registration-form');
    if (!reg) return;

    // Only set fields that exist on the record — partial records (e.g. new
    // members, no-profile placeholders) only carry account-creation fields
    // (name, sex, DOB) or none at all.
    setVal('firstName',    swimmer.firstName);
    setVal('lastName',     swimmer.lastName);
    setVal('middleInitial', swimmer.middleInitial);
    if (swimmer.email)  setVal('email', swimmer.email);
    if (swimmer.zip)    setVal('zipUs', swimmer.zip);

    setSelectByValue('Gender', swimmer.gender);
    if (swimmer.phone)   setVal('phone', swimmer.phone);
    if (swimmer.address) setVal('address', swimmer.address);
    if (swimmer.city)    setVal('city', swimmer.city);
    if (swimmer.state)   setSelectByValue('SelectedState', swimmer.state);
    if (swimmer.lmsc) setSelectByValue('selectedLmsc', swimmer.lmsc.toLowerCase());

    if (swimmer.birthDate) {
      var parts = swimmer.birthDate.split('/'); // MM/DD/YYYY
      setSelectByValue('BirthMonth', parseInt(parts[0], 10));
      setSelectByValue('BirthDay',   parseInt(parts[1], 10));
    }
  }

  function populateBirthYear(swimmer) {
    if (!swimmer || !swimmer.birthDate) return;
    if (!document.querySelector('.full-registration-form')) return;
    var parts = swimmer.birthDate.split('/');
    setSelectByValue('BirthYear', parseInt(parts[2], 10));
  }

  // Must run after registration.js (deferred) has attached coach-interest listeners.
  function populateCoachInterests(swimmer) {
    if (!swimmer || swimmer.coachSelfIdentified == null) return;
    if (!document.querySelector('.full-registration-form')) return;
    var val = swimmer.coachSelfIdentified ? 'true' : 'false';
    var radio = document.querySelector('input[name="checkbox-interests-self-identified-coach"][value="' + val + '"]');
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    }
  }

  // Must run after registration.js (deferred) has attached the LMSC change
  // listener that populates club options. Triggers the change event on the
  // already-set LMSC select, then sets the club value once options exist.
  function populateClub(swimmer) {
    if (!swimmer || !swimmer.lmsc) return;
    if (!document.querySelector('.full-registration-form')) return;
    var lmscEl = document.getElementById('selectedLmsc');
    if (!lmscEl) return;
    lmscEl.dispatchEvent(new Event('change'));
    if (swimmer.club) {
      var abbr    = '(' + swimmer.club + ')';
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

  // ── Resolve the active swimmer ────────────────────────────────────────────
  var dataEl = document.getElementById('site-users-data');
  var data;
  if (dataEl) {
    try { data = JSON.parse(dataEl.textContent); } catch (e) {}
  }

  var userFromUrl = new URLSearchParams(window.location.search).get('user');
  var activeId = null;
  if (data && userFromUrl && data.swimmers[userFromUrl]) {
    activeId = userFromUrl;
    sessionStorage.setItem(STORAGE_KEY, activeId);
  } else if (data) {
    var saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved && data.swimmers[saved]) activeId = saved;
  }

  // No valid override — leave the page's server-rendered default as-is.
  if (data && activeId) {
    var resolved = data.swimmers[activeId];
    var tier = data.membershipTiers[resolved.membershipTier] || {};
    var swimmerName = (resolved.firstName || resolved.lastName)
      ? (resolved.firstName || '') + ' ' + (resolved.lastName || '')
      : '';

    // Patch add-ons wrapper
    var addonsWrapper = document.querySelector('.masters-addons');
    if (addonsWrapper) {
      addonsWrapper.dataset.membershipLevel         = resolved.membershipTier || '';
      addonsWrapper.dataset.vsaPrice                = tier.vsaPrice != null ? tier.vsaPrice : '';
      addonsWrapper.dataset.swimmerName             = swimmerName;
      addonsWrapper.dataset.competitionEligible     = tier.competitionEligible ? 'true' : 'false';
      addonsWrapper.dataset.eventLicenseUpgradePrice = tier.eventLicenseUpgradePrice != null ? tier.eventLicenseUpgradePrice : '';
    }

    // Patch registration form wrapper
    var regWrapper = document.querySelector('.full-registration-form');
    if (regWrapper) {
      regWrapper.dataset.membershipLevel = resolved.membershipTier || '';
      regWrapper.dataset.renew     = resolved.renew     ? 'true' : 'false';
      regWrapper.dataset.isLapsed  = resolved.isLapsed  ? 'true' : 'false';
    }

    // Patch hidden swimmerId input
    var swimmerInput = document.getElementById('swimmerId');
    if (swimmerInput) swimmerInput.value = resolved.swimmerId || '';

    // Show/hide role-gated product groups — matches AddOnProductOptions.njk's
    // build-time check (swimmer[group.requiresRole]), same object now.
    document.querySelectorAll('[data-requires-role]').forEach(function (el) {
      var role = el.dataset.requiresRole;
      el.style.display = resolved[role] === true ? '' : 'none';
    });

    // Patch nav login state
    var loginWrapper = document.querySelector('.mega-main-menu__actions-login--wrapper');
    if (loginWrapper) {
      var loggedIn = resolved.loggedIn === true;
      loginWrapper.dataset.loggedIn = loggedIn ? 'true' : 'false';

      var loginLabel = loginWrapper.querySelector('label');
      if (loggedIn) {
        // Logged in: remove <a> wrapper if present, update label
        var loginLink = loginWrapper.querySelector('a');
        if (loginLink) {
          while (loginLink.firstChild) loginWrapper.insertBefore(loginLink.firstChild, loginLink);
          loginWrapper.removeChild(loginLink);
        }
        if (loginLabel) loginLabel.textContent = resolved.firstName ? resolved.firstName.substring(0, 7) : '';
      } else {
        // Logged out: wrap content in <a> if not already
        if (!loginWrapper.querySelector('a')) {
          var a = document.createElement('a');
          a.href = '/account/myusmslogin';
          while (loginWrapper.firstChild) a.appendChild(loginWrapper.firstChild);
          loginWrapper.appendChild(a);
        }
        if (loginLabel) loginLabel.textContent = 'Log In';
      }
    }

    // Pre-populate registration form fields (all except BirthYear)
    populateRegistrationFields(resolved);

    // BirthYear and club — deferred until DOMContentLoaded (below), since
    // registration.js (deferred) must run first to create those options.
    document.addEventListener('DOMContentLoaded', function () {
      populateBirthYear(resolved);
      populateClub(resolved);
      populateCoachInterests(resolved);
    });
  }
})();
