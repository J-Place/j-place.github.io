// club-dashboard.html — "Select Your Club" list.
//
// Which club(s) a signed-in user is a contact for is authenticated state we don't
// have in this mockup, so it's simulated with ?club=<abbreviation>:
//   - club-dashboard.html            → no club listed, only "Add a New Club"
//   - club-dashboard.html?club=PACMS → one club button (Pacific Coast Masters)
// One club at a time. The abbreviation carries through club-manage → club-edit.
// Club records come from clubsLocal.json (embedded as #clubs-local-data).

(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var abbr = params.get('club');
  if (!abbr) return;

  var clubs;
  try {
    clubs = JSON.parse(document.getElementById('clubs-local-data').textContent);
  } catch (e) {
    return;
  }
  var club = clubs && clubs[abbr];
  if (!club) return;

  var listWrap = document.getElementById('dashboard-club-list');
  var slot = document.getElementById('dashboard-club-slot');
  if (!listWrap || !slot) return;

  var a = document.createElement('a');
  a.className = 'btn btn-outline club-link-button';
  a.href = '/club-central/club-dashboard/club-manage.html?club=' + encodeURIComponent(abbr);
  a.textContent = abbr;
  slot.appendChild(a);

  listWrap.style.display = '';
})();
