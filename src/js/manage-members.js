(function () {
  var params = new URLSearchParams(window.location.search);
  var clubId = params.get('club') || sessionStorage.getItem('activeClub');

  if (!clubId) {
    document.getElementById('members-no-club').style.display = '';
    document.getElementById('members-content').style.display = 'none';
    return;
  }
  sessionStorage.setItem('activeClub', clubId);

  var manageContactsLink = document.querySelector('a[href*="expired-members"]');
  if (manageContactsLink) {
    manageContactsLink.href = '/club-central/expired-members.html?club=' + encodeURIComponent(clubId);
  }

  var clubs = JSON.parse(document.getElementById('clubs-local-data').textContent);
  var club = clubs[clubId];
  if (club) {
    document.getElementById('members-club-name').textContent = club.name;
  }

  var allMembers = JSON.parse(document.getElementById('members-local-data').textContent);
  var clubMembers = allMembers.find(function (m) { return m.clubId === clubId; });

  if (!clubMembers) {
    document.getElementById('members-no-club').style.display = '';
    document.getElementById('members-content').style.display = 'none';
    return;
  }

  function formatType(type) {
    return type === 'Competitive' ? 'Yes' : 'No';
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
        expirationDate: m.expirationDate, registrationDate: m.registrationDate,
        isPending: m.isPending, _status: status, _checkable: checkable };
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
    if (key === 'registrationDate') return m.registrationDate || '';
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

  var checkedIds = new Set();

  function renderRow(m) {
    var pendingBadge = m.isPending
      ? '<span class="members-badge members-badge--pending">Pending Waiver</span>'
      : '';
    var checkCell = m._checkable
      ? '<td class="col-checkbox"><input type="checkbox" class="expiring-checkbox" data-id="' + m.id + '"></td>'
      : '<td class="col-checkbox"></td>';
    return '<tr' + (m.isPending ? ' class="member-row--pending"' : '') + '>' +
      checkCell +
      '<td data-label="Name">' + m.firstName + ' ' + m.lastName + pendingBadge + '</td>' +
      '<td data-label="Permanent ID"><span class="member-id">' + m.swimmerId.slice(0, 5) + '</span></td>' +
      '<td data-label="Membership Type">' + m._status + '</td>' +
      '<td data-label="Event License">' + formatType(m.membershipType) + '</td>' +
      '<td data-label="Registered">' + (m.registrationDate ? formatDate(m.registrationDate) : '') + '</td>' +
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
    var count = checkedIds.size;
    var total = count * 75;
    var licenseLine = document.getElementById('payment-license-line');
    licenseLine.style.display = count > 0 ? '' : 'none';
    document.getElementById('payment-license-count').textContent = count;
    document.getElementById('payment-license-subtotal').textContent = formatCurrency(total);
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

  // --- Current USMS Members lookup ---
  // Lets coaches verify a drop-in swimmer is a current USMS member. Searches
  // the USMS-wide directory (usmsMembersLocal.json), excluding the active
  // club's own members — they're already in the table below. Results render as
  // a plain list under the input (no selection step): a match *is* the
  // confirmation, and no match gets an explicit "not found" message.
  // Independent of the table and its checkboxes, so it stays usable when bulk
  // registration is closed.

  var LOOKUP_MIN_CHARS = 3;
  var LOOKUP_MAX_RESULTS = 7;

  var directory = JSON.parse(document.getElementById('usms-members-local-data').textContent)
    .filter(function (m) { return m.clubId !== clubId; })
    .sort(function (a, b) {
      return a.lastName < b.lastName ? -1 : a.lastName > b.lastName ? 1 :
        a.firstName < b.firstName ? -1 : a.firstName > b.firstName ? 1 : 0;
    });
  var lookupInput = document.getElementById('lookupMemberName');
  var lookupResults = document.getElementById('lookupMemberResults');
  var lookupTimer;

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Match count label, shown above the results from the first character on:
  // "(Showing 0 matches)" until the search kicks in at LOOKUP_MIN_CHARS, then
  // the real count, with a "keep typing" hint when the list is truncated.
  function lookupCountLabel(total) {
    if (total > LOOKUP_MAX_RESULTS) {
      return '(Showing ' + LOOKUP_MAX_RESULTS + ' of ' + total +
        ' matches. Keep typing to narrow the list.)';
    }
    return '(Showing ' + total + (total === 1 ? ' match)' : ' matches)');
  }

  function renderLookupResults() {
    var query = lookupInput.value.trim();
    var val = query.toLowerCase();
    lookupResults.innerHTML = '';
    if (!val.length) return;

    var matches = val.length < LOOKUP_MIN_CHARS ? [] : directory.filter(function (m) {
      return (m.firstName + ' ' + m.lastName).toLowerCase().indexOf(val) !== -1;
    });

    var count = document.createElement('p');
    count.className = 'members-lookup__more';
    count.textContent = lookupCountLabel(matches.length);
    lookupResults.appendChild(count);

    if (val.length < LOOKUP_MIN_CHARS) return;

    if (!matches.length) {
      var empty = document.createElement('p');
      empty.className = 'members-lookup__empty';
      empty.innerHTML = 'No current USMS member matches &ldquo;' + escapeHtml(query) +
        '&rdquo;. They may have let their membership lapse, or be registered under a different name.';
      lookupResults.appendChild(empty);
      return;
    }

    var list = document.createElement('ul');
    list.className = 'members-lookup__list';
    matches.slice(0, LOOKUP_MAX_RESULTS).forEach(function (m) {
      var fullName = m.firstName + ' ' + m.lastName;
      var idx = fullName.toLowerCase().indexOf(val);
      var bolded = escapeHtml(fullName.slice(0, idx)) + '<strong>' +
        escapeHtml(fullName.slice(idx, idx + val.length)) + '</strong>' +
        escapeHtml(fullName.slice(idx + val.length));
      var li = document.createElement('li');
      li.className = 'members-lookup__item';
      li.innerHTML =
        '<i class="fas fa-circle-check members-lookup__icon" aria-hidden="true"></i>' +
        '<span class="members-lookup__name">' + bolded + '</span>' +
        '<span class="members-lookup__details">' + escapeHtml(m.clubName + ' \u00b7 ' + m.city + ', ' + m.state) + '</span>';
      list.appendChild(li);
    });
    lookupResults.appendChild(list);
  }

  lookupInput.addEventListener('input', function () {
    clearTimeout(lookupTimer);
    // Below the search threshold there's nothing to search, so show the
    // "0 matches" label immediately rather than after the debounce
    if (lookupInput.value.trim().length < LOOKUP_MIN_CHARS) {
      renderLookupResults();
    } else {
      lookupTimer = setTimeout(renderLookupResults, 300);
    }
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
