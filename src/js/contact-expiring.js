(function () {
  var params = new URLSearchParams(window.location.search);
  var clubId = params.get('clubId') || sessionStorage.getItem('activeClubId');

  if (!clubId) {
    document.getElementById('contactexp-no-club').style.display = '';
    document.getElementById('contactexp-content').style.display = 'none';
    return;
  }
  sessionStorage.setItem('activeClubId', clubId);

  var clubs = JSON.parse(document.getElementById('clubs-local-data').textContent);
  var club = clubs.find(function (c) { return c.id === clubId; });
  if (club) {
    document.getElementById('contactexp-club-name').textContent = club.title;
  }

  var allPotential = JSON.parse(document.getElementById('potential-local-data').textContent);
  var clubData = allPotential.find(function (p) { return p.clubId === clubId; });

  if (!clubData) {
    document.getElementById('contactexp-no-club').style.display = '';
    document.getElementById('contactexp-content').style.display = 'none';
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
  var activeList = [];
  var respondedList = [];

  contacts.forEach(function (c) {
    if (c.responded) respondedList.push(c);
    else activeList.push(c);
  });

  function renderActiveCard(c) {
    return '<div class="contact-card" id="card-' + c.id + '">' +
      '<div class="contact-top">' +
      '<input type="checkbox" class="responded-checkbox" data-id="' + c.id + '" data-email="' + c.email + '" data-name="' + c.firstName + ' ' + c.lastName + '">' +
      '<span class="contact-name">' + c.firstName + ' ' + c.lastName + '</span>' +
      '</div>' +
      '<div class="contact-meta">' +
      '<span class="contact-email">' + c.email + '</span>' +
      '<span class="contact-date">' + formatDate(c.contactDate) + '</span>' +
      '<a href="#" class="contact-resend" data-email="' + c.email + '" data-name="' + c.firstName + ' ' + c.lastName + '">Resend</a>' +
      '</div>' +
      '</div>';
  }

  function renderRespondedCard(name, email, dateStr) {
    return '<div class="contact-card contact-card--responded">' +
      '<span class="contact-name contact-name--responded">' + name + '</span>' +
      '<span class="contact-date contact-date--responded">' + dateStr + '</span>' +
      '</div>';
  }

  function emptyActive() {
    return '<p class="contactexp-empty">No active contacts.</p>';
  }

  function emptyResponded() {
    return '<p class="contactexp-empty contactexp-empty--responded">None yet.</p>';
  }

  var recentActiveEl = document.getElementById('recent-active');
  var recentRespondedListEl = document.getElementById('recent-responded-list');
  var recentCountEl = document.getElementById('recent-count');

  function byDateAsc(a, b) { return a.contactDate < b.contactDate ? -1 : a.contactDate > b.contactDate ? 1 : 0; }

  recentActiveEl.innerHTML = activeList.length ? activeList.sort(byDateAsc).map(renderActiveCard).join('') : emptyActive();
  recentRespondedListEl.innerHTML = respondedList.length
    ? respondedList.map(function (c) { return renderRespondedCard(c.firstName + ' ' + c.lastName, c.email, formatDate(c.respondedDate)); }).join('')
    : emptyResponded();
  recentCountEl.textContent = activeList.length;

  document.getElementById('contactexp-content').addEventListener('change', function (e) {
    if (!e.target.classList.contains('responded-checkbox')) return;
    var cb = e.target;
    var card = document.getElementById('card-' + cb.dataset.id);
    var col = card.closest('.contactexp-col');
    var activeEl = col.querySelector('.contactexp-active');
    var respondedListEl = col.querySelector('.contactexp-responded__list');
    var countEl = col.querySelector('.contactexp-active-count span');

    card.remove();

    var remaining = activeEl.querySelectorAll('.contact-card').length;
    countEl.textContent = remaining;
    if (remaining === 0) activeEl.innerHTML = emptyActive();

    var emptyMsg = respondedListEl.querySelector('.contactexp-empty--responded');
    if (emptyMsg) emptyMsg.remove();

    var newCard = document.createElement('div');
    newCard.innerHTML = renderRespondedCard(cb.dataset.name, cb.dataset.email, formatToday());
    respondedListEl.insertBefore(newCard.firstChild, respondedListEl.firstChild);
  });

  var resendModal = document.getElementById('resend-modal');
  var resendModalName = document.getElementById('resend-modal-name');
  var resendModalEmail = document.getElementById('resend-modal-email');

  function openResendModal(name, email) {
    resendModalName.textContent = name;
    resendModalEmail.textContent = email;
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade in';
    document.body.appendChild(backdrop);
    resendModal.classList.add('in');
    resendModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.body.style.paddingRight = scrollbarWidth + 'px';
  }

  function closeResendModal() {
    resendModal.style.display = 'none';
    resendModal.classList.remove('show', 'in');
    resendModal.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.modal-backdrop').forEach(function (el) { el.parentNode.removeChild(el); });
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
  }

  document.getElementById('contactexp-content').addEventListener('click', function (e) {
    if (!e.target.classList.contains('contact-resend')) return;
    e.preventDefault();
    openResendModal(e.target.dataset.name, e.target.dataset.email);
  });

  document.getElementById('resend-modal-send').addEventListener('click', function () {
    closeResendModal();
  });
})();
