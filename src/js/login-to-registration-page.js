(function () {
  // Both Go buttons lead to the same /registration/ URL (matching production's
  // single-route model — see registration.js's applyRenewalMode comment) —
  // they just set which mode registration.js should simulate on arrival.

  // "Renew with a USMS Account" — a real <form method="post"> whose default
  // submit action isn't wired to anything meaningful in this mockup (no login
  // backend); intercept the submit-button click to navigate to registration
  // in renew mode instead.
  var renewGo = document.querySelector('.login-form__submit');
  if (renewGo) {
    renewGo.addEventListener('click', function (e) {
      e.preventDefault();
      sessionStorage.setItem('registrationMode', 'renew');
      window.location.href = '/registration/';
    });
  }

  // "Create a USMS My Account" — already a plain link to /registration/;
  // just tag the mode before the browser follows it.
  var createGo = document.querySelector('.register-form__submit');
  if (createGo) {
    createGo.addEventListener('click', function () {
      sessionStorage.setItem('registrationMode', 'new');
    });
  }
})();
