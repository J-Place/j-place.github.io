/* global showLoadingOverlay, validateField, setSectionInputStatus,
   hideLoadingOverlay, FormData, getUrlParams, showErrorModal,
   setInputStatus, compareSections, showSaveModal,
   validateSectionName, validateGoldClubs, validateSectionDetails, validateSectionContact,
   getLocations, regionalClub, showLocationInputs, handleAddLocation
   Accept, FindPos */
/* eslint wrap-iife:0 */
function hideAgreementError() {
  document.querySelector('.help-block--agreeTerms').classList.remove('has-error');
}

function showAgreementError() {
  document.querySelector('.help-block--agreeTerms').classList.add('has-error');
}

function checkAgreement() {
  const form = document.querySelector('.payment-info');
  if (!form) return;

  if (form.querySelector('input[name="agree-terms"]').checked) {
    hideAgreementError();
  } else {
    showAgreementError();
  }
}

function showPaymentError(message) {
  if (document.querySelector('#modalPayment .modal-body > p')) {
    document.querySelector('#modalPayment .modal-body > p').innerHTML = message;
    $('#modalPayment').modal('show');
  } else {
    showErrorModal(message);
  }
}

function ValidatePaymentForm() {
  const form = document.querySelector('.payment-info');
  if (!form) return false;

  validateField(form.querySelector('input[name="cardName"]'));
  validateField(form.querySelector('input[name="cardNumber"]'));
  validateField(form.querySelector('input[name="cardCode"]'));
  validateField(form.querySelector('input[name="expiration"]'));
  validateField(form.querySelector('input[name="cardZip"]'));

  checkAgreement();

  return (form.querySelectorAll('span.help-block.has-error').length === 0);
}

function setClubExpYear() {
  const clubExpYearElem = document.querySelector('.agree-terms--year');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/apis/v1/clubweb/regyear', true);
  xhr.withCredentials = true;
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      if (!response.error) {
        const currentYear = Number(response.data);
        if (!clubExpYearElem) return;
        if (clubExpYearElem) {
          clubExpYearElem.innerHTML = currentYear;
        }
      }
    }
  };
//   xhr.send();
}

function editPayment(e) {
  e.preventDefault();
  const sectionPayment = document.querySelector('#club-payment');
  setSectionInputStatus(sectionPayment, false);
}

function submitPayment() {
  const form = document.querySelector('.payment-info');
  if (!form) {
    hideLoadingOverlay();
    return;
  }

  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  const clubId = getUrlParams('clubId');

  formData.append('BillingName', form.querySelector('input[name="cardName"]').value);
  formData.append('BillingZip', form.querySelector('input[name="cardZip"]').value);
  formData.append('BillingAmount', form.querySelector('input[name="billingAmount"]').value);
  formData.append('Nonce', form.querySelector('input[name="dataValue"]').value);
  formData.append('ClubID', clubId);
  formData.append('ClubItemId', form.querySelector('input[name="clubItemId"]').value);

  xhr.open('POST', '/apis/v1/clubweb/payment/save', true);
  xhr.withCredentials = true;
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      if (response.error) {
        hideLoadingOverlay();
        showPaymentError(response.error);
      } else {
        window.location.href = response.data.confirmationPage;
      }
    } else {
      hideLoadingOverlay();
      showPaymentError('Error sending payment');
    }
  };
  xhr.send(formData);
}

function getClubPricing() {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  const lmsc = document.querySelector('select[name="SelectLmsc"]').value;
  if (!lmsc) {
    return;
  }
  formData.append('SelectedLmsc', lmsc);
  if (document.querySelector('input[name="isWog"]')) {
    formData.append('IsWog', document.querySelector('input[name="isWog"]').value || false);
  } else {
    formData.append('IsWog', false);
  }

  xhr.open('POST', '/apis/v1/clubweb/getpricing', true);
  xhr.withCredentials = true;
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      if (!response.error) {
        const usmsCost = Number(response.data.UsmsCost);
        const lmscCost = Number(response.data.LmscCost);
        const total = usmsCost + lmscCost;
        document.querySelector('.section-payment .section-payment__usms-cost').innerHTML = `$${total.toFixed(2)}`;
      } else {
        showPaymentError(response.error);
      }
    } else {
      showPaymentError('Error updating pricing');
    }
  };
  xhr.send(formData);
}

function responseHandler(response) {
  const form = document.querySelector('.payment-info');
  if (!form) {
    hideLoadingOverlay();
    return;
  }
  let errorMessage = '';
  if (response.messages.resultCode === 'Error') {
    for (let i = 0; i < response.messages.message.length; i += 1) {
      const error = response.messages.message[i];
      switch (error.code) {
        case 'E_WC_05':
          setInputStatus(form.querySelector('input[name="cardNumber"]'), false);
          errorMessage += error.text;
          break;
        case 'E_WC_06':
        case 'E_WC_07':
        case 'E_WC_08':
          setInputStatus(form.querySelector('input[name="expiration"]'), false);
          errorMessage += error.text;
          break;
        case 'E_WC_15':
          setInputStatus(form.querySelector('input[name="cardCode"]'), false);
          errorMessage += error.text;
          break;
        default:
          errorMessage += error.text;
      }
    }
    hideLoadingOverlay();
    showPaymentError(errorMessage);
    return;
  }
  if (response && response.opaqueData && response.opaqueData.dataDescriptor &&
    response.opaqueData.dataValue) {
    form.querySelector('input[name="dataDesc"]').value = response.opaqueData.dataDescriptor;
    form.querySelector('input[name="dataValue"]').value = response.opaqueData.dataValue;
    submitPayment();
  } else {
    hideLoadingOverlay();
  }
}

function getSecureData() {
  const form = document.querySelector('.payment-info');
  if (!form) return false;

  const expiration = form.querySelector('input[name="expiration"]').value;
  const month = expiration.substring(0, expiration.indexOf('/'));
  const year = expiration.substring(expiration.indexOf('/') + 1);

  return {
    cardData: {
      cardNumber: form.querySelector('input[name="cardNumber"]').value,
      month,
      year,
      cardCode: form.querySelector('input[name="cardCode"]').value,
      cardZip: form.querySelector('input[name="cardZip"]').value,
    },
    authData: {
      clientKey: form.querySelector('input[name="clientKey"]').value,
      apiLoginID: form.querySelector('input[name="loginId"]').value,
    },
  };
}

function handleAgreementChange(e) {
  if (!document.querySelector('input[name="agree-terms"]').checked) {
    showAgreementError();
  } else {
    hideAgreementError();
  }
}

function validateSectionsForPayment() {
  const previousSection = document.querySelector('.section__content.collapse.in');
  if (previousSection) {
    let sectionSaved = false;
    switch (previousSection.id) {
      case 'club-name__content':
        sectionSaved = compareSections(previousSection);
        break;
      case 'club-details__content':
        sectionSaved = compareSections(previousSection);
        break;
      case 'club-contact__content':
        sectionSaved = compareSections(previousSection);
        break;
      default:
        break;
    }
    if (!sectionSaved) {
      hideLoadingOverlay();
      showSaveModal(previousSection.querySelector('button.btn.save-section').onclick);
      return false;
    }
  }
  if (!validateSectionName()) {
    hideLoadingOverlay();
    $('#club-name .section__content').collapse('show');
    return false;
  }

  if (!validateSectionDetails()) {
    hideLoadingOverlay();
    $('#club-details .section__content').collapse('show');
    return false;
  }

  if (!validateSectionContact()) {
    hideLoadingOverlay();
    $('#club-contact .section__content').collapse('show');
    return false;
  }
  if (!validateContactStatus()) {
    hideLoadingOverlay();
    $('#club-contact .section__content').collapse('show');
    return false;
  }

  if (regionalClub && regionalClub.checked) return true;

  if (!validateGoldClubs()) {
    hideLoadingOverlay();
    $('#gold-club .section__content').collapse('show');
    return false;
  }

  if (!validateLocations()) {
    hideLoadingOverlay();
    $('#club-location .section__content').collapse('show');
    return false;
  }
  return true;
}

function validateContactStatus() {
  document.querySelector('.section-payment__contact-pending').style.display = 'block';
  const result = document.querySelectorAll('#club-contact .list-item div.coach-validated').length === 0;
  setSubmitStatus(result);
  return result;
}

function submitCreditCard(e) {
  e.preventDefault();
  showLoadingOverlay();

  if (!validateSectionsForPayment()) {
    hideLoadingOverlay();
    return;
  }
  if (ValidatePaymentForm()) {
    // if form is ok, check address
    const data = getSecureData();
    if (data) {
      Accept.dispatchData(data, responseHandler);
    } else {
      hideLoadingOverlay();
    }
  } else {
    const form = document.querySelector('.payment-info');
    if (form.querySelectorAll('input.has-error')[0]) {
      window.scroll(0, FindPos(form.querySelectorAll('input.has-error')[0]));
      hideLoadingOverlay();
    }
  }
}

(function () {
  // $('[data-toggle="tooltip"]').tooltip();
  $('input[name="expiration"]').mask('09/09');
  setClubExpYear();
  if (document.querySelector('input[name="isWog"]')) {
    getClubPricing();
  }
})();
