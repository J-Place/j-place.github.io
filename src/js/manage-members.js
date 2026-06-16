(function () {
  var params = new URLSearchParams(window.location.search);
  var clubId = params.get('clubId') || sessionStorage.getItem('activeClubId');

  if (!clubId) {
    document.getElementById('members-no-club').style.display = '';
    document.getElementById('members-content').style.display = 'none';
    return;
  }
  sessionStorage.setItem('activeClubId', clubId);

  var manageContactsLink = document.querySelector('a[href*="contact-non-members"]');
  if (manageContactsLink) {
    manageContactsLink.href = '/club-central/contact-non-members.html?clubId=' + encodeURIComponent(clubId);
  }

  var clubs = JSON.parse(document.getElementById('clubs-local-data').textContent);
  var club = clubs.find(function (c) { return c.id === clubId; });
  if (club) {
    document.getElementById('members-club-name').textContent = club.title;
  }

  var allMembers = JSON.parse(document.getElementById('members-local-data').textContent);
  var clubMembers = allMembers.find(function (m) { return m.clubId === clubId; });

  if (!clubMembers) {
    document.getElementById('members-no-club').style.display = '';
    document.getElementById('members-content').style.display = 'none';
    return;
  }

  function formatType(type) {
    var abbr = type === 'Competitive' ? 'Cmp' : 'Std';
    return '<span class="hidden-xs">' + type + '</span><span class="visible-xs-inline">' + abbr + '</span>';
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function setCount(id, count) {
    document.getElementById(id).textContent = '(' + count + ')';
  }

  // --- Detail view row renderers ---

  function renderBasicRow(member) {
    var pendingBadge = member.isPending
      ? '<span class="members-badge members-badge--pending">Pending Waiver</span>'
      : '';
    return '<tr>' +
      '<td>' + member.firstName + ' ' + member.lastName + pendingBadge + '</td>' +
      '<td><span class="member-id">#' + member.swimmerId + '</span></td>' +
      '<td>' + formatType(member.membershipType) + '</td>' +
      '<td>' + formatDate(member.expirationDate) + '</td>' +
      '</tr>';
  }

  function renderCheckableRow(member) {
    return '<tr>' +
      '<td class="col-checkbox"><input type="checkbox" class="expiring-checkbox" data-id="' + member.id + '"></td>' +
      '<td>' + member.firstName + ' ' + member.lastName + '</td>' +
      '<td><span class="member-id">#' + member.swimmerId + '</span></td>' +
      '<td>' + formatType(member.membershipType) + '</td>' +
      '<td>' + formatDate(member.expirationDate) + '</td>' +
      '</tr>';
  }

  // --- Simple view column renderers ---

  function renderSimpleCol(member) {
    var pendingBadge = member.isPending
      ? '<span class="members-badge members-badge--pending">Pending</span>'
      : '';
    return '<div class="col-xs-12 simple-col">' +
      '<div class="simple-item">' +
      '<span class="simple-name">' + member.firstName + ' ' + member.lastName + pendingBadge + '</span>' +
      '<span class="simple-date">#' + member.swimmerId + '</span>' +
      '</div>' +
      '</div>';
  }

  function renderCheckableCol(member) {
    return '<div class="col-xs-12 simple-col">' +
      '<label class="simple-item simple-item--checkable">' +
      '<input type="checkbox" class="expiring-checkbox" data-id="' + member.id + '">' +
      '<span class="simple-name">' + member.firstName + ' ' + member.lastName + '</span>' +
      '<span class="simple-date">#' + member.swimmerId + '</span>' +
      '</label>' +
      '</div>';
  }

  // --- Render all sections ---

  var autoRenew = clubMembers.autoRenew || [];
  var yearPlus = clubMembers.yearPlus || [];
  var expiring = clubMembers.expiring || [];

  document.getElementById('tbody-autorenew').innerHTML = autoRenew.map(renderBasicRow).join('');
  document.getElementById('tbody-yearplus').innerHTML = yearPlus.map(renderBasicRow).join('');
  document.getElementById('tbody-expiring').innerHTML = expiring.map(renderCheckableRow).join('');

  document.getElementById('grid-autorenew').innerHTML = autoRenew.map(renderSimpleCol).join('');
  document.getElementById('grid-yearplus').innerHTML = yearPlus.map(renderSimpleCol).join('');
  document.getElementById('grid-expiring').innerHTML = expiring.map(renderCheckableCol).join('');

  setCount('count-autorenew', autoRenew.length);
  setCount('count-yearplus', yearPlus.length);
  setCount('count-expiring', expiring.length);

  // --- View toggle ---

  document.querySelectorAll('.members-view-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var view = btn.dataset.view;
      document.querySelectorAll('.members-view-tab').forEach(function (b) {
        b.classList.toggle('is-active', b.dataset.view === view);
      });
      document.getElementById('members-content').classList.toggle('view-simple', view === 'simple');
    });
  });

  // --- Expiring checkboxes ---

  var checkedIds = new Set();
  var selectedCount = document.getElementById('selected-count');
  var bulkBtn = document.getElementById('btn-bulk-register');
  var selectAll = document.getElementById('select-all-expiring');

  function updateBulkButton() {
    selectedCount.textContent = checkedIds.size;
    bulkBtn.disabled = checkedIds.size === 0;
  }

  function updateSelectAll() {
    selectAll.checked = expiring.length > 0 && checkedIds.size === expiring.length;
    selectAll.indeterminate = checkedIds.size > 0 && checkedIds.size < expiring.length;
  }

  selectAll.addEventListener('change', function () {
    var checked = this.checked;
    expiring.forEach(function (m) {
      if (checked) checkedIds.add(m.id); else checkedIds.delete(m.id);
    });
    document.querySelectorAll('.expiring-checkbox').forEach(function (cb) {
      cb.checked = checked;
    });
    updateBulkButton();
  });

  document.getElementById('members-content').addEventListener('change', function (e) {
    if (!e.target.classList.contains('expiring-checkbox')) return;
    var id = e.target.dataset.id;
    var isChecked = e.target.checked;
    if (isChecked) checkedIds.add(id); else checkedIds.delete(id);
    // Sync matching checkbox in the other view
    document.querySelectorAll('.expiring-checkbox[data-id="' + id + '"]').forEach(function (cb) {
      cb.checked = isChecked;
    });
    updateSelectAll();
    updateBulkButton();
  });

  bulkBtn.addEventListener('click', function () {
    alert('Bulk registration for ' + checkedIds.size + ' member(s) — flow TBD.');
  });
})();
