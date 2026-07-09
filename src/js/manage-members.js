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
      '<td data-label="Name">' + member.firstName + ' ' + member.lastName + pendingBadge + '</td>' +
      '<td data-label="ID"><span class="member-id">' + member.swimmerId.slice(0, 6) + '</span></td>' +
      '<td data-label="Type">' + formatType(member.membershipType) + '</td>' +
      '<td data-label="Expires">' + formatDate(member.expirationDate) + '</td>' +
      '</tr>';
  }

  function renderCheckableRow(member) {
    return '<tr>' +
      '<td class="col-checkbox"><input type="checkbox" class="expiring-checkbox" data-id="' + member.id + '"></td>' +
      '<td data-label="Name">' + member.firstName + ' ' + member.lastName + '</td>' +
      '<td data-label="ID"><span class="member-id">' + member.swimmerId.slice(0, 6) + '</span></td>' +
      '<td data-label="Type">' + formatType(member.membershipType) + '</td>' +
      '<td data-label="Expires">' + formatDate(member.expirationDate) + '</td>' +
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
      '<span class="simple-date">' + member.swimmerId.slice(0, 6) + '</span>' +
      '</div>' +
      '</div>';
  }

  function renderCheckableCol(member) {
    return '<div class="col-xs-12 simple-col">' +
      '<label class="simple-item simple-item--checkable">' +
      '<input type="checkbox" class="expiring-checkbox" data-id="' + member.id + '">' +
      '<span class="simple-name">' + member.firstName + ' ' + member.lastName + '</span>' +
      '<span class="simple-date">' + member.swimmerId.slice(0, 6) + '</span>' +
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

  var MEMBER_FEE = 75;
  var checkedIds = new Set();
  var selectAll = document.getElementById('select-all-expiring');

  function formatCurrency(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function updatePaymentSummary() {
    var count = checkedIds.size;
    var total = count * MEMBER_FEE;
    var usmsLine = document.getElementById('payment-usms-line');
    usmsLine.style.display = count > 0 ? '' : 'none';
    document.getElementById('payment-member-count').textContent = count;
    document.getElementById('payment-member-unit').textContent = count === 1 ? 'member' : 'members';
    document.getElementById('payment-subtotal').textContent = formatCurrency(total);
    document.getElementById('payment-total').textContent = formatCurrency(total);
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
    updatePaymentSummary();
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
    updatePaymentSummary();
  });

  var noMembersError = document.getElementById('payment-no-members-error');

  document.getElementById('register-button').addEventListener('click', function () {
    var valid = true;

    // Member selection
    if (checkedIds.size === 0) {
      noMembersError.style.display = '';
      valid = false;
    } else {
      noMembersError.style.display = 'none';
    }

    // Required text fields
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

    // Agree-terms checkbox
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
