// Bulk registration open/closed state for Manage Current Members.
// `?bulkReg=closed` (or `open`) simulates the state, persisted in
// sessionStorage.bulkRegState so it carries forward across navigation in the
// same tab — same pattern as `?user=` / `?date=` / `?club=`. Defaults to open.
// Loaded non-deferred so body.bulk-reg-closed is set before manage-members.js
// renders the table (closed hides Select All, checkboxes and payment — see
// manage-members.css).
(function () {
  var param = new URLSearchParams(window.location.search).get('bulkReg');
  if (param === 'open' || param === 'closed') sessionStorage.setItem('bulkRegState', param);
  if (sessionStorage.getItem('bulkRegState') === 'closed') {
    document.body.classList.add('bulk-reg-closed');
  }
})();
