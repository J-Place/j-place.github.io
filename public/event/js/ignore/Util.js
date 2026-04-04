function getUrlParams(prop) {
  const params = (new URL(document.location)).searchParams;
  return params.get(prop);
}

function setSectionInputStatus(section, disabled) {
  console.log("setSectionInputStatus", section.id);
  if (section && section.id !== 'club-name__content') {
    const inputs = section.querySelectorAll('input');
    // console.log(inputs);
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = disabled;
    }
    const buttons = section.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].className.indexOf('section__edit-btn') === -1) {
        buttons[i].disabled = disabled;
      }
    }
    const selects = section.querySelectorAll('select');
    for (let i = 0; i < selects.length; i++) {
      selects[i].disabled = disabled;
    }
    const textAreas = section.querySelectorAll('textarea');
    for (let i = 0; i < textAreas.length; i++) {
      textAreas[i].disabled = disabled;
    }
  }
}

function FindPos(obj) {
  if (typeof obj || !obj) return 0;
  let curtop = 0;
  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }
  return curtop;
}

function showSaveModal(callback) {
  if (callback) {
    currentCallback = callback;
    $('#modalSaveSection').modal('show');
  } else {
    console.error('No callback function set for save modal');
  }
}

function closeSaveModal() {
  $('#modalSaveSection').modal('hide');
}

function closeConfirmationModal() {
  $('#modalConfirmation').modal('hide');
}

function showConfirmationModal(message, callback) {
  document.querySelector('#modalConfirmation .modal-body p').innerHTML = message;
  if (callback) {
    $('#modalConfirmation button.btn-success').on('click', callback);
  }
  $('#modalConfirmation').modal('show');
}

function showMessageModal(message) {
  document.querySelector('#modalMessage .modal-body p').innerHTML = message;
  $('#modalMessage').modal('show');
}

function showApprovalMessageModal(message) {
  document.querySelector('#modalMessageApproval .modal-body p').innerHTML = message;
  $('#modalMessageApproval').modal('show');
}

function closeMessageModal() {
  document.querySelector('#modalMessage .modal-body p').innerHTML = '';
  $('#modalMessage').modal('hide');
}

function closeApprovalMessageModal() {
  document.querySelector('#modalMessageApproval .modal-body p').innerHTML = '';
  $('#modalMessageApproval').modal('hide');
  location.replace('/club-central/club-dashboard/');
}

function showLoadingOverlay() {
  const overlay = document.querySelector('.loading');
  if (overlay) {
    overlay.style.display = 'flex';
  }
  // added timeout in case loading overlay gets stuck
  setTimeout(function () {
    hideLoadingOverlay();
  },
    700);
}

function hideLoadingOverlay() {
  const overlay = document.querySelector('.loading');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

function scrollLoginBegin() {
  if (!document.querySelector('.form-complete-message')) return;
  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return;
  $([document.documentElement, document.body]).animate({
    scrollTop: $('.form-complete-message').offset().top,
  }, 250);
}

$(window).on('load', function () {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();
  scrollLoginBegin();
});
