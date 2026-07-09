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
  var clubEmail = (club && club.contact && club.contact.emailPrimary) ? club.contact.emailPrimary : '';
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
  var expiredReplied = allExpired.filter(function (m) { return m.contacted; });

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

  function formatToday() {
    return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  var contacts = clubData.contacts || [];
  var recentActive = [];
  var recentResponded = [];

  contacts.forEach(function (c) {
    var d = daysAgo(c.contactDate);
    if (d >= 0 && d <= 30) {
      if (c.responded) recentResponded.push(c);
      else recentActive.push(c);
    }
  });

  recentActive.forEach(function (c) { c._type = 'contact'; });
  recentResponded.forEach(function (c) { c._type = 'contact'; });
  expiredActive.forEach(function (m) { m._type = 'expired'; });
  expiredReplied.forEach(function (m) { m._type = 'expired'; });
  var allActive = recentActive.concat(expiredActive);
  var allResponded = recentResponded.concat(expiredReplied);

  function renderActiveCard(c) {
    return '<div class="contact-card" id="card-' + c.id + '" data-id="' + c.id + '">' +
      '<div class="contact-card__left">' +
      '<div class="contact-name">' + c.firstName + ' ' + c.lastName + '</div>' +
      '<div class="contact-email">' + c.email + '</div>' +
      '</div>' +
      '<div class="contact-card__right">' +
      (c.source ? '<span class="contact-source"><strong>' + (c.source === 'TMS' ? 'Trial' : c.source === 'CLUB' ? 'Club Page' : c.source) + '</strong></span>' : '') +
      '<span class="contact-date">' + formatDate(c.contactDate) + '</span>' +
      '<div class="contact-actions">' +
      '<a href="#" class="contact-resend" data-id="' + c.id + '">View Message</a>' +
      '<a href="#" class="contact-send-email"><i class="fa fa-envelope" aria-hidden="true"></i> Reply</a>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function renderRespondedCard(name, email, dateStr, sourceLabel) {
    return '<div class="contact-card contact-card--responded">' +
      '<div class="contact-card__left">' +
      '<span class="contact-name">' + name + '</span>' +
      '<span class="contact-email">' + email + '</span>' +
      '</div>' +
      '<div class="contact-card__right">' +
      (sourceLabel ? '<span class="contact-source">' + sourceLabel + '</span>' : '') +
      '<span class="contact-date">' + dateStr + '</span>' +
      '</div>' +
      '</div>';
  }

  function emptyActive() {
    return '<p class="nonmembers-empty">No active contacts.</p>';
  }

  function emptyResponded() {
    return '<p class="nonmembers-empty nonmembers-empty--responded">None yet.</p>';
  }

  var recentActiveEl = document.getElementById('recent-active');
  var recentRespondedListEl = document.getElementById('recent-responded-list');
  var recentCountEl = document.getElementById('recent-count');

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

  var filterGroupEl = document.querySelector('.nonmembers-filter');
  var sortDirBtn = document.getElementById('sort-dir');
  var sortDirIcon = sortDirBtn ? sortDirBtn.querySelector('.nonmembers-sort-overlay') : null;

  if (filterGroupEl) {
    filterGroupEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.nonmembers-filter__btn');
      if (!btn) return;
      filterGroupEl.querySelectorAll('.nonmembers-filter__btn').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      activeFilter = btn.dataset.filter;
      renderRecentActive(activeFilter, sortDir);
    });
  }

  if (sortDirBtn) {
    sortDirBtn.addEventListener('click', function () {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      if (sortDirIcon) { sortDirIcon.className = 'fas nonmembers-sort-overlay ' + (sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down'); }
      sortDirBtn.setAttribute('aria-label', sortDir === 'asc' ? 'Sort ascending' : 'Sort descending');
      renderRecentActive(activeFilter, sortDir);
    });
  }

  function getRespondedDate(item) { return item._type === 'expired' ? item.contactedDate : item.respondedDate; }

  var respondedSortDir = 'desc';

  function renderResponded(dir) {
    var sorted = allResponded.slice();
    sorted.sort(function (a, b) {
      var da = getRespondedDate(a), db = getRespondedDate(b);
      return da < db ? 1 : da > db ? -1 : 0;
    });
    if (dir === 'asc') sorted.reverse();
    recentRespondedListEl.innerHTML = sorted.length
      ? sorted.map(function (item) {
          if (item._type === 'expired') return renderRespondedCard(item.firstName + ' ' + item.lastName, item.swimmerId.slice(0, 6) + (item.email ? '  ' + item.email : ''), formatDate(item.contactedDate), 'Expired');
          return renderRespondedCard(item.firstName + ' ' + item.lastName, item.email, formatDate(item.respondedDate), item.source === 'TMS' ? 'Trial' : 'Club Page');
        }).join('')
      : emptyResponded();
  }

  renderResponded(respondedSortDir);

  var respondedSortBtn = document.getElementById('responded-sort-dir');
  var respondedSortIcon = respondedSortBtn ? respondedSortBtn.querySelector('.nonmembers-sort-overlay') : null;

  if (respondedSortBtn) {
    respondedSortBtn.addEventListener('click', function () {
      respondedSortDir = respondedSortDir === 'desc' ? 'asc' : 'desc';
      if (respondedSortIcon) { respondedSortIcon.className = 'fas nonmembers-sort-overlay ' + (respondedSortDir === 'desc' ? 'fa-sort-down' : 'fa-sort-up'); }
      respondedSortBtn.setAttribute('aria-label', respondedSortDir === 'desc' ? 'Sort descending' : 'Sort ascending');
      renderResponded(respondedSortDir);
    });
  }
  recentCountEl.textContent = allActive.length;

  function renderExpiredCard(m) {
    return '<div class="contact-card expired-card" id="card-' + m.id + '" data-id="' + m.id + '">' +
      '<div class="contact-card__left">' +
      '<div class="contact-name-row">' +
      '<span class="contact-name">' + m.firstName + ' ' + m.lastName + '</span>' +
      '<span class="contact-swimmer-id">' + m.swimmerId.slice(0, 6) + '</span>' +
      '</div>' +
      '<div class="contact-email">' + (m.email || '') + '</div>' +
      '</div>' +
      '<div class="contact-card__right">' +
      '<span class="contact-source"><strong>Expired</strong></span>' +
      '<span class="contact-date">' + formatDate(m.expirationDate) + '</span>' +
      '<a href="#" class="contact-send-expired"><i class="fa fa-envelope" aria-hidden="true"></i> Contact</a>' +
      '</div>' +
      '</div>';
  }


  function todayISO() {
    var m = today.getMonth() + 1, d = today.getDate();
    return today.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
  }

  function markResponded(contactId) {
    var card = document.getElementById('card-' + contactId);
    if (!card) return;
    var c = contactMap[contactId];
    c.respondedDate = todayISO();
    card.remove();
    var remaining = recentActiveEl.querySelectorAll('.contact-card').length;
    recentCountEl.textContent = remaining;
    if (remaining === 0) recentActiveEl.innerHTML = emptyActive();
    allResponded.push(c);
    renderResponded(respondedSortDir);
  }

  var contactMap = {};
  contacts.forEach(function (c) { contactMap[c.id] = c; });

  var originalModal = document.getElementById('original-modal');
  var currentOriginalId = null;

  function openOriginalModal(id) {
    currentOriginalId = id;
    var c = contactMap[id];
    if (!c) return;
    document.getElementById('orig-name').textContent = c.firstName + ' ' + c.lastName;
    document.getElementById('orig-email').textContent = c.email;
    var phoneRow = document.getElementById('orig-phone-row');
    if (c.phone) {
      document.getElementById('orig-phone').textContent = c.phone;
      phoneRow.style.display = '';
    } else {
      phoneRow.style.display = 'none';
    }
    document.getElementById('orig-member').textContent = (c.message && c.message.isMember) ? 'Yes' : 'No';
    document.getElementById('orig-interest').textContent = (c.message && c.message.interest) || '—';
    document.getElementById('orig-body').textContent = (c.message && c.message.body) || '—';
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade in';
    document.body.appendChild(backdrop);
    originalModal.classList.add('in');
    originalModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.body.style.paddingRight = scrollbarWidth + 'px';
  }

  function closeOriginalModal() {
    originalModal.style.display = 'none';
    originalModal.classList.remove('show', 'in');
    originalModal.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.modal-backdrop').forEach(function (el) { el.parentNode.removeChild(el); });
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
  }

  document.getElementById('nonmembers-content').addEventListener('click', function (e) {
    var resendLink = e.target.closest('.contact-resend');
    if (!resendLink) return;
    e.preventDefault();
    openOriginalModal(resendLink.dataset.id);
  });

  document.getElementById('orig-reply-btn').addEventListener('click', function () {
    var id = currentOriginalId;
    closeOriginalModal();
    openReplyModal(id, true);
  });

  var replyModal = document.getElementById('reply-modal');

  function openReplyModal(contactId, preserveFields) {
    var c = contactMap[contactId];
    if (!c) return;
    currentOriginalId = contactId;
    document.getElementById('reply-date').textContent = formatToday();
    document.getElementById('reply-to').textContent = c.firstName + ' ' + c.lastName + ' <' + c.email + '>';
    document.getElementById('reply-from').textContent = clubEmail;
    if (!preserveFields) {
      document.getElementById('reply-subject').value = 'Re: Your interest in joining our club';
      document.getElementById('reply-body').value = '';
    }
    updateReplySendState();
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade in';
    document.body.appendChild(backdrop);
    replyModal.classList.add('in');
    replyModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.body.style.paddingRight = scrollbarWidth + 'px';
  }

  function closeReplyModal() {
    replyModal.style.display = 'none';
    replyModal.classList.remove('show', 'in');
    replyModal.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.modal-backdrop').forEach(function (el) { el.parentNode.removeChild(el); });
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
  }

  document.getElementById('nonmembers-content').addEventListener('click', function (e) {
    var replyLink = e.target.closest('.contact-send-email');
    if (!replyLink) return;
    e.preventDefault();
    var card = replyLink.closest('.contact-card');
    openReplyModal(card.dataset.id);
  });

  var replySubject = document.getElementById('reply-subject');
  var replyBody = document.getElementById('reply-body');
  var replySendBtn = document.getElementById('reply-send-btn');

  function updateReplySendState() {
    replySendBtn.disabled = !(replySubject.value.trim() && replyBody.value.trim());
  }

  replySubject.addEventListener('input', updateReplySendState);
  replyBody.addEventListener('input', updateReplySendState);

  var replyCancelBtn = document.getElementById('reply-cancel-btn');
  if (replyCancelBtn) {
    replyCancelBtn.addEventListener('click', function () {
      replySubject.value = '';
      replyBody.value = '';
      updateReplySendState();
      closeReplyModal();
    });
  }

  document.getElementById('reply-back-btn').addEventListener('click', function () {
    var id = currentOriginalId;
    closeReplyModal();
    openOriginalModal(id, true);
  });

  document.getElementById('reply-send-btn').addEventListener('click', function () {
    var id = currentOriginalId;
    closeReplyModal();
    markResponded(id);
  });

  var expiredMap = {};
  allExpired.forEach(function (m) { expiredMap[m.id] = m; });

  var contactExpiredModal = document.getElementById('contact-expired-modal');
  var currentExpiredId = null;
  var contactExpSubject = document.getElementById('contact-exp-subject');
  var contactExpBody = document.getElementById('contact-exp-body');
  var contactExpSendBtn = document.getElementById('contact-exp-send-btn');

  function updateContactExpSendState() {
    contactExpSendBtn.disabled = !(contactExpSubject.value.trim() && contactExpBody.value.trim());
  }

  contactExpSubject.addEventListener('input', updateContactExpSendState);
  contactExpBody.addEventListener('input', updateContactExpSendState);

  function openContactExpiredModal(id) {
    currentExpiredId = id;
    var m = expiredMap[id];
    if (!m) return;
    contactExpSubject.value = '';
    contactExpBody.value = '';
    updateContactExpSendState();
    document.getElementById('contact-exp-date').textContent = formatToday();
    document.getElementById('contact-exp-to').textContent = m.firstName + ' ' + m.lastName + ' <' + m.email + '>';
    document.getElementById('contact-exp-from').textContent = clubEmail;
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade in';
    document.body.appendChild(backdrop);
    contactExpiredModal.classList.add('in');
    contactExpiredModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.body.style.paddingRight = scrollbarWidth + 'px';
  }

  function closeContactExpiredModal() {
    contactExpiredModal.style.display = 'none';
    contactExpiredModal.classList.remove('show', 'in');
    contactExpiredModal.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.modal-backdrop').forEach(function (el) { el.parentNode.removeChild(el); });
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
  }

  document.getElementById('nonmembers-content').addEventListener('click', function (e) {
    var contactLink = e.target.closest('.contact-send-expired');
    if (!contactLink) return;
    e.preventDefault();
    var card = contactLink.closest('.contact-card');
    openContactExpiredModal(card.dataset.id);
  });

  function markExpiredContacted(id) {
    var card = document.getElementById('card-' + id);
    if (!card) return;
    var m = expiredMap[id];
    m.contactedDate = todayISO();
    card.remove();
    var remaining = recentActiveEl.querySelectorAll('.contact-card').length;
    recentCountEl.textContent = remaining;
    if (remaining === 0) recentActiveEl.innerHTML = emptyActive();
    allResponded.push(m);
    renderResponded(respondedSortDir);
  }

  document.getElementById('contact-exp-cancel-btn').addEventListener('click', function () {
    contactExpSubject.value = '';
    contactExpBody.value = '';
    updateContactExpSendState();
    closeContactExpiredModal();
  });

  document.getElementById('contact-exp-send-btn').addEventListener('click', function () {
    var id = currentExpiredId;
    closeContactExpiredModal();
    markExpiredContacted(id);
  });

  originalModal.addEventListener('click', function (e) {
    if (e.target === originalModal) closeOriginalModal();
  });
  replyModal.addEventListener('click', function (e) {
    if (e.target === replyModal) closeReplyModal();
  });
  contactExpiredModal.addEventListener('click', function (e) {
    if (e.target === contactExpiredModal) closeContactExpiredModal();
  });
})();
