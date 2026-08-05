// ============================================================
// DEV ONLY — do not load in production
// Toggles club-edit.html between "Create Club" (blank, default) and
// "Edit Club" (populated with an existing club's data, Payment section
// replaced with "Submit Club Edits for Approval" — mirrors production's
// ClubEditBottom.cshtml, which swaps ClubPayment.cshtml for
// ClubSubmitApproval.cshtml based on Model.PaymentRequired).
// ============================================================
(function () {
  'use strict';

  var STORAGE_KEY = 'dev-club-edit-mode';
  var MODES = [
    { value: 'create', label: 'Create Club' },
    { value: 'edit',   label: 'Edit Club' }
  ];

  var saved = sessionStorage.getItem(STORAGE_KEY) || 'create';

  // Reuses the same personas already used elsewhere in this mockup
  // (ClubEditReceipt.njk's Bay Area Masters/Kevin Brown, club-edit.js's own
  // MOCK_COACHES, and the Arlington Park & Aquatic Complex location from
  // locations.json) so an "existing club" looks consistent across pages.
  var MOCK_EXISTING_CLUB = {
    lmsc: 'a0x3h000001SQXQAA4', // Pacific
    clubName: 'Bay Area Masters',
    clubAbbr: 'BAM',
    description: 'A friendly, competitive Masters swim club serving the greater Bay Area with year-round coached workouts.',
    practiceDetails: 'Mon/Wed/Fri 6:00-7:15am and Sat 8:00-9:30am at the Bay Area Aquatic Center.',
    totalSwimmers: '68',
    usmsLiabilityInsurance: 'true',
    membershipRequired: 'true',
    marketingBundle: 'True',
    contact: {
      firstName: 'Kevin', lastName: 'Brown', city: 'Oakland', state: 'CA',
      swimmerId: '724K', phone: '555-123-4567', email: 'kevin.brown@example.com',
      isMember: true, validated: true
    },
    coach: {
      firstName: 'Marcus', lastName: 'Ellison', city: 'Austin', state: 'TX',
      swimmerId: '601M', phone: '512-555-0201', email: 'marcus.ellison@example.org',
      isMember: true, validated: true
    },
    location: {
      name: 'Arlington Park & Aquatic Complex',
      street: '2650 Waldemere Street',
      city: 'Sarasota', state: 'FL', zip: '34239',
      venues: [{ name: 'Arlington Aquatic Center', subType: 'Outdoor, SCY/LCM' }]
    }
  };

  // ── Helpers ──────────────────────────────────────────────

  function setVal(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.value = value;
  }

  function setRadioByValue(name, value) {
    var radio = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (radio) radio.checked = true;
  }

  // addContact()/addCoachCard() only build the card — the Lookup/Add New UI
  // is hidden by whatever *called* them (setContactTitle()/confirmCurrentContact()
  // for Contact, setTitle()/_hideCoachPrompts() for Coach), none of which we can
  // call directly since they depend on private lookup state we're bypassing.
  // Mirror just the hide/show part here instead, so a populated "Edit Club"
  // load looks the same as one a real user just added a contact/coach to.
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

  function hideCoachPrompts() {
    var lookupSection = document.querySelector('.coach-details');
    if (lookupSection) lookupSection.style.display = 'none';
  }

  // Runs after club-edit.js (deferred) has defined addContact/addCoachCard/
  // addLocationCard, and BEFORE club-edit.js's own DOMContentLoaded handler
  // (registered after this script's, since this script isn't deferred and
  // runs earlier) — so its hasData/lock checks see these values already set.
  function populateExistingClub() {
    setVal('selectLmsc', MOCK_EXISTING_CLUB.lmsc);
    setVal('clubName', MOCK_EXISTING_CLUB.clubName);
    setVal('clubAbbr', MOCK_EXISTING_CLUB.clubAbbr);
    setVal('clubDescription', MOCK_EXISTING_CLUB.description);
    setVal('practiceDetails', MOCK_EXISTING_CLUB.practiceDetails);
    setVal('totalSwimmers', MOCK_EXISTING_CLUB.totalSwimmers);
    setRadioByValue('usmsLiabilityInsurance', MOCK_EXISTING_CLUB.usmsLiabilityInsurance);
    setRadioByValue('membershipRequired', MOCK_EXISTING_CLUB.membershipRequired);
    setRadioByValue('marketingBundle', MOCK_EXISTING_CLUB.marketingBundle);

    if (typeof window.addContact === 'function') {
      window.addContact(MOCK_EXISTING_CLUB.contact);
      hideContactPrompts();
    }
    if (typeof window.addCoachCard === 'function') {
      window.addCoachCard(MOCK_EXISTING_CLUB.coach);
      hideCoachPrompts();
    }
    if (typeof window.addLocationCard === 'function') {
      var loc = MOCK_EXISTING_CLUB.location;
      window.addLocationCard({
        name: loc.name, street: loc.street, city: loc.city, state: loc.state, zip: loc.zip
      }, loc.venues);
    }
  }

  // Mirrors production's ClubEditBottom.cshtml: Payment (#club-payment) is
  // swapped for ClubSubmitApproval's simpler "Submit for Approval" section
  // when the club doesn't need to pay again.
  function swapPaymentForApproval() {
    var paymentSection = document.getElementById('club-payment');
    if (!paymentSection) return;
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

  // ── DOMContentLoaded ─────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    if (saved === 'edit') {
      populateExistingClub();
      swapPaymentForApproval();
    }

    var select = document.createElement('select');
    select.className = 'login-status__select';

    MODES.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m.value;
      opt.textContent = m.label;
      if (m.value === saved) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', function () {
      sessionStorage.setItem(STORAGE_KEY, this.value);
      window.location.reload();
    });

    var bar = document.querySelector('.login-status .usms-container');
    if (bar) {
      bar.appendChild(select);
      return;
    }

    var container = document.createElement('div');
    container.className = 'login-status';
    var inner = document.createElement('div');
    inner.className = 'usms-container';
    inner.appendChild(select);
    container.appendChild(inner);
    document.body.appendChild(container);
  });
}());
