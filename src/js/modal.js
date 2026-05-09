document.addEventListener('click', function (e) {
  var trigger = e.target.closest('[data-modal-target]');
  if (trigger) {
    e.preventDefault();
    var target = document.querySelector(trigger.dataset.modalTarget);
    if (!target) return;
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade in';
    document.body.appendChild(backdrop);
    target.classList.add('in');
    target.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.body.style.paddingRight = scrollbarWidth + 'px';
    return;
  }

  if (!e.target.closest('.js-modal-close')) return;
  var modal = e.target.closest('.modal');
  if (!modal) return;
  modal.style.display = 'none';
  modal.classList.remove('show', 'in');
  modal.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('.modal-backdrop').forEach(function (el) {
    el.parentNode.removeChild(el);
  });
  document.body.classList.remove('modal-open');
  document.body.style.paddingRight = '';
});
