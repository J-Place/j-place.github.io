// ============================================================
// DEV ONLY — do not load in production
// Toggles bulk registration open/closed state on manage-members.
// Sets a body class synchronously so CSS hides elements before
// manage-members.js renders them.
// ============================================================
(function () {
  var STORAGE_KEY = 'dev-bulk-reg-state';
  var STATES = [
    { value: 'open',   label: 'Bulk Registration: Open' },
    { value: 'closed', label: 'Bulk Registration: Closed' }
  ];

  var saved = sessionStorage.getItem(STORAGE_KEY) || 'open';
  if (saved === 'closed') document.body.classList.add('bulk-reg-closed');

  document.addEventListener('DOMContentLoaded', function () {
    var select = document.createElement('select');
    select.className = 'login-status__select';

    STATES.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value       = s.value;
      opt.textContent = s.label;
      if (s.value === saved) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', function () {
      sessionStorage.setItem(STORAGE_KEY, this.value);
      window.location.reload();
    });

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
