(function () {
  const params = new URLSearchParams(window.location.search);
  const clubId = params.get('clubId');

  if (!clubId) return;

  const clubs = JSON.parse(document.getElementById('clubs-local-data').textContent);
  const club = clubs.find(function (c) { return c.id === clubId; });

  if (club) {
    document.getElementById('club-manage-heading').textContent =
      'What would you like to do with ' + club.title + '?';
  }

  const suffix = '?clubId=' + encodeURIComponent(clubId);
  document.getElementById('btn-club-edit').href += suffix;
  document.getElementById('btn-manage-members').href += suffix;
  document.getElementById('btn-manage-non-members').href += suffix;
})();
