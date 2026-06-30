(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Open the Event Name accordion section after production JS has initialized
    setTimeout(function () {
      var collapseEl = document.getElementById('event-name__content');
      if (!collapseEl) return;
      if (window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(collapseEl).show();
      } else {
        collapseEl.classList.add('show');
        collapseEl.style.display = 'block';
      }
    }, 300);
  });
}());
