// ============================================================
// DEV ONLY — do not load in production
// Injects a date-window <select> into the overlay bar.
// Selecting a window sets window.USMS_MOCK_DATE (via sessionStorage)
// and reloads so registration.js sees the new date.
// ============================================================
(function () {
  var STORAGE_KEY = 'dev-mock-date';

  var DATE_WINDOWS = [
    { value: '2025-11-01', label: 'Standard and USMS+ Open' },
    { value: '2025-07-01', label: 'Jul 1 — Year-Plus Open' }
  ];

  // Synchronous: patch window.USMS_MOCK_DATE before registration.js (defer) runs.
  // Default to the first option on first visit so the select and the displayed
  // tiers are always in sync.
  var saved = sessionStorage.getItem(STORAGE_KEY);
  if (!saved) {
    saved = DATE_WINDOWS[0].value;
    sessionStorage.setItem(STORAGE_KEY, saved);
  }
  window.USMS_MOCK_DATE = saved;

  document.addEventListener('DOMContentLoaded', function () {
    var select = document.createElement('select');
    select.className = 'login-status__select';

    DATE_WINDOWS.forEach(function (win) {
      var opt = document.createElement('option');
      opt.value       = win.value;
      opt.textContent = win.label;
      if (win.value === (saved || '')) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', function () {
      if (this.value) {
        sessionStorage.setItem(STORAGE_KEY, this.value);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      window.location.reload();
    });

    // Append to the existing login-status bar (created first by login-status.js).
    // Fall back to a standalone bar if not present.
    var bar = document.querySelector('.login-status .usms-container');
    if (bar) {
      bar.appendChild(select);
    } else {
      var container = document.createElement('div');
      container.className = 'login-status';
      var inner = document.createElement('div');
      inner.className = 'usms-container';
      inner.appendChild(select);
      container.appendChild(inner);
      document.body.appendChild(container);
    }
  });
})();
