// Sitecore form validation — driven by data-val attributes matching production's naming.
// Reads: data-val="true", data-val-required="msg", data-val-regex="msg", data-val-regex-pattern="pattern"
// Error display: adds/removes input-validation-error on inputs, field-validation-error/valid on [data-valmsg-for] spans.

function initAllScForms() {
  document.querySelectorAll('form .sc-form__container').forEach(function (container) {
    var form = container.closest('form');
    if (!form || form._scFormInit) return;
    form._scFormInit = true;
    initScForm(form);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllScForms);
} else {
  initAllScForms();
}

function initScForm(form) {

  // ── Error display ───────────────────────────────────────────────────────
  function setError(name, message) {
    form.querySelectorAll('[name="' + name + '"]').forEach(function (el) {
      el.classList.add('input-validation-error');
      el.classList.remove('valid');
    });
    var span = form.querySelector('[data-valmsg-for="' + name + '"]');
    if (span) { span.className = 'field-validation-error'; span.textContent = message; }
  }

  function clearError(name) {
    form.querySelectorAll('[name="' + name + '"]').forEach(function (el) {
      el.classList.remove('input-validation-error');
      el.classList.add('valid');
    });
    var span = form.querySelector('[data-valmsg-for="' + name + '"]');
    if (span) { span.className = 'field-validation-valid'; span.textContent = ''; }
  }

  // ── Validate a single field by name ────────────────────────────────────
  function validateField(name) {
    var el = form.querySelector('[name="' + name + '"][data-val]');
    if (!el) return true;

    var isRadio    = el.type === 'radio';
    var isCheckbox = el.type === 'checkbox';

    var value;
    if (isRadio)         value = form.querySelector('[name="' + name + '"]:checked')?.value ?? '';
    else if (isCheckbox) value = el.checked ? 'true' : '';
    else                 value = el.value.trim();

    if ('valRequired' in el.dataset) {
      if (!value) { setError(name, el.dataset.valRequired); return false; }
    }

    if ('valRegex' in el.dataset && 'valRegexPattern' in el.dataset && value) {
      if (!new RegExp(el.dataset.valRegexPattern).test(value)) {
        setError(name, el.dataset.valRegex);
        return false;
      }
    }

    clearError(name);
    return true;
  }

  // ── Conditional submit rows ─────────────────────────────────────────────
  var rowInitial   = form.querySelector('.btn-submit--initial');
  var rowMember    = form.querySelector('.btn-submit--member-row');
  var rowNonmember = form.querySelector('.btn-submit--nonmember-row');

  function updateSubmitRows() {
    if (!rowMember && !rowNonmember) return;
    var checked = form.querySelector('input[name="member"]:checked');
    var val = checked ? checked.value : null;
    if (rowInitial)   rowInitial.style.display   = val ? 'none' : '';
    if (rowMember)    rowMember.style.display     = val === 'Yes' ? '' : 'none';
    if (rowNonmember) rowNonmember.style.display  = val === 'No'  ? '' : 'none';
  }

  updateSubmitRows();

  // ── Captcha widget ──────────────────────────────────────────────────────
  form.querySelectorAll('.sc-captcha__widget').forEach(function (widget) {
    var captchaContainer = widget.closest('.sc-captcha');
    var hiddenInput = captchaContainer ? captchaContainer.querySelector('.fxt-captcha') : null;
    if (!hiddenInput) return;

    function verify() {
      if (hiddenInput.value) return;
      hiddenInput.value = 'mock-verified';
      var checkbox = widget.querySelector('.recaptcha-checkbox');
      if (checkbox) {
        checkbox.classList.add('recaptcha-checkbox-checked');
        checkbox.setAttribute('aria-checked', 'true');
      }
      validateField(hiddenInput.name);
    }

    widget.addEventListener('click', verify);
    widget.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); verify(); }
    });
  });

  // ── Event listeners ─────────────────────────────────────────────────────
  var seenNames = new Set();

  form.querySelectorAll('[data-val]').forEach(function (el) {
    if (el.type === 'hidden') return;

    if (el.type === 'radio') {
      if (seenNames.has(el.name)) return;
      seenNames.add(el.name);
      form.querySelectorAll('[name="' + el.name + '"]').forEach(function (r) {
        r.addEventListener('change', function () {
          validateField(el.name);
          updateSubmitRows();
        });
      });
    } else if (el.type === 'checkbox') {
      // Captcha checkbox is handled by the widget click above; skip blur wiring
    } else {
      el.addEventListener('blur', function () { validateField(el.name); });
    }
  });

  // ── Submit ───────────────────────────────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    var validated = new Set();

    form.querySelectorAll('[data-val]').forEach(function (el) {
      if (el.type === 'hidden' && !el.classList.contains('fxt-captcha')) return;
      if (validated.has(el.name)) return;
      validated.add(el.name);
      if (!validateField(el.name)) valid = false;
    });
  });
}
