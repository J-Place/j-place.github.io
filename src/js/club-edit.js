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

function showNewContactInputs() {
  var el = document.querySelector('.club-contact__not-member-container');
  if (el) el.style.display = '';
}

function handleCancelAddContact() {
  var el = document.querySelector('.club-contact__not-member-container');
  if (el) el.style.display = 'none';
}

function confirmCurrentContact(e) {
  if (e) e.preventDefault();
}

function handleAddContactButton() { }

function handleContactConfirmation(el) { }

function setContactTitle(e) { }

function editContactList() {
  var section = document.querySelector('#club-contact');
  if (section) section.classList.add('edit-list');
}

function cancelContactList() {
  var section = document.querySelector('#club-contact');
  if (section) section.classList.remove('edit-list');
}

function saveContactList(e) {
  if (e) e.preventDefault();
  var section = document.querySelector('#club-contact');
  if (section) section.classList.remove('edit-list');
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

  // Open Club Name section on load via Bootstrap 3 jQuery API so that the
  // show.bs.collapse listener fires and enables inputs / marks isEdit.
  setTimeout(function () {
    var clubNameContent = document.querySelector('#club-name__content');
    if (clubNameContent) $(clubNameContent).collapse('show');
  }, 150);

  initTooltips();
});
