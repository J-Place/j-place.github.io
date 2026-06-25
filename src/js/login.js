(function () {
  var submit = document.querySelector('.login-form__submit');
  if (!submit) return;
  submit.addEventListener('click', function () {
    var spinner = document.querySelector('.button-spinner');
    if (spinner) spinner.style.display = 'inline-block';
  });
})();
