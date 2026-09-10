// ============================================================
// club-edit.html — create vs. edit — regular site functionality (loaded on
// every club-edit visit, both dev and prod env).
//
// The URL is self-describing: `?club=<abbreviation>` means "edit this existing
// club" (populate the form, swap Finish & Pay for "Submit Club Edits for
// Approval" — mirrors production's ClubEditBottom.cshtml). No `?club=` means
// "create a new club" (blank form, the default — do nothing here).
//
// club-manage's "Manage Club" links `club-edit.html?club=<abbr>`; club-dashboard's
// "Add a New Club" links the bare `club-edit.html`. Club records come from
// clubsLocal.json, embedded on the page as #clubs-local-data (same data the
// dashboard and club-manage read), keyed by club abbreviation.
//
// Must load NON-deferred and before the deferred club-edit.js so its
// DOMContentLoaded handler is registered first (see populateExistingClub).
// ============================================================
(function () {
  'use strict';

  var SCENARIOS = {};
  try {
    var scEl = document.getElementById('clubs-local-data');
    if (scEl) SCENARIOS = JSON.parse(scEl.textContent) || {};
  } catch (e) { SCENARIOS = {}; }

  var clubFromUrl = new URLSearchParams(window.location.search).get('club');
  var MOCK_EXISTING_CLUB = SCENARIOS[clubFromUrl];
  var isEditMode = !!MOCK_EXISTING_CLUB;

  // ── Helpers ──────────────────────────────────────────────

  function setVal(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.value = value;
  }

  function setRadioByValue(name, value) {
    var radio = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (radio) radio.checked = true;
  }

  // addContact() only builds the card — the Lookup/Add New UI is hidden by
  // whatever *called* it (setContactTitle()/confirmCurrentContact()), which we
  // can't call directly since it depends on private lookup state we're
  // bypassing. Mirror just the hide/show part here instead, so a populated
  // "Edit Club" load looks the same as one a real user just added a contact to.
  // (Coach has no equivalent — the coach lookup fields stay visible even once
  // a coach card exists, so an edit-mode reviewer can still see/use them.)
  function hideContactPrompts() {
    var otherContainer = document.querySelector('.club-contact__other-container');
    if (otherContainer) { otherContainer.style.display = 'none'; otherContainer.style.visibility = 'hidden'; }
    var addNew = document.querySelector('.club-contact__add-new');
    if (addNew) addNew.style.display = 'none';
    var typeForm = document.querySelector('#club-contact .contact-type-form');
    if (typeForm) typeForm.style.display = 'none';
    var listHeader = document.querySelector('#club-contact .contact-list__header');
    if (listHeader) listHeader.classList.add('show');
    var listSettings = document.querySelector('#listContactSettings');
    if (listSettings) listSettings.style.display = '';
  }

  // Bundles the club had already accepted before this session (snapshotted
  // right after populateExistingClub() sets the radios, before club-edit.js's
  // own DOMContentLoaded has run its radio-lock logic) — used to tell "already
  // paid for in a prior session" apart from "just selected this session" for
  // Finish & Pay vs. Submit for Approval, without racing that lock logic.
  var initiallyAcceptedBundles = {};

  // Runs after club-edit.js (deferred) has defined addContact/addCoachCard/
  // addLocationCard, and BEFORE club-edit.js's own DOMContentLoaded handler
  // (registered after this script's, since this script isn't deferred and
  // runs earlier) — so its hasData/lock checks see these values already set.
  function populateExistingClub() {
    setVal('selectLmsc', MOCK_EXISTING_CLUB.lmsc);
    setVal('clubName', MOCK_EXISTING_CLUB.name);
    setVal('clubAbbr', MOCK_EXISTING_CLUB.abbreviation);
    setVal('clubDescription', MOCK_EXISTING_CLUB.description);
    setVal('practiceDetails', MOCK_EXISTING_CLUB.practiceDetails);
    setVal('totalSwimmers', MOCK_EXISTING_CLUB.totalSwimmers);
    setRadioByValue('usmsLiabilityInsurance', MOCK_EXISTING_CLUB.usmsLiabilityInsurance);
    setRadioByValue('membershipRequired', MOCK_EXISTING_CLUB.membershipRequired);
    setRadioByValue('marketingBundle', MOCK_EXISTING_CLUB.marketingBundle);

    CLUB_BUNDLES.forEach(function (bundleKey) {
      var yesRadio = document.getElementById(bundleKey + 'Yes');
      initiallyAcceptedBundles[bundleKey] = !!(yesRadio && yesRadio.checked);
    });

    if (typeof window.addContact === 'function') {
      window.addContact(MOCK_EXISTING_CLUB.contact);
      hideContactPrompts();
    }
    if (typeof window.addCoachCard === 'function') {
      window.addCoachCard(MOCK_EXISTING_CLUB.coach);
    }
    if (typeof window.addLocationCard === 'function') {
      var locs = MOCK_EXISTING_CLUB.locations || [MOCK_EXISTING_CLUB.location];
      locs.forEach(function (loc) {
        if (!loc) return;
        window.addLocationCard({
          name: loc.name, street: loc.street, city: loc.city, state: loc.state, zip: loc.zip
        }, loc.venues);
      });
    }
  }

  // Mirrors production's ClubEditBottom.cshtml: Payment (#club-payment) is
  // swapped for ClubSubmitApproval's simpler "Submit for Approval" section
  // when the club doesn't need to pay again.
  function swapPaymentForApproval() {
    var paymentSection = document.getElementById('club-payment');
    if (!paymentSection || document.getElementById('club-submit-approval')) return;
    paymentSection.style.display = 'none';

    var approval = document.createElement('div');
    approval.className = 'section section-payment';
    approval.id = 'club-submit-approval';
    approval.innerHTML =
      '<h3 class="section__header">Submit Club Edits for Approval</h3>' +
      '<p class="section-payment__contact-pending" style="display: none;">You cannot submit your club until your new club contact has approved their My Account.</p>' +
      '<div class="row button-row__content button-row__content--left">' +
        '<div class="col-xs-12">' +
          '<button class="btn save-section" id="saveClubName" type="button">Submit</button>' +
        '</div>' +
      '</div>';
    paymentSection.parentNode.insertBefore(approval, paymentSection.nextSibling);

    var btn = approval.querySelector('#saveClubName');
    if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); });
  }

  // Reverses swapPaymentForApproval() — an existing club that accepts a new
  // paid bundle mid-edit (e.g. RFS flipping Marketing Bundle to Yes)
  // owes money again, so Finish & Pay needs to come back. The club already
  // paid its USMS Club Membership Fee in a prior session, though, so that
  // line item stays hidden — only the newly-added bundle should bill.
  function restorePaymentSection() {
    var approval = document.getElementById('club-submit-approval');
    if (approval) approval.remove();
    var paymentSection = document.getElementById('club-payment');
    if (paymentSection) paymentSection.style.display = '';
    var clubFeeRow = document.querySelector('.section-payment__club-fee-row');
    if (clubFeeRow) clubFeeRow.style.display = 'none';
    if (typeof window._updateBillingTotal === 'function') window._updateBillingTotal();
  }

  // Only a bundle the club is newly selecting this session should trigger
  // payment — one accepted in a prior session (see initiallyAcceptedBundles
  // above) was already paid for and shouldn't re-surface Finish & Pay on its own.
  function clubOwesPayment() {
    return CLUB_BUNDLES.some(function (bundleKey) {
      var yesRadio = document.getElementById(bundleKey + 'Yes');
      return yesRadio && yesRadio.checked && !initiallyAcceptedBundles[bundleKey];
    });
  }

  // Keeps Finish & Pay vs. Submit for Approval in sync with the bundle radios
  // any time a bundle selection changes during the session — not just on load.
  function syncPaymentSectionForBundles() {
    if (clubOwesPayment()) {
      restorePaymentSection();
    } else {
      swapPaymentForApproval();
    }
  }

  // ── DOMContentLoaded ─────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    if (isEditMode) {
      populateExistingClub();
      syncPaymentSectionForBundles();

      CLUB_BUNDLES.forEach(function (bundleKey) {
        document.querySelectorAll('input[name="' + bundleKey + '"]').forEach(function (radio) {
          radio.addEventListener('change', syncPaymentSectionForBundles);
        });
      });
    }
  });
}());
