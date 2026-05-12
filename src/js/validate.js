// Form validation utilities
// Extracted from production login.min.js (utils/forms.js)
// Depends on: validator.js (loaded from CDN or vendored)

// ── Internal helpers ──────────────────────────────────────────────────────────

function _findFormGroup(el) {
  var parent = el.parentNode;
  return parent.classList.contains('form-group') ? parent : _findFormGroup(parent);
}

function _setInputStatus(input, isValid) {
  // Zip inputs are treated as a pair — clear both before re-evaluating
  if (input.name === 'ZipInt' || input.name === 'ZipUs') {
    ['ZipUs', 'ZipInt'].forEach(function (name) {
      var el = document.querySelector('input[name="' + name + '"]');
      if (el) {
        el.classList.remove('has-success', 'has-error');
      }
    });
  }

  input.classList.remove('has-success', 'has-error');

  var helpBlock = document.querySelector('span.help-block--' + input.name);

  try {
    if (isValid) {
      input.classList.add('has-success');
      if (!helpBlock) return;
      helpBlock.classList.remove('has-error');
      if (input.type === 'email') {
        var okIcon = document.querySelector('span.glyphicon--' + input.name);
        if (okIcon) {
          okIcon.classList.remove('glyphicon-remove');
          okIcon.classList.add('glyphicon-ok');
          okIcon.style.color = '#3c763d';
        }
      }
    } else {
      input.classList.add('has-error');
      if (helpBlock) helpBlock.classList.add('has-error');
      if (input.type === 'email') {
        var errIcon = document.querySelector('span.glyphicon--' + input.name);
        if (errIcon) {
          errIcon.classList.remove('glyphicon-ok');
          errIcon.classList.add('glyphicon-remove');
          errIcon.style.color = '#a94442';
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}

function _isValidExpirationDate(value) {
  if (!/^[0-9]{1,2}\/[0-9]{1,2}$/.test(value)) return false;
  var month = value.substring(0, value.indexOf('/'));
  var year = value.substring(value.indexOf('/') + 1);
  var now = new Date();
  var floor = new Date(Number(('' + now.getFullYear()).substring(2)), now.getMonth());
  return new Date(year, month - 1) >= floor;
}

// ── Field-type validators ─────────────────────────────────────────────────────

function _validatePhone(input) {
  var countrySelect = document.querySelector('select[name="SelectedCountry"]');
  var isValid;
  if (countrySelect && countrySelect.value !== 'US') {
    isValid = /^./.test(input.value);
  } else {
    isValid = /^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/.test(input.value);
  }
  _setInputStatus(input, isValid);
}

function _validateText(input) {
  var hasLengthConstraints = input.minLength !== -1 && input.maxLength !== -1;
  var isValid = hasLengthConstraints
    ? validator.isLength(input.value, { min: input.minLength, max: input.maxLength })
    : validator.isLength(input.value, { min: 1 });
  _setInputStatus(input, isValid);
}

function _validateExpiration(input) {
  input.classList.remove('has-error--credit-card');
  if (!input.value) {
    _setInputStatus(input, false);
    return;
  }
  // If inside a renew form with a renewalDate, validate against that date
  var renewalDateInput = document.querySelector('input[name="renewalDate"]');
  var inPaymentForm = document.querySelector('div.payment-information--form');
  var inRenewForm = document.querySelector('div.renew__form-container');
  var signupChecked = document.querySelector('input[name="signup"]:checked');

  if ((inPaymentForm && renewalDateInput) || (inRenewForm && signupChecked && renewalDateInput)) {
    var parts = input.value.split('/');
    var renewalDate = new Date(renewalDateInput.value);
    var cardExpiry = new Date(Number('20' + parts[1]), Number(parts[0]), 0);
    var isValid = _isValidExpirationDate(input.value) && cardExpiry > renewalDate;
    _setInputStatus(input, isValid);
    if (!isValid) input.classList.add('has-error--credit-card');
  } else {
    _setInputStatus(input, _isValidExpirationDate(input.value));
  }
}

function _validateZip(input) {
  var countrySelect = document.querySelector('select[name="SelectedCountry"]');
  var isValid;
  if (countrySelect && countrySelect.value === 'US') {
    isValid = /^\d{5}([-\s]\d{4})?$/.test(input.value);
  } else {
    isValid = /^./.test(input.value);
  }
  _setInputStatus(input, isValid);
}

function _validateCvv(input) {
  _setInputStatus(input, /^\d{3,4}$/.test(input.value));
}

function _validateNumber(input) {
  if (!input) {
    console.error('Invalid input for ValidateNumber [' + input + ']');
    _setInputStatus(input, false);
    return;
  }
  var hasRange = input.min !== undefined && input.min && input.max !== undefined && input.max;
  var isValid = !!input.value && (hasRange
    ? !Number.isNaN(input.value) && input.value >= input.min && input.max >= input.value
    : !Number.isNaN(input.value));
  _setInputStatus(input, isValid);
}

function _validateEmail(input) {
  _setInputStatus(input, validator.isEmail(input.value));
}

function _validateSelect(input) {
  _setInputStatus(input, input.value !== '-1');
}

function _validateRadioCheckbox(input) {
  var checked = document.querySelector('input[name=' + input.name + ']:checked');
  _setInputStatus(input, checked !== null);
}

// ── Public API ────────────────────────────────────────────────────────────────

var ValidateField = function (input) {
  if (typeof window === 'undefined') return;
  if (!input) {
    console.error('Null field specified on ValidateField function.');
    return;
  }

  switch (input.type) {
    case 'text':
      var name = input.name.toLowerCase();
      if (name === 'cardnumberid') {
        _setInputStatus(input, validator.isCreditCard(input.value));
      } else if (name === 'phone' || name.indexOf('phone') !== -1) {
        _validatePhone(input);
      } else if (name === 'zip' || name.indexOf('zip') !== -1 || name === 'cardzipid') {
        _validateZip(input);
      } else if (name === 'cardcodeid') {
        _validateCvv(input);
      } else if (name === 'expiration') {
        _validateExpiration(input);
      } else {
        _validateText(input);
      }
      break;
    case 'number':
      _validateNumber(input);
      break;
    case 'email':
      _validateEmail(input);
      break;
    case 'select-one':
      _validateSelect(input);
      break;
    case 'radio':
    case 'checkbox':
      _validateRadioCheckbox(input);
      break;
    default:
      _validateText(input);
  }
};

var ValidateDob = function (yearInput, monthInput, dayInput) {
  var dob = new Date(yearInput.value, monthInput.value - 1, dayInput.value);
  var now = new Date();
  var cutoff = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
  var isValid = cutoff >= dob;
  var helpBlock = document.querySelector('span.help-block--date-of-birth');
  if (helpBlock) {
    helpBlock.classList.toggle('has-error', !isValid);
    helpBlock.classList.toggle('has-success', isValid);
  }
};

var BlockDigits = function (e) {
  if (['Tab', 'Backspace', 'Enter'].indexOf(e.key) !== -1) return;
  if (!/^[A-Za-z]$/.test(e.key)) e.preventDefault();
};

var MakeColumnWithErrorSameHeight = function () {
  if (typeof window === 'undefined') return;

  if (document.body.getBoundingClientRect().width < 768) {
    // Mobile: reset heights, then equalize columns within error rows
    document.querySelectorAll('.form-group div.col-xs-4').forEach(function (el) {
      el.style.height = null;
    });
    document.querySelectorAll('.form-group div.col-xs-4 span.has-error').forEach(function (errorSpan) {
      var cols = _findFormGroup(errorSpan).querySelectorAll('div.col-xs-4');
      var maxH = 0;
      cols.forEach(function (col) {
        if (col.getBoundingClientRect().height > maxH) maxH = col.getBoundingClientRect().height;
      });
      cols.forEach(function (col) {
        if (col.getBoundingClientRect().height < maxH) {
          col.style.height = maxH + 'px';
          col.classList.add('same-height');
        }
      });
    });
  } else {
    // Desktop: reset, then equalize all col- children within error form-groups
    document.querySelectorAll('.form-group div[class^="col-"]').forEach(function (el) {
      el.style.height = null;
      el.classList.remove('same-height');
    });
    var errorCols = [];
    document.querySelectorAll('.form-group div[class^="col-"] span.has-error').forEach(function (span) {
      if (!span.parentNode.classList.contains('col-xs-9')) errorCols.push(span);
    });
    errorCols.forEach(function (span) {
      var group = _findFormGroup(span);
      if (group.querySelector('input[type="radio"], input[type="checkbox"]')) return;
      var groupH = group.getBoundingClientRect().height;
      group.querySelectorAll('div[class^="col-"]').forEach(function (col) {
        if (col.parentNode.classList.contains('form-group') && col.getBoundingClientRect().height < groupH) {
          col.style.height = groupH + 'px';
          col.classList.add('same-height');
        }
        if (col.parentNode.classList.contains('row')) {
          var rowH = col.parentNode.getBoundingClientRect().height;
          col.parentNode.querySelectorAll('div[class^="col-"]').forEach(function (sibling) {
            if (sibling.getBoundingClientRect().height < rowH) {
              sibling.style.height = rowH + 'px';
              sibling.classList.add('same-height');
            }
          });
        }
      });
    });
  }
};
