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
  var olderActive = [];
  var olderResponded = [];

  contacts.forEach(function (c) {
    var d = daysAgo(c.contactDate);
    if (d >= 0 && d <= 30) {
      if (c.responded) recentResponded.push(c);
      else recentActive.push(c);
    } else if (d > 30 && d <= 365) {
      if (c.responded) olderResponded.push(c);
      else olderActive.push(c);
    }
  });

  function renderActiveCard(c) {
    return '<div class="contact-card" id="card-' + c.id + '">' +
      '<div class="contact-top">' +
      '<input type="checkbox" class="responded-checkbox" data-id="' + c.id + '" data-email="' + c.email + '" data-name="' + c.firstName + ' ' + c.lastName + '">' +
      '<span class="contact-name">' + c.firstName + ' ' + c.lastName + '</span>' +
      (c.source ? '<span class="contact-source contact-source--' + c.source.toLowerCase() + '"><span class="contact-source__label">Source: </span><strong>' + c.source + '</strong></span>' : '') +
      '</div>' +
      '<div class="contact-meta">' +
      '<span class="contact-email">' + c.email + '</span>' +
      '<span class="contact-date">' + formatDate(c.contactDate) + '</span>' +
      '<a href="#" class="contact-resend" data-id="' + c.id + '">View Original</a>' +
      '<a href="mailto:' + c.email + '" class="contact-send-email"><i class="fa fa-envelope" aria-hidden="true"></i> Reply</a>' +
      '</div>' +
      '</div>';
  }

  function renderRespondedCard(name, email, dateStr) {
    return '<div class="contact-card contact-card--responded">' +
      '<span class="contact-name contact-name--responded">' + name + '</span>' +
      '<span class="contact-email contact-email--responded">' + email + '</span>' +
      '<span class="contact-date contact-date--responded">' + dateStr + '</span>' +
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
  var olderActiveEl = document.getElementById('older-active');
  var olderRespondedListEl = document.getElementById('older-responded-list');
  var olderCountEl = document.getElementById('older-count');

  function byDateAsc(a, b) { return a.contactDate < b.contactDate ? -1 : a.contactDate > b.contactDate ? 1 : 0; }

  recentActiveEl.innerHTML = recentActive.length ? recentActive.sort(byDateAsc).map(renderActiveCard).join('') : emptyActive();
  recentRespondedListEl.innerHTML = recentResponded.length
    ? recentResponded.map(function (c) { return renderRespondedCard(c.firstName + ' ' + c.lastName, c.email, formatDate(c.respondedDate)); }).join('')
    : emptyResponded();
  recentCountEl.textContent = recentActive.length;

  olderActiveEl.innerHTML = olderActive.length ? olderActive.sort(byDateAsc).map(renderActiveCard).join('') : emptyActive();
  olderRespondedListEl.innerHTML = olderResponded.length
    ? olderResponded.map(function (c) { return renderRespondedCard(c.firstName + ' ' + c.lastName, c.email, formatDate(c.respondedDate)); }).join('')
    : emptyResponded();
  olderCountEl.textContent = olderActive.length;

  function markResponded(contactId) {
    var card = document.getElementById('card-' + contactId);
    if (!card) return;
    var c = contactMap[contactId];
    var col = card.closest('.nonmembers-col');
    var activeEl = col.querySelector('.nonmembers-active');
    var respondedListEl = col.querySelector('.nonmembers-responded__list');
    var countEl = col.querySelector('.nonmembers-active-count span');

    card.remove();

    var remaining = activeEl.querySelectorAll('.contact-card').length;
    countEl.textContent = remaining;
    if (remaining === 0) activeEl.innerHTML = emptyActive();

    var emptyMsg = respondedListEl.querySelector('.nonmembers-empty--responded');
    if (emptyMsg) emptyMsg.remove();

    var newCard = document.createElement('div');
    newCard.innerHTML = renderRespondedCard(c.firstName + ' ' + c.lastName, c.email, formatToday());
    respondedListEl.insertBefore(newCard.firstChild, respondedListEl.firstChild);
  }

  document.getElementById('nonmembers-content').addEventListener('change', function (e) {
    if (!e.target.classList.contains('responded-checkbox')) return;
    markResponded(e.target.dataset.id);
  });

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
    if (!e.target.classList.contains('contact-resend')) return;
    e.preventDefault();
    openOriginalModal(e.target.dataset.id);
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
    if (!e.target.classList.contains('contact-send-email')) return;
    e.preventDefault();
    var card = e.target.closest('.contact-card');
    var cb = card.querySelector('.responded-checkbox');
    openReplyModal(cb.dataset.id);
  });

  var replySubject = document.getElementById('reply-subject');
  var replyBody = document.getElementById('reply-body');
  var replySendBtn = document.getElementById('reply-send-btn');

  function updateReplySendState() {
    replySendBtn.disabled = !(replySubject.value.trim() && replyBody.value.trim());
  }

  replySubject.addEventListener('input', updateReplySendState);
  replyBody.addEventListener('input', updateReplySendState);

  document.getElementById('reply-cancel-btn').addEventListener('click', function () {
    replySubject.value = '';
    replyBody.value = '';
    updateReplySendState();
    closeReplyModal();
  });

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
})();
