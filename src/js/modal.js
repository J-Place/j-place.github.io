document.addEventListener('click', function (e) {
  if (!e.target.closest('.js-modal-close')) return;
  var modal = e.target.closest('.modal');
  if (!modal) return;
  modal.style.display = 'none';
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('.modal-backdrop').forEach(function (el) {
    el.parentNode.removeChild(el);
  });
  document.body.classList.remove('modal-open');
});
