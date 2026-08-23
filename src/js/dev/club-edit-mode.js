// ============================================================
// DEV ONLY — do not load in production
// Toggles club-edit.html between "Create Club" (blank, default) and
// "Edit Club" (populated with an existing club's data, Payment section
// replaced with "Submit Club Edits for Approval" — mirrors production's
// ClubEditBottom.cshtml, which swaps ClubPayment.cshtml for
// ClubSubmitApproval.cshtml based on Model.PaymentRequired).
// Mode/scenario is set entirely via ?mode=/?clubId= (or a prior visit's
// sessionStorage) — there is no on-page selector UI.
// ============================================================
(function () {
  'use strict';

  var STORAGE_KEY = 'dev-club-edit-mode';

  // A real nav click (club-manage's "Manage Club" vs. club-dashboard's "Add a
  // New Club") always declares ?mode= explicitly, so it should win over
  // whatever mode was last left in sessionStorage from a previous visit.
  var modeFromUrl = new URLSearchParams(window.location.search).get('mode');
  var saved = (modeFromUrl === 'create' || modeFromUrl === 'edit')
    ? modeFromUrl
    : sessionStorage.getItem(STORAGE_KEY) || 'create';
  sessionStorage.setItem(STORAGE_KEY, saved);

  // Reuses the same personas already used elsewhere in this mockup
  // (ClubEditReceipt.njk's Bay Area Masters/Kevin Brown, club-edit.js's own
  // MOCK_COACHES, and the Arlington Park & Aquatic Complex location from
  // locations.json) so an "existing club" looks consistent across pages.
  //
  // Keyed by ?clubId= so a given scenario (e.g. an Affiliate club that pays
  // for the Marketing Bundle) can be loaded directly via URL instead of
  // clicking through the form — local-001 is the default when clubId is
  // omitted or unrecognized.
  var MOCK_CLUBS = {
    // Member Club — membership required, so Club Bundles is hidden entirely
    // (Member Clubs get the bundle benefits for free, no opt-in needed).
    'local-001': {
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
    },
    // Affiliate Club — membership not required, so Club Bundles is shown and
    // this club has already accepted the Marketing Bundle (Yes), which
    // should load with both bundle radios locked.
    'local-002': {
      lmsc: 'a0x3h000001SQWyAAO', // Florida Gold Coast
      clubName: 'Golden Gate Aquatics',
      clubAbbr: 'GGA',
      description: 'A community fitness swim program open to swimmers of all levels, not affiliated through individual USMS membership.',
      practiceDetails: 'Tue/Thu 6:30-7:45pm at the Golden Gate Community Pool.',
      totalSwimmers: '12',
      usmsLiabilityInsurance: 'true',
      membershipRequired: 'false',
      marketingBundle: 'True',
      contact: {
        firstName: 'Dana', lastName: 'Whitfield', city: 'Boca Raton', state: 'FL',
        swimmerId: '318D', phone: '561-555-0148', email: 'dana.whitfield@example.com',
        isMember: true, validated: true
      },
      coach: {
        firstName: 'Priya', lastName: 'Nair', city: 'Boca Raton', state: 'FL',
        swimmerId: '452P', phone: '561-555-0192', email: 'priya.nair@example.org',
        isMember: true, validated: true
      },
      location: {
        name: 'Golden Gate Community Pool',
        street: '4200 NW 22nd Street',
        city: 'Boca Raton', state: 'FL', zip: '33434',
        venues: [{ name: 'Golden Gate Community Pool', subType: 'Outdoor, SCY' }]
      }
    },
    // Affiliate Club — membership not required, so Club Bundles is shown, but
    // this club previously declined the Marketing Bundle (No), which should
    // load with both bundle radios still active so it can be upgraded.
    'local-003': {
      lmsc: 'a0x3h000001SQX4AAO', // Inland Northwest
      clubName: 'Riverbend Fitness Swimming',
      clubAbbr: 'RFS',
      description: 'A low-key fitness swim group for adults looking for structured workouts without a competitive focus.',
      practiceDetails: 'Mon/Wed 5:30-6:45am at the Riverbend Recreation Center.',
      totalSwimmers: '4',
      usmsLiabilityInsurance: 'true',
      membershipRequired: 'false',
      marketingBundle: 'False',
      contact: {
        firstName: 'Owen', lastName: 'Castillo', city: 'Spokane', state: 'WA',
        swimmerId: '279O', phone: '509-555-0173', email: 'owen.castillo@example.com',
        isMember: true, validated: true
      },
      coach: {
        firstName: 'Naomi', lastName: 'Feldman', city: 'Spokane', state: 'WA',
        swimmerId: '506N', phone: '509-555-0164', email: 'naomi.feldman@example.org',
        isMember: true, validated: true
      },
      location: {
        name: 'Riverbend Recreation Center',
        street: '1815 N Ash Street',
        city: 'Spokane', state: 'WA', zip: '99205',
        venues: [{ name: 'Riverbend Recreation Center', subType: 'Indoor, SCY' }]
      }
    }
  };

  var clubIdFromUrl = new URLSearchParams(window.location.search).get('clubId');
  var MOCK_EXISTING_CLUB = MOCK_CLUBS[clubIdFromUrl] || MOCK_CLUBS['local-001'];

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
    setVal('clubName', MOCK_EXISTING_CLUB.clubName);
    setVal('clubAbbr', MOCK_EXISTING_CLUB.clubAbbr);
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
  // paid bundle mid-edit (e.g. local-003 flipping Marketing Bundle to Yes)
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
    if (saved === 'edit') {
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
