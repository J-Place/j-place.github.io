(function () {
  const params = new URLSearchParams(window.location.search);
  const club = params.get('club') || sessionStorage.getItem('activeClub');

  if (!club) return;
  sessionStorage.setItem('activeClub', club);

  const clubs = JSON.parse(document.getElementById('clubs-local-data').textContent);
  const data = clubs[club];

  if (data) {
    document.getElementById('club-manage-heading').textContent =
      'What would you like to do with ' + data.name + '?';
  }

  ['btn-club-edit', 'btn-manage-members', 'btn-manage-non-members'].forEach(function (id) {
    const link = document.getElementById(id);
    const url = new URL(link.href, window.location.origin);
    url.searchParams.set('club', club);
    link.href = url.pathname + url.search;
  });
})();
