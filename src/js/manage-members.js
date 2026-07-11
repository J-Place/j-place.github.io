(function () {
  var params = new URLSearchParams(window.location.search);
  var clubId = params.get('clubId') || sessionStorage.getItem('activeClubId');

  if (!clubId) {
    document.getElementById('members-no-club').style.display = '';
    document.getElementById('members-content').style.display = 'none';
    return;
  }
  sessionStorage.setItem('activeClubId', clubId);

  var manageContactsLink = document.querySelector('a[href*="expired-members"]');
  if (manageContactsLink) {
    manageContactsLink.href = '/club-central/expired-members.html?clubId=' + encodeURIComponent(clubId);
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

  // --- Flatten all members into one list ---

  var autoRenew = clubMembers.autoRenew || [];
  var yearPlus = clubMembers.yearPlus || [];
  var expiring = clubMembers.expiring || [];
  var needsRenewal = expiring.filter(function (m) { return !m.selfRenewed; });
  var selfRenewed = expiring.filter(function (m) { return m.selfRenewed; });

  function tag(arr, status, checkable) {
    return arr.map(function (m) {
      return { id: m.id, firstName: m.firstName, lastName: m.lastName,
        swimmerId: m.swimmerId, membershipType: m.membershipType,
        expirationDate: m.expirationDate, isPending: m.isPending,
        _status: status, _checkable: checkable };
    });
  }

  var flat = tag(needsRenewal, 'Annual', true)
    .concat(tag(selfRenewed, 'Annual', false))
    .concat(tag(yearPlus, 'Year-Plus', false))
    .concat(tag(autoRenew, 'Auto-Renew', false));

  // --- Sort ---

  var sortKey = 'lastName';
  var sortDir = 'asc';

  var STATUS_ORDER = { 'Annual': 0, 'Year-Plus': 1, 'Auto-Renew': 2 };

  function getSortVal(m, key) {
    if (key === 'lastName') return m.lastName;
    if (key === 'status') return STATUS_ORDER[m._status] !== undefined ? STATUS_ORDER[m._status] : m._status;
    if (key === 'membershipType') return m.membershipType;
    if (key === 'expirationDate') return m.expirationDate;
    return '';
  }

  function sortedFlat() {
    var copy = flat.slice();
    copy.sort(function (a, b) {
      var va = getSortVal(a, sortKey), vb = getSortVal(b, sortKey);
      return va < vb ? -1 : va > vb ? 1 : 0;
    });
    if (sortDir === 'desc') copy.reverse();
    return copy;
  }

  // --- Render ---

  var FEES = { Standard: 75, Competitive: 125 };
  var checkedIds = new Set();

  function renderRow(m) {
    var pendingBadge = m.isPending
      ? '<span class="members-badge members-badge--pending">Pending Waiver</span>'
      : '';
    var checkCell = m._checkable
      ? '<td class="col-checkbox"><input type="checkbox" class="expiring-checkbox" data-id="' + m.id + '"></td>'
      : '<td class="col-checkbox"></td>';
    return '<tr>' +
      checkCell +
      '<td data-label="Name">' + m.firstName + ' ' + m.lastName + pendingBadge + '</td>' +
      '<td data-label="ID"><span class="member-id">' + m.swimmerId.slice(0, 6) + '</span></td>' +
      '<td data-label="Status">' + m._status + '</td>' +
      '<td data-label="Type">' + formatType(m.membershipType) + '</td>' +
      '<td data-label="Expires">' + formatDate(m.expirationDate) + '</td>' +
      '</tr>';
  }

  function renderTable() {
    document.getElementById('tbody-members').innerHTML = sortedFlat().map(renderRow).join('');
    document.querySelectorAll('.expiring-checkbox').forEach(function (cb) {
      cb.checked = checkedIds.has(cb.dataset.id);
    });
  }

  renderTable();

  // --- Sort buttons ---

  document.querySelectorAll('.members-sort-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.dataset.sort;
      if (key === sortKey) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey = key;
        sortDir = 'asc';
      }
      document.querySelectorAll('.members-sort-btn').forEach(function (b) {
        var overlay = b.querySelector('.members-sort-overlay');
        if (b.dataset.sort === sortKey) {
          b.classList.add('is-active');
          overlay.className = 'fas members-sort-overlay ' + (sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
          b.setAttribute('aria-label', sortDir === 'asc' ? 'Sort A to Z' : 'Sort Z to A');
        } else {
          b.classList.remove('is-active');
          overlay.className = 'fas members-sort-overlay fa-sort-up';
        }
      });
      renderTable();
    });
  });

  // --- Checkboxes & payment summary ---

  var selectAll = document.getElementById('select-all-expiring');

  function formatCurrency(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function updatePaymentSummary() {
    var standardCount = 0;
    var competitiveCount = 0;
    checkedIds.forEach(function (id) {
      var member = needsRenewal.find(function (m) { return m.id === id; });
      if (member && member.membershipType === 'Competitive') competitiveCount++;
      else if (member) standardCount++;
    });
    var standardTotal = standardCount * FEES.Standard;
    var competitiveTotal = competitiveCount * FEES.Competitive;
    var total = standardTotal + competitiveTotal;

    var stdLine = document.getElementById('payment-standard-line');
    var cmpLine = document.getElementById('payment-competitive-line');
    stdLine.style.display = standardCount > 0 ? '' : 'none';
    document.getElementById('payment-standard-count').textContent = standardCount;
    document.getElementById('payment-standard-subtotal').textContent = formatCurrency(standardTotal);
    cmpLine.style.display = competitiveCount > 0 ? '' : 'none';
    document.getElementById('payment-competitive-count').textContent = competitiveCount;
    document.getElementById('payment-competitive-subtotal').textContent = formatCurrency(competitiveTotal);
    document.getElementById('payment-total').textContent = formatCurrency(total);
  }

  function updateSelectAll() {
    selectAll.checked = needsRenewal.length > 0 && checkedIds.size === needsRenewal.length;
    selectAll.indeterminate = checkedIds.size > 0 && checkedIds.size < needsRenewal.length;
  }

  selectAll.addEventListener('change', function () {
    var checked = this.checked;
    needsRenewal.forEach(function (m) {
      if (checked) checkedIds.add(m.id); else checkedIds.delete(m.id);
    });
    document.querySelectorAll('.expiring-checkbox').forEach(function (cb) {
      cb.checked = checked;
    });
    updatePaymentSummary();
  });

  document.getElementById('members-content').addEventListener('change', function (e) {
    if (!e.target.classList.contains('expiring-checkbox')) return;
    var id = e.target.dataset.id;
    var isChecked = e.target.checked;
    if (isChecked) checkedIds.add(id); else checkedIds.delete(id);
    updateSelectAll();
    updatePaymentSummary();
  });

  var noMembersError = document.getElementById('payment-no-members-error');

  document.getElementById('register-button').addEventListener('click', function () {
    var valid = true;

    if (checkedIds.size === 0) {
      noMembersError.style.display = '';
      valid = false;
    } else {
      noMembersError.style.display = 'none';
    }

    ['cardName', 'cardNumberID', 'cardCodeID', 'expiration', 'cardZipID'].forEach(function (id) {
      var field = document.getElementById(id);
      var group = field.closest('.form-group');
      var helpBlock = group.querySelector('.help-block');
      if (!field.value.trim()) {
        if (helpBlock) helpBlock.classList.add('has-error');
        valid = false;
      } else {
        if (helpBlock) helpBlock.classList.remove('has-error');
      }
    });

    var agreeTerms = document.getElementById('agreeTerms');
    var agreeGroup = agreeTerms.closest('.form-group');
    var agreeHelpBlock = agreeGroup.querySelector('.help-block');
    if (!agreeTerms.checked) {
      if (agreeHelpBlock) agreeHelpBlock.classList.add('has-error');
      valid = false;
    } else {
      if (agreeHelpBlock) agreeHelpBlock.classList.remove('has-error');
    }
  });
})();
