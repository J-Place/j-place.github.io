// /club-central/club-login
//
// Production behavior (ClubLoginController):
//   - LoginBegin   → on success, redirect to the club dashboard (or the become-a-member
//                    interstitial, which then lands on the dashboard).
//   - CreateAccount → posts back and re-renders the column with Model.FormComplete: the
//                     form is replaced in place by a "check your e-mail to verify" message.
//
// No login backend exists in this mockup, so the "GO!" buttons simulate those happy-path
// outcomes for click-through flow testing:
//   - "Login to My Account"       → navigate to the club dashboard
//   - "Create a My Account Login"  → swap the form for the form-complete message
//
// Both submit buttons carry the .login-form__submit class in production markup, so the
// handlers are scoped by their parent <form>. Phone field gets the 000-000-0000 mask
// production applies.

(function () {
  'use strict';

  if (window.jQuery && typeof window.jQuery.fn.mask === 'function') {
    window.jQuery('input[name="PhoneNumber"]').mask('000-000-0000');
  }

  // Login to My Account → club dashboard
  var loginGo = document.querySelector('.login-form .login-form__submit');
  if (loginGo) {
    loginGo.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = '/club-central/club-dashboard.html';
    });
  }

  // Create a My Account Login → in-place "verify your e-mail" confirmation
  var createForm = document.querySelector('.register-form');
  var createGo = createForm && createForm.querySelector('.login-form__submit');
  var completeMsg = document.querySelector('.form-complete-message');
  if (createGo && completeMsg) {
    createGo.addEventListener('click', function (e) {
      e.preventDefault();
      var emailField = document.getElementById('loginGuestEmail');
      var slot = completeMsg.querySelector('.register-form__email');
      if (slot && emailField && emailField.value.trim()) {
        slot.textContent = emailField.value.trim();
      }
      createForm.hidden = true;
      completeMsg.hidden = false;
    });
  }
})();
