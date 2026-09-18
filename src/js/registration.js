/* globals ValidateField, ValidateDob, MakeColumnWithErrorSameHeight */
(function () {
  // Set by applyRenewalMode() below, consumed later by
  // applyRenewalParticipationDefaults() once the participationInfo/
  // competitionCategory listeners it needs to trigger actually exist.
  var renewalSwimmer = null;

  // ── Renewal mode ────────────────────────────────────────────────────────
  // Simulates production's server-seeded RegistrationSession/IsRenewal flag
  // (see MembershipRepository.FillRegistrationDataForRenewal in production) —
  // same URL for new and renewing members either way, just seeded
  // differently before this page renders. Since this mockup has no real
  // login/session backend, the Renew/Create buttons on
  // login-to-registration-page/ set this sessionStorage flag immediately
  // before navigating here (both link to the same /registration/ URL).
  // Consumed once and cleared so a plain reload doesn't stay stuck in
  // renewal mode.
  (function applyRenewalMode() {
    var mode = sessionStorage.getItem('registrationMode');
    sessionStorage.removeItem('registrationMode');
    if (mode !== 'renew') return;

    var dataEl = document.getElementById('renewal-swimmer-data');
    if (!dataEl) return;
    var swimmer;
    try { swimmer = JSON.parse(dataEl.textContent); } catch (e) { return; }
    if (!swimmer) return;

    function setVal(id, val) {
      var el = document.getElementById(id);
      if (el && val != null) el.value = val;
    }
    function disable(id) {
      var el = document.getElementById(id);
      if (el) el.disabled = true;
    }
    function setPreselect(id, val) {
      var el = document.getElementById(id);
      if (el) el.dataset.preselect = val || '';
    }

    // Header greeting — Nunjucks already renders this for the default
    // new-member persona at build time; renewal's name is only known at
    // runtime (sessionStorage + the embedded JSON), so update it here too.
    var headerName = document.getElementById('renewHeaderFirstName');
    if (headerName && swimmer.firstName) headerName.textContent = swimmer.firstName;

    // Contact info already on file — prefilled, and (matching production's
    // disabled={IsRenewal} on Email/DOB) locked against editing.
    setVal('firstName', swimmer.firstName);
    setVal('lastName', swimmer.lastName);
    setVal('email', swimmer.email);
    setVal('phone', swimmer.phone);
    setVal('address', swimmer.address);
    setVal('city', swimmer.city);
    setVal('zipUs', swimmer.zip);
    setPreselect('Gender', swimmer.gender);
    setPreselect('SelectedState', swimmer.state);

    if (swimmer.birthDate) {
      var bd = swimmer.birthDate.split('/');
      setPreselect('BirthMonth', bd[0]);
      setPreselect('BirthDay', bd[1]);
      setPreselect('BirthYear', bd[2]);
    }

    if (swimmer.lmsc) {
      setPreselect('selectedLmsc', swimmer.lmsc.toLowerCase());
      var lmscEl = document.getElementById('selectedLmsc');
      if (lmscEl && swimmer.club) lmscEl.dataset.preselectClub = swimmer.club;
    }

    disable('email');
    disable('BirthMonth');
    disable('BirthDay');
    disable('BirthYear');

    // Coach status, Liability, Membership type, add-ons (VSA/donations),
    // Payment details, and Acknowledgment are intentionally left blank on
    // renewal — confirmed out of scope, re-affirmed/re-chosen every cycle
    // regardless of membership history.

    // Participation defaults and the auto-renew checkbox need listeners
    // registered further down in this file to exist first (dispatching
    // participationInfo/competitionCategory's change events is how their
    // reveal cascade runs) — stash the swimmer record for
    // applyRenewalParticipationDefaults() to pick up once those are wired.
    renewalSwimmer = swimmer;
  })();

  // ── Selectors ─────────────────────────────────────────────────────────────
  var membershipContainer = document.querySelector('.membership-length--container');
  var paymentFields      = document.querySelector('.registration-payment__fields');
  var autoRenewGroup     = document.querySelector('.form-group.auto-renew');
  var paymentSummary     = document.querySelector('.js-payment-summary');
  var membershipTotalEl  = document.querySelector('.membership-length--total');
  var vsaTotalEl         = document.querySelector('.video-stroke-analysis--total');
  var donationTotalEl    = document.querySelector('.total-donations');
  var agreeCheckbox      = document.getElementById('agreeTerms');
  var registerBtn        = document.getElementById('register-button');
  var strokeFocusDiv     = document.querySelector('.select-stroke-focus');
  var strokeSelect       = document.getElementById('stroke-video-analysis__focus');
  var sslInput           = document.querySelector("input[name='swimming-saves-lives']");
  var shffInput          = document.querySelector("input[name='swimming-hall-of-fame']");
  var lmscInput          = document.querySelector("input[name='lmsc']");

  // ── Helpers ───────────────────────────────────────────────────────────────
  function fmt(n) { return '$' + parseFloat(n || 0).toFixed(2); }
  function parseAmt(el) { return parseFloat((el && el.textContent || '').replace(/[^0-9.]/g, '')) || 0; }
  function inputVal(el) { return el ? parseFloat(el.value) || 0 : 0; }

  function preselectByDataAttr(id) {
    var el = document.getElementById(id);
    if (!el || !el.dataset.preselect) return;
    var val = el.dataset.preselect;
    // Numeric fallback: birthDate.split('/') keeps zero-padded months/days
    // ("05"), but option values aren't zero-padded ("5") — a plain string
    // comparison would never match those, so compare numerically too when
    // both sides parse as numbers.
    var valNum = parseInt(val, 10);
    for (var i = 0; i < el.options.length; i++) {
      var optVal = el.options[i].value;
      if (optVal == val || (!isNaN(valNum) && parseInt(optVal, 10) === valNum)) {
        el.selectedIndex = i;
        return;
      }
    }
  }

  function selectedTile() {
    return document.querySelector('.membership-length--option.selected') || null;
  }

  // ── Payment visibility ────────────────────────────────────────────────────
  function hasPayableSelection() {
    var hasTile     = selectedTile() !== null;
    var hasDonation = [sslInput, shffInput, lmscInput].some(function (el) { return inputVal(el) > 0; });
    return hasTile || hasDonation;
  }

  function setPaymentVisible(visible) {
    if (paymentFields) paymentFields.style.display = visible ? '' : 'none';
  }

  // Auto Renew is only offered on the Standard (currentYear), Event
  // License Standard (competition), and USMS+ (usmsPlus) tiers — matches
  // production's Payment.jsx getAutoRenew(radio.id) enableFor list. The id
  // lives on the tile's radio input, not on the .membership-length--option
  // container itself.
  function updateAutoRenewVisibility() {
    if (!autoRenewGroup) return;
    var tile   = selectedTile();
    var radio  = tile && tile.querySelector('input[type="radio"]');
    var id     = radio ? radio.id : '';
    var active = id === 'currentYear' || id === 'competition' || id === 'usmsPlus';
    autoRenewGroup.style.display = active ? '' : 'none';
    var cb = autoRenewGroup.querySelector('#signup');
    if (active) {
      // Default to checked whenever Auto Renew becomes available — dispatch
      // a real change event so updateAgreeTermsVariant() swaps the
      // agreement to its auto-renew caption/position, same as a manual click.
      if (cb && !cb.checked) {
        cb.checked = true;
        cb.dispatchEvent(new Event('change'));
      }
    } else {
      if (cb) cb.checked = false;
      updateAgreeTermsVariant();
    }
  }

  // ── Agreement swap — Auto Renew replaces the general agreement ───────────
  // Matches production (Payment.jsx): the same #agreeTerms checkbox swaps
  // its caption/validation text and relocates to after the USMS+ block when
  // Auto Renew is checked (showSignUpAgreement), reverting to its original
  // position above USMS+ when unchecked — never a second checkbox. React
  // mounts a fresh uncontrolled checkbox on each swap (always unchecked);
  // mirrored here by explicitly unchecking + clearing error state.
  var GENERAL_AGREEMENT_HELP = 'You need to agree to the terms to complete your registration.';
  var AUTO_RENEW_AGREEMENT_HELP = 'You need to agree to the auto renew terms to complete your registration.';
  var GENERAL_AGREEMENT_HTML = 'I agree that all information I am providing is factual. I agree to the U.S. Masters Swimming <a href="/content/privacy" target="_blank">Privacy Policy</a>. I understand that this membership will take effect immediately and is non-refundable, non-transferable, and expires on December 31, 2026.';
  var AUTO_RENEW_AGREEMENT_HTML = 'I agree that all information I am providing is factual. I agree to the U.S. Masters Swimming <a href="/content/privacy" target="_blank">Privacy Policy</a>. I understand that I am opting in to automatically continuing my membership until I cancel. I understand that I can cancel at any time in My Account. I understand my credit or debit card will be stored in My Account. I understand that this membership will take effect immediately and is non-refundable, non-transferable, and expires on December 31, 2026.';

  var agreeTermsBlock   = document.querySelector('.form-group.agree-terms');
  var agreeTermsHelp    = document.querySelector('.help-block--agree-terms');
  var agreeTermsCaption = document.querySelector('.js-agree-terms-caption');
  var agreeUsmsPlusBlock = document.querySelector('.agree-usmsplus-terms');

  function updateAgreeTermsVariant() {
    if (!agreeTermsBlock || !agreeUsmsPlusBlock) return;
    var signup = document.getElementById('signup');
    var autoRenew = !!(signup && signup.checked);

    if (agreeTermsHelp)    agreeTermsHelp.textContent = autoRenew ? AUTO_RENEW_AGREEMENT_HELP : GENERAL_AGREEMENT_HELP;
    if (agreeTermsCaption) agreeTermsCaption.innerHTML = autoRenew ? AUTO_RENEW_AGREEMENT_HTML : GENERAL_AGREEMENT_HTML;
    agreeUsmsPlusBlock.insertAdjacentElement(autoRenew ? 'afterend' : 'beforebegin', agreeTermsBlock);

    if (agreeCheckbox) agreeCheckbox.checked = false;
    if (agreeTermsHelp) agreeTermsHelp.classList.remove('has-error');
    if (agreeCheckbox) agreeCheckbox.classList.remove('has-error');
    updatePaymentGating();
  }
  var signupCheckbox = document.getElementById('signup');
  if (signupCheckbox) signupCheckbox.addEventListener('change', updateAgreeTermsVariant);

  // ── Payment gating — lock payment interactions until agreement checked ───
  // Card fields are readonly (can't be filled in) until every required field
  // above and the agreement are satisfied — not `disabled`, since a real
  // disabled control never fires click/focus at all (bubbled or otherwise),
  // which would make it impossible to catch and surface validation on a
  // locked interaction. Register and the wallet-pay buttons apply the same
  // logic by never being `disabled` in the first place — real, live elements
  // just styled to look locked (see updatePaymentGating()).
  var CARD_FIELD_IDS = ['cardName', 'cardNumberID', 'cardCodeID', 'expiration', 'cardZipID'];

  function agreementSatisfied() {
    if (!agreeCheckbox || !agreeCheckbox.checked) return false;
    if (isVisible(agreeUsmsPlusBlock)) {
      var usmsPlusCb = document.getElementById('agreeUsmsPlusTerms');
      if (!usmsPlusCb || !usmsPlusCb.checked) return false;
    }
    return true;
  }

  // Mirrors REQUIRED_FIELD_RULES' shape (span + check) but for the agreement
  // checkbox(es) themselves — used when a Register/wallet-pay click is
  // blocked with every required field above already valid, so there's
  // nothing else to point the user at except "you still need to check this".
  var AGREEMENT_FIELD_RULES = [
    {
      span: 'help-block--agree-terms',
      check: function () { return !!(agreeCheckbox && agreeCheckbox.checked); }
    },
    {
      span: 'help-block--agree-usmsplus-terms',
      check: function () {
        if (!isVisible(agreeUsmsPlusBlock)) return true;
        var e = document.getElementById('agreeUsmsPlusTerms');
        return !!(e && e.checked);
      }
    }
  ];

  function validateAgreementFields(scrollToFirst) {
    var firstErrorSpan = null;
    AGREEMENT_FIELD_RULES.forEach(function (rule) {
      var span = document.querySelector('.' + rule.span);
      if (!span) return;
      var valid = rule.check();
      span.classList.toggle('has-error', !valid);
      if (!valid && !firstErrorSpan) firstErrorSpan = span;
    });
    MakeColumnWithErrorSameHeight();
    if (scrollToFirst && firstErrorSpan) firstErrorSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return firstErrorSpan;
  }

  // Single entry point for "a Register/wallet-pay click landed while
  // locked" — checks required fields above first (they read top-to-bottom
  // before Payment, so they take scroll priority), then the agreement
  // checkbox(es) themselves. Covers the case this was built for: every
  // required field already valid, agreement still unchecked — there'd be no
  // required-field error to scroll to otherwise, and the click would
  // silently do nothing.
  function validateOnLockedPaymentClick() {
    if (!paymentLocked()) return false;
    var firstRequiredError = runRequiredFieldsValidation(true);
    // Only reached (and only shown) when every required field above already
    // passes — otherwise this would flag the agreement as a second, unrelated
    // problem alongside whatever's actually still incomplete above it.
    if (!firstRequiredError) validateAgreementFields(true);
    return true;
  }

  function checkCardField(id) {
    if (!isVisible(paymentFields)) return true;
    var e = document.getElementById(id);
    if (!e) return false;
    ValidateField(e);
    return !e.classList.contains('has-error');
  }

  var watchedCardFields = new Set();
  function attachCardFieldWatcher(id) {
    if (watchedCardFields.has(id)) return;
    watchedCardFields.add(id);
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      var span = document.querySelector('.help-block--' + id);
      var valid = checkCardField(id);
      if (span) span.classList.toggle('has-error', !valid);
      MakeColumnWithErrorSameHeight();
    });
  }

  // Register-only, submit-time check of the credit-card fields — separate
  // from the required-fields-above / agreement checks that gate whether
  // Register is clickable in the first place. This only runs once the
  // button is already unlocked: "the actual thing you're about to submit
  // should be valid before it submits." Skips entirely when the card-fields
  // section itself is hidden (an Apple/Google Pay method was picked instead
  // — see wallet-payments.js), same as the old pre-removal validation did.
  // Apple/Google Pay themselves never run this — there's no card to check.
  function validateCardFields(scrollToFirst) {
    var firstErrorSpan = null;
    CARD_FIELD_IDS.forEach(function (id) {
      var span = document.querySelector('.help-block--' + id);
      var valid = checkCardField(id);
      if (span) span.classList.toggle('has-error', !valid);
      attachCardFieldWatcher(id);
      if (!valid && !firstErrorSpan) firstErrorSpan = span;
    });
    MakeColumnWithErrorSameHeight();
    if (scrollToFirst && firstErrorSpan) firstErrorSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return firstErrorSpan;
  }

  // Fires when a required field ABOVE Payment regresses (goes from valid to
  // invalid) while the payment section is already unlocked — see the
  // required-field watcher further down. Whatever was entered for the
  // credit card, and the fact the agreement was checked, no longer apply
  // once something above it isn't actually complete anymore: clear the card
  // fields entirely (a stale value behind a re-disabled field would read as
  // "still on file") and uncheck the agreement(s) rather than leaving them
  // checked against a form that's gone invalid again.
  function resetPaymentSectionForRegression() {
    CARD_FIELD_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.value = '';
      el.classList.remove('has-error', 'has-success');
    });
    document.querySelectorAll('.registration-payment__fields .help-block').forEach(function (span) {
      span.classList.remove('has-error');
    });
    // Set directly rather than via .click()/dispatching 'change' — this is
    // an automatic reset the user didn't initiate, so it shouldn't
    // recursively trigger the checkbox's own change handler (which would
    // re-run required-fields validation and scroll to boot).
    if (agreeCheckbox) agreeCheckbox.checked = false;
    var usmsPlusCb = document.getElementById('agreeUsmsPlusTerms');
    if (usmsPlusCb) usmsPlusCb.checked = false;
  }

  function updatePaymentGating() {
    // paymentLocked() (defined further down, alongside requiredFieldsSatisfied())
    // is a cheap cached-state read — it does NOT re-run validation, so calling
    // updatePaymentGating() from unrelated places (tile selection, donation
    // totals, ...) never triggers a surprise validation pass on its own.
    var locked = paymentLocked();
    // readOnly, not disabled — a disabled control never fires click/focus at
    // all (bubbled or otherwise), which would leave no way to catch a locked
    // click/tab-into on these fields the way Register/wallet-pay already do
    // by staying real, live elements. readonly blocks editing just the same,
    // and production's own CSS (bootstrap-3-usms-patch.css,
    // ContactInformation.css) already styles [readonly] identically to
    // [disabled] on .form-control, so the look doesn't change either.
    CARD_FIELD_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.readOnly = locked;
    });
    // Scoped to .registration-payment__fields so only the card-field labels
    // gray out — agree-terms/auto-renew/USMS+ live outside this container.
    if (paymentFields) paymentFields.classList.toggle('registration-payment__fields--locked', locked);
    if (registerBtn) registerBtn.classList.toggle('btn--payment-locked', locked);
    document.querySelectorAll('.btn-wallet-pay').forEach(function (btn) {
      btn.classList.toggle('btn--payment-locked', locked);
    });
  }

  // The agreement checkbox(es) are what trigger the "check all required
  // fields above" pass (runRequiredFieldsValidation(), defined further down)
  // — not Register, and not any of the unrelated calls to
  // updatePaymentGating() elsewhere on the page. Checking either one (when
  // USMS+ is active, either of the two) only succeeds if every required
  // field above is already valid — if not, the checkbox is immediately
  // reverted to unchecked (synchronously, before any repaint, so it never
  // visibly renders as checked) and the page scrolls to the first invalid
  // field, same as a locked Register/wallet-pay click. Unchecking is always
  // allowed and doesn't re-validate or scroll — that's not someone trying to
  // move forward.
  [agreeCheckbox, document.getElementById('agreeUsmsPlusTerms')].forEach(function (el) {
    if (el) el.addEventListener('change', function () {
      var cb = this;
      if (cb.checked) {
        var firstRequiredError = runRequiredFieldsValidation(true);
        if (firstRequiredError) {
          // Required fields are the actual blocker here, already shown and
          // scrolled to above — bounce the checkbox back without ALSO
          // flagging it as "required". Showing both at once reads as two
          // contradictory messages ("check this" + "you can't check this")
          // for an attempt that was reasonable, just early.
          cb.checked = false;
          updatePaymentGating();
          return;
        }
      }
      // Reaching here means every required field above is already
      // satisfied — so if either agreement checkbox is still unchecked
      // (this one, or its USMS+ counterpart), that's genuinely the one
      // remaining thing, and it's safe to reflect that. No scroll here —
      // this is a direct interaction with the checkbox itself, not a
      // blocked attempt to move past it.
      validateAgreementFields(false);
      updatePaymentGating();
    });
  });

  // ── Variable terms ────────────────────────────────────────────────────────
  // Tier tiles carry data-terms-keys="key1,key2" — JS shows matching
  // production-class terms blocks and enables their checkboxes.
  var termsBlocks = {
    usmsPlus: document.querySelector('.agree-usmsplus-terms')
  };

  function updateVariableTerms() {
    var tile      = selectedTile();
    var activeKeys = new Set();
    if (tile) {
      var raw = tile.dataset.termsKeys || '';
      raw.split(',').forEach(function (k) { if (k) activeKeys.add(k.trim()); });
    }

    Object.keys(termsBlocks).forEach(function (key) {
      var block  = termsBlocks[key];
      if (!block) return;
      var active = activeKeys.has(key);
      block.style.display = active ? '' : 'none';
      var cb  = block.querySelector('input[type="checkbox"]');
      var lbl = block.querySelector('label');
      if (cb)  { cb.disabled = !active; if (!active) cb.checked = false; }
      if (lbl) lbl.classList.toggle('disabled', !active);
    });

    updatePaymentGating();
  }

  // ── Agreement / submit ────────────────────────────────────────────────────
  // The agree-terms checkbox itself is never disabled based on form
  // completeness, matching production (Payment.jsx) — the Checkbox usage for
  // #agreeTerms passes no `disabled` prop, so it's always clickable, even
  // before a membership option is selected. Register and the card
  // fields/wallet buttons it gates ARE locked until it's checked (see
  // updatePaymentGating() above) — a deviation from production, which never
  // disables Register on form completeness either. Register's click handler
  // is currently a no-op with the mock validate() removed (see below), so
  // there's no error-highlighting to describe here yet.

  // ── Card expiration auto-slash ────────────────────────────────────────────
  // Matches production (Payment.jsx componentDidMount:
  // $('input[name="expiration"]').mask('09/09')) — that's jQuery's
  // maskedinput plugin, which isn't loaded here, so this reproduces the same
  // user-facing behavior (digits only, "/" auto-inserted after mm) directly.
  var expirationInput = document.getElementById('expiration');
  if (expirationInput) {
    expirationInput.addEventListener('input', function () {
      var digits = this.value.replace(/\D/g, '').slice(0, 4);
      this.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
    });
  }

  // ── Payment summary (subtotals) ───────────────────────────────────────────
  function buildPaymentSummary() {
    if (!paymentSummary) return;
    paymentSummary.innerHTML = '';

    var membership = parseAmt(membershipTotalEl);
    var vsa        = parseAmt(vsaTotalEl);
    var donations  = inputVal(sslInput) + inputVal(shffInput) + inputVal(lmscInput);
    var total      = membership + vsa + donations;

    function addLine(label, amount, cls) {
      if (amount === 0 && cls !== 'total') return;
      var p = document.createElement('p');
      p.className = 'payment-info__line-item payment-info__line-item--' + cls;
      p.innerHTML = label + ': <span class="payment-info__line-item--price">' + fmt(amount) + '</span>';
      paymentSummary.appendChild(p);
    }

    addLine('USMS Membership Fee', membership, 'usms');
    addLine('Video Stroke Analysis', vsa, 'vsa');
    addLine('Total Donations', donations, 'donations');
    var totalP = document.createElement('p');
    totalP.className = 'payment-info__line-item payment-info__line-item--total';
    totalP.innerHTML = 'Total charge: <span class="payment-info__line-item--price">' + fmt(total) + '</span>';
    paymentSummary.appendChild(totalP);
  }

  // ── Donations ─────────────────────────────────────────────────────────────
  function updateDonationTotal() {
    var total = inputVal(sslInput) + inputVal(shffInput) + inputVal(lmscInput);
    if (donationTotalEl) donationTotalEl.textContent = fmt(total);
    buildPaymentSummary();
    setPaymentVisible(hasPayableSelection());
  }

  document.querySelectorAll('.btn-donate').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (sslInput) sslInput.value = parseFloat(this.value).toFixed(2);
      updateDonationTotal();
    });
  });
  [sslInput, shffInput, lmscInput].forEach(function (el) {
    if (el) el.addEventListener('change', updateDonationTotal);
    if (el) el.addEventListener('input', updateDonationTotal);
  });

  // ── VSA ───────────────────────────────────────────────────────────────────
  function resetVsa() {
    var priceEl = document.querySelector('.price-string__video-stroke-analysis');
    if (priceEl) priceEl.textContent = '';
    if (vsaTotalEl) vsaTotalEl.textContent = '$0.00';
    if (strokeSelect) strokeSelect.value = '-1';
    if (strokeFocusDiv) strokeFocusDiv.style.display = 'none';
    document.querySelectorAll('input[name="videoStrokeAnalysis"]').forEach(function (r) {
      r.checked = false;
      r.disabled = true;
      r.closest('label').classList.add('disabled');
    });
  }

  if (strokeFocusDiv) strokeFocusDiv.style.display = 'none';

  document.querySelectorAll('input[name="videoStrokeAnalysis"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (strokeFocusDiv) strokeFocusDiv.style.display = this.value === 'yes' ? '' : 'none';
      if (vsaTotalEl && this.value === 'no') { vsaTotalEl.textContent = '$0.00'; buildPaymentSummary(); }
      if (this.value === 'yes' && strokeSelect) strokeSelect.value = '-1';
    });
  });

  if (strokeSelect) {
    strokeSelect.addEventListener('change', function () {
      if (this.value === '-1') return;
      var tile = selectedTile();
      var vsaPrice = tile ? parseFloat(tile.dataset.vsaPrice || 0) : 110;
      if (vsaTotalEl) vsaTotalEl.textContent = fmt(vsaPrice);
      buildPaymentSummary();
    });
  }

  // ── Membership tile selection ─────────────────────────────────────────────
  function activateTile(col) {
    var tile = col && col.querySelector('.membership-length--option');
    if (tile) { tile.removeAttribute('aria-hidden'); tile.removeAttribute('disabled'); }
  }

  function deactivateTile(col) {
    var tile = col && col.querySelector('.membership-length--option');
    if (tile) {
      tile.setAttribute('aria-hidden', 'true');
      tile.setAttribute('disabled', '');
      var radio = tile.querySelector('input[type="radio"]');
      if (radio) radio.checked = false;
    }
  }

  function resetMembershipSelection() {
    document.querySelectorAll('.membership-length--option').forEach(function (t) { t.classList.remove('selected'); });
    document.querySelectorAll('input[name="length"]').forEach(function (r) { r.checked = false; });
    if (membershipTotalEl) membershipTotalEl.textContent = '$0.00';
    updateVariableTerms();
    updateAutoRenewVisibility();
  }

  // ── Membership tile selection ─────────────────────────────────────────────
  // Class manipulation and click wiring live in membership-options.js.
  // This handler runs the registration-specific logic after a tile is selected.
  document.addEventListener('membershipTierSelected', function (e) {
    var tile = e.detail.tile;

    var price = parseFloat(tile.dataset.price || 0);
    if (membershipTotalEl) membershipTotalEl.textContent = fmt(price);

    var vsaPrice    = parseFloat(tile.dataset.vsaPrice || 0);
    var priceEl     = document.querySelector('.price-string__video-stroke-analysis');
    var vsaSelected = document.querySelector('input[name="videoStrokeAnalysis"][value="yes"]:checked') !== null;

    if (vsaSelected) {
      if (priceEl) priceEl.textContent = vsaPrice === 0 ? ' for FREE!' : ' for $' + vsaPrice.toFixed(2);
      if (vsaTotalEl) vsaTotalEl.textContent = fmt(vsaPrice);
    } else {
      resetVsa();
      document.querySelectorAll('input[name="videoStrokeAnalysis"]').forEach(function (r) {
        r.disabled = false;
        r.closest('label').classList.remove('disabled');
      });
      if (priceEl) priceEl.textContent = vsaPrice === 0 ? ' for FREE!' : ' for $' + vsaPrice.toFixed(2);
    }

    updateVariableTerms();
    updateAutoRenewVisibility();
    buildPaymentSummary();
    setPaymentVisible(hasPayableSelection());
  });

  // ── Competition flow helpers (cascade reset downward) ────────────────────
  function resetCompetitionTerms() {
    var block = document.querySelector('.agree-terms-competition');
    var cb    = document.getElementById('agree-terms-competition');
    if (block) block.style.display = 'none';
    if (cb)   cb.checked = false;
    if (membershipContainer) membershipContainer.classList.add('disabled');
    // Restore cols to initial load state
    document.querySelectorAll('.membership-length--option').forEach(function (tile) {
      tile.parentElement.style.display = tile.dataset.initialDisplay || 'flex';
      deactivateTile(tile.parentElement);
    });
    resetMembershipSelection();
    resetVsa();
    buildPaymentSummary();
  }

  function resetCompetitionCertification() {
    var group = document.querySelector('.competition-certification');
    if (group) group.style.display = 'none';
    document.querySelectorAll('input[name="CompetitionMembership"]').forEach(function (r) { r.checked = false; });
    resetCompetitionTerms();
  }

  function resetNationalRecognition() {
    var group = document.querySelector('.national-recognition');
    if (group) group.style.display = 'none';
    document.querySelectorAll('input[name="nationalRecognition"]').forEach(function (r) { r.checked = false; });
    resetCompetitionCertification();
  }

  function resetCompetitionCategory() {
    var group = document.querySelector('.competition-category');
    if (group) group.style.display = 'none';
    document.querySelectorAll('input[name="competitionCategory"]').forEach(function (r) { r.checked = false; });
    resetNationalRecognition();
  }

  // ── Participation radio ───────────────────────────────────────────────────
  document.querySelectorAll('input[name="participationInfo"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      resetCompetitionCategory();

      if (this.value === 'yes') {
        var group = document.querySelector('.competition-category');
        if (group) group.style.display = '';
      } else {
        // No: show the standard (no-events) tiers — Standard Membership and
        // Year-Plus — no agreement/certification gates this path.
        if (membershipContainer) membershipContainer.classList.remove('disabled');
        document.querySelectorAll('.membership-length--option').forEach(function (tile) {
          var col = tile.parentElement;
          var radio = tile.querySelector('input[type="radio"]');
          if (tile.dataset.noEventsDefault === 'true' || (radio && radio.id === 'nextYear')) {
            col.style.display = 'flex';
            activateTile(col);
          } else {
            col.style.display = 'none';
            deactivateTile(col);
          }
        });
      }
    });
  });

  // ── Competition Category radio ────────────────────────────────────────────
  document.querySelectorAll('input[name="competitionCategory"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      resetNationalRecognition();
      if (this.value === 'mens-open') {
        var block = document.querySelector('.agree-terms-competition');
        if (block) block.style.display = '';
      } else {
        // Progressive disclosure: only reveal National Recognition here.
        // Certification and the Agreement stay hidden until each preceding
        // checkbox is actually checked (see those handlers below) — no more
        // "unchecked defaults to showing the agreement anyway."
        var group = document.querySelector('.national-recognition');
        if (group) group.style.display = '';
      }
    });
  });

  // ── Participation default (2027 policy update) ────────────────────────────
  // Event participation defaults to Yes on load for every persona, which
  // reveals Competition Category (left unselected) — triggered via the real
  // change event so it runs through the same reveal cascade a manual click
  // would, rather than silently setting display styles.
  var participationYesDefault = document.getElementById('participationInfoYes');
  if (participationYesDefault) {
    participationYesDefault.checked = true;
    participationYesDefault.dispatchEvent(new Event('change'));
  }

  // ── Renewal mode: carry forward on-file competition category + auto-renew ──
  // Unlike the coach/add-on/payment fields above, these are meant to survive
  // being set here, landing on whichever downstream section that category
  // implies (agree-terms for mens-open, national-recognition otherwise) —
  // left for the member to answer fresh either way.
  if (renewalSwimmer) {
    if (renewalSwimmer.competitionCategory) {
      var compCategoryRadio = document.querySelector('input[name="competitionCategory"][value="' + renewalSwimmer.competitionCategory + '"]');
      if (compCategoryRadio) {
        compCategoryRadio.checked = true;
        compCategoryRadio.dispatchEvent(new Event('change'));
      }
    }
    // Automatic renewal defaults to yes (2027 policy update) — the rest of
    // the Payment section (card details, terms acknowledgment) stays blank.
    var autoRenew = document.getElementById('signup');
    if (autoRenew) autoRenew.checked = true;
  }

  // ── National Recognition radio ────────────────────────────────────────────
  // "yes" reveals Certification and the Agreement together (Certification
  // no longer gates the Agreement's visibility — see below). "no" opens a
  // confirmation modal explaining the eligibility tradeoff before deciding
  // what to reveal (see the modal handler further down).
  document.querySelectorAll('input[name="nationalRecognition"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      resetCompetitionCertification();
      if (this.value === 'no') {
        openModal(document.getElementById('modalNationalRecognitionDecline'));
      } else {
        var group = document.querySelector('.competition-certification');
        if (group) group.style.display = '';
        var block = document.querySelector('.agree-terms-competition');
        if (block) block.style.display = '';
      }
    });
  });

  // ── National Recognition "no" confirmation modal ──────────────────────────
  // Mirrors modal.js's own open sequence (that file only listens for clicks
  // on [data-modal-target] elements, so opening programmatically needs its
  // own copy of the same steps rather than a user click to react to).
  function openModal(modal) {
    if (!modal) return;
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade in';
    document.body.appendChild(backdrop);
    modal.classList.add('in');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.body.style.paddingRight = scrollbarWidth + 'px';
  }

  (function () {
    var modal = document.getElementById('modalNationalRecognitionDecline');
    if (!modal) return;

    function showOnlyAgreement() {
      var cert = document.querySelector('.competition-certification');
      var agree = document.querySelector('.agree-terms-competition');
      if (cert) cert.style.display = 'none';
      if (agree) agree.style.display = '';
    }

    function showBoth() {
      var cert = document.querySelector('.competition-certification');
      var agree = document.querySelector('.agree-terms-competition');
      if (cert) cert.style.display = '';
      if (agree) agree.style.display = '';
    }

    // Radios only stage a choice — Continue is what applies it and closes
    // the modal (see modal.njk's modalHideCloseButton; there's no X or
    // Cancel, so Continue is the only way out). "Yes, opt out" behaves like
    // the old "I understand" confirm; "No, remain eligible" behaves like
    // the old Cancel.
    var continueBtn = document.getElementById('nationalRecognitionDeclineContinue');
    modal.querySelectorAll('input[name="nationalRecognitionDeclineChoice"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (continueBtn) continueBtn.disabled = false;
      });
    });

    if (continueBtn) {
      continueBtn.addEventListener('click', function () {
        var choice = modal.querySelector('input[name="nationalRecognitionDeclineChoice"]:checked');
        if (!choice) return;
        if (choice.value === 'yes') {
          showOnlyAgreement();
        } else {
          // "No, remain eligible" reverses the opt-out — flip the main
          // question's radio back to Yes so it reflects that choice, rather
          // than leaving it stuck on "No" while showing the Yes-shaped view.
          var mainYesRadio = document.getElementById('nationalRecognitionYes');
          if (mainYesRadio) {
            mainYesRadio.checked = true;
            mainYesRadio.dispatchEvent(new Event('change'));
          }
          showBoth();
        }

        // Reset the modal's own choice back to blank so a later reopen
        // (e.g. toggling the main question again) starts fresh instead of
        // showing whatever was picked last time.
        modal.querySelectorAll('input[name="nationalRecognitionDeclineChoice"]').forEach(function (r) { r.checked = false; });
        if (continueBtn) continueBtn.disabled = true;
      });
    }
  })();

  // ── Competition Certification checkbox ────────────────────────────────────
  // Purely informational now — no longer gates the Agreement's visibility
  // (previously checking/unchecking this showed/hid it; that script has
  // been removed so both can be visible at the same time).

  // ── Competition agreement + certification — gates event tier display ─────
  // Membership Options only unlock once the Agreement is checked, and — when
  // the "I certify" checkbox is showing (women's category, national
  // recognition opted in) — that's checked too. Either checkbox changing
  // re-evaluates the gate, matching the "I acknowledge" pattern applied to
  // both fields instead of just one.
  var competitionAgree   = document.getElementById('agree-terms-competition');
  var competitionCertify = document.getElementById('competitionMembershipYesInput');

  function competitionGatePassed() {
    if (!competitionAgree || !competitionAgree.checked) return false;
    if (isVisible(document.querySelector('.competition-certification')) && (!competitionCertify || !competitionCertify.checked)) return false;
    return true;
  }

  function updateCompetitionGate() {
    if (competitionGatePassed()) {
      if (membershipContainer) membershipContainer.classList.remove('disabled');
      document.querySelectorAll('.membership-length--option').forEach(function (tile) {
        var col = tile.parentElement;
        var radio = tile.querySelector('input[type="radio"]');
        // Event License USMS+ is excluded here on purpose — only Event
        // License Standard and Event License Year-Plus should enable once
        // the agreement/certification gate passes.
        if (tile.dataset.competitionEligible === 'true' && radio && radio.id !== 'usmsPlus') {
          col.style.display = 'flex';
          activateTile(col);
        } else {
          col.style.display = 'none';
          deactivateTile(col);
        }
      });
    } else {
      if (membershipContainer) membershipContainer.classList.add('disabled');
      // Restore cols to initial load state
      document.querySelectorAll('.membership-length--option').forEach(function (tile) {
        tile.parentElement.style.display = tile.dataset.initialDisplay || 'flex';
        deactivateTile(tile.parentElement);
      });
      resetMembershipSelection();
      resetVsa();
      buildPaymentSummary();
    }
  }

  if (competitionAgree)   competitionAgree.addEventListener('change', updateCompetitionGate);
  if (competitionCertify) competitionCertify.addEventListener('change', updateCompetitionGate);

  // ── Coach interest ────────────────────────────────────────────────────────
  var coachInterestDiv = document.querySelector('.order-4.col-xs-12');
  if (coachInterestDiv) {
    coachInterestDiv.style.display = 'none';
    document.querySelectorAll('input[name="checkbox-interests-self-identified-coach"]').forEach(function (r) {
      r.addEventListener('change', function () {
        coachInterestDiv.style.display = this.value === 'false' ? '' : 'none';
      });
    });
  }

  // ── Club / LMSC selects ───────────────────────────────────────────────────
  var CLUBS = {
    florida: [
      { value: 'a0w3h000001KFKKAA4', text: 'Unattached - Will appear as (UC14)' },
      { value: 'a0w3h000001KEaWAAW', text: 'All Day Endurance Masters (ADEM)' },
      { value: 'a0w3h000001KEakAAG', text: 'ATAC Masters (ATAC)' },
      { value: 'a0wPO000000BYXpYAO', text: 'Avalon Swim Club (AVSC)' },
      { value: 'a0w3h000001KE3lAAG', text: 'Blue Dolfins Masters (BDO)' },
      { value: 'a0w3h000001KEajAAG', text: 'Blue Marlins Aquatic Club (BMAC)' },
      { value: 'a0w3h000003BrqcAAC', text: 'Bolles School Sharks Masters Swimming (BSS)' },
      { value: 'a0w3h000003bmDGAAY', text: 'BOLTS Masters (BOLTS)' },
      { value: 'a0wPO000000WTq5YAG', text: 'Carrollwood Village Masters Swim Team (CVMST)' },
      { value: 'a0wPO000000S3J7YAK', text: 'Champions Mojo Masters (CHAMP)' },
      { value: 'a0w3h000001KEDQAA4', text: 'Clearwater Aquatic Masters (CAM)' },
      { value: 'a0w3h000001KEctAAG', text: 'FAST Falcons (FLCNS)' },
      { value: 'a0w3h000001KEe5AAG', text: 'Florida Aquatic Combined Team (FACT)' },
      { value: 'a0w3h000001KEeAAAW', text: 'Florida League Of Aquatics (FLA)' },
      { value: 'a0w3h000001KEG7AAO', text: 'Forever Swimmers (4SWM)' },
      { value: 'a0w3h000001KEenAAG', text: 'Gator Swim Club (GSC)' },
      { value: 'a0w3h000001KEJ6AAO', text: 'Greater Tampa Swim Association (GTSA)' },
      { value: 'a0w3h000001KE5FAAW', text: 'Gulf Coast Swim Team Masters (GCST)' },
      { value: 'a0w3h000001KEeqAAG', text: 'Jacksonville Area Warrior Swimmers (JWS)' },
      { value: 'a0w3h000001KESRAA4', text: 'Julington Creek Masters (JCM)' },
      { value: 'a0w3h000001KEXYAA4', text: 'Lake Gators Swim Club (LG)' },
      { value: 'a0w3h000001KEMBAA4', text: 'Lake Highland Masters Swimming Club (LHM)' },
      { value: 'a0w3h000001KEbiAAG', text: 'Legends Masters Swim Club (LMSC)' },
      { value: 'a0wPO000000EKoTYAW', text: 'North Florida Swimming (NFS)' },
      { value: 'a0w3h000001KESMAA4', text: 'Palm Coast Piranha Club (PCSC)' },
      { value: 'a0w3h000001KEeyAAG', text: 'Sarasota Sharks Masters (SHARK)' },
      { value: 'a0w3h000001KEB6AAO', text: 'Sarasota Tsunami Masters (SRQM)' },
      { value: 'a0w3h000001KEXvAAO', text: 'Sea Dragon Aquatics Masters (SDAMS)' },
      { value: 'a0w3h000001KEaPAAW', text: 'Shanna and Bryan Glazer JCC (BGJCC)' },
      { value: 'a0w3h000001KEeuAAG', text: 'Southwest Florida Aquatics (SWFA)' },
      { value: 'a0w3h000001KEeDAAW', text: 'Space Coast Aquanauts (AQNT)' },
      { value: 'a0w3h000001KEf1AAG', text: 'Space Coast Masters (SPCO)' },
      { value: 'a0w3h000001KEHUAA4', text: 'St Augustine Reef Sharks (SARS)' },
      { value: 'a0w3h000001KEe8AAG', text: 'St Pete Masters Inc (SPM)' },
      { value: 'a0w3h000001KEexAAG', text: 'Sun City Center Sharks (SCCS)' },
      { value: 'a0w3h000001KEXxAAO', text: 'Suncoast YMCA Masters Swimming (SYMS)' },
      { value: 'a0w3h000001KESjAAO', text: 'Swamp Water Aquatics Gainesville (SWAG)' },
      { value: 'a0w3h000001KEeEAAW', text: 'Swim Florida Masters (SWIM)' },
      { value: 'a0w3h000001KEC7AAO', text: 'Swim Like A Pro (SLAP)' },
      { value: 'a0w3h000001KEWlAAO', text: 'Swim Melbourne Masters (MELB)' },
      { value: 'a0w3h000001KEWTAA4', text: 'Swim Out (SWOUT)' },
      { value: 'a0wPO0000006r6TYAQ', text: 'Swim Start (STRT)' },
      { value: 'a0wPO0000007HXBYA2', text: 'SwimRise Aquatics (SRA)' },
      { value: 'a0w3h000001KE6OAAW', text: 'T2 Naples Masters (T2NM)' },
      { value: 'a0wPO000000Q99JYAS', text: 'Tampa Elite Aquatics - Manta Rays (TEAM)' },
      { value: 'a0w3h000001KElGAAW', text: 'Tampa Tarpons Masters (TTM)' },
      { value: 'a0w3h000001KEemAAG', text: 'Tampa Y Swimming Masters (TYSM)' },
      { value: 'a0w3h000001KE2iAAG', text: 'Team Windfall (TWFL)' },
      { value: 'a0wPO000000p7vWYAQ', text: 'Torpedo Masters Club (TMC)' },
      { value: 'a0wPO000000BnrpYAC', text: 'Treasure Coast Aquatics (TCA)' },
      { value: 'a0w3h000001KEREAA4', text: 'Unagi (UNAGI)' },
      { value: 'a0w3h000003bl2qAAA', text: 'Villagers Masters Aquatic Squad (VMAS)' },
      { value: 'a0w3h000003bmTTAAY', text: 'Wahoos of Jacksonville (WAHOO)' },
      { value: 'a0w3h000004GoiWAAS', text: 'West Volusia (WVMS)' },
      { value: 'a0w3h000001KEOrAAO', text: 'YMCA of Southwest Florida Masters Hurricanes (SFYH)' }
    ]
  };

  var WORKOUT_GROUPS = {
    'a0w3h000001KFKKAA4': [{ value: 'wg1', text: 'Meet at Blue' }]
  };

  var lmscSelect        = document.getElementById('selectedLmsc');
  var clubSelect        = document.getElementById('selectedClub');
  var workoutGroupSelect = document.getElementById('selectedWorkoutgroup');
  var workoutGroupCol   = document.querySelector('.club-information__column');

  if (workoutGroupCol) workoutGroupCol.style.display = 'none';

  if (lmscSelect && clubSelect) {
    lmscSelect.addEventListener('change', function () {
      var clubs = CLUBS[this.value] || [];
      clubSelect.innerHTML = '<option selected value="-1">Select a club</option>';
      clubs.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.value;
        opt.textContent = c.text;
        clubSelect.appendChild(opt);
      });
      if (workoutGroupSelect) workoutGroupSelect.innerHTML = '<option selected value="-1">Select a workout group</option>';
      if (workoutGroupCol) workoutGroupCol.style.display = 'none';
    });
  }

  if (clubSelect && workoutGroupCol && workoutGroupSelect) {
    clubSelect.addEventListener('change', function () {
      var groups = WORKOUT_GROUPS[this.value] || [];
      workoutGroupSelect.innerHTML = '<option selected value="-1">Select a workout group</option>';
      groups.forEach(function (g) {
        var opt = document.createElement('option');
        opt.value = g.value;
        opt.textContent = g.text;
        workoutGroupSelect.appendChild(opt);
      });
      workoutGroupCol.style.display = groups.length > 0 ? '' : 'none';
    });
  }

  // ── Validation ────────────────────────────────────────────────────────────
  function isVisible(el) {
    if (!el) return false;
    if (el.style.display === 'none') return false;
    return el.offsetParent !== null;
  }

  // Declarative rules for every required field ABOVE the Payment section
  // (Contact Information through Donations) — everything the agreement
  // checkbox(es) gate. Deliberately excludes the credit-card fields (their
  // own visibility/disabled state already skips them, and they live inside
  // the section this engine is gating, not above it) and the agree-terms /
  // agree-usmsplus-terms checkboxes themselves (they're the trigger, not a
  // field being checked). agree-terms-competition IS included — it's a
  // required field in the Participation flow, above Payment.
  // Rules marked with ValidateField delegate to validate.js (extracted from
  // production) which in turn uses validator.js for email, credit card, and
  // length checks — same pattern the old Register-click validation used.
  var REQUIRED_FIELD_RULES = [
    // Contact
    // FirstName, LastName, Gender, and BirthMonth/Day/Year are intentionally
    // not validated here. In production these arrive already filled in from
    // the account-creation step (login-to-registration page) and can't be
    // empty by the time this page is reached — this mockup doesn't replicate
    // that handoff, but the validation UI should still mimic the real
    // (always-valid) state rather than show errors that can't occur in prod.
    {
      span: 'help-block--date-of-birth',
      check: function () {
        var bm = document.getElementById('BirthMonth');
        var bd = document.getElementById('BirthDay');
        var by = document.getElementById('BirthYear');
        if (!bm || !bd || !by || bm.value === '-1' || bd.value === '-1' || by.value === '-1') return true;
        ValidateDob(by, bm, bd);
        var span = document.querySelector('.help-block--date-of-birth');
        return !span || !span.classList.contains('has-error');
      },
      watch: [
        { sel: '#BirthMonth', ev: 'change' },
        { sel: '#BirthDay',   ev: 'change' },
        { sel: '#BirthYear',  ev: 'change' }
      ]
    },
    {
      span: 'help-block--Email',
      check: function () { var e = document.getElementById('email'); if (!e) return false; ValidateField(e); return !e.classList.contains('has-error'); },
      watch: [{ sel: '#email', ev: 'input' }]
    },
    {
      span: 'help-block--Phone',
      check: function () { var e = document.getElementById('phone'); if (!e) return false; ValidateField(e); return !e.classList.contains('has-error'); },
      watch: [{ sel: '#phone', ev: 'input' }, { sel: '#SelectedCountry', ev: 'change' }]
    },
    {
      span: 'help-block--SelectedCountry',
      check: function () { var e = document.getElementById('SelectedCountry'); if (!e) return false; ValidateField(e); return !e.classList.contains('has-error'); },
      watch: [{ sel: '#SelectedCountry', ev: 'change' }]
    },
    {
      span: 'help-block--Address',
      check: function () { var e = document.getElementById('address'); if (!e) return false; ValidateField(e); return !e.classList.contains('has-error'); },
      watch: [{ sel: '#address', ev: 'input' }]
    },
    {
      span: 'help-block--City',
      check: function () { var e = document.getElementById('city'); if (!e) return false; ValidateField(e); return !e.classList.contains('has-error'); },
      watch: [{ sel: '#city', ev: 'input' }]
    },
    {
      span: 'help-block--SelectedState',
      check: function () { var e = document.getElementById('SelectedState'); if (!e) return false; ValidateField(e); return !e.classList.contains('has-error'); },
      watch: [{ sel: '#SelectedState', ev: 'change' }]
    },
    {
      span: 'help-block--selectedLmsc',
      check: function () { var e = document.getElementById('selectedLmsc'); if (!e) return false; ValidateField(e); return !e.classList.contains('has-error'); },
      watch: [{ sel: '#selectedLmsc', ev: 'change' }]
    },
    {
      span: 'help-block--selectedClub',
      check: function () { var e = document.getElementById('selectedClub'); if (!e) return false; ValidateField(e); return !e.classList.contains('has-error'); },
      watch: [{ sel: '#selectedClub', ev: 'change' }]
    },
    {
      span: 'help-block--ZipUs',
      check: function () { var e = document.getElementById('zipUs'); if (!e) return false; ValidateField(e); return !e.classList.contains('has-error'); },
      watch: [{ sel: '#zipUs', ev: 'input' }, { sel: '#SelectedCountry', ev: 'change' }]
    },
    // Interests
    {
      span: 'help-block--checkbox-interests-self-identified-coach',
      check: function () { return !!document.querySelector('input[name="checkbox-interests-self-identified-coach"]:checked'); },
      watch: [{ sel: 'input[name="checkbox-interests-self-identified-coach"]', ev: 'change' }]
    },
    {
      span: 'help-block--checkbox-interests-coach',
      check: function () {
        if (!isVisible(coachInterestDiv)) return true;
        return !!document.querySelector('input[name="checkbox-interests-coach"]:checked');
      },
      watch: [{ sel: 'input[name="checkbox-interests-coach"]', ev: 'change' }]
    },
    // Liability
    {
      span: 'help-block--WaiverTerms',
      check: function () { return !!document.querySelector('input[name="WaiverTerms"][value="agree"]:checked'); },
      watch: [{ sel: 'input[name="WaiverTerms"]', ev: 'change' }]
    },
    // Participation
    {
      span: 'help-block--participationInfo',
      check: function () { return !!document.querySelector('input[name="participationInfo"]:checked'); },
      watch: [{ sel: 'input[name="participationInfo"]', ev: 'change' }]
    },
    {
      span: 'help-block--competitionCategory',
      check: function () {
        if (!isVisible(document.querySelector('.competition-category'))) return true;
        return !!document.querySelector('input[name="competitionCategory"]:checked');
      },
      watch: [{ sel: 'input[name="competitionCategory"]', ev: 'change' }]
    },
    {
      span: 'help-block--nationalRecognition',
      check: function () {
        if (!isVisible(document.querySelector('.national-recognition'))) return true;
        return !!document.querySelector('input[name="nationalRecognition"]:checked');
      },
      watch: [{ sel: 'input[name="nationalRecognition"]', ev: 'change' }]
    },
    {
      span: 'help-block--competitionCertification',
      check: function () {
        if (!isVisible(document.querySelector('.competition-certification'))) return true;
        var e = document.getElementById('competitionMembershipYesInput'); return e && e.checked;
      },
      watch: [{ sel: '#competitionMembershipYesInput', ev: 'change' }]
    },
    {
      span: 'help-block--agree-terms-competition',
      check: function () {
        if (!isVisible(document.querySelector('.agree-terms-competition'))) return true;
        var e = document.getElementById('agree-terms-competition'); return e && e.checked;
      },
      watch: [{ sel: '#agree-terms-competition', ev: 'change' }]
    },
    // Membership tier
    {
      span: 'help-block--length',
      check: function () { return selectedTile() !== null; },
      watch: [{ sel: '.membership-length--option', ev: 'click' }]
    },
    // VSA
    {
      span: 'help-block--videoStrokeAnalysis',
      check: function () { return !!document.querySelector('input[name="videoStrokeAnalysis"]:checked'); },
      watch: [{ sel: 'input[name="videoStrokeAnalysis"]', ev: 'change' }]
    },
    {
      span: 'help-block--stroke-video-analysis__focus',
      check: function () {
        if (!isVisible(strokeFocusDiv)) return true;
        return strokeSelect && strokeSelect.value !== '-1';
      },
      watch: [{ sel: '#stroke-video-analysis__focus', ev: 'change' }]
    },
    // Donations — minimum $5 if non-zero
    {
      span: 'help-block--swimming-saves-lives',
      check: function () { var v = parseFloat(sslInput && sslInput.value) || 0; return v === 0 || v >= 5; },
      watch: [{ sel: "input[name='swimming-saves-lives']", ev: 'input' }]
    },
    {
      span: 'help-block--swimming-hall-of-fame',
      check: function () { var v = parseFloat(shffInput && shffInput.value) || 0; return v === 0 || v >= 5; },
      watch: [{ sel: "input[name='swimming-hall-of-fame']", ev: 'input' }]
    },
    {
      span: 'help-block--lmsc',
      check: function () { var v = parseFloat(lmscInput && lmscInput.value) || 0; return v === 0 || v >= 5; },
      watch: [{ sel: "input[name='lmsc']", ev: 'input' }]
    }
  ];

  // failingRequiredFields tracks which rules are currently showing an error,
  // so requiredFieldsSatisfied() (read by updatePaymentGating(), which runs
  // from many unrelated call sites — tile selection, donation totals, etc.)
  // is a cheap, side-effect-free lookup rather than something that
  // re-validates and re-displays errors on every one of those calls. Actual
  // validation only ever runs from runRequiredFieldsValidation() below,
  // which is wired solely to the agreement checkbox(es) — that's the
  // intended trigger, not incidental page activity.
  var failingRequiredFields = new Set();
  var watchedRequiredFields = new Set();

  function evaluateRequiredField(rule) {
    var span = document.querySelector('.' + rule.span);
    if (!span) return true;
    var valid = rule.check();
    span.classList.toggle('has-error', !valid);
    if (valid) failingRequiredFields.delete(rule.span);
    else failingRequiredFields.add(rule.span);
    return valid;
  }

  // Watches every required field, not just the ones currently failing, so a
  // field that regresses after the section unlocks (e.g. a downstream reset
  // clears a radio that was already answered) re-locks it rather than
  // leaving Register/wallet-pay enabled against a form that's gone invalid
  // again.
  function attachRequiredFieldWatcher(rule) {
    if (watchedRequiredFields.has(rule.span)) return;
    watchedRequiredFields.add(rule.span);
    rule.watch.forEach(function (w) {
      document.querySelectorAll(w.sel).forEach(function (el) {
        el.addEventListener(w.ev, function () {
          // Captured before re-evaluating: if the section was unlocked going
          // into this change and this field just made it invalid, that's a
          // regression — reset the payment section rather than just quietly
          // re-locking it (see resetPaymentSectionForRegression() above).
          // Note: this rule's own span is the only thing evaluateRequiredField
          // touches here — an agreement error already on screen is
          // deliberately left alone. It persists until the agreement
          // checkbox itself is legitimately checked (which only sticks once
          // everything else already passes), not as a side effect of editing
          // some unrelated field while it's still mid-correction.
          var wasUnlocked = !paymentLocked();
          evaluateRequiredField(rule);
          MakeColumnWithErrorSameHeight();
          if (wasUnlocked && !requiredFieldsSatisfied()) resetPaymentSectionForRegression();
          updatePaymentGating();
        });
      });
    });
  }

  // The actual "check all required fields above" pass — runs on every
  // agreement-checkbox change (see the payment-gating section above) and on
  // a locked Register/wallet-pay click (see below), evaluating and
  // displaying has-error on every rule, then watching all of them going
  // forward. scrollToFirst is on for the click path (an explicit "let me
  // pay" action should immediately show why it can't proceed) and off for
  // the checkbox path (already at the bottom of the page; errors are above).
  function runRequiredFieldsValidation(scrollToFirst) {
    var firstErrorSpan = null;
    REQUIRED_FIELD_RULES.forEach(function (rule) {
      var valid = evaluateRequiredField(rule);
      attachRequiredFieldWatcher(rule);
      if (!valid && !firstErrorSpan) firstErrorSpan = document.querySelector('.' + rule.span);
    });
    MakeColumnWithErrorSameHeight();
    if (scrollToFirst && firstErrorSpan) {
      firstErrorSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return firstErrorSpan;
  }

  // Cheap getter for updatePaymentGating() — see failingRequiredFields above.
  function requiredFieldsSatisfied() {
    return failingRequiredFields.size === 0;
  }

  function paymentLocked() {
    return !agreementSatisfied() || !requiredFieldsSatisfied();
  }

  // A locked Register click fires validateOnLockedPaymentClick() — the same
  // thing a locked wallet-pay click does (see wallet-payments.js) — instead
  // of being a silent no-op. Matches how a real disabled control would still
  // need *some* way to tell the user what's missing, just without the
  // `disabled` attribute's built-in refusal to fire `click` at all.
  //
  // Once unlocked (agreement checked, everything above valid), a Register
  // click runs one more pass — validateCardFields() — since Register is the
  // only button that actually submits the credit-card fields; Apple/Google
  // Pay bypass them entirely, so they never need this second check.
  if (registerBtn) {
    registerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (validateOnLockedPaymentClick()) return;
      validateCardFields(true);
    });
  }

  // The card fields are readonly rather than disabled while locked (see
  // updatePaymentGating()) specifically so they stay real, live elements
  // that still fire click/focus — a click or a tab-into on one of them while
  // locked runs the same validation a locked Register/wallet-pay click does.
  // focus is included alongside click so keyboard users tabbing into a
  // locked field (readonly fields, unlike disabled ones, stay in the tab
  // order) get the same feedback a mouse click gets, rather than landing on
  // a field with no explanation for why it won't accept input. Rounds out
  // "interacting with anything in Payment while it's locked runs validation"
  // across all three surfaces (Register, wallet-pay, card fields).
  CARD_FIELD_IDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    ['click', 'focus'].forEach(function (ev) {
      el.addEventListener(ev, function () {
        validateOnLockedPaymentClick();
      });
    });
  });

  // ── Init ──────────────────────────────────────────────────────────────────

  // Hide tiers outside their availability window based on today's date, or a
  // simulated date via ?date=YYYY-MM-DD in the URL (falls back to
  // sessionStorage so it carries forward across navigation, same pattern as
  // ?user= in current-user.js and ?club= in club-edit-mode.js).
  (function () {
    var DATE_KEY   = 'activeDate';
    var dateParam  = new URLSearchParams(window.location.search).get('date');
    var simDate = null;
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      simDate = dateParam;
      sessionStorage.setItem(DATE_KEY, simDate);
    } else {
      var savedDate = sessionStorage.getItem(DATE_KEY);
      if (savedDate && /^\d{4}-\d{2}-\d{2}$/.test(savedDate)) simDate = savedDate;
    }
    var now   = simDate ? new Date(simDate + 'T12:00:00') : new Date();
    var today = (now.getMonth() + 1) * 100 + now.getDate(); // e.g. July 15 → 715
    function md(str) { var p = str.split('-'); return parseInt(p[0], 10) * 100 + parseInt(p[1], 10); }
    document.querySelectorAll('.membership-length--option[data-avail-start]').forEach(function (tile) {
      var start = md(tile.dataset.availStart);
      var end   = tile.dataset.availEnd ? md(tile.dataset.availEnd) : null;
      var available = end === null  ? today >= start
                    : start <= end  ? today >= start && today <= end
                    :                 today >= start || today <= end; // cross-year (e.g. Nov 1–Jun 30)
      if (!available) {
        tile.parentElement.style.display = 'none';
      }
    });

    // DEV/TESTING DEFAULT — not a production rule: only show the two Event
    // License tiers (Event License USMS+ / usmsPlus, Event License Standard
    // / competition) on load, for convenience testing the Event
    // Participation "Yes" default. Standard Membership and Year-Plus are
    // hidden here rather than via any eligibility logic. The whole
    // Membership Options container stays .disabled (see
    // MembershipOptions.njk's default class + the participation reset
    // cascade re-adding it) until the agreement gate passes, so these two
    // show up locked rather than fully hidden.
    document.querySelectorAll('.membership-length--option').forEach(function (tile) {
      var radio = tile.querySelector('input[type="radio"]');
      var showByDefault = radio && (radio.id === 'usmsPlus' || radio.id === 'competition' || radio.id === 'competition-nextYear');
      if (!showByDefault) tile.parentElement.style.display = 'none';
    });

    // Snapshot each col's display after all init logic so resets can restore it.
    document.querySelectorAll('.membership-length--option').forEach(function (tile) {
      tile.dataset.initialDisplay = tile.parentElement.style.display;
    });
  })();

  // Payment fields (auto-renew checkbox + card details) are visible from
  // page load for both new and renewing members, not gated behind
  // selecting a membership tile first — matches production's real layout.
  setPaymentVisible(true);
  buildPaymentSummary();
  updatePaymentGating();

  $('[data-toggle="tooltip"]').tooltip();

  // Pre-select static form fields from data-preselect attributes (renewing/lapsed members).
  preselectByDataAttr('Gender');
  preselectByDataAttr('BirthMonth');
  preselectByDataAttr('BirthDay');
  preselectByDataAttr('SelectedState');

  // Pre-select LMSC and club
  (function () {
    var lmsc = document.getElementById('selectedLmsc');
    var club = document.getElementById('selectedClub');
    if (!lmsc || !lmsc.dataset.preselect) return;
    preselectByDataAttr('selectedLmsc');
    lmsc.dispatchEvent(new Event('change'));
    // Matched by club code (e.g. "SRQM", as stored on swimmer records) found in the
    // option's display text "Club Name (CODE)" — CLUBS' option values are opaque
    // Salesforce IDs, not the short code, so a direct value match won't work here.
    var preselectClub = lmsc.dataset.preselectClub;
    if (preselectClub && club) {
      for (var i = 0; i < club.options.length; i++) {
        if (club.options[i].textContent.indexOf('(' + preselectClub + ')') !== -1) { club.selectedIndex = i; break; }
      }
    }
  })();

  // Populate BirthYear options (server-rendered in production; built here
  // for the mockup). Max year = current year minus 18 (minimum age).
  (function () {
    var select = document.getElementById('BirthYear');
    if (!select) return;
    var maxYear = new Date().getFullYear() - 18;
    for (var y = maxYear; y >= 1920; y--) {
      var opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      select.appendChild(opt);
    }
    preselectByDataAttr('BirthYear');
  })();

  // Forces the deepest reachable state of the page open in one shot: the
  // Competitive participation path (womens category — not mens-open, which
  // skips National Recognition entirely — so this reaches one more reveal
  // step) through the certification/agreement gate to an Event License
  // Standard selection, plus VSA, a donation amount, and the coach-interest
  // follow-up. Event License USMS+ is deliberately never selected here:
  // updateCompetitionGate() excludes it once the gate passes (see that
  // function above), so it can't actually be reached through this page's own
  // UI regardless of which competition-category/national-recognition answers
  // are given — it only ever appears locked, as an upsell preview. Called
  // directly (no validation) by the visual-regression suite
  // (tests/usms-visual-regression-screenshots/screenshots.spec.js) via
  // window.expandAllSections() before capturing this page, so every
  // conditional section's markup is visible in the baseline.
  window.expandAllSections = function () {
    function check(id) {
      var el = document.getElementById(id);
      if (!el) return null;
      el.checked = true;
      el.dispatchEvent(new Event('change'));
      return el;
    }

    check('participationInfoYes');
    check('competitionCategoryWomens');
    check('nationalRecognitionYes');
    check('competitionMembershipYesInput');
    check('agree-terms-competition');

    // The gate passing above enables the Event License tiles — select
    // Event License Standard (id="competition") now that its tile is no
    // longer disabled. Found by radio id, not by class: the Year-Plus tile
    // reuses "membership-length--competition" as an *extra* class (shared
    // styling hook), so a class selector alone matches both tiles.
    var tileRadio = document.getElementById('competition');
    var tile = tileRadio && tileRadio.closest('.membership-length--option');
    if (tile && !tile.hasAttribute('disabled')) check('competition');

    // VSA radios are enabled by the membershipTierSelected handler above.
    check('videoStrokeAnalysisYes');
    var strokeSelect = document.getElementById('stroke-video-analysis__focus');
    if (strokeSelect) { strokeSelect.value = 'Freestyle'; strokeSelect.dispatchEvent(new Event('change')); }

    // A non-zero donation surfaces the "Total Donations" payment-summary line.
    if (sslInput) { sslInput.value = '30'; sslInput.dispatchEvent(new Event('change')); }

    check('checkbox-interests-self-identified-coach--false');
  };

  // Exposed for wallet-payments.js, which builds the Apple/Google Pay
  // buttons after this script has already run its initial
  // updatePaymentGating() pass — it calls registrationUpdatePaymentGating()
  // once those buttons exist so they pick up the current locked state.
  // registrationValidateOnLockedPaymentClick() is the single entry point for
  // "a click landed while locked": it re-checks the real lock condition
  // (agreement checked AND every required field above Payment valid —
  // checking only the agreement checkbox was the earlier bug that let a
  // wallet-pay click open its sheet as soon as it was checked, even with the
  // rest of the form blank), shows errors on whichever required fields are
  // still blank, and — if those are all fine but the agreement itself isn't
  // checked — shows the error on the agreement checkbox(es) instead, so
  // there's always something to point the user at. Returns true if it
  // blocked the click, false if the click should proceed normally.
  window.registrationValidateOnLockedPaymentClick = validateOnLockedPaymentClick;
  window.registrationUpdatePaymentGating = updatePaymentGating;
})();
