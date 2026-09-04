// ============================================================
// EXPERIMENTAL / DEV ONLY — do not load in production
// Apple Pay / Google Pay mockup for the registration payment section.
//
// Neither real payment sheet is markup we can build — Apple Pay is a
// native Safari/OS sheet, Google Pay is a Google-hosted overlay. This
// fakes the concept (merchant name, line items pulled live from the
// existing payment summary, total, confirm action) using our standard
// modal.njk-shaped markup, so the global modal.js open/close handling
// (data-modal-target / .js-modal-close) just works on it with no changes
// to modal.js itself.
//
// Isolated entirely in this dev overlay (see
// src/_data/devOverlays/wallet-payments.json) — Payment.njk and
// registration.js are untouched, so this can be pruned by deleting
// this file + wallet-payments.css + the overlay JSON if the feature
// doesn't get adopted.
// ============================================================
(function () {
  'use strict';

  var APPLE_ICON = '<svg viewBox="0 0 14 16" width="14" height="16" fill="currentColor" aria-hidden="true"><path d="M11.2 8.5c0-1.9 1.5-2.8 1.6-2.9-.9-1.3-2.2-1.5-2.7-1.5-1.1-.1-2.2.7-2.8.7-.6 0-1.5-.7-2.5-.6-1.3 0-2.5.7-3.1 1.9-1.3 2.3-.3 5.7 1 7.6.6.9 1.3 1.9 2.3 1.9 1 0 1.3-.6 2.4-.6s1.4.6 2.4.6c1 0 1.7-.9 2.3-1.9.7-1 1-2 1-2.1-.1 0-1.9-.8-1.9-2.9zM9.2 2.6c.5-.6.8-1.4.8-2.2-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.3-.8 2.1.8 0 1.6-.4 2.1-1z"/></svg>';
  var GOOGLE_ICON = '<svg viewBox="0 0 18 18" width="16" height="16" aria-hidden="true"><path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"/><path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3z"/><path fill="#EA4335" d="M9 3.6c1.3 0 2.5.4 3.4 1.3l2.6-2.6C13.5.9 11.4 0 9 0A9 9 0 0 0 .9 5l3 2.3C4.6 5.1 6.6 3.6 9 3.6z"/></svg>';
  var FACEID_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M20 8V6a2 2 0 0 0-2-2h-2M20 16v2a2 2 0 0 1-2 2h-2M8 10v1M16 10v1M8.5 15c1 .8 2.1 1.2 3.5 1.2s2.5-.4 3.5-1.2"/></svg>';

  // Clones the current .js-payment-summary line items into a wallet sheet
  // rather than recomputing totals — reuses registration.js's own math.
  function refreshLineItems(container) {
    var source = document.querySelector('.js-payment-summary');
    container.innerHTML = '';
    if (!source) return;
    Array.prototype.forEach.call(source.children, function (child) {
      container.appendChild(child.cloneNode(true));
    });
  }

  function buildButtons() {
    var wrap = document.createElement('div');
    wrap.className = 'wallet-payment-options js-wallet-payment-options';
    wrap.innerHTML =
      '<div class="wallet-payment-options__buttons">' +
        '<button type="button" class="btn-wallet-pay btn-apple-pay" data-modal-target="#walletApplePayModal" aria-label="Pay with Apple Pay">' + APPLE_ICON + ' <span>Pay</span></button>' +
        '<button type="button" class="btn-wallet-pay btn-google-pay" data-modal-target="#walletGooglePayModal" aria-label="Pay with Google Pay">' + GOOGLE_ICON + ' <span>Pay</span></button>' +
      '</div>' +
      '<div class="wallet-payment-options__divider"><span>or pay with card</span></div>';
    return wrap;
  }

  function buildSelectedStrip() {
    var strip = document.createElement('div');
    strip.className = 'wallet-payment-selected js-wallet-payment-selected';
    strip.style.display = 'none';
    strip.innerHTML =
      '<span class="wallet-payment-selected__check">&#10003;</span>' +
      '<span class="js-wallet-payment-selected-label"></span>' +
      '<button type="button" class="btn-link js-wallet-payment-change">Change payment method</button>';
    return strip;
  }

  function buildAppleModal() {
    var modal = document.createElement('div');
    modal.className = 'modal usms-modal-global modal--apple-pay-sheet';
    modal.id = 'walletApplePayModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    modal.innerHTML =
      '<div class="modal-dialog modal-dialog-centered">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<span class="wallet-sheet__brand">' + APPLE_ICON + ' Pay</span>' +
            '<button type="button" class="btn-close js-modal-close" aria-label="Close"></button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="wallet-sheet__merchant">U.S. Masters Swimming</div>' +
            '<div class="wallet-sheet__card"><span class="wallet-sheet__card-chip"></span> Visa •••• 4242</div>' +
            '<div class="wallet-sheet__line-items js-wallet-line-items"></div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button type="button" class="btn-wallet-confirm btn-apple-pay-confirm js-modal-close" id="walletApplePayConfirm">' + FACEID_ICON + ' <span>Confirm with Face ID</span></button>' +
          '</div>' +
        '</div>' +
      '</div>';
    return modal;
  }

  function buildGoogleModal() {
    var modal = document.createElement('div');
    modal.className = 'modal usms-modal-global modal--google-pay-sheet';
    modal.id = 'walletGooglePayModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    modal.innerHTML =
      '<div class="modal-dialog modal-dialog-centered">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<span class="wallet-sheet__brand">' + GOOGLE_ICON + ' Pay</span>' +
            '<button type="button" class="btn-close js-modal-close" aria-label="Close"></button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="wallet-sheet__merchant">U.S. Masters Swimming</div>' +
            '<label class="wallet-sheet__card-row">' +
              '<input type="radio" name="walletGoogleCard" checked disabled>' +
              '<span class="wallet-sheet__card-chip"></span> Visa •••• 4242' +
            '</label>' +
            '<div class="wallet-sheet__add-card">+ Add another card</div>' +
            '<div class="wallet-sheet__line-items js-wallet-line-items"></div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button type="button" class="btn-wallet-confirm btn-google-pay-confirm js-modal-close" id="walletGooglePayConfirm">Pay</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    return modal;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var paymentFields = document.querySelector('.registration-payment__fields');
    var paymentSummary = document.querySelector('.js-payment-summary');
    if (!paymentFields || !paymentSummary) return;

    var optionsEl = buildButtons();
    var selectedEl = buildSelectedStrip();
    paymentFields.parentNode.insertBefore(optionsEl, paymentFields);
    paymentFields.parentNode.insertBefore(selectedEl, paymentFields);

    var appleModal = buildAppleModal();
    var googleModal = buildGoogleModal();
    document.body.appendChild(appleModal);
    document.body.appendChild(googleModal);

    // Bound directly on each button (not delegated) so this runs during the
    // bubble phase before modal.js's document-level listener shows the
    // modal — the sheet always opens with the current summary, not stale
    // content from an earlier point in the form.
    optionsEl.querySelectorAll('.btn-wallet-pay').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var modal = document.querySelector(btn.dataset.modalTarget);
        if (modal) refreshLineItems(modal.querySelector('.js-wallet-line-items'));
      });
    });

    // Hiding .registration-payment__fields here is what makes
    // registration.js's own validate() stop requiring the card inputs —
    // its rules already skip fields inside a hidden paymentFields
    // container, so no changes to registration.js are needed.
    var walletSelected = false;

    function selectWallet(method) {
      walletSelected = true;
      paymentFields.style.display = 'none';
      optionsEl.style.display = 'none';
      selectedEl.querySelector('.js-wallet-payment-selected-label').textContent = 'Paying with ' + method;
      selectedEl.style.display = '';

      // Clear any card details already typed in — if the user goes back to
      // card payment later via "Change payment method", they should have
      // to re-enter it rather than find their old input still sitting there
      // under a wallet payment that's since replaced it.
      ['cardName', 'cardNumberID', 'cardCodeID', 'expiration', 'cardZipID'].forEach(function (id) {
        var field = document.getElementById(id);
        if (!field) return;
        field.value = '';
        field.classList.remove('has-error', 'has-success');
      });
    }

    document.getElementById('walletApplePayConfirm').addEventListener('click', function () {
      selectWallet('Apple Pay');
    });
    document.getElementById('walletGooglePayConfirm').addEventListener('click', function () {
      selectWallet('Google Pay');
    });

    selectedEl.querySelector('.js-wallet-payment-change').addEventListener('click', function () {
      walletSelected = false;
      paymentFields.style.display = '';
      optionsEl.style.display = '';
      selectedEl.style.display = 'none';

      // Reset Auto Renew — dispatching a real change event runs
      // registration.js's own updateAgreeTermsVariant() listener, which
      // also resets the terms-of-agreement checkbox (#agreeTerms) and
      // clears its error state as part of the same swap-back logic, so
      // both reset together without duplicating that logic here.
      var autoRenewCheckbox = document.getElementById('signup');
      if (autoRenewCheckbox) {
        autoRenewCheckbox.checked = false;
        autoRenewCheckbox.dispatchEvent(new Event('change'));
      }
    });

    // registration.js shows/hides .registration-payment__fields from several
    // places unrelated to wallet selection (event-participation Yes/No,
    // donation totals, membership tile changes, ...) — including re-showing
    // it on a new tile selection, which would otherwise resurrect the card
    // fields out from under an already-confirmed wallet choice. A
    // MutationObserver catches all of that generically rather than hooking
    // every call site, so this stays in sync without registration.js
    // knowing this overlay exists.
    new MutationObserver(function () {
      if (walletSelected) {
        // Once a wallet's confirmed, card fields stay hidden no matter what
        // else touches their display — only "Change payment method" (above)
        // is allowed to bring them back.
        if (paymentFields.style.display !== 'none') paymentFields.style.display = 'none';
        return;
      }
      optionsEl.style.display = paymentFields.style.display === 'none' ? 'none' : '';
    }).observe(paymentFields, { attributes: true, attributeFilter: ['style'] });
  });
})();
