(function () {
  var params = new URLSearchParams(window.location.search);
  var clubId = params.get('clubId') || sessionStorage.getItem('activeClubId');

  if (!clubId) {
    document.getElementById('members-no-club').style.display = '';
    document.getElementById('members-content').style.display = 'none';
    return;
  }
  sessionStorage.setItem('activeClubId', clubId);

  var clubs = JSON.parse(document.getElementById('clubs-local-data').textContent);
  var club = clubs.find(function (c) { return c.id === clubId; });
  if (club) {
    var nameEl = document.getElementById('members-club-name');
    if (nameEl) {
      nameEl.textContent = club.title;
      nameEl.style.display = '';
    }
  }

  var allMembers = JSON.parse(document.getElementById('members-local-data').textContent);
  var memberData = allMembers.find(function (m) { return m.clubId === clubId; });
  var expired = (memberData && memberData.expired) || [];

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  var sortKey = 'lastName';
  var sortDir = 'asc';
  var tbody = document.getElementById('tbody-expired');

  function renderRow(m) {
    return '<tr>' +
      '<td data-label="Name">' + m.firstName + ' ' + m.lastName + '</td>' +
      '<td data-label="Permanent ID">' + m.swimmerId.slice(0, 6) + '</td>' +
      '<td data-label="Email">' + (m.email || '') + '</td>' +
      '<td data-label="Status">' + (m.renewalType || '') + '</td>' +
      '<td data-label="Expires">' + formatDate(m.expirationDate) + '</td>' +
      '</tr>';
  }

  function render() {
    var sorted = expired.slice().sort(function (a, b) {
      var va = sortKey === 'lastName'
        ? (a.lastName + a.firstName).toLowerCase()
        : (a[sortKey] || '').toLowerCase();
      var vb = sortKey === 'lastName'
        ? (b.lastName + b.firstName).toLowerCase()
        : (b[sortKey] || '').toLowerCase();
      var cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    tbody.innerHTML = sorted.length
      ? sorted.map(renderRow).join('')
      : '<tr><td colspan="5" class="members-empty">No expired members.</td></tr>';
  }

  document.querySelectorAll('.members-sort-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-sort');
      if (sortKey === key) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey = key;
        sortDir = 'asc';
      }
      document.querySelectorAll('.members-sort-btn').forEach(function (b) {
        b.classList.remove('is-active');
        b.querySelector('.members-sort-overlay').className = 'fas fa-sort-up members-sort-overlay';
      });
      btn.classList.add('is-active');
      btn.querySelector('.members-sort-overlay').className =
        (sortDir === 'desc' ? 'fas fa-sort-down' : 'fas fa-sort-up') + ' members-sort-overlay';
      render();
    });
  });

  render();
})();
