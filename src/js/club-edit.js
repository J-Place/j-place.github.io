// === Shared state (mirrors production Accordion.js globals) ===
var nextSection = null;
var currentSectionState = null;
var currentCallback = null;

// ── Utilities ────────────────────────────────────────────────────────────────

function FindPos(obj) {
  if (!obj) return 0;
  var curtop = 0;
  if (obj.offsetParent) {
    do { curtop += obj.offsetTop; } while ((obj = obj.offsetParent));
  }
  return curtop;
}

function setSectionInputStatus(section, disabled) {
  if (!section) return;
  // Club Name and Gold Club manage their own disabled state
  if (section.id === 'club-name__content' || section.id === 'gold-club__content') return;
  section.querySelectorAll('input').forEach(function (el) { el.disabled = disabled; });
  section.querySelectorAll('select').forEach(function (el) { el.disabled = disabled; });
  section.querySelectorAll('textarea').forEach(function (el) { el.disabled = disabled; });
  section.querySelectorAll('button').forEach(function (el) {
    if (!el.className || el.className.indexOf('section__edit-btn') === -1) {
      el.disabled = disabled;
    }
  });
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
    case 'gold-club__content':
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

    // Bootstrap 3 open state is .in (not .show)
    $('#accordion .section__content').filter(function () {
      return this !== contentEl && ($(this).hasClass('in') || $(this).hasClass('collapsing'));
    }).collapse('hide');

    setTimeout(function () {
      window.scroll(0, FindPos(contentEl.parentNode));
    }, 450);

    setSectionInputStatus(contentEl, false);
    contentEl.parentElement.classList.add('isEdit');

    switch (contentEl.id) {
      case 'gold-club__content':
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

function autocompleteContactsByName(inp) {
  var runSearch = _debounce(function () {
    var val = inp.value.trim().toLowerCase();
    _closeAllLists(inp);
    if (val.length < 3) return;

    var matches = MOCK_CONTACTS.filter(function (c) {
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

    matches.forEach(function (contact) {
      var item = document.createElement('div');
      var fullName = contact.firstName + ' ' + contact.lastName;
      var location = contact.city && contact.state ? contact.city + ', ' + contact.state : '';
      var matchIdx = fullName.toLowerCase().indexOf(val);
      var boldedName = matchIdx >= 0
        ? fullName.slice(0, matchIdx) + '<strong>' + fullName.slice(matchIdx, matchIdx + val.length) + '</strong>' + fullName.slice(matchIdx + val.length)
        : fullName;
      item.innerHTML = boldedName + (location ? ' <span class="autocomplete-location">' + location + '</span>' : '');

      item.addEventListener('mousedown', function (e) {
        e.preventDefault();
        inp.value = fullName;
        setCurrentContact(contact);
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

function showNewContactInputs() {
  var lookupInput = document.querySelector('#lookupContactName');
  if (lookupInput) { lookupInput.value = ''; _closeAllLists(lookupInput); }

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

function handleAddContactButton() { }

function handleContactConfirmation(el) { }

function setContactTitle(e) {
  if (e) e.preventDefault();
  if (!_latestContact) return;

  addContact(_latestContact);
  _latestContact = null;

  var lookupInput = document.querySelector('#lookupContactName');
  if (lookupInput) { _closeAllLists(lookupInput); lookupInput.value = ''; }
  var confirmDiv = document.querySelector('#club-contact .lookup-confirm');
  if (confirmDiv) confirmDiv.classList.remove('show');
  var addBtn = document.querySelector('#addAsContact');
  if (addBtn) addBtn.disabled = true;
  var nameEl = document.querySelector('#club-contact .lookup-confirm--name');
  if (nameEl) nameEl.textContent = '';

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

function setTitle(e, type) {
  if (e) e.preventDefault();
}

function handleAddCoachButton() { }

function showNewCoachInputs() {
  var el = document.querySelector('.club-coach__not-member-container');
  if (el) el.style.display = '';
}

function hideCoachLookupInputs() { }

function showCoachSection() { }

function editCoachList() {
  var section = document.querySelector('#coach');
  if (section) section.classList.add('edit-list');
}

function cancelCoachList() {
  var section = document.querySelector('#coach');
  if (section) section.classList.remove('edit-list');
}

function saveCoachList(e) {
  if (e) e.preventDefault();
  var section = document.querySelector('#coach');
  if (section) section.classList.remove('edit-list');
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
  var section = document.querySelector('#gold-club');
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
    $(document.querySelector('#gold-club .section__content')).collapse('hide');
  }
}

// ── Section — Payment ────────────────────────────────────────────────────────

function editPayment() { }

function handleAgreementChange() {
  var checkbox = document.querySelector('#agreeTerms');
  var submitBtn = document.querySelector('#submit-button');
  if (submitBtn) submitBtn.disabled = !(checkbox && checkbox.checked);
}

function submitCreditCard(e) {
  if (e) e.preventDefault();
}

// ── Tooltips ─────────────────────────────────────────────────────────────────

function initTooltips() {
  if (window.bootstrap && window.bootstrap.Tooltip) {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
      new window.bootstrap.Tooltip(el, { strategy: 'fixed' });
    });
  }
}

// ── DOMContentLoaded init ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
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

  var locationItem = document.querySelector('#location-information .list-item');
  if (locationItem) {
    var locationSection = document.querySelector('#location-information');
    if (locationSection) locationSection.classList.add('hasData');
  }

  var goldYes = document.querySelector('#gold-club input[type="radio"]:checked');
  if (goldYes) {
    var goldSection = document.querySelector('#gold-club');
    if (goldSection) goldSection.classList.add('hasData');
  }

  // Clicking the Search Contact input while Add New form is open closes and clears the form.
  var lookupContactNameEl = document.querySelector('#lookupContactName');
  if (lookupContactNameEl) {
    lookupContactNameEl.addEventListener('focus', function () {
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

  // Open Club Name section on load via Bootstrap 3 jQuery API so that the
  // show.bs.collapse listener fires and enables inputs / marks isEdit.
  setTimeout(function () {
    var clubNameContent = document.querySelector('#club-name__content');
    if (clubNameContent) $(clubNameContent).collapse('show');
  }, 150);

  initTooltips();
});
