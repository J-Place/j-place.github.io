(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Open the Location Information accordion section
    var collapseEl = document.getElementById('location-information__content');
    if (collapseEl && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(collapseEl).show();
    }

    // Poll for Selby Aquatic Center card and click Select
    var maxWait = 8000;
    var interval = 150;
    var elapsed = 0;
    var timer = setInterval(function () {
      var card = document.querySelector(
        '.location-column [data-name="Selby Aquatic Center"]'
      );
      if (card) {
        clearInterval(timer);
        var btn = card.querySelector('.btn-select-location');
        if (btn) btn.click();
      }
      elapsed += interval;
      if (elapsed >= maxWait) clearInterval(timer);
    }, interval);

    // Restore scroll after modal closes (sanctions.min.js leaves overflow:hidden on body)
    var modalEl = document.getElementById('modalCourseSelection');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', function () {
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
      });
    }
  });
}());
