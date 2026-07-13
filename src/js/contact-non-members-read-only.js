(function () {
  var params = new URLSearchParams(window.location.search);
  var clubId = params.get('clubId') || sessionStorage.getItem('activeClubId');

  if (!clubId) {
    document.getElementById('nonmembers-no-club').style.display = '';
    document.getElementById('nonmembers-content').style.display = 'none';
    return;
  }
  sessionStorage.setItem('activeClubId', clubId);

  var clubs = JSON.parse(document.getElementById('clubs-local-data').textContent);
  var club = clubs.find(function (c) { return c.id === clubId; });
  if (club) {
    document.getElementById('nonmembers-club-name').textContent = club.title;
  }

  var allPotential = JSON.parse(document.getElementById('potential-local-data').textContent);
  var clubData = allPotential.find(function (p) { return p.clubId === clubId; });

  if (!clubData) {
    document.getElementById('nonmembers-no-club').style.display = '';
    document.getElementById('nonmembers-content').style.display = 'none';
    return;
  }

  var allMembers = JSON.parse(document.getElementById('members-local-data').textContent);
  var memberData = allMembers.find(function (m) { return m.clubId === clubId; });
  var allExpired = (memberData && memberData.expired) || [];
  var expiredActive = allExpired.filter(function (m) { return !m.contacted; });

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var MS_PER_DAY = 86400000;

  function daysAgo(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return Math.floor((today - d) / MS_PER_DAY);
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  var contacts = clubData.contacts || [];
  var recentActive = [];

  contacts.forEach(function (c) {
    var d = daysAgo(c.contactDate);
    if (d >= 0 && d <= 30 && !c.responded) recentActive.push(c);
  });

  recentActive.forEach(function (c) { c._type = 'contact'; });
  expiredActive.forEach(function (m) { m._type = 'expired'; });
  var allActive = recentActive.concat(expiredActive);

  function renderActiveCard(c) {
    return '<div class="contact-card" id="card-' + c.id + '" data-id="' + c.id + '">' +
      '<div class="contact-card__left">' +
      '<div class="contact-name-row">' +
      '<span class="contact-name">' + c.firstName + ' ' + c.lastName + '</span>' +
      (c.swimmerId ? '<span class="contact-swimmer-id">' + c.swimmerId.slice(0, 6) + '</span>' : '') +
      (c.email ? '<span class="contact-email">' + c.email + '</span>' : '') +
      '</div>' +
      '</div>' +
      '<div class="contact-card__right">' +
      (c.source ? '<span class="contact-source"><strong>' + (c.source === 'TMS' ? 'Trial' : c.source === 'CLUB' ? 'Club Page' : c.source) + '</strong></span>' : '') +
      '<span class="contact-date">' + formatDate(c.contactDate) + '</span>' +
      '</div>' +
      '</div>';
  }

  function renderExpiredCard(m) {
    return '<div class="contact-card expired-card" id="card-' + m.id + '" data-id="' + m.id + '">' +
      '<div class="contact-card__left">' +
      '<div class="contact-name-row">' +
      '<span class="contact-name">' + m.firstName + ' ' + m.lastName + '</span>' +
      '<span class="contact-swimmer-id">' + m.swimmerId.slice(0, 6) + '</span>' +
      (m.email ? '<span class="contact-email">' + m.email + '</span>' : '') +
      '</div>' +
      '</div>' +
      '<div class="contact-card__right">' +
      '<span class="contact-source"><strong>Expired</strong></span>' +
      '<span class="contact-date">' + formatDate(m.expirationDate) + '</span>' +
      '</div>' +
      '</div>';
  }

  function emptyActive() {
    return '<p class="nonmembers-empty">No active contacts.</p>';
  }

  var recentActiveEl = document.getElementById('recent-active');

  function getItemDate(item) { return item._type === 'expired' ? item.expirationDate : item.contactDate; }
  function byDateAsc(a, b) { var da = getItemDate(a), db = getItemDate(b); return da < db ? -1 : da > db ? 1 : 0; }

  function renderCard(item) { return item._type === 'expired' ? renderExpiredCard(item) : renderActiveCard(item); }

  var sortDir = 'asc';
  var activeFilter = 'all';

  function renderRecentActive(filter, dir) {
    var filtered = allActive.filter(function (item) {
      if (filter === 'trial') return item.source === 'TMS';
      if (filter === 'club') return item.source === 'CLUB';
      if (filter === 'expired') return item._type === 'expired';
      return true;
    });
    filtered.sort(byDateAsc);
    if (dir === 'desc') filtered.reverse();
    recentActiveEl.innerHTML = filtered.length ? filtered.map(renderCard).join('') : emptyActive();
  }

  renderRecentActive('all', 'asc');
})();
