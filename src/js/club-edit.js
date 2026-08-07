// === Shared state (mirrors production Accordion.js globals) ===
var nextSection = null;
var currentSectionState = null;
var currentCallback = null;

// Snapshot of whether membershipRequired came in pre-answered on page load
// (an existing, already-saved club) — set once in the DOMContentLoaded
// handler below, before the user can touch the radios. A brand-new club
// answering this question for the first time during Create must NOT lock
// it, so the lock has to key off this load-time snapshot rather than a live
// "is it checked right now" check re-run every time the section reopens.
var membershipRequiredLocked = false;

// ── Utilities ────────────────────────────────────────────────────────────────

function FindPos(obj) {
  if (!obj) return 0;
  var curtop = 0;
  if (obj.offsetParent) {
    do { curtop += obj.offsetTop; } while ((obj = obj.offsetParent));
  }
  return curtop;
}

// Closes a section directly via classList rather than jQuery's $.collapse('hide').
// This page loads both Bootstrap 3 (site-wide) and Bootstrap 5 (club-edit.js's own
// pageJS bundle) — whichever last registered $.fn.collapse silently no-ops on
// sections opened with the other version's marker class, so sibling sections were
// getting stuck open. Manipulating the class directly sidesteps that entirely.
function _closeSection(contentEl) {
  if (!contentEl) return;
  contentEl.classList.remove('in', 'show', 'collapsing');
  contentEl.style.height = '';
  setSectionInputStatus(contentEl, true);
  if (contentEl.parentElement) contentEl.parentElement.classList.remove('isEdit');
}

// Membership Requirement — an existing, already-saved club's Member/Affiliate
// status can't be flipped later via Edit, so lock both radios once the
// load-time snapshot says it came in pre-answered. A brand-new club
// answering this for the first time during Create stays editable even after
// its section is saved and reopened, since membershipRequiredLocked stays
// false for the whole session in that case.
function lockMembershipRequiredIfAnswered() {
  if (membershipRequiredLocked) {
    document.querySelectorAll('input[name="membershipRequired"]').forEach(function (r) {
      r.disabled = true;
    });
  }
}

function setSectionInputStatus(section, disabled) {
  if (!section) return;
  // Club Name and Club Bundles manage their own disabled state
  if (section.id === 'club-name__content' || section.id === 'club-bundles__content') return;
  section.querySelectorAll('input').forEach(function (el) { el.disabled = disabled; });
  section.querySelectorAll('select').forEach(function (el) { el.disabled = disabled; });
  section.querySelectorAll('textarea').forEach(function (el) { el.disabled = disabled; });
  section.querySelectorAll('button').forEach(function (el) {
    if (!el.className || el.className.indexOf('section__edit-btn') === -1) {
      el.disabled = disabled;
    }
  });
  // The blanket enabling above would otherwise clobber the membership-required lock.
  lockMembershipRequiredIfAnswered();
}

function saveSectionState(section) {
  if (!section) return null;
  var state = { inputs: [], selects: [], textareas: [] };
  section.querySelectorAll('input:not([type="file"])').forEach(function (el) {
    state.inputs.push({ name: el.name, id: el.id, value: el.value, checked: el.checked, type: el.type });
  });
  section.querySelectorAll('select').forEach(function (el) {
    state.selects.push({ name: el.name, id: el.id, value: el.value.replace('{', '').replace('}', '').toUpperCase() });
  });
  section.querySelectorAll('textarea').forEach(function (el) {
    state.textareas.push({ name: el.name, id: el.id, value: el.value });
  });
  return state;
}

function deepEqual(a, b) {
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    var keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (var k in a) {
      if (!(k in b) || !deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return a === b;
}

function compareSections(section) {
  return deepEqual(currentSectionState, saveSectionState(section));
}

function sectionSaved(section) {
  if (!section) return true;
  var result = false;  // production default — unknown sections (e.g. coach) always prompt save
  switch (section.id) {
    case 'location-information__content':
      result = section.querySelectorAll('.list__container .list-item').length > 0;
      break;
    case 'club-contact__content':
      result = section.querySelector('.list-item--new,.list__container--modified,.location-details.show,.edit-list') === null
        && section.querySelector('.list-item:not(.list-item--new)') !== null;
      break;
    case 'club-name__content':
    case 'club-details__content':
    case 'club-bundles__content':
      result = compareSections(section);
      break;
    default:
      break;
  }
  return result;
}

// ── Loading overlay ──────────────────────────────────────────────────────────

function showLoadingOverlay() {
  var el = document.querySelector('.loading');
  if (el) el.style.display = 'flex';
}

function hideLoadingOverlay() {
  var el = document.querySelector('.loading');
  if (el) el.style.display = 'none';
}

// ── Modal helpers ────────────────────────────────────────────────────────────

function _openModal(id) {
  var el = document.querySelector('#' + id);
  if (!el) return;
  var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  var backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop fade in';
  document.body.appendChild(backdrop);
  el.style.display = 'block';
  el.classList.add('in');
  el.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.body.style.paddingRight = scrollbarWidth + 'px';
}

function _closeModal(id) {
  var el = document.querySelector('#' + id);
  if (!el) return;
  el.style.display = '';
  el.classList.remove('in', 'show');
  el.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('.modal-backdrop').forEach(function (b) { b.parentNode.removeChild(b); });
  document.body.classList.remove('modal-open');
  document.body.style.paddingRight = '';
}

function showSaveModal(callback) {
  if (callback) currentCallback = callback;
  _openModal('modalSaveSection');
}

function closeSaveModal() {
  _closeModal('modalSaveSection');
}

function showErrorModal(message) {
  var el = document.querySelector('#modalError .modal-body p');
  if (el) el.innerHTML = message || '';
  _openModal('modalError');
}

function closeErrorModal() {
  var el = document.querySelector('#modalError .modal-body p');
  if (el) el.innerHTML = '';
  _closeModal('modalError');
}

function showMessageModal(message) {
  var el = document.querySelector('#modalMessage .modal-body p');
  if (el) el.innerHTML = message || '';
  _openModal('modalMessage');
}

function closeMessageModal() {
  var el = document.querySelector('#modalMessage .modal-body p');
  if (el) el.innerHTML = '';
  _closeModal('modalMessage');
}

function showApprovalMessageModal(message) {
  var el = document.querySelector('#modalMessageApproval .modal-body p');
  if (el) el.innerHTML = message || '';
  _openModal('modalMessageApproval');
}

function closeApprovalMessageModal() {
  var el = document.querySelector('#modalMessageApproval .modal-body p');
  if (el) el.innerHTML = '';
  _closeModal('modalMessageApproval');
}

function showConfirmationModal(message, callback) {
  var el = document.querySelector('#modalConfirmation .modal-body p');
  if (el) el.innerHTML = message || '';
  if (callback) {
    var btn = document.querySelector('#modalConfirmation button.btn-success');
    if (btn) btn.onclick = callback;
  }
  _openModal('modalConfirmation');
}

function closeConfirmationModal() {
  _closeModal('modalConfirmation');
}

function handleCancelModal(el) {
  var modal = el && el.closest ? el.closest('.modal') : null;
  if (modal) {
    modal.style.display = '';
    modal.classList.remove('in', 'show');
    modal.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.modal-backdrop').forEach(function (b) { b.parentNode.removeChild(b); });
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
  }
}

// ── Validation ───────────────────────────────────────────────────────────────

function setInputStatus(input, isValid) {
  input.classList.remove('has-success', 'has-error');
  var helpBlock = document.querySelector('span.help-block--' + input.name);
  try {
    if (isValid) {
      input.classList.add('has-success');
      if (input.parentNode.classList.contains('form-group')) {
        input.parentNode.classList.remove('has-error');
        input.parentNode.classList.add('has-success');
      }
      if (input.type === 'file') {
        input.parentNode.parentNode.querySelector('span.help-block').classList.remove('has-error');
      } else if (helpBlock) {
        helpBlock.classList.remove('has-error');
      }
    } else {
      input.classList.add('has-error');
      if (input.parentNode.classList.contains('form-group')) {
        input.parentNode.classList.add('has-error');
        input.parentNode.classList.remove('has-success');
      }
      if (input.type === 'file') {
        input.parentNode.parentNode.querySelector('span.help-block').classList.add('has-error');
      } else if (helpBlock) {
        helpBlock.classList.add('has-error');
      }
    }
  } catch (err) { /* ignore traversal errors */ }
}

function _isValidUrl(url) {
  return /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi.test(url);
}
function _isValidEmail(email) {
  return /^[^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(String(email));
}
function _isValidPhone(v) { return /^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/.test(v); }
function _isValidZip(v) { return /^\d{5}([-\s]\d{4})?$/.test(v); }
function _isValidCvv(v) { return /^\d{3,4}$/.test(v); }
function _isValidExpiration(v) {
  if (!/^[0-9]{1,2}\/[0-9]{1,2}$/.test(v)) return false;
  var parts = v.split('/');
  var now = new Date();
  var inputDate = new Date(Number('20' + parts[1]), Number(parts[0]) - 1);
  return inputDate >= new Date(now.getFullYear(), now.getMonth());
}
function _isValidCardNumber(v) {
  return /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})|(?:3\d{15})$/.test(v);
}

function validateField(field) {
  if (!field) return false;
  switch (field.type) {
    case 'text':
      if (field.id === 'socialFacebook' || field.id === 'socialTwitter' || field.id === 'socialInstagram') {
        setInputStatus(field, _isValidUrl('www.test.com/' + field.value));
      } else if (field.id === 'cardNumber') {
        setInputStatus(field, _isValidCardNumber(field.value));
      } else if (field.id === 'cardCode') {
        setInputStatus(field, _isValidCvv(field.value));
      } else if (field.id === 'cardZip') {
        setInputStatus(field, _isValidZip(field.value));
      } else if (field.id === 'expiration') {
        setInputStatus(field, _isValidExpiration(field.value));
      } else if (field.id.toLowerCase().indexOf('phone') !== -1) {
        setInputStatus(field, _isValidPhone(field.value));
      } else {
        var minLen = field.minLength > 0 ? field.minLength : 1;
        setInputStatus(field, field.value.length >= minLen && field.value.length <= (field.maxLength || 99999));
      }
      break;
    case 'textarea':
      setInputStatus(field, field.value.length > 0);
      break;
    case 'email':
      setInputStatus(field, _isValidEmail(field.value));
      break;
    case 'select-one':
      setInputStatus(field, field.value !== '-1' && field.value !== '');
      break;
    case 'radio':
      setInputStatus(field, document.querySelector('input[name="' + field.name + '"]:checked') !== null);
      break;
    case 'tel':
      setInputStatus(field, _isValidPhone(field.value));
      break;
    case 'url':
      setInputStatus(field, _isValidUrl(field.value));
      break;
    default:
      setInputStatus(field, field.value.length > 0);
  }
}

function handleInputBlur(input) {
  validateField(input);
}

function validateWebsiteUrl() {
  var el = document.querySelector('#clubWebsite');
  if (el) setInputStatus(el, _isValidUrl(el.value));
}

// ── Accordion ────────────────────────────────────────────────────────────────
// Bootstrap 3's data-toggle="collapse" + data-parent="#accordion" handles all
// header clicks and mutual exclusivity natively. We only need jQuery listeners
// for side effects. jQuery .on() is required — Bootstrap 3 fires show/hide
// events via jQuery trigger, not native DOM dispatch.

$(function () {
  // show.bs.collapse — enable inputs, mark isEdit, scroll, close others.
  // Bootstrap 3's data-parent accordion requires .panel structure which we don't
  // use, so it never auto-closes siblings. Close them explicitly here.
  $('#accordion .section__content').on('show.bs.collapse', function (e) {
    var contentEl = e.target;

    // Cover both BS3 (.in/.collapsing) and BS5 (.show) open states
    document.querySelectorAll('#accordion .section__content').forEach(function (content) {
      if (content !== contentEl && (content.classList.contains('in') || content.classList.contains('show') || content.classList.contains('collapsing'))) {
        _closeSection(content);
      }
    });

    setTimeout(function () {
      window.scroll(0, FindPos(contentEl.parentNode));
    }, 450);

    setSectionInputStatus(contentEl, false);
    contentEl.parentElement.classList.add('isEdit');

    switch (contentEl.id) {
      case 'club-bundles__content':
        setGoldClubFlag();
        break;
      case 'club-name__content':
      case 'club-details__content':
      case 'club-contact__content':
      case 'location-information__content':
        currentSectionState = saveSectionState(contentEl);
        break;
      default:
        break;
    }
  });

  // hide.bs.collapse — disable inputs, remove isEdit
  $('#accordion .section__content').on('hide.bs.collapse', function (e) {
    var contentEl = e.target;
    setSectionInputStatus(contentEl, true);
    contentEl.parentElement.classList.remove('isEdit');
  });
});

// ── Section — Club Name ──────────────────────────────────────────────────────

function editClubName(e) {
  e.preventDefault();
}

function cancelName() { }

function saveName(e) {
  e.preventDefault();
  var lmsc = document.querySelector('#selectLmsc');
  var name = document.querySelector('#clubName');
  var abbr = document.querySelector('#clubAbbr');
  validateField(lmsc);
  validateField(name);
  validateField(abbr);
  var section = document.querySelector('#club-name');
  if (section && section.querySelector('span.has-error')) {
    window.scroll(0, FindPos(section.querySelector('span.help-block.has-error')));
    return;
  }
  section.classList.add('hasData');
  if (nextSection) {
    $(nextSection.querySelector('.section__content')).collapse('show');
    nextSection = null;
  } else {
    $(document.querySelector('#club-details .section__content')).collapse('show');
  }
}

// ── Section — Club Details ───────────────────────────────────────────────────

function editDetails() { }

function removeClubPhoto(type) { }

// Mirrors production Details.js setRegionalClubSections() — adds/removes
// section--disabled on Location, Coach, and Club Bundles when Regional Club is toggled.
function setRegionalClubSections(enabled) {
  var sectionsToDisable = [
    document.querySelector('#section-location-information'),
    document.querySelector('#coach')
  ];
  sectionsToDisable.forEach(function(section) {
    if (!section) return;
    if (enabled) {
      section.classList.add('section--disabled');
      var content = section.querySelector('.section__content');
      if (content) $(content).collapse('hide');
    } else {
      section.classList.remove('section--disabled');
    }
  });

  // Club Bundles: disable/enable independently of its show/hide (controlled by membership required radio)
  var clubBundles = document.querySelector('#club-bundles');
  if (clubBundles) {
    if (enabled) {
      clubBundles.classList.add('section--disabled');
      var bundlesContent = clubBundles.querySelector('.section__content');
      if (bundlesContent) $(bundlesContent).collapse('hide');
    } else {
      clubBundles.classList.remove('section--disabled');
    }
  }
}

function saveDetails(e) {
  e.preventDefault();
  var section = document.querySelector('#club-details');
  if (!section) return;
  var desc = section.querySelector('#clubDescription');
  var practice = section.querySelector('#practiceDetails');
  if (desc) validateField(desc);
  if (practice) validateField(practice);
  if (section.querySelector('span.has-error')) {
    window.scroll(0, FindPos(section.querySelector('span.help-block.has-error')));
    return;
  }
  section.classList.add('hasData');
  if (nextSection) {
    $(nextSection.querySelector('.section__content')).collapse('show');
    nextSection = null;
  } else {
    $(document.querySelector('#club-contact .section__content')).collapse('show');
  }
}

// ── Section — Club Contact ───────────────────────────────────────────────────

function editContact(e) {
  if (e) e.preventDefault();
}

// ── Mock autocomplete fixture data ───────────────────────────────────────────
var MOCK_CONTACTS = [
  { firstName: 'Alice',  lastName: 'Nakamura', city: 'Austin',   state: 'TX', swimmerId: '501A', phone: '512-555-0101', email: 'alice.nakamura@example.org', isMember: true,  validated: true },
  { firstName: 'Bob',    lastName: 'Nakamura', city: 'Houston',  state: 'TX', swimmerId: '502B', phone: '713-555-0102', email: 'bob.nakamura@example.org',   isMember: true,  validated: true },
  { firstName: 'Carol',  lastName: 'Nguyen',   city: 'Dallas',   state: 'TX', swimmerId: '',     phone: '214-555-0103', email: 'carol.nguyen@example.org',   isMember: false, validated: false },
  { firstName: 'David',  lastName: 'Reynolds', city: 'Denver',   state: 'CO', swimmerId: '504D', phone: '303-555-0104', email: 'd.reynolds@example.org',     isMember: true,  validated: false },
  { firstName: 'Ellen',  lastName: 'Park',     city: 'Portland', state: 'OR', swimmerId: '505E', phone: '503-555-0105', email: 'ellen.park@example.org',     isMember: true,  validated: true },
  { firstName: 'Frank',  lastName: 'Martinez', city: 'Phoenix',  state: 'AZ', swimmerId: '506F', phone: '602-555-0106', email: 'frank.martinez@example.org', isMember: true,  validated: true },
  { firstName: 'Grace',  lastName: 'Lee',      city: 'Seattle',  state: 'WA', swimmerId: '507G', phone: '206-555-0107', email: 'grace.lee@example.org',      isMember: true,  validated: true },
  { firstName: 'Henry',  lastName: 'Thompson', city: 'Chicago',  state: 'IL', swimmerId: '508H', phone: '312-555-0108', email: 'h.thompson@example.org',     isMember: true,  validated: true },
  { firstName: 'Iris',   lastName: 'Campbell', city: 'Atlanta',  state: 'GA', swimmerId: '',     phone: '404-555-0109', email: 'iris.campbell@example.org',  isMember: false, validated: false },
  { firstName: 'James',  lastName: 'Wright',   city: 'Boston',   state: 'MA', swimmerId: '510J', phone: '617-555-0110', email: 'james.wright@example.org',   isMember: true,  validated: true },
];
var _latestContact = null;

var MOCK_COACHES = [
  { firstName: 'Marcus',  lastName: 'Ellison',  city: 'Austin',    state: 'TX', swimmerId: '601M', phone: '512-555-0201', email: 'marcus.ellison@example.org',  isMember: true,  validated: true },
  { firstName: 'Priya',   lastName: 'Rao',      city: 'Houston',   state: 'TX', swimmerId: '602P', phone: '713-555-0202', email: 'priya.rao@example.org',       isMember: true,  validated: true },
  { firstName: 'Diego',   lastName: 'Salazar',  city: 'Denver',    state: 'CO', swimmerId: '603D', phone: '303-555-0203', email: 'diego.salazar@example.org',   isMember: true,  validated: false },
  { firstName: 'Naomi',   lastName: 'Fischer',  city: 'Portland',  state: 'OR', swimmerId: '604N', phone: '503-555-0204', email: 'naomi.fischer@example.org',   isMember: true,  validated: true },
  { firstName: 'Owen',    lastName: 'Whitfield', city: 'Seattle',  state: 'WA', swimmerId: '605O', phone: '206-555-0205', email: 'owen.whitfield@example.org',  isMember: true,  validated: true },
  { firstName: 'Renata',  lastName: 'Cabral',   city: 'Chicago',   state: 'IL', swimmerId: '606R', phone: '312-555-0206', email: 'renata.cabral@example.org',   isMember: true,  validated: true },
  { firstName: 'Samuel',  lastName: 'Okafor',   city: 'Atlanta',   state: 'GA', swimmerId: '607S', phone: '404-555-0207', email: 'samuel.okafor@example.org',   isMember: true,  validated: true },
  { firstName: 'Talia',   lastName: 'Bergman',  city: 'Boston',    state: 'MA', swimmerId: '608T', phone: '617-555-0208', email: 'talia.bergman@example.org',   isMember: true,  validated: false },
  { firstName: 'Kenji',   lastName: 'Nakamura', city: 'San Diego', state: 'CA', swimmerId: '609K', phone: '619-555-0209', email: 'kenji.nakamura@example.org',  isMember: true,  validated: true },
];
var _latestCoach = null;

function _debounce(fn, delay) {
  var timer;
  return function () {
    var args = arguments;
    var ctx = this;
    clearTimeout(timer);
    timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
  };
}

function _closeAllLists(inp) {
  var parent = inp ? inp.parentNode : null;
  if (!parent) return;
  parent.querySelectorAll('.autocomplete-items').forEach(function (l) {
    l.parentNode.removeChild(l);
  });
}

function setCurrentContact(contact) {
  _latestContact = contact;
  var nameEl = document.querySelector('#club-contact .lookup-confirm--name');
  if (nameEl) nameEl.textContent = 'Add ' + contact.firstName + ' ' + contact.lastName;
  var confirmDiv = document.querySelector('#club-contact .lookup-confirm');
  if (confirmDiv) confirmDiv.classList.add('show');
  var addBtn = document.querySelector('#addAsContact');
  if (addBtn) addBtn.disabled = false;
}

function _autocompleteByName(inp, mockData, onSelect) {
  var runSearch = _debounce(function () {
    var val = inp.value.trim().toLowerCase();
    _closeAllLists(inp);
    if (val.length < 3) return;

    var matches = mockData.filter(function (c) {
      var full = (c.firstName + ' ' + c.lastName).toLowerCase();
      return full.indexOf(val) !== -1 ||
        c.firstName.toLowerCase().indexOf(val) !== -1 ||
        c.lastName.toLowerCase().indexOf(val) !== -1;
    });
    if (!matches.length) return;

    var listDiv = document.createElement('div');
    listDiv.id = inp.id + 'autocomplete-list';
    listDiv.className = 'autocomplete-items';
    inp.parentNode.appendChild(listDiv);

    matches.forEach(function (person) {
      var item = document.createElement('div');
      var fullName = person.firstName + ' ' + person.lastName;
      var location = person.city && person.state ? person.city + ', ' + person.state : '';
      var matchIdx = fullName.toLowerCase().indexOf(val);
      var boldedName = matchIdx >= 0
        ? fullName.slice(0, matchIdx) + '<strong>' + fullName.slice(matchIdx, matchIdx + val.length) + '</strong>' + fullName.slice(matchIdx + val.length)
        : fullName;
      item.innerHTML = boldedName + (location ? ' <span class="autocomplete-location">' + location + '</span>' : '');

      item.addEventListener('mousedown', function (e) {
        e.preventDefault();
        inp.value = fullName;
        onSelect(person);
        _closeAllLists(inp);
      });

      listDiv.appendChild(item);
    });
  }, 300);

  inp.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') return;
    runSearch();
  });

  inp.addEventListener('keydown', function (e) {
    var list = document.querySelector('#' + inp.id + 'autocomplete-list');
    if (!list) return;
    var items = list.querySelectorAll('div');
    var activeEl = list.querySelector('.autocomplete-active');
    var activeIdx = -1;
    items.forEach(function (item, i) { if (item === activeEl) activeIdx = i; });
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeEl) activeEl.classList.remove('autocomplete-active');
      var next = activeIdx < items.length - 1 ? items[activeIdx + 1] : items[0];
      if (next) next.classList.add('autocomplete-active');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeEl) activeEl.classList.remove('autocomplete-active');
      var prev = activeIdx > 0 ? items[activeIdx - 1] : items[items.length - 1];
      if (prev) prev.classList.add('autocomplete-active');
    } else if (e.key === 'Enter') {
      if (activeEl) { e.preventDefault(); activeEl.dispatchEvent(new MouseEvent('mousedown')); }
    }
  });

  document.addEventListener('click', function () { _closeAllLists(inp); });
}

function autocompleteContactsByName(inp) {
  _autocompleteByName(inp, MOCK_CONTACTS, setCurrentContact);
}

function autocompleteCoachesByName(inp) {
  _autocompleteByName(inp, MOCK_COACHES, setCurrentCoach);
}

function _resetContactLookup() {
  _latestContact = null;
  var lookupInput = document.querySelector('#lookupContactName');
  if (lookupInput) { _closeAllLists(lookupInput); lookupInput.value = ''; }
  var confirmDiv = document.querySelector('#club-contact .lookup-confirm');
  if (confirmDiv) confirmDiv.classList.remove('show');
  var addBtn = document.querySelector('#addAsContact');
  if (addBtn) addBtn.disabled = true;
  var nameEl = document.querySelector('#club-contact .lookup-confirm--name');
  if (nameEl) nameEl.textContent = '';
}

function showNewContactInputs() {
  _resetContactLookup();

  var el = document.querySelector('.club-contact__not-member-container');
  if (el) { el.style.display = 'block'; el.style.visibility = 'visible'; }

  // Hide only the button, not the "Or Add a New Contact" label (matches Event Director pattern)
  var addNewBtn = document.querySelector('.club-contact__add-new-btn');
  if (addNewBtn) addNewBtn.style.display = 'none';
}

function _clearNewContactForm() {
  ['#newContactFirstName', '#newContactLastName', '#newContactEmailPrimary',
    '#newContactPhonePrimary', '#newContactCity'].forEach(function (sel) {
    var input = document.querySelector(sel);
    if (input) { input.value = ''; input.disabled = false; }
  });
  var stateEl = document.querySelector('#newContactState');
  if (stateEl) stateEl.value = '';
}

function handleCancelAddContact() {
  var el = document.querySelector('.club-contact__not-member-container');
  if (el) { el.style.display = 'none'; el.style.visibility = 'hidden'; }
  _clearNewContactForm();
  var addNewBtn = document.querySelector('.club-contact__add-new-btn');
  if (addNewBtn) addNewBtn.style.display = '';
}

function confirmCurrentContact(e) {
  if (e) e.preventDefault();
  var btn = document.querySelector('#confirmCurrentContact');
  if (btn) btn.style.display = 'none';
  var saveBtn = document.querySelector('#saveContact');
  if (saveBtn) saveBtn.disabled = false;
  var typeForm = document.querySelector('#club-contact .contact-type-form');
  if (typeForm) typeForm.style.display = 'none';
  var listHeader = document.querySelector('#club-contact .contact-list__header');
  if (listHeader) listHeader.classList.add('show');
  var listSettings = document.querySelector('#listContactSettings');
  if (listSettings) listSettings.style.display = '';
  // Uncheck privacy boxes so user actively chooses (matches production)
  document.querySelectorAll('#club-contact .club-privacy input[type="checkbox"]').forEach(function (cb) {
    cb.checked = false;
  });
  var privacy = document.querySelector('#club-contact .club-privacy');
  if (privacy) privacy.style.display = '';
}

// Validates, builds, and adds the contact card, plus the section-finalization
// steps setContactTitle() already does — addContact(), unlike addCoachCard(),
// doesn't show the list header / hide the type-form itself, so that has to
// happen here too.
function handleAddContactButton() {
  var fields = ['#newContactFirstName', '#newContactLastName', '#newContactEmailPrimary',
    '#newContactPhonePrimary', '#newContactCity', '#newContactState']
    .map(function (sel) { return document.querySelector(sel); });

  var firstError = null;
  fields.forEach(function (field) {
    if (!field) return;
    validateField(field);
    if (!firstError && field.classList.contains('has-error')) firstError = field;
  });
  if (firstError) {
    window.scroll(0, FindPos(firstError));
    return;
  }

  var contact = {
    firstName: document.querySelector('#newContactFirstName').value,
    lastName: document.querySelector('#newContactLastName').value,
    email: document.querySelector('#newContactEmailPrimary').value,
    phone: document.querySelector('#newContactPhonePrimary').value,
    city: document.querySelector('#newContactCity').value,
    state: document.querySelector('#newContactState').value,
    swimmerId: '',
    isMember: false,
    validated: false,
  };
  addContact(contact);

  var el = document.querySelector('.club-contact__not-member-container');
  if (el) { el.style.display = 'none'; el.style.visibility = 'hidden'; }
  _clearNewContactForm();

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
  document.querySelectorAll('#club-contact .club-privacy input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
  var privacy = document.querySelector('#club-contact .club-privacy');
  if (privacy) privacy.style.display = '';
  var saveBtn = document.querySelector('#saveContact');
  if (saveBtn) saveBtn.disabled = false;
}

function handleContactConfirmation(el) { }

function setContactTitle(e) {
  if (e) e.preventDefault();
  if (!_latestContact) return;

  addContact(_latestContact);
  _resetContactLookup();

  var otherContainer = document.querySelector('.club-contact__other-container');
  if (otherContainer) { otherContainer.style.display = 'none'; otherContainer.style.visibility = 'hidden'; }
  var addNew = document.querySelector('.club-contact__add-new');
  if (addNew) addNew.style.display = 'none';
  var listHeader = document.querySelector('#club-contact .contact-list__header');
  if (listHeader) listHeader.classList.add('show');
  var listSettings2 = document.querySelector('#listContactSettings');
  if (listSettings2) listSettings2.style.display = '';
  var typeForm = document.querySelector('#club-contact .contact-type-form');
  if (typeForm) typeForm.style.display = 'none';
  document.querySelectorAll('#club-contact .club-privacy input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
  var privacy = document.querySelector('#club-contact .club-privacy');
  if (privacy) privacy.style.display = '';
  var saveBtn = document.querySelector('#saveContact');
  if (saveBtn) saveBtn.disabled = false;
}

function removeCurrentContacts() {
  var row = document.querySelector('.section#club-contact .list__container .row');
  if (!row) return;
  while (row.firstChild) row.removeChild(row.firstChild);
}

// Mirrors production addContact() — builds the contact card DOM and appends it.
function addContact(contact, headerText, removeCurrent) {
  if (removeCurrent === undefined) removeCurrent = true;
  if (removeCurrent) removeCurrentContacts();

  var row = document.querySelector('.section#club-contact .list__container .row');
  if (!row) return;

  var isMember = contact.isMember === true || contact.isMember === 'true';
  var isValidated = contact.validated === true || contact.validated === 'true';

  var col = document.createElement('div');
  col.className = 'col-xs-12 col-sm-6 col-md-4 contact-column';

  var item = document.createElement('div');
  item.className = 'list-item list-item--fade-out list-item--new';

  var hiddenIsMember = document.createElement('input');
  hiddenIsMember.type = 'hidden';
  hiddenIsMember.className = 'contact-isMember';
  hiddenIsMember.value = String(isMember);
  item.appendChild(hiddenIsMember);

  var removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'list-item__delete';
  removeBtn.textContent = 'Remove';
  item.appendChild(removeBtn);

  if (headerText) {
    var hdr = document.createElement('div');
    hdr.className = 'contact-header';
    hdr.textContent = headerText;
    item.appendChild(hdr);
  }

  if (!isValidated) {
    var pending = document.createElement('div');
    pending.className = 'coach-validated';
    pending.textContent = 'Account Pending';
    item.appendChild(pending);
  }

  var nameEl = document.createElement('div');
  nameEl.className = 'contact-name';
  nameEl.textContent = (contact.firstName || '') + ' ' + (contact.lastName || '');
  item.appendChild(nameEl);

  if (contact.city && contact.state) {
    var loc = document.createElement('div');
    loc.className = 'contact-location';
    loc.textContent = contact.city + ', ' + contact.state;
    item.appendChild(loc);
  }

  var phoneEl = document.createElement('div');
  phoneEl.className = 'contact-phone';
  phoneEl.textContent = contact.phone || '';
  item.appendChild(phoneEl);

  var emailEl = document.createElement('div');
  emailEl.className = 'contact-email';
  emailEl.textContent = contact.email || '';
  item.appendChild(emailEl);

  var idDiv = document.createElement('div');
  idDiv.className = 'contact-id';
  if (!isMember) idDiv.style.display = 'none';
  idDiv.textContent = 'Member ID: ';
  var idVal = document.createElement('span');
  idVal.className = 'contact-id__value';
  idVal.textContent = contact.swimmerId || '';
  idDiv.appendChild(idVal);
  item.appendChild(idDiv);

  col.appendChild(item);
  row.appendChild(col);

  setTimeout(function () { item.classList.remove('list-item--fade-out'); }, 250);

  var awaitingMsg = document.querySelector('#club-contact .contact-list__awaiting__message');
  if (awaitingMsg) awaitingMsg.style.display = !isValidated ? 'block' : 'none';
}

// Mirrors production handleContactType() — radio click handler for contact type.
function handleContactType(e) {
  var val = e.target.value;

  // Reset lookup/add-new form inputs
  var lookupInput = document.querySelector('#lookupContactName');
  if (lookupInput) lookupInput.value = '';
  ['#newContactFirstName', '#newContactLastName', '#newContactEmailPrimary',
    '#newContactPhonePrimary', '#newContactCity'].forEach(function (sel) {
    var el = document.querySelector(sel);
    if (el) { el.value = ''; el.disabled = false; }
  });
  var stateEl = document.querySelector('#newContactState');
  if (stateEl) stateEl.value = '';

  if (val === 'contactCurrent') {
    var listHeader = document.querySelector('#club-contact .contact-list__header');
    if (listHeader) listHeader.classList.remove('show');

    var otherContainer = document.querySelector('.club-contact__other-container');
    if (otherContainer) { otherContainer.style.display = 'none'; otherContainer.style.visibility = 'hidden'; }
    var notMemberContainer = document.querySelector('.club-contact__not-member-container');
    if (notMemberContainer) { notMemberContainer.style.display = 'none'; notMemberContainer.style.visibility = 'hidden'; }
    var addNew = document.querySelector('.club-contact__add-new');
    if (addNew) addNew.style.display = 'none';

    var confirmBtn = document.querySelector('#confirmCurrentContact');
    if (confirmBtn) confirmBtn.style.display = 'block';

    var swimmerIdEl = document.querySelector('#currentSwimmerId');
    if (!swimmerIdEl || !swimmerIdEl.value) {
      // Non-member: pre-fill the new-contact form from profile data
      var map = {
        '#newContactFirstName': '#currentFirstName',
        '#newContactLastName': '#currentLastName',
        '#newContactEmailPrimary': '#currentEmail',
        '#newContactPhonePrimary': '#currentPhone',
        '#newContactCity': '#currentCity',
        '#newContactState': '#currentState'
      };
      Object.keys(map).forEach(function (dest) {
        var src = document.querySelector(map[dest]);
        var destEl = document.querySelector(dest);
        if (src && destEl) destEl.value = src.value;
      });
      var emailInput = document.querySelector('#newContactEmailPrimary');
      if (emailInput) emailInput.disabled = true;
      if (notMemberContainer) { notMemberContainer.style.display = 'block'; notMemberContainer.style.visibility = 'visible'; }
      return;
    }

    var contact = {
      firstName: (document.querySelector('#currentFirstName') || {}).value || '',
      lastName:  (document.querySelector('#currentLastName')  || {}).value || '',
      swimmerId: (document.querySelector('#currentSwimmerId') || {}).value || '',
      email:     (document.querySelector('#currentEmail')     || {}).value || '',
      phone:     (document.querySelector('#currentPhone')     || {}).value || '',
      validated: (document.querySelector('#currentValidated') || {}).value || 'true',
      city:      (document.querySelector('#currentCity')      || {}).value || '',
      state:     (document.querySelector('#currentState')     || {}).value || '',
      isMember:  (document.querySelector('#currentIsMember')  || {}).value || 'true',
    };
    addContact(contact);

  } else if (val === 'contactOther') {
    removeCurrentContacts();
    var otherContainer2 = document.querySelector('.club-contact__other-container');
    if (otherContainer2) { otherContainer2.style.display = 'block'; otherContainer2.style.visibility = 'visible'; }
    var notMemberContainer2 = document.querySelector('.club-contact__not-member-container');
    if (notMemberContainer2) { notMemberContainer2.style.display = 'none'; notMemberContainer2.style.visibility = 'hidden'; }
    var addNew2 = document.querySelector('.club-contact__add-new');
    if (addNew2) addNew2.style.display = 'block';
    var addNewBtn2 = document.querySelector('.club-contact__add-new-btn');
    if (addNewBtn2) addNewBtn2.style.display = '';
    var confirmBtn2 = document.querySelector('#confirmCurrentContact');
    if (confirmBtn2) confirmBtn2.style.display = 'none';
    var lookupInputEl = document.querySelector('#lookupContactName');
    if (lookupInputEl) { lookupInputEl.disabled = false; lookupInputEl.focus(); }
  }
}

// Mirrors production Contact.js removeContact() — marks ALL list-item__delete
// parents as fading out, then hides the column wrapper and club-privacy after
// the CSS transition completes.
function removeContact(e) {
  if (e) e.preventDefault();
  var section = document.querySelector('#club-contact');
  var listContainer = section.querySelector('.list__container');
  if (listContainer) listContainer.classList.add('list__container--modified');

  var deleteButtons = section.querySelectorAll('.list-item__delete');
  for (var i = 0; i < deleteButtons.length; i++) {
    var contactItem = deleteButtons[i].parentNode; // .list-item
    contactItem.classList.add('list-item--fade-out');
    (function (item) {
      setTimeout(function () {
        var col = item.parentNode; // .contact-column wrapper
        if (col) col.style.display = 'none';
        var privacy = document.querySelector('#club-contact .club-privacy');
        if (privacy) privacy.style.display = 'none';
      }, 250);
    })(contactItem);
  }
}

function editContactList() {
  var list = document.querySelector('.section#club-contact .list');
  if (!list) return;
  if (list.classList.contains('edit-list')) {
    list.classList.remove('edit-list');
    cancelContactList();
    var saveBtn = document.querySelector('#saveContact');
    if (saveBtn) saveBtn.disabled = false;
  } else {
    list.classList.add('edit-list');
    var saveBtn2 = document.querySelector('#saveContact');
    if (saveBtn2) saveBtn2.disabled = true;
  }
  // If no contact and type is Other, re-show the search input
  var contactType = document.querySelector('#club-contact input[name="ContactType"]:checked');
  var hasContact = document.querySelector('.section#club-contact .list-item') !== null;
  if (!hasContact && contactType && contactType.value === 'contactOther') {
    var otherContainer = document.querySelector('.club-contact__other-container');
    if (otherContainer) { otherContainer.style.display = 'block'; otherContainer.style.visibility = 'visible'; }
    var lookupInput = document.querySelector('#lookupContactName');
    if (lookupInput) lookupInput.focus();
  }
}

function cancelContactList() {
  var section = document.querySelector('#club-contact');
  var list = section ? section.querySelector('.list') : null;
  if (!list) return;

  // Capture faded nodes before removing the class (NodeList is static — refs persist)
  var fadedItems = section.querySelectorAll('.list-item--fade-out');
  for (var i = 0; i < fadedItems.length; i++) {
    fadedItems[i].classList.remove('list-item--fade-out');
  }
  setTimeout(function () {
    for (var j = 0; j < fadedItems.length; j++) {
      var col = fadedItems[j].parentNode;
      if (col) col.style.display = 'block';
    }
    var privacy = document.querySelector('#club-contact .club-privacy');
    if (privacy) privacy.style.display = '';

    if (fadedItems.length > 0) {
      var listHeader = section.querySelector('.contact-list__header');
      if (listHeader) listHeader.classList.add('show');
    }
  }, 250);

  list.classList.remove('edit-list');
  var saveBtn = document.querySelector('#saveContact');
  if (saveBtn) saveBtn.disabled = false;
}

function saveContactList(e) {
  if (e) e.preventDefault();
  var section = document.querySelector('#club-contact');
  var list = section ? section.querySelector('.list') : null;
  if (!list) return;

  // Confirm newly-added items
  var newItems = section.querySelectorAll('.list-item--new');
  for (var i = 0; i < newItems.length; i++) {
    newItems[i].classList.remove('list-item--new');
  }

  // Remove faded items — item.parentNode is the .contact-column wrapper
  var fadedItems = section.querySelectorAll('.list-item--fade-out');
  for (var j = 0; j < fadedItems.length; j++) {
    var col = fadedItems[j].parentNode;
    if (col && col.parentNode) col.parentNode.removeChild(col);
  }

  list.classList.remove('edit-list');
  var container = list.querySelector('.list__container');
  if (container) container.classList.remove('list__container--modified');

  var remaining = section.querySelectorAll('.list-item');
  if (remaining.length > 0) {
    section.classList.add('hasData');
  } else {
    section.classList.remove('hasData');
    var listHeader = section.querySelector('.contact-list__header');
    if (listHeader) listHeader.classList.remove('show');
    var listSettings = section.querySelector('#listContactSettings');
    if (listSettings) listSettings.style.display = 'none';
    var radios = section.querySelectorAll('input[name="ContactType"]');
    for (var k = 0; k < radios.length; k++) radios[k].checked = false;
    var typeForm = section.querySelector('.contact-type-form');
    if (typeForm) typeForm.style.display = '';
  }

  var saveBtn = document.querySelector('#saveContact');
  if (saveBtn) saveBtn.disabled = false;
}

function saveContact(e) {
  if (e) e.preventDefault();
  var section = document.querySelector('#club-contact');
  if (section) section.classList.add('hasData');
  if (nextSection) {
    $(nextSection.querySelector('.section__content')).collapse('show');
    nextSection = null;
  } else {
    $(document.querySelector('#coach .section__content')).collapse('show');
  }
}

// ── Section — Coach ──────────────────────────────────────────────────────────

function getCurrentCoaches() { }

function setCurrentCoach(coach) {
  _latestCoach = coach;
  var nameEl = document.querySelector('#coach .lookup-confirm--name');
  if (nameEl) nameEl.textContent = coach.firstName + ' ' + coach.lastName;
  var confirmDiv = document.querySelector('#coach .lookup-confirm');
  if (confirmDiv) confirmDiv.classList.add('show');
  var addBtn = document.querySelector('#addAsCoach');
  if (addBtn) addBtn.disabled = false;
}

// Mirrors addContact() — builds the coach card DOM and appends it.
function addCoachCard(coach) {
  var row = document.querySelector('.section#coach .list__container .row');
  if (!row) return;

  var isValidated = coach.validated === true || coach.validated === 'true';
  var isMember = coach.isMember !== false;

  var col = document.createElement('div');
  col.className = 'col-xs-12 col-sm-6 col-md-4';

  var item = document.createElement('div');
  item.className = 'list-item list-item--fade-out list-item--new';

  var removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'list-item__delete';
  removeBtn.textContent = 'Remove';
  item.appendChild(removeBtn);

  // Head Coach radio — shares the literal name "Head Coach" across every
  // card so only one can be checked at a time, matching production exactly.
  var headCoachInput = null;
  var titleEl = null;
  if (isMember) {
    var headCoachSelect = document.createElement('div');
    headCoachSelect.className = 'head-coach__select';
    var headCoachLabel = document.createElement('label');
    headCoachLabel.className = 'radio-label--coach-list';
    headCoachLabel.textContent = 'Head Coach';
    headCoachInput = document.createElement('input');
    headCoachInput.type = 'radio';
    headCoachInput.name = 'Head Coach';
    headCoachInput.className = 'radio-input--coach-list';
    headCoachInput.checked = !!coach.headCoach;
    headCoachLabel.appendChild(headCoachInput);
    headCoachSelect.appendChild(headCoachLabel);
    item.appendChild(headCoachSelect);
  }

  if (!isValidated) {
    var pending = document.createElement('div');
    pending.className = 'coach-validated';
    pending.textContent = 'Account Pending';
    item.appendChild(pending);
  }

  var nameEl = document.createElement('div');
  nameEl.className = 'coach-name';
  nameEl.textContent = (coach.firstName || '') + ' ' + (coach.lastName || '');
  item.appendChild(nameEl);

  var phoneEl = document.createElement('div');
  phoneEl.className = 'coach-phone';
  phoneEl.textContent = coach.phone || '';
  item.appendChild(phoneEl);

  var emailEl = document.createElement('div');
  emailEl.className = 'coach-email';
  emailEl.textContent = coach.email || '';
  item.appendChild(emailEl);

  if (isMember && coach.city && coach.state) {
    var loc = document.createElement('div');
    loc.className = 'coach-location';
    loc.textContent = coach.city + ', ' + coach.state;
    item.appendChild(loc);
  }

  if (isMember) {
    var idDiv = document.createElement('div');
    idDiv.className = 'coach-id';
    idDiv.textContent = 'Member ID: ';
    var idVal = document.createElement('span');
    idVal.className = 'coach-id__value';
    idVal.textContent = coach.swimmerId || '';
    idDiv.appendChild(idVal);
    item.appendChild(idDiv);
  }

  // HEAD COACH / COACH badge — always present, mirrors the radio above.
  titleEl = document.createElement('div');
  titleEl.className = 'coach-title';
  titleEl.textContent = coach.headCoach ? 'HEAD COACH' : 'COACH';
  item.appendChild(titleEl);

  if (headCoachInput) {
    headCoachInput.addEventListener('change', function (e) {
      document.querySelectorAll('#coach .list-item .coach-title').forEach(function (t) { t.textContent = 'COACH'; });
      if (e.target.checked) titleEl.textContent = 'HEAD COACH';
    });
  }

  col.appendChild(item);
  row.appendChild(col);

  setTimeout(function () { item.classList.remove('list-item--fade-out'); }, 250);

  var listHeader = document.querySelector('#coach .coach-list__header');
  if (listHeader) listHeader.classList.add('show');
  var settingsBtn = document.querySelector('#listCoachSettings');
  if (settingsBtn) { settingsBtn.disabled = false; settingsBtn.style.display = ''; }
  var editBtn = document.querySelector('#editCoachList');
  if (editBtn) editBtn.disabled = false;
  var saveBtn = document.querySelector('#saveCoach');
  if (saveBtn) saveBtn.disabled = false;
  var section = document.querySelector('#coach');
  if (section) section.classList.add('hasData');
}

function removeCoachCard(e) {
  if (e) e.preventDefault();
  var item = e.target.closest('.list-item');
  if (!item) return;
  var listContainer = document.querySelector('#coach .list__container');
  if (listContainer) listContainer.classList.add('list__container--modified');
  item.classList.add('list-item--fade-out');
  setTimeout(function () {
    var col = item.parentNode;
    if (col) col.style.display = 'none';
  }, 250);
}

function _resetCoachLookup() {
  _latestCoach = null;
  var lookupInput = document.querySelector('#lookupCoachName');
  if (lookupInput) { _closeAllLists(lookupInput); lookupInput.value = ''; }
  var confirmDiv = document.querySelector('#coach .lookup-confirm');
  if (confirmDiv) confirmDiv.classList.remove('show');
  var addBtn = document.querySelector('#addAsCoach');
  if (addBtn) addBtn.disabled = true;
  var nameEl = document.querySelector('#coach .lookup-confirm--name');
  if (nameEl) nameEl.textContent = '';
}

function setTitle(e, type) {
  if (e) e.preventDefault();
  if (!_latestCoach) return;

  addCoachCard(_latestCoach);
  _resetCoachLookup();
}

function showCoachSection() { }

function editCoachList() {
  var list = document.querySelector('.section#coach .list');
  if (!list) return;
  if (list.classList.contains('edit-list')) {
    list.classList.remove('edit-list');
    cancelCoachList();
    var saveBtn = document.querySelector('#saveCoach');
    if (saveBtn) saveBtn.disabled = false;
  } else {
    list.classList.add('edit-list');
    var saveBtn2 = document.querySelector('#saveCoach');
    if (saveBtn2) saveBtn2.disabled = true;
  }
}

function cancelCoachList() {
  var section = document.querySelector('#coach');
  var list = section ? section.querySelector('.list') : null;
  if (!list) return;

  var fadedItems = section.querySelectorAll('.list-item--fade-out');
  for (var i = 0; i < fadedItems.length; i++) {
    fadedItems[i].classList.remove('list-item--fade-out');
  }
  setTimeout(function () {
    for (var j = 0; j < fadedItems.length; j++) {
      var col = fadedItems[j].parentNode;
      if (col) col.style.display = 'block';
    }

    if (fadedItems.length > 0) {
      var listHeader = section.querySelector('.coach-list__header');
      if (listHeader) listHeader.classList.add('show');
    }
  }, 250);

  list.classList.remove('edit-list');
  var saveBtn = document.querySelector('#saveCoach');
  if (saveBtn) saveBtn.disabled = false;
}

function saveCoachList(e) {
  if (e) e.preventDefault();
  var section = document.querySelector('#coach');
  var list = section ? section.querySelector('.list') : null;
  if (!list) return;

  var newItems = section.querySelectorAll('.list-item--new');
  for (var i = 0; i < newItems.length; i++) {
    newItems[i].classList.remove('list-item--new');
  }

  var fadedItems = section.querySelectorAll('.list-item--fade-out');
  for (var j = 0; j < fadedItems.length; j++) {
    var col = fadedItems[j].parentNode;
    if (col && col.parentNode) col.parentNode.removeChild(col);
  }

  list.classList.remove('edit-list');
  var container = list.querySelector('.list__container');
  if (container) container.classList.remove('list__container--modified');

  var remaining = section.querySelectorAll('.list-item');
  if (remaining.length > 0) {
    section.classList.add('hasData');
  } else {
    section.classList.remove('hasData');
    var listHeader = section.querySelector('.coach-list__header');
    if (listHeader) listHeader.classList.remove('show');
    var settingsBtn = document.querySelector('#listCoachSettings');
    if (settingsBtn) settingsBtn.style.display = 'none';
    var lookupSection = document.querySelector('.coach-details');
    if (lookupSection) lookupSection.style.display = '';
  }

  var saveBtn = document.querySelector('#saveCoach');
  if (saveBtn) saveBtn.disabled = false;
}

function saveCoach() {
  var section = document.querySelector('#coach');
  var coaches = section ? section.querySelectorAll('.list-item') : [];
  if (section) {
    if (coaches.length > 0) section.classList.add('hasData');
    else section.classList.remove('hasData');
  }
  if (nextSection) {
    $(nextSection.querySelector('.section__content')).collapse('show');
    nextSection = null;
  } else {
    $(document.querySelector('#location-information__content')).collapse('show');
  }
}

// ── Section — Location ───────────────────────────────────────────────────────

var _locationMode = null; // 'pool' | 'openwater' — which Add button was clicked
var _pendingNewLocation = null; // holds step 1 details while step 2 is filled out
var _locationRemoveTarget = null; // .col-sm-12 card queued for removal

// No live Google Places key in this mockup environment — accept a typed
// "Street, City, ST 12345" address and fall back to storing the raw text as
// the street line when it doesn't split cleanly.
function _parseLocationAddress(raw) {
  var parts = String(raw || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var street = parts[0] || '';
  var city = parts[1] || '';
  var state = '';
  var zip = '';
  if (parts[2]) {
    var m = parts[2].match(/([A-Za-z]{2})\s*(\d{5})?/);
    if (m) {
      state = m[1].toUpperCase();
      zip = m[2] || '';
    }
  }
  return { street: street, city: city, state: state, zip: zip };
}

function _resetLocationStep1Fields() {
  var nameInput = document.querySelector('#locationName');
  var addrInput = document.querySelector('#addLocationAddressStreet');
  if (nameInput) { nameInput.value = ''; nameInput.classList.remove('has-error', 'has-success'); }
  if (addrInput) { addrInput.value = ''; addrInput.classList.remove('has-error', 'has-success'); }
  var addrHelp = document.querySelector('.help-block--LocationAddressStreet');
  if (addrHelp) addrHelp.classList.remove('has-error');
  var typeSelect = document.querySelector('#locationType');
  if (typeSelect) typeSelect.classList.remove('has-error', 'has-success');
}

function _resetLocationStep2Fields() {
  var venueNameInput = document.querySelector('#venueName');
  if (venueNameInput) { venueNameInput.value = ''; venueNameInput.classList.remove('has-error', 'has-success'); }
  var poolTypeSelect = document.querySelector('#poolType');
  if (poolTypeSelect) { poolTypeSelect.value = '-1'; poolTypeSelect.classList.remove('has-error', 'has-success'); }
  var openWaterTypeSelect = document.querySelector('#openWaterType');
  if (openWaterTypeSelect) { openWaterTypeSelect.value = '-1'; openWaterTypeSelect.classList.remove('has-error', 'has-success'); }
  document.querySelectorAll('input[name="selectCourseType"]').forEach(function (cb) { cb.checked = false; });
  var courseHelp = document.querySelector('.help-block--selectCourseType');
  if (courseHelp) courseHelp.classList.remove('has-error');
}

function handleAddLocationButtonClick(e) {
  var isPool = e.currentTarget.id === 'addPoolLocationBtn';
  _locationMode = isPool ? 'pool' : 'openwater';

  var headerAdd = document.querySelector('.location-header__add');
  if (headerAdd) headerAdd.style.display = 'none';

  var details = document.querySelector('.location-details');
  if (details) details.classList.add('show');

  var typeSelect = document.querySelector('#locationType');
  if (typeSelect) {
    typeSelect.disabled = !isPool;
    typeSelect.value = isPool ? '-1' : 'Open Water';
    typeSelect.classList.remove('has-error', 'has-success');
  }

  var nameInput = document.querySelector('#locationName');
  if (nameInput) nameInput.focus();
}

function cancelNewLocationForm() {
  var headerAdd = document.querySelector('.location-header__add');
  if (headerAdd) headerAdd.style.display = '';
  var details = document.querySelector('.location-details');
  if (details) details.classList.remove('show');
  _resetLocationStep1Fields();
  _locationMode = null;
}

function confirmNewLocationDetails() {
  var isPool = _locationMode === 'pool';
  var nameInput = document.querySelector('#locationName');
  var addrInput = document.querySelector('#addLocationAddressStreet');
  var typeSelect = document.querySelector('#locationType');
  var addrHelp = document.querySelector('.help-block--LocationAddressStreet');

  validateField(nameInput);

  var addrValid = !!(addrInput && addrInput.value.trim());
  setInputStatus(addrInput, addrValid);
  if (addrHelp) addrHelp.classList.toggle('has-error', !addrValid);

  if (isPool) validateField(typeSelect);

  var invalid = document.querySelector('.location-details input.has-error, .location-details select.has-error, .location-details span.help-block.has-error');
  if (invalid) {
    window.scroll(0, FindPos(invalid));
    return;
  }

  var parsed = _parseLocationAddress(addrInput.value);
  var candidate = {
    name: nameInput.value.trim(),
    street: parsed.street,
    city: parsed.city,
    state: parsed.state,
    zip: parsed.zip,
    type: isPool ? typeSelect.value : 'Open Water',
  };

  var isDuplicate = Array.prototype.some.call(
    document.querySelectorAll('#locationListContainer .location-address-street'),
    function (el) { return (el.dataset.street || '').toLowerCase() === candidate.street.toLowerCase(); }
  );
  if (isDuplicate) {
    _openModal('modalAddDuplicateOrganization');
    return;
  }

  _pendingNewLocation = candidate;

  var details = document.querySelector('.location-details');
  if (details) details.classList.remove('show');

  var venueRow = document.querySelector('.venue-form-row');
  if (venueRow) venueRow.style.display = '';

  var poolGroup = document.querySelector('.input-group--poolType');
  var courseGroup = document.querySelector('.input-group--course');
  var openWaterGroup = document.querySelector('.input-group--openWaterType');
  if (poolGroup) poolGroup.style.display = isPool ? '' : 'none';
  if (courseGroup) courseGroup.style.display = isPool ? '' : 'none';
  if (openWaterGroup) openWaterGroup.style.display = isPool ? 'none' : '';

  var venueNameInput = document.querySelector('#venueName');
  if (venueNameInput) venueNameInput.focus();
}

function cancelNewVenueForm() {
  var venueRow = document.querySelector('.venue-form-row');
  if (venueRow) venueRow.style.display = 'none';
  _resetLocationStep2Fields();
  // Back to step 1 — matches production's handleCancelNewVenue, which returns
  // to the location-details form rather than fully canceling the Add flow.
  var details = document.querySelector('.location-details');
  if (details) details.classList.add('show');
}

function addLocationCard(location, venues) {
  var container = document.querySelector('#locationListContainer');
  var listWrap = document.querySelector('#locationsList');
  if (!container || !listWrap) return;

  var col = document.createElement('div');
  col.className = 'col-sm-12';

  var item = document.createElement('div');
  item.className = 'list-item list-item-existing list-item--fade-out';

  // Production mounts .list__controls only while edit=true (a React conditional,
  // not a CSS rule) — inline display here so visibility doesn't depend on cascade
  // order between the .edit-list class and unscoped .list__controls rules.
  var controls = document.createElement('div');
  controls.className = 'list__controls';
  controls.style.display = document.querySelector('#locationsList .list.locations').classList.contains('edit-list') ? '' : 'none';
  var removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn btn-link list-item__delete';
  removeBtn.textContent = 'Remove';
  controls.appendChild(removeBtn);
  item.appendChild(controls);

  var nameEl = document.createElement('p');
  nameEl.className = 'location-name text-bold';
  nameEl.textContent = location.name;
  item.appendChild(nameEl);

  var addrEl = document.createElement('p');
  addrEl.className = 'location-address-street';
  addrEl.dataset.street = location.street;
  var cityState = [location.city, [location.state, location.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  addrEl.textContent = cityState ? (location.street + ' | ' + cityState) : location.street;
  item.appendChild(addrEl);

  var venueList = document.createElement('div');
  venueList.className = 'venue__list';
  (venues || []).forEach(function (venue) {
    var venueItem = document.createElement('div');
    venueItem.className = 'venue__list--item selected';
    var venueText = document.createElement('div');
    var venueNameEl = document.createElement('p');
    venueNameEl.className = 'venue-name selected';
    venueNameEl.textContent = venue.name;
    var venueTypeEl = document.createElement('p');
    venueTypeEl.className = 'venue-type';
    venueTypeEl.textContent = '(' + venue.subType + ')';
    venueText.appendChild(venueNameEl);
    venueText.appendChild(venueTypeEl);
    venueItem.appendChild(venueText);
    venueList.appendChild(venueItem);
  });
  item.appendChild(venueList);

  col.appendChild(item);
  container.appendChild(col);

  setTimeout(function () { item.classList.remove('list-item--fade-out'); }, 250);

  listWrap.style.display = '';

  var section = document.querySelector('#section-location-information');
  if (section) section.classList.add('hasData');

  var selectLocationHelp = document.querySelector('.section-location-information .help-block--selectLocation');
  if (selectLocationHelp) selectLocationHelp.classList.remove('has-error');
}

function confirmNewVenue() {
  if (!_pendingNewLocation) return;
  var isPool = _locationMode === 'pool';

  var venueNameInput = document.querySelector('#venueName');
  var poolTypeSelect = document.querySelector('#poolType');
  var openWaterTypeSelect = document.querySelector('#openWaterType');
  var courseBoxes = document.querySelectorAll('input[name="selectCourseType"]');
  var courseHelp = document.querySelector('.help-block--selectCourseType');

  validateField(venueNameInput);
  var valid = venueNameInput.value.trim().length > 0;

  if (isPool) {
    validateField(poolTypeSelect);
    var anyCourseChecked = Array.prototype.some.call(courseBoxes, function (cb) { return cb.checked; });
    if (courseHelp) courseHelp.classList.toggle('has-error', !anyCourseChecked);
    valid = valid && poolTypeSelect.value !== '-1' && anyCourseChecked;
  } else {
    validateField(openWaterTypeSelect);
    valid = valid && openWaterTypeSelect.value !== '-1';
  }

  if (!valid) {
    var invalid = document.querySelector('.list-venue-form input.has-error, .list-venue-form select.has-error, .list-venue-form span.help-block.has-error');
    if (invalid) window.scroll(0, FindPos(invalid));
    return;
  }

  var courseLabels = { '25y': 'SCY', '25m': 'SCM', '50m': 'LCM', other: 'Other' };
  var checkedCourses = Array.prototype.filter.call(courseBoxes, function (cb) { return cb.checked; })
    .map(function (cb) { return courseLabels[cb.value] || cb.value; });

  var venue = {
    name: venueNameInput.value.trim(),
    subType: isPool ? (poolTypeSelect.value + (checkedCourses.length ? ', ' + checkedCourses.join('/') : '')) : openWaterTypeSelect.value,
  };

  addLocationCard(_pendingNewLocation, [venue]);

  var venueRow = document.querySelector('.venue-form-row');
  if (venueRow) venueRow.style.display = 'none';

  _resetLocationStep1Fields();
  _resetLocationStep2Fields();

  var headerAdd = document.querySelector('.location-header__add');
  if (headerAdd) headerAdd.style.display = '';

  _pendingNewLocation = null;
  _locationMode = null;
}

function toggleLocationEdit(on) {
  var list = document.querySelector('#locationsList .list.locations');
  if (list) list.classList.toggle('edit-list', on);
  document.querySelectorAll('#locationListContainer .list__controls').forEach(function (el) {
    el.style.display = on ? '' : 'none';
  });
  var editBtn = document.querySelector('#editLocationBtn');
  var doneBtn = document.querySelector('#doneEditLocationBtn');
  if (editBtn) editBtn.style.display = on ? 'none' : '';
  if (doneBtn) doneBtn.style.display = on ? '' : 'none';
}

function saveLocation(e) {
  if (e) e.preventDefault();
  var section = document.querySelector('#section-location-information');
  var hasLocations = document.querySelectorAll('#locationListContainer .list-item').length > 0;
  var helpBlock = document.querySelector('.section-location-information .help-block--selectLocation');
  if (!hasLocations) {
    if (helpBlock) helpBlock.classList.add('has-error');
    window.scroll(0, FindPos(helpBlock));
    return;
  }
  if (helpBlock) helpBlock.classList.remove('has-error');
  if (section) section.classList.add('hasData');
  if (nextSection) {
    $(nextSection.querySelector('.section__content')).collapse('show');
    nextSection = null;
  } else {
    $(document.querySelector('#club-bundles .section__content')).collapse('show');
  }
}

// ── Location Search — prefilled candidate list from range/zip lookup ────────
// Mirrors event-edit-locations.js: the full locations dataset is baked into
// the page as inline JSON (no live Google Places key in this mockup), and a
// default city seeds the initial candidate list on load, same as production
// hydrating from a real "locations near me" API call.

(function () {
  var dataEl = document.querySelector('#club-location-search-data');
  if (!dataEl) return;
  var allLocations;
  try { allLocations = JSON.parse(dataEl.textContent); } catch (err) { allLocations = []; }

  var locationColumn = document.querySelector('.section-location-information .location-column');
  var nameInput       = document.querySelector('.section-location-information input[name="search-filter__club-name"]');
  var locationInput   = document.querySelector('.section-location-information #locationSearch');
  var rangeSelect      = document.querySelector('.section-location-information #search-filter__range');
  var submitBtn        = document.querySelector('.section-location-information #listSearchSubmit');
  var typeBoxes         = document.querySelectorAll('.section-location-information input[name="searchType"]');
  var summaryCount     = document.querySelector('.section-location-information .summary-count');
  var summaryRange     = document.querySelector('.section-location-information .summary-range');
  var summaryLoc       = document.querySelector('.section-location-information .summary-location');
  var expandSearchHelp = document.querySelector('.section-location-information .help-block--expandSearch');

  if (!locationColumn) return;

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function haversineMiles(lat1, lng1, lat2, lng2) {
    var R = 3958.8;
    var d1 = (lat2 - lat1) * Math.PI / 180;
    var d2 = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(d1 / 2) * Math.sin(d1 / 2)
      + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
      * Math.sin(d2 / 2) * Math.sin(d2 / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  var knownPoolTags = ['SCY', 'SCM', 'LCM'];

  function uniqueTags(courses) {
    var seen = {};
    var tags = [];
    (courses || []).forEach(function (c) {
      if (c.tag && !seen[c.tag]) { seen[c.tag] = true; tags.push(c.tag); }
    });
    return tags;
  }

  function renderCourseTags(courses) {
    return uniqueTags(courses).map(function (tag) {
      return '<p class="event-location--course">' + escapeHtml(tag) + '</p>';
    }).join('');
  }

  function renderSearchCard(loc) {
    return '<div class="list-item list-item--location"'
      + ' data-location-id="' + escapeHtml(loc.id) + '"'
      + ' data-name="'        + escapeHtml(loc.name) + '"'
      + ' data-address="'     + escapeHtml(loc.address) + '"'
      + ' data-city="'        + escapeHtml(loc.city) + '"'
      + ' data-state="'       + escapeHtml(loc.state) + '"'
      + ' data-zip="'         + escapeHtml(loc.zip) + '"'
      + ' data-courses="'     + escapeHtml(JSON.stringify(loc.courses)) + '">'
      + '<button type="button" class="btn btn-small btn-select-location">Select</button>'
      + '<p class="event-location__address--name">'   + escapeHtml(loc.name)    + '</p>'
      + '<p class="event-location__address--street">' + escapeHtml(loc.address) + '</p>'
      + '<p class="event-location__city-state">'      + escapeHtml(loc.city) + ', ' + escapeHtml(loc.state) + ' ' + escapeHtml(loc.zip) + '</p>'
      + '<div class="event-location--course-tags">' + renderCourseTags(loc.courses) + '</div>'
      + '</div>';
  }

  // ── Filtering ────────────────────────────────────────────────────────────

  var userLat = null;
  var userLng = null;

  function parseLocationText(raw) {
    var s = (raw || '').trim();
    if (!s) return null;
    if (/^\d{5}$/.test(s)) return { zip: s };
    if (s.indexOf(',') !== -1) {
      var parts = s.split(',');
      return { city: parts[0].trim().toLowerCase(), state: parts[1].trim().toLowerCase() };
    }
    if (/^[a-zA-Z]{2}$/.test(s)) return { state: s.toLowerCase() };
    return { city: s.toLowerCase() };
  }

  function locMatchesText(loc, parsed) {
    if (!parsed) return true;
    if (parsed.zip) return (loc.zip || '') === parsed.zip;
    var cityOk  = !parsed.city  || (loc.city  || '').toLowerCase().indexOf(parsed.city) !== -1;
    var stateOk = !parsed.state || (loc.state || '').toLowerCase().indexOf(parsed.state) !== -1;
    return cityOk && stateOk;
  }

  function getSelectedRange() {
    if (!rangeSelect) return null;
    var val = rangeSelect.value;
    return val === 'nationwide' ? null : parseFloat(val);
  }

  function locMatchesDistance(loc, rangeMiles) {
    if (rangeMiles === null) return true;
    if (userLat === null || userLng === null) return true;
    var itemLat = parseFloat(loc.lat);
    var itemLng = parseFloat(loc.lng);
    if (isNaN(itemLat) || isNaN(itemLng)) return false;
    return haversineMiles(userLat, userLng, itemLat, itemLng) <= rangeMiles;
  }

  function locMatchesType(loc, checkedValues) {
    if (!checkedValues.length) return true;
    var isPoolLoc = (loc.courses || []).some(function (c) { return knownPoolTags.indexOf(c.tag) !== -1; });
    return checkedValues.some(function (val) {
      return val === 'pool' ? isPoolLoc : !isPoolLoc;
    });
  }

  function updateSummary(count) {
    if (summaryCount) summaryCount.textContent = count;
    if (summaryRange && rangeSelect) summaryRange.textContent = rangeSelect.options[rangeSelect.selectedIndex].text;
    if (summaryLoc && locationInput) summaryLoc.textContent = locationInput.value.trim() || 'Nationwide';
  }

  function applyFilters() {
    var nameQuery     = nameInput ? nameInput.value.trim().toLowerCase() : '';
    var rangeMiles    = getSelectedRange();
    var parsedLoc     = (userLat === null && locationInput) ? parseLocationText(locationInput.value) : null;
    var checkedValues = [];
    typeBoxes.forEach(function (cb) { if (cb.checked) checkedValues.push(cb.value); });

    var matched = allLocations.filter(function (loc) {
      var nameOk   = !nameQuery || (loc.name || '').toLowerCase().indexOf(nameQuery) !== -1;
      var distOk   = locMatchesDistance(loc, rangeMiles);
      var locOk    = distOk || locMatchesText(loc, parsedLoc);
      var typeOk   = locMatchesType(loc, checkedValues);
      return nameOk && (userLat !== null ? distOk : locOk) && typeOk;
    });

    locationColumn.innerHTML = matched.map(renderSearchCard).join('');
    updateSummary(matched.length);
    if (expandSearchHelp) expandSearchHelp.classList.toggle('has-error', matched.length === 0);
  }

  function geocodeAddress(address) {
    if (!address) { applyFilters(); return; }
    fetch(
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=' + encodeURIComponent(address),
      { headers: { 'Accept-Language': 'en-US,en' } }
    )
      .then(function (r) { return r.json(); })
      .then(function (results) {
        if (results && results[0]) {
          userLat = parseFloat(results[0].lat);
          userLng = parseFloat(results[0].lon);
        }
        applyFilters();
      })
      .catch(function () { applyFilters(); });
  }

  // ── Events ───────────────────────────────────────────────────────────────

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      userLat = null;
      userLng = null;
      geocodeAddress(locationInput ? locationInput.value : '');
    });
  }

  if (nameInput) {
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') applyFilters();
    });
  }

  if (locationInput) {
    locationInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { userLat = null; userLng = null; geocodeAddress(locationInput.value); }
    });
  }

  if (rangeSelect) rangeSelect.addEventListener('change', applyFilters);
  typeBoxes.forEach(function (cb) { cb.addEventListener('change', applyFilters); });

  // ── Select a candidate → add it directly ──────────────────────────────────
  // Production's Search.jsx calls handleLocationSelect(loc) straight off the
  // Select button — Location.jsx's modalCourseSelection/showModalCourseSelection
  // are defined but never called from anywhere, so there's no course-picker
  // step here. The whole location, with every one of its pools, gets added.

  // Reconstructs distinct pools/venues from the flat courses array (grouped by
  // pool name), matching how a real API response's Pools array would look.
  function groupCoursesToVenues(courses, locationName) {
    var venueMap = {};
    var order = [];
    (courses || []).forEach(function (c) {
      var poolName = c.pool || locationName;
      if (!venueMap[poolName]) {
        venueMap[poolName] = { name: poolName, type: c.type, tags: [] };
        order.push(poolName);
      }
      if (c.tag && venueMap[poolName].tags.indexOf(c.tag) === -1) venueMap[poolName].tags.push(c.tag);
    });
    return order.map(function (poolName) {
      var v = venueMap[poolName];
      return { name: v.name, subType: [v.type, v.tags.join('/')].filter(Boolean).join(', ') };
    });
  }

  locationColumn.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-select-location');
    if (!btn) return;
    var item = btn.closest('.list-item[data-location-id]');
    if (!item) return;

    var isDuplicate = Array.prototype.some.call(
      document.querySelectorAll('#locationListContainer .location-address-street'),
      function (el) { return (el.dataset.street || '').toLowerCase() === (item.dataset.address || '').toLowerCase(); }
    );
    if (isDuplicate) {
      _openModal('modalAddDuplicateOrganization');
      return;
    }

    var courses;
    try { courses = JSON.parse(item.dataset.courses || '[]'); } catch (err) { courses = []; }

    addLocationCard({
      name: item.dataset.name,
      street: item.dataset.address,
      city: item.dataset.city,
      state: item.dataset.state,
      zip: item.dataset.zip,
    }, groupCoursesToVenues(courses, item.dataset.name));
  });

  // ── Init: seed a default city so a candidate list shows on load ──────────

  if (locationInput) locationInput.value = 'Sarasota, FL';
  geocodeAddress(locationInput ? locationInput.value : '');
}());

// ── Section — Gold Club ──────────────────────────────────────────────────────

// In production this calls the API to check for certified coaches and updates
// the certifiedCoach radio accordingly. In the mockup the coach is pre-populated
// so we assume certification is present and set Yes.
function setGoldClubFlag() {
  var yes = document.querySelector('#certifiedCoachYes');
  var no = document.querySelector('#certifiedCoachNo');
  var addCoachNote = document.querySelector('.help-block--addCoach');
  var addCoachBtn = document.querySelector('#goldClubAddCoach');
  var hasCoach = document.querySelector('#coach .list-item') !== null;
  if (yes) yes.checked = hasCoach;
  if (no) no.checked = !hasCoach;
  if (addCoachNote) addCoachNote.style.display = hasCoach ? 'none' : '';
  if (addCoachBtn) addCoachBtn.style.display = hasCoach ? 'none' : '';
}

function saveGold(e) {
  if (e) e.preventDefault();
  var section = document.querySelector('#club-bundles');
  if (!section) return;
  var radios = section.querySelectorAll('input[type="radio"]');
  var valid = true;
  var names = {};
  radios.forEach(function (r) { names[r.name] = true; });
  Object.keys(names).forEach(function (name) {
    var checked = section.querySelector('input[name="' + name + '"]:checked');
    if (!checked) {
      valid = false;
      var anyRadio = section.querySelector('input[name="' + name + '"]');
      if (anyRadio) setInputStatus(anyRadio, false);
    }
  });
  if (!valid) {
    var header = section.querySelector('.radio-group-header') || section.querySelector('.section__header');
    window.scroll(0, FindPos(header));
    return;
  }
  section.classList.add('hasData');
  if (nextSection) {
    $(nextSection.querySelector('.section__content')).collapse('show');
    nextSection = null;
  } else {
    $(document.querySelector('#club-bundles .section__content')).collapse('hide');
  }
}

// ── Section — Payment ────────────────────────────────────────────────────────

function _getClubTierIndex(swimmerCount) {
  var n = parseInt(swimmerCount, 10);
  if (isNaN(n) || n < 1) return null;
  if (n < 5)   return 1;
  if (n < 25)  return 2;
  if (n < 100) return 3;
  return 4;
}

var CLUB_TIER_PRICES = { 1: 99, 2: 199, 3: 299, 4: 499 };
var CLUB_TIER_INFO = {
  1: { label: 'Tier 1', range: '(< 5 swimmers)', price: '$99/yr' },
  2: { label: 'Tier 2', range: '(5—24 swimmers)', price: '$199/yr' },
  3: { label: 'Tier 3', range: '(25—99 swimmers)', price: '$299/yr' },
  4: { label: 'Tier 4', range: '(100+ swimmers)', price: '$499/yr' }
};

function _renderMarketingBundleTier(tier) {
  var el = document.querySelector('#marketingBundleTierPrice');
  if (!el) return;
  var info = CLUB_TIER_INFO[tier] || CLUB_TIER_INFO[1];
  el.innerHTML = '';
  var label = document.createElement('span');
  label.className = 'bundle-tier-name';
  label.textContent = info.label;
  var range = document.createElement('span');
  range.className = 'bundle-tier-swimmer-count';
  range.textContent = info.range;
  var price = document.createElement('span');
  price.className = 'bundle-tier-price';
  price.textContent = info.price;
  el.appendChild(label);
  el.appendChild(price);
  el.appendChild(range);
}

var USMS_CLUB_FEE = 75;
var CLUB_BUNDLES = ['marketingBundle', 'clubBundleOption2', 'clubBundleOption3'];

function _bundleRow(bundleKey) {
  return document.querySelector('.section-payment__bundle-row[data-bundle="' + bundleKey + '"]');
}

function _updateBillingTotal() {
  var billingInput = document.querySelector('input[name="billingAmount"]');
  var totalEl = document.querySelector('.section-payment__total');
  var clubFeeRow = document.querySelector('.section-payment__club-fee-row');
  var clubFee = (!clubFeeRow || clubFeeRow.style.display !== 'none') ? USMS_CLUB_FEE : 0;
  var bundleTotal = 0;
  CLUB_BUNDLES.forEach(function (bundleKey) {
    var row = _bundleRow(bundleKey);
    if (!row || row.style.display === 'none') return;
    var costEl = row.querySelector('.section-payment__bundle-cost');
    if (costEl) bundleTotal += parseFloat(costEl.textContent.replace('$', '')) || 0;
  });
  var total = (clubFee + bundleTotal).toFixed(2);
  if (billingInput) billingInput.value = total;
  if (totalEl) totalEl.textContent = '$' + total;
}

function updateClubPricing() {
  var swimmerInput = document.querySelector('#totalSwimmers');
  var tier = _getClubTierIndex(swimmerInput ? swimmerInput.value : '');
  var tierPrice = tier ? CLUB_TIER_PRICES[tier] : null;

  CLUB_BUNDLES.forEach(function (bundleKey) {
    var row = _bundleRow(bundleKey);
    var costEl = row && row.querySelector('.section-payment__bundle-cost');
    if (costEl) costEl.textContent = tierPrice !== null ? '$' + tierPrice + '.00' : '$0.00';
  });

  _renderMarketingBundleTier(tier || 1);

  _updateBillingTotal();
}

// Marketing Bundle radios/price depend on knowing the club's swimmer count
// (that's what the tier/price is based on), so keep them disabled/hidden
// until totalSwimmers has a value. An already-accepted bundle stays locked
// regardless — see the CLUB_BUNDLES lock in the DOMContentLoaded handler —
// so this never re-enables a radio that lock intentionally disabled.
function _syncMarketingBundleAvailability() {
  var yesRadio = document.querySelector('#marketingBundleYes');
  var noRadio = document.querySelector('#marketingBundleNo');
  var priceEl = document.querySelector('#marketingBundleTierPrice');
  if (!yesRadio || !noRadio) return;
  var locked = yesRadio.checked;
  var swimmerInput = document.querySelector('#totalSwimmers');
  var hasSwimmerCount = !!(swimmerInput && swimmerInput.value);
  if (!locked) {
    yesRadio.disabled = !hasSwimmerCount;
    noRadio.disabled = !hasSwimmerCount;
  }
  if (priceEl) priceEl.style.display = hasSwimmerCount ? '' : 'none';
}

function updateBundlePricing(bundleKey) {
  var yesRadio = document.querySelector('#' + bundleKey + 'Yes');
  var row = _bundleRow(bundleKey);
  if (!row) return;
  var show = yesRadio && yesRadio.checked;
  row.style.display = show ? '' : 'none';
  if (show) updateClubPricing();
  _updateBillingTotal();
}

function editPayment() { }

function handleAgreementChange() {
  var checkbox = document.querySelector('#agreeTerms');
  var submitBtn = document.querySelector('#submit-button');
  if (submitBtn) submitBtn.disabled = !(checkbox && checkbox.checked);
}

// Force every accordion section open at once (bypassing the single-open
// accordion behavior) so Submit Payment can surface errors anywhere in the
// form, not just the currently-open section. Skips sections Regional Club
// has disabled, since those are intentionally out of the flow.
function expandAllSections() {
  document.querySelectorAll('#accordion .section__content.collapse').forEach(function (content) {
    var wrapper = content.closest('.section');
    if (wrapper && wrapper.classList.contains('section--disabled')) return;
    content.classList.add('in', 'show');
    content.style.height = '';
    content.setAttribute('aria-expanded', 'true');
    setSectionInputStatus(content, false);
    if (content.parentElement) content.parentElement.classList.add('isEdit');
  });
}

function _validateRequiredRadioGroup(name) {
  var helpBlock = document.querySelector('.help-block--' + name);
  var answered = !!document.querySelector('input[name="' + name + '"]:checked');
  if (helpBlock) helpBlock.classList.toggle('has-error', !answered);
  return answered;
}

function _validateRequiredCheckbox(el, helpBlockSelector) {
  var helpBlock = document.querySelector(helpBlockSelector);
  var checked = !!(el && el.checked);
  if (helpBlock) helpBlock.classList.toggle('has-error', !checked);
  return checked;
}

function _validateRequiredField(selector) {
  var el = document.querySelector(selector);
  if (!el) return true;
  validateField(el);
  return !el.classList.contains('has-error');
}

function _validateAtLeastOneItem(containerSelector, helpBlockSelector) {
  var hasItem = document.querySelector(containerSelector + ' .list-item') !== null;
  var helpBlock = document.querySelector(helpBlockSelector);
  if (helpBlock) helpBlock.classList.toggle('has-error', !hasItem);
  return hasItem;
}

// Wipes every has-error/has-success flag showValidation may have set, anywhere
// in the form, so a second click can start clean rather than leaving stale
// error states on sections that get collapsed back down.
function _clearAllValidation() {
  document.querySelectorAll('#accordion .has-error, #accordion .has-success, .payment-info .has-error, .payment-info .has-success').forEach(function (el) {
    el.classList.remove('has-error', 'has-success');
  });
}

var _validationDisplayed = false;

function showValidation(e) {
  if (e) e.preventDefault();

  // Second click — dev-only reset: clear all validation states and collapse
  // every section back down except Club Name. Closes sections directly via
  // _closeSection rather than $.collapse('show')'s side effect — Club Name
  // already carries the 'in'/'show' classes expandAllSections() stamped on
  // it, so Bootstrap treats it as already shown and never fires
  // show.bs.collapse (the event the "close siblings" logic depends on).
  if (_validationDisplayed) {
    _clearAllValidation();
    document.querySelectorAll('#accordion .section__content').forEach(function (content) {
      if (content.id !== 'club-name__content') _closeSection(content);
    });
    var clubNameContent = document.querySelector('#club-name__content');
    if (clubNameContent) {
      clubNameContent.classList.add('in', 'show');
      clubNameContent.style.height = '';
      clubNameContent.setAttribute('aria-expanded', 'true');
      setSectionInputStatus(clubNameContent, false);
      if (clubNameContent.parentElement) clubNameContent.parentElement.classList.add('isEdit');
    }
    _validationDisplayed = false;
    return;
  }
  _validationDisplayed = true;

  expandAllSections();

  var allValid = true;

  // Club Name
  ['#selectLmsc', '#clubName', '#clubAbbr'].forEach(function (sel) {
    if (!_validateRequiredField(sel)) allValid = false;
  });

  // Club Details
  ['#clubDescription', '#practiceDetails', '#totalSwimmers'].forEach(function (sel) {
    if (!_validateRequiredField(sel)) allValid = false;
  });
  if (!_validateRequiredRadioGroup('usmsLiabilityInsurance')) allValid = false;
  if (!_validateRequiredRadioGroup('usaSwimmingAffiliation')) allValid = false;
  if (!_validateRequiredRadioGroup('clubTrialMembership')) allValid = false;
  if (!_validateRequiredRadioGroup('membershipRequired')) allValid = false;

  // Club Contact — requires at least one saved contact
  var contactSection = document.querySelector('#club-contact');
  if (contactSection && !contactSection.classList.contains('section--disabled')) {
    if (!_validateAtLeastOneItem('#club-contact .list__container', '.help-block--ContactType')) allValid = false;
  }

  // Location — requires at least one saved location (skipped when Regional Club disables the section)
  var locationSection = document.querySelector('#section-location-information');
  if (locationSection && !locationSection.classList.contains('section--disabled')) {
    if (!_validateAtLeastOneItem('#locationListContainer', '.section-location-information .help-block--selectLocation')) allValid = false;
  }

  // Club Bundles — only if the section is visible and not disabled by Regional Club
  var clubBundles = document.querySelector('#club-bundles');
  if (clubBundles && clubBundles.style.display !== 'none' && !clubBundles.classList.contains('section--disabled')) {
    CLUB_BUNDLES.forEach(function (bundleKey) {
      if (!_validateRequiredRadioGroup(bundleKey)) allValid = false;
    });
  }

  // Payment
  ['#cardName', '#cardNumber', '#cardCode', '#expiration', '#cardZip'].forEach(function (sel) {
    if (!_validateRequiredField(sel)) allValid = false;
  });
  if (!_validateRequiredCheckbox(document.querySelector('#agreeTerms'), '.help-block--agreeTerms')) allValid = false;

  if (!allValid) {
    var firstError = document.querySelector(
      '#accordion span.help-block.has-error, #accordion input.has-error, #accordion select.has-error, '
      + '.payment-info span.help-block.has-error, .payment-info input.has-error'
    );
    if (firstError) window.scroll(0, FindPos(firstError));
  }
}

// ── Tooltips ─────────────────────────────────────────────────────────────────

function initAccordion() {
  // Belt-and-suspenders: click listener on section headers closes all other
  // open sections before BS3/BS5 processes the toggle. Covers the case where
  // show.bs.collapse doesn't fire reliably due to BS3/BS5 coexistence.
  document.querySelectorAll('#accordion .section__header[data-toggle="collapse"]').forEach(function (header) {
    header.addEventListener('click', function () {
      var targetSelector = this.getAttribute('data-target');
      var opening = targetSelector ? document.querySelector(targetSelector) : null;
      document.querySelectorAll('#accordion .section__content').forEach(function (content) {
        if (content !== opening && (content.classList.contains('in') || content.classList.contains('show') || content.classList.contains('collapsing'))) {
          _closeSection(content);
        }
      });
    });
  });
}

function initTooltips() {
  if (window.bootstrap && window.bootstrap.Tooltip) {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
      new window.bootstrap.Tooltip(el, { strategy: 'fixed' });
    });
  }
  // Tooltip icons sit inside a <label> next to their field (or, for checkboxes,
  // inside the same label as the checkbox itself). Clicking them would otherwise
  // trigger the label's native click-forwarding to that field/checkbox, which either
  // steals focus and closes the tooltip immediately, or toggles a checkbox the user
  // never meant to touch. stopPropagation keeps the click from ever reaching the
  // label's own click handling, so neither happens.
  document.querySelectorAll('.icon-help[data-bs-toggle="tooltip"]').forEach(function (el) {
    // Track shown/hidden state so a click can tell "just opened via this
    // click's own focus" (case A) apart from "was already open" (case B).
    el.addEventListener('shown.bs.tooltip', function () { el.dataset.tooltipOpen = 'true'; });
    el.addEventListener('hidden.bs.tooltip', function () { el.dataset.tooltipOpen = 'false'; });

    var wasOpenBeforeThisClick = false;
    el.addEventListener('mousedown', function () {
      // Runs before the browser shifts focus, so this still reflects the
      // pre-click state.
      wasOpenBeforeThisClick = el.dataset.tooltipOpen === 'true';
    });

    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (wasOpenBeforeThisClick) {
        // Icon was already focused/open — this click means "close it."
        // Blurring lets the existing focus-trigger handle the hide.
        el.blur();
      }
    });
  });
}

// ── DOMContentLoaded init ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  initAccordion();

  // Capture initial state from Club Name for change detection
  var clubNameContent = document.querySelector('#club-name__content');
  if (clubNameContent) {
    currentSectionState = saveSectionState(clubNameContent);
  }

  // Lock LMSC and Abbreviation in edit state — production disables these on init
  // if they already have values, since they cannot be changed after registration.
  var lmsc = document.querySelector('#selectLmsc');
  var clubAbbr = document.querySelector('#clubAbbr');
  if (lmsc && lmsc.value) lmsc.disabled = true;
  if (clubAbbr && clubAbbr.value) clubAbbr.disabled = true;

  // Club Bundles — an existing club that already accepted a bundle can't back
  // out of it, so lock both radios once "Yes" comes in pre-selected. A bundle
  // that was previously declined ("No") stays open so the club can still
  // upgrade into it. New clubs (Create) have neither radio checked, so this
  // is a no-op for them.
  CLUB_BUNDLES.forEach(function (bundleKey) {
    var yesRadio = document.querySelector('#' + bundleKey + 'Yes');
    var noRadio = document.querySelector('#' + bundleKey + 'No');
    if (!yesRadio || !noRadio) return;
    var locked = yesRadio.checked;
    yesRadio.disabled = locked;
    noRadio.disabled = locked;
  });

  membershipRequiredLocked = !!document.querySelector('input[name="membershipRequired"]:checked');
  lockMembershipRequiredIfAnswered();

  // Mark sections with pre-populated data
  var clubName = document.querySelector('#clubName');
  if (lmsc && lmsc.value && clubName && clubName.value && clubAbbr && clubAbbr.value) {
    var nameSection = document.querySelector('#club-name');
    if (nameSection) nameSection.classList.add('hasData');
  }

  var detailsDesc = document.querySelector('#clubDescription');
  if (detailsDesc && detailsDesc.value) {
    var detailsSection = document.querySelector('#club-details');
    if (detailsSection) detailsSection.classList.add('hasData');
  }

  var contactItem = document.querySelector('#club-contact .list-item');
  if (contactItem) {
    var contactSection = document.querySelector('#club-contact');
    if (contactSection) contactSection.classList.add('hasData');
  }

  var coachItem = document.querySelector('#coach .list-item');
  if (coachItem) {
    var coachSection = document.querySelector('#coach');
    if (coachSection) coachSection.classList.add('hasData');
  }

  var locationItem = document.querySelector('#locationListContainer .list-item');
  if (locationItem) {
    var locationSection = document.querySelector('#section-location-information');
    if (locationSection) locationSection.classList.add('hasData');
    var locationsListWrap = document.querySelector('#locationsList');
    if (locationsListWrap) locationsListWrap.style.display = '';
  }

  var bundlesAnswered = document.querySelector('#club-bundles input[type="radio"]:checked');
  if (bundlesAnswered) {
    var bundlesSection = document.querySelector('#club-bundles');
    if (bundlesSection) bundlesSection.classList.add('hasData');
  }

  // Dynamic pricing — update payment total as swimmer count changes.
  var totalSwimmersEl = document.querySelector('#totalSwimmers');
  if (totalSwimmersEl) {
    totalSwimmersEl.addEventListener('blur', updateClubPricing);
    totalSwimmersEl.addEventListener('input', _syncMarketingBundleAvailability);
  }
  _syncMarketingBundleAvailability();

  CLUB_BUNDLES.forEach(function (bundleKey) {
    document.querySelectorAll('input[name="' + bundleKey + '"]').forEach(function (r) {
      r.addEventListener('change', function () { updateBundlePricing(bundleKey); });
    });
  });

  // Club Bundles section — show when "No" is selected for USMS membership requirement.
  function handleMembershipRequired() {
    var noRadio = document.querySelector('#membershipRequiredAnsweredNo');
    var clubBundles = document.querySelector('#club-bundles');
    if (!clubBundles) return;
    var requiresBundle = !!(noRadio && noRadio.checked);
    clubBundles.style.display = requiresBundle ? '' : 'none';

    if (requiresBundle) {
      _syncMarketingBundleAvailability();
    } else {
      // Membership is required again, so no bundle applies — clear any answer
      // (unless it's a locked, already-accepted bundle) and drop its line
      // item from the payment total.
      CLUB_BUNDLES.forEach(function (bundleKey) {
        var yesRadio = document.querySelector('#' + bundleKey + 'Yes');
        var noBundleRadio = document.querySelector('#' + bundleKey + 'No');
        if (yesRadio && yesRadio.disabled) return;
        if (yesRadio) yesRadio.checked = false;
        if (noBundleRadio) noBundleRadio.checked = false;
        updateBundlePricing(bundleKey);
      });
      clubBundles.classList.remove('hasData');
    }
  }
  document.querySelectorAll('input[name="membershipRequired"]').forEach(function (r) {
    r.addEventListener('change', handleMembershipRequired);
  });
  handleMembershipRequired();

  // Regional Club checkbox — disable Location Information section when checked,
  // and warn the user with a confirmation modal (mirrors production Details.js
  // handleRegionalClubChange(), which only shows the modal on check, not uncheck).
  var regionalClubEl = document.querySelector('#regionalClub');
  if (regionalClubEl) {
    regionalClubEl.addEventListener('change', function (e) {
      setRegionalClubSections(e.target.checked);
      if (e.target.checked) {
        var modalEl = document.querySelector('#modalClubDetails');
        if (modalEl) {
          // Mirrors modal.js's own [data-modal-target] click handler — this
          // codebase's modal system is self-contained (no BS3/BS5 JS), so
          // opening it via bootstrap.Modal here left an inline
          // body.style.overflow that handleCancelModal's class-based
          // cleanup (matching modal.js's close branch) never clears.
          var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
          var backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade in';
          document.body.appendChild(backdrop);
          modalEl.classList.add('in');
          modalEl.setAttribute('aria-hidden', 'false');
          document.body.classList.add('modal-open');
          document.body.style.paddingRight = scrollbarWidth + 'px';
        }
      }
    });
    setRegionalClubSections(regionalClubEl.checked);
  }

  // Clicking the Search Contact input while Add New form is open closes and
  // clears the form. Uses mousedown rather than focus — browser autofill can
  // programmatically focus this field as a side effect of filling out the
  // Add New form (it shares "name"-like field naming), which was closing the
  // form out from under the user; a real user click still fires mousedown.
  var lookupContactNameEl = document.querySelector('#lookupContactName');
  if (lookupContactNameEl) {
    lookupContactNameEl.addEventListener('mousedown', function () {
      var notMember = document.querySelector('.club-contact__not-member-container');
      if (notMember && notMember.style.display === 'block') {
        handleCancelAddContact();
      }
    });
    autocompleteContactsByName(lookupContactNameEl);
  }

  // Wire up contact-type radio buttons — mirrors production's IIFE addEventListener calls.
  var radioContactTypeCurrent = document.querySelector('#contactTypeCurrent');
  var radioContactTypeOther   = document.querySelector('#contactTypeOther');
  if (radioContactTypeCurrent) radioContactTypeCurrent.addEventListener('click', handleContactType);
  if (radioContactTypeOther)   radioContactTypeOther.addEventListener('click', handleContactType);

  // Event delegation for Remove buttons in the contact list — mirrors production's
  // button.addEventListener('click', removeContact) attached per-card in addContact().
  var contactListContainer = document.querySelector('#club-contact .list__container');
  if (contactListContainer) {
    contactListContainer.addEventListener('click', function (e) {
      var btn = e.target;
      while (btn && btn !== contactListContainer) {
        if (btn.classList.contains('list-item__delete')) {
          removeContact(e);
          return;
        }
        btn = btn.parentNode;
      }
    });
  }

  var lookupCoachNameEl = document.querySelector('#lookupCoachName');
  if (lookupCoachNameEl) {
    autocompleteCoachesByName(lookupCoachNameEl);
  }

  var coachListContainer = document.querySelector('#coach .list__container');
  if (coachListContainer) {
    coachListContainer.addEventListener('click', function (e) {
      var btn = e.target;
      while (btn && btn !== coachListContainer) {
        if (btn.classList.contains('list-item__delete')) {
          removeCoachCard(e);
          return;
        }
        btn = btn.parentNode;
      }
    });
  }

  // Location — Add New Pool / Open Water buttons
  var addPoolLocationBtn = document.querySelector('#addPoolLocationBtn');
  var addOpenWaterLocationBtn = document.querySelector('#addOpenWaterLocationBtn');
  if (addPoolLocationBtn) addPoolLocationBtn.addEventListener('click', handleAddLocationButtonClick);
  if (addOpenWaterLocationBtn) addOpenWaterLocationBtn.addEventListener('click', handleAddLocationButtonClick);

  var confirmNewFacilityBtn = document.querySelector('#confirmNewFacility');
  var cancelNewFacilityBtn = document.querySelector('#cancelNewFacility');
  if (confirmNewFacilityBtn) confirmNewFacilityBtn.addEventListener('click', confirmNewLocationDetails);
  if (cancelNewFacilityBtn) cancelNewFacilityBtn.addEventListener('click', cancelNewLocationForm);

  var saveFormPoolBtn = document.querySelector('#saveFormPool');
  var cancelSaveVenueBtn = document.querySelector('#cancelSaveVenue');
  if (saveFormPoolBtn) saveFormPoolBtn.addEventListener('click', confirmNewVenue);
  if (cancelSaveVenueBtn) cancelSaveVenueBtn.addEventListener('click', cancelNewVenueForm);

  var closeDuplicateOrganizationBtn = document.querySelector('#closeDuplicateOrganization');
  if (closeDuplicateOrganizationBtn) {
    closeDuplicateOrganizationBtn.addEventListener('click', function () {
      _closeModal('modalAddDuplicateOrganization');
    });
  }

  var editLocationBtn = document.querySelector('#editLocationBtn');
  var doneEditLocationBtn = document.querySelector('#doneEditLocationBtn');
  if (editLocationBtn) editLocationBtn.addEventListener('click', function () { toggleLocationEdit(true); });
  if (doneEditLocationBtn) doneEditLocationBtn.addEventListener('click', function () { toggleLocationEdit(false); });

  var locationListContainerEl = document.querySelector('#locationListContainer');
  if (locationListContainerEl) {
    locationListContainerEl.addEventListener('click', function (e) {
      var btn = e.target;
      while (btn && btn !== locationListContainerEl) {
        if (btn.classList.contains('list-item__delete')) {
          _locationRemoveTarget = btn.closest('.col-sm-12');
          _openModal('modalRemoveLocation');
          return;
        }
        btn = btn.parentNode;
      }
    });
  }

  var confirmRemoveLocationBtn = document.querySelector('#confirmRemoveLocation');
  if (confirmRemoveLocationBtn) {
    confirmRemoveLocationBtn.addEventListener('click', function () {
      if (_locationRemoveTarget && _locationRemoveTarget.parentNode) {
        _locationRemoveTarget.parentNode.removeChild(_locationRemoveTarget);
      }
      _locationRemoveTarget = null;
      _closeModal('modalRemoveLocation');
      var remaining = document.querySelectorAll('#locationListContainer .list-item').length;
      if (remaining === 0) {
        var listWrap = document.querySelector('#locationsList');
        if (listWrap) listWrap.style.display = 'none';
        var locationSection = document.querySelector('#section-location-information');
        if (locationSection) locationSection.classList.remove('hasData');
        toggleLocationEdit(false);
      }
    });
  }

  var saveLocationBtn = document.querySelector('#saveLocation');
  if (saveLocationBtn) saveLocationBtn.addEventListener('click', saveLocation);

  // Open Club Name section on load via Bootstrap 3 jQuery API so that the
  // show.bs.collapse listener fires and enables inputs / marks isEdit.
  setTimeout(function () {
    var clubNameContent = document.querySelector('#club-name__content');
    if (clubNameContent) $(clubNameContent).collapse('show');
  }, 150);

  initTooltips();
});
