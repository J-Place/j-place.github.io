/* eslint no-restricted-syntax: 0 */
/* eslint guard-for-in: 0 */

function findFormGroup(div) {
  const parent = div.parentNode;
  if (parent.classList.contains('form-group')) {
    return parent;
  }
  return findFormGroup(parent);
}

function sectionContainsErrors(section) {
  if (!section) {
    console.error('[sectionContainsErrors] - Section is undefined or null');
    return true;
  }
  return section.querySelector('span.has-error') !== null;
}

function setInputStatus(input, isValid) {
  input.classList.remove('has-success');
  input.classList.remove('has-error');
  try {
    if (isValid) {
      input.classList.add('has-success');
      if (input.parentNode.classList.contains('form-group')) {
        input.parentNode.classList.remove('has-error');
        input.parentNode.classList.add('has-success');
      }
      if (input.id === 'loginEmail' || input.id === 'loginGuestEmail') {
        input.parentNode.querySelector('span.help-block').classList.remove('has-error');
        input.parentNode.querySelector('span.help-block').classList.add('has-success');
        return;
      }
      if (input.type === 'file') {
        input.parentNode.parentNode.querySelector('span.help-block').classList.remove('has-error');
      } else if (document.querySelector(`span.help-block--${input.name}`)) {
        document.querySelector(`span.help-block--${input.name}`).classList.remove('has-error');
      }
    } else {
      input.classList.add('has-error');
      if (input.parentNode.classList.contains('form-group')) {
        input.parentNode.classList.add('has-error');
        input.parentNode.classList.remove('has-success');
      }
      if (input.id === 'loginEmail' || input.id === 'loginGuestEmail') {
        input.parentNode.querySelector('span.help-block').classList.add('has-error');
        input.parentNode.querySelector('span.help-block').classList.remove('has-success');
        return;
      }
      if (input.type === 'file') {
        input.parentNode.parentNode.querySelector('span.help-block').classList.add('has-error');
      } else if (document.querySelector(`span.help-block--${input.name}`)) {
        document.querySelector(`span.help-block--${input.name}`).classList.add('has-error');
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function isValidUrl(url) {
  const testRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  return testRegex.test(url);
}

function isValidEmail(email) {
  const testRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return testRegex.test(String(email).toLowerCase());
}

function isValidPhone(value) {
  const testRegex = /^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/;
  return testRegex.test(value);
}

function IsValidZip(value) {
  const testRegex = /^\d{5}([-\s]\d{4})?$/;
  return testRegex.test(value);
}

function IsValidCvv(value) {
  const testRegex = /^\d{3,4}$/;
  return testRegex.test(value);
}

function IsValidExpiration(value) {
  const testRegex = /^[0-9]{1,2}\/[0-9]{1,2}$/;
  if (!testRegex.test(value)) {
    return false;
  }
  const month = value.substring(0, value.indexOf('/'));
  const year = value.substring(value.indexOf('/') + 1);

  const currentMonth = new Date().getMonth();
  const currentYear = Number(new Date().getFullYear().toString().substring(2));

  const currentDate = new Date(currentYear, currentMonth);
  const inputDate = new Date(year, month - 1);
  return inputDate >= currentDate;
}

function IsValidCardNumber(value) {
  const testRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})|(?:3\d{15})$/;
  return testRegex.test(value);
}

function ValidateSocialUrl(input) {
  const result = isValidUrl('www.test.com/' + input.value);
  // we set domain while testing since input doesnt include it
  setInputStatus(input, result);
  return result;
}

function ValidateUrl(input) {
  const result = isValidUrl(input.value);
  setInputStatus(input, result);
  return result;
}

function ValidateTextArea(input) {
  const result = input.value.length > 0;
  setInputStatus(input, result);
  return result;
}

function ValidatePhone(input) {
  const result = isValidPhone(input.value);
  setInputStatus(input, result);
  return result;
}

function ValidateText(input) {
  let result = false;

  // if input min length is not set, we just check if its empty
  if (!input.minLength) {
    result = input.value.length > 0;
  } else if (input.minLength === -1) {
    result = input.value.length > 0;
  } else {
    result = input.value.length >= input.minLength && input.value.length <= input.maxLength;
  }
  setInputStatus(input, result);
  return result;
}

function ValidateEmail(input) {
  const result = isValidEmail(input.value);
  setInputStatus(input, result);
}

function ValidateSelect(input) {
  const result = input.value !== '-1' && input.value !== '';
  setInputStatus(input, result);
}

function ValidateZip(input) {
  setInputStatus(input, IsValidZip(input.value));
}

function ValidateCardCode(input) {
  setInputStatus(input, IsValidCvv(input.value));
}

function ValidateExpiration(input) {
  setInputStatus(input, IsValidExpiration(input.value));
}

function ValidateCardNumber(input) {
  setInputStatus(input, IsValidCardNumber(input.value));
}

function ValidateRadio(input) {
  const result = document.querySelector('input[name=' + input.name + ']:checked') !== null;
  setInputStatus(input, result);
}

function validateField(field) {
  if (!field) return false;

  switch (field.type) {
    case 'text': {
    //   if (field.id === 'socialFacebook' || field.id === 'socialTwitter' || field.id === 'socialInstagram') {
    //     ValidateSocialUrl(field);
    //   } else 
      if (field.id === 'cardNumber') {
        ValidateCardNumber(field);
      } else if (field.id === 'cardCode') {
        ValidateCardCode(field);
      } else if (field.id === 'cardZip') {
        ValidateZip(field);
      } else if (field.id === 'expiration') {
        ValidateExpiration(field);
      } else if (field.id.toLowerCase().indexOf('phone') !== -1) {
        ValidatePhone(field);
      } else {
        ValidateText(field);
      }
      break;
    }
    case 'textarea': {
      ValidateTextArea(field);
      break;
    }
    case 'email': {
      ValidateEmail(field);
      break;
    }
    case 'select-one': {
      ValidateSelect(field);
      break;
    }
    case 'radio': {
      ValidateRadio(field);
      break;
    }
    case 'tel': {
      ValidatePhone(field);
      break;
    }
    case 'url': {
      ValidateUrl(field);
      break;
    }
    default: {
      ValidateText(field);
      break;
    }
  }
}

function handleInputBlur(input) {
  validateField(input);
}

function showErrorModal(message) {
  document.querySelector('#modalError .modal-body > p').innerHTML = message;
  $('#modalError').modal('show');
}

function closeErrorModal() {
  document.querySelector('#modalError .modal-body > p').innerHTML = '';
  $('#modalError').modal('hide');
}

function deepEqual(a, b) {
  if ((typeof a === 'object' && a !== null) &&
    (typeof b === 'object' && b !== null)) {
    const count = [0, 0];
    for (let key in a) count[0] += 1;
    for (let key in b) count[1] += 1;
    if (count[0] - count[1] !== 0) {
      return false;
    }
    for (let key in a) {
      if (!(key in b) || !deepEqual(a[key], b[key])) {
        return false;
      }
    }
    for (let key in b) {
      if (!(key in a) || !deepEqual(b[key], a[key])) {
        return false;
      }
    }
    return true;
  }
  return a === b;
}






function compareSections(section) {
  const newState = saveSectionState(section);
  return deepEqual(currentSectionState, newState);
}

function saveSectionState(section) {
  if (!section) return null;

  const state = {
    inputs: [],
    selects: [],
    textareas: [],
  };

  const inputs = section.querySelectorAll('input:not([type="file"])');
  const selects = section.querySelectorAll('select');
  const textareas = section.querySelectorAll('textarea');
  for (let i = 0; i < inputs.length; i += 1) {
    const input = inputs[i];
    state.inputs.push({
      name: input.name,
      id: input.id,
      value: input.value,
      checked: input.checked,
      type: input.type,
    });
  }
  for (let i = 0; i < selects.length; i += 1) {
    const input = selects[i];
    state.selects.push({
      name: input.name,
      id: input.id,
      value: input.value.replace('{', '').replace('}', '').toUpperCase(),
    });
  }
  for (let i = 0; i < textareas.length; i += 1) {
    const input = textareas[i];
    state.textareas.push({
      name: input.name,
      id: input.id,
      value: input.value,
    });
  }

  return state;
}



function sectionSaved(section) {
    let result = false;
    switch (section.id) {
        case "event-type__content":
            console.log("Validation/sectionSaved/Event Type");
            break;
        case "event-information__content":
            console.log("Validation/sectionSaved/Event Information");
            break;
        case "contact-information__content":
        case "location-information__content":
        case "entry-information__content":
            console.log("Validation/sectionSaved/Entry Information");
            break;
        case "accept-submit__content":
        default:
    }
    return result;
}


function setSubmitStatus(status) {
    if (status) {
    // document.querySelector('.section-payment__contact-pending').style.display = 'none';
    // if (document.querySelector('#club-payment button#saveClubName')) {
    //   document.querySelector('#club-payment button#saveClubName').disabled = false;
    // }
    // if (document.querySelector('#club-payment button#submit-button')) {
    //   document.querySelector('#club-payment button#submit-button').disabled = false;
    // }
    } else {
    // document.querySelector('.section-payment__contact-pending').style.display = 'block';
    // if (document.querySelector('#club-payment button#saveClubName')) {
    //   document.querySelector('#club-payment button#saveClubName').disabled = true;
    // }
    // if (document.querySelector('#club-payment button#submit-button')) {
    //   document.querySelector('#club-payment button#submit-button').disabled = true;
    // }
    }
}