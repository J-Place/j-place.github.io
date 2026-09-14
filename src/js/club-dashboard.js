// club-dashboard.html — "Select Your Club" list.
//
// Mirrors production's GetSalesforceClubDashboard: which club(s) a signed-in
// user administers is looked up from the club side (each club's contact record
// points at the swimmer who administers it), not stored as a field on the
// swimmer — so one person can administer any number of clubs, and a club admin
// need not be a personal USMS member. We simulate the same shape locally:
// clubsLocal.json's per-club contact.userKey points at a users.json persona
// key, and every club whose contact.userKey matches the active ?user=/
// sessionStorage persona is rendered as a button (production: ClubDashModel.Clubs,
// one <a> per entry).
//
// ?club=<abbreviation> is still honored as a direct single-club override
// (bypasses the userKey lookup entirely) — useful for testing/snapshotting one
// club in isolation without needing a matching persona.

(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);

  var clubs;
  try {
    clubs = JSON.parse(document.getElementById('clubs-local-data').textContent);
  } catch (e) {
    return;
  }
  if (!clubs) return;

  var abbrs = [];

  var clubParam = params.get('club');
  if (clubParam && clubs[clubParam]) {
    abbrs = [clubParam];
  } else {
    var userParam = params.get('user');
    var activeUser = userParam || sessionStorage.getItem('activeUser');
    if (activeUser) {
      abbrs = Object.keys(clubs).filter(function (abbr) {
        var contact = clubs[abbr].contact;
        return contact && contact.userKey === activeUser;
      });
    }
  }

  if (!abbrs.length) return;

  var listWrap = document.getElementById('dashboard-club-list');
  var slot = document.getElementById('dashboard-club-slot');
  if (!listWrap || !slot) return;

  abbrs.forEach(function (abbr) {
    var wrapper = document.createElement('div');
    wrapper.className = 'club-button-wrapper';

    var a = document.createElement('a');
    a.className = 'btn btn-outline club-link-button';
    a.href = '/club-central/club-dashboard/club-manage.html?club=' + encodeURIComponent(abbr);
    a.textContent = abbr;

    wrapper.appendChild(a);
    slot.appendChild(wrapper);
  });

  listWrap.style.display = '';
})();
