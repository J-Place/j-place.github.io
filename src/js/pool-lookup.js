window.initPoolPlaces = function () {};

(function () {
  'use strict';

  // ── Haversine distance (miles) ─────────────────────────────────────────────

  function haversine(lat1, lng1, lat2, lng2) {
    var R  = 3958.8;
    var d1 = (lat2 - lat1) * Math.PI / 180;
    var d2 = (lng2 - lng1) * Math.PI / 180;
    var a  = Math.sin(d1 / 2) * Math.sin(d1 / 2)
           + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
           * Math.sin(d2 / 2) * Math.sin(d2 / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ── Data ───────────────────────────────────────────────────────────────────

  var dataEl = document.getElementById('pool-locations-data');
  if (!dataEl) return;
  var allLocations = [];
  try { allLocations = JSON.parse(dataEl.textContent); } catch (e) {}

  var locationColumn = document.querySelector('.location-column');

  // ── Card rendering ─────────────────────────────────────────────────────────

  var courseTagMap = { '25y': 'SCY', '25m': 'SCM', '50m': 'LCM' };

  function uniqueTags(courses) {
    var seen = {};
    var tags = [];
    (courses || []).forEach(function (c) {
      if (c.tag && !seen[c.tag]) { seen[c.tag] = true; tags.push(c.tag); }
    });
    return tags;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderCard(loc) {
    var tags = uniqueTags(loc.courses).map(function (tag) {
      return '<p class="event-location--course">' + escapeHtml(tag) + '</p>';
    }).join('');

    return '<div class="list-item list-item--location"'
      + ' data-location-id="' + escapeHtml(loc.id) + '"'
      + ' data-name="'        + escapeHtml(loc.name) + '"'
      + ' data-address="'     + escapeHtml(loc.address) + '"'
      + ' data-city="'        + escapeHtml(loc.city) + '"'
      + ' data-state="'       + escapeHtml(loc.state) + '"'
      + ' data-zip="'         + escapeHtml(loc.zip) + '"'
      + ' data-lat="'         + escapeHtml(loc.lat) + '"'
      + ' data-lng="'         + escapeHtml(loc.lng) + '"'
      + ' data-courses="'     + escapeHtml(JSON.stringify(loc.courses)) + '">'
      + '<button type="button" class="btn btn-small btn-detail">Details</button>'
      + '<p class="event-location__address--name">'   + escapeHtml(loc.name)    + '</p>'
      + '<p class="event-location__address--street">' + escapeHtml(loc.address) + '</p>'
      + '<p class="event-location__city-state">'      + escapeHtml(loc.city) + ', ' + escapeHtml(loc.state) + ' ' + escapeHtml(loc.zip) + '</p>'
      + '<div class="event-location--course-tags">' + tags + '</div>'
      + '</div>';
  }

  // ── Modal ──────────────────────────────────────────────────────────────────

  var modal    = document.getElementById('modalPoolDetail');
  var backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop fade in';

  function openModal(data) {
    document.getElementById('poolDetailName').textContent = data.name;
    var courses = [];
    try { courses = JSON.parse(data.courses || '[]'); } catch (e) {}

    var countEl = document.getElementById('poolDetailCount');
    if (countEl) countEl.textContent = 'Showing ' + courses.length + ' course' + (courses.length !== 1 ? 's' : '');

    var coursesEl = document.getElementById('poolDetailCourses');
    if (courses.length) {
      var items = courses.map(function (c) {
        var poolName    = c.pool || data.name;
        var tp          = parseInt(c.touchpads, 10);
        var touchpadTxt = isNaN(tp) ? 'No Touchpads' : tp + ' Touchpad' + (tp !== 1 ? 's' : '');
        var lanesTxt    = c.lanes ? c.lanes + ' Lane' + (c.lanes !== 1 ? 's' : '') : '';
        var bulkheadTxt = c.bulkhead ? 'Bulkhead' : 'No Bulkhead';
        var certDate = (c.certifiedDate || '').replace(/(\d{2})\/\d{2}(\d{2})$/, '$1/$2');
        var certifiedTxt = c.certified ? 'Certified ' + certDate : 'Not Certified';
        var detailParts = [escapeHtml(c.length || ''), escapeHtml(lanesTxt), escapeHtml(bulkheadTxt)].filter(Boolean);
        return '<li class="pool-course-item">'
          + '<p class="pool-course-item__name">'          + escapeHtml(poolName)                              + '</p>'
          + '<p class="pool-course-item__details">'       + detailParts.join(', ')                            + '</p>'
          + '<p class="pool-course-item__certified-date">' + escapeHtml(certifiedTxt) + ' - ' + escapeHtml(touchpadTxt) + '</p>'
          + '</li>';
      }).join('');
      coursesEl.innerHTML = '<ul class="pool-course-list">' + items + '</ul>';
    } else {
      coursesEl.innerHTML = '';
    }

    modal.style.display = 'block';
    modal.classList.add('show');
    modal.removeAttribute('aria-hidden');
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.appendChild(backdrop);
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth + 'px';
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  if (modal) {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-detail');
      if (!btn) return;
      var item = btn.closest('.list-item[data-location-id]');
      if (!item) return;
      openModal({
        name:    item.dataset.name,
        address: item.dataset.address,
        city:    item.dataset.city,
        state:   item.dataset.state,
        zip:     item.dataset.zip,
        courses: item.dataset.courses
      });
    });

    document.getElementById('poolDetailConfirm').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  // ── Search filters ─────────────────────────────────────────────────────────

  var submitBtn     = document.getElementById('listSearchSubmit');
  if (!submitBtn) return;

  var nameInput     = document.querySelector('input[name="search-filter__club-name"]');
  var locationInput = document.getElementById('locationSearch');
  var courseBoxes   = document.querySelectorAll('input[name="check-list--searchCourseTypes"]');
  var rangeSelect   = document.getElementById('search-filter__range');
  var lmscSelect    = document.getElementById('search-filter__lmsc');
  var tagsContainer = document.querySelector('.list-control-search--tags');
  var summaryCount  = document.querySelector('.summary-count');
  var summaryRange  = document.querySelector('.summary-range');
  var summaryLoc    = document.querySelector('.summary-location');

  // User's resolved coordinates from Google Places
  var userLat = null;
  var userLng = null;

  // ── Google Places Autocomplete ─────────────────────────────────────────────

  function initPlaces() {
    if (!locationInput || !window.google) return;
    var ac = new google.maps.places.Autocomplete(locationInput, {
      types: ['(regions)'],
      componentRestrictions: { country: 'us' }
    });
    ac.addListener('place_changed', function () {
      var place = ac.getPlace();
      if (place.geometry && place.geometry.location) {
        userLat = place.geometry.location.lat();
        userLng = place.geometry.location.lng();
      } else {
        userLat = null;
        userLng = null;
      }
      withLoader(applyFilters);
    });
  }
  window.initPoolPlaces = initPlaces;
  if (window.google && window.google.maps) initPlaces();

  // ── Location text fallback (no Places selection) ───────────────────────────

  function parseLocation(raw) {
    var s = raw.trim();
    if (!s) return null;
    if (/^\d{5}$/.test(s)) return { zip: s };
    if (s.indexOf(',') !== -1) {
      var parts = s.split(',');
      return { city: parts[0].trim().toLowerCase(), state: parts[1].trim().toLowerCase() };
    }
    if (/^[a-zA-Z]{2}$/.test(s)) return { state: s.toLowerCase() };
    return { city: s.toLowerCase() };
  }

  function locMatchesText(loc, parsed) {
    if (!parsed) return true;
    if (parsed.zip) return (loc.zip || '') === parsed.zip;
    var cityOk  = !parsed.city  || (loc.city  || '').toLowerCase().includes(parsed.city);
    var stateOk = !parsed.state || (loc.state || '').toLowerCase().includes(parsed.state);
    return cityOk && stateOk;
  }

  // ── Distance filter ────────────────────────────────────────────────────────

  function getSelectedRange() {
    if (!rangeSelect) return null;
    var val = rangeSelect.value;
    if (val === 'max') return null;
    return parseFloat(val);
  }

  function locMatchesDistance(loc, rangeMiles) {
    if (rangeMiles === null) return true;
    if (userLat === null || userLng === null) return true;
    var itemLat = parseFloat(loc.lat);
    var itemLng = parseFloat(loc.lng);
    if (isNaN(itemLat) || isNaN(itemLng)) return false;
    return haversine(userLat, userLng, itemLat, itemLng) <= rangeMiles;
  }

  // ── Course filter ──────────────────────────────────────────────────────────

  function locMatchesCourses(loc, checkedValues) {
    if (!checkedValues.length) return true;
    var courses = loc.courses || [];
    var knownTags = Object.values(courseTagMap);
    return checkedValues.some(function (val) {
      if (val === 'other') {
        return courses.some(function (c) { return knownTags.indexOf(c.tag) === -1; })
          || courses.length === 0;
      }
      var tag = courseTagMap[val];
      return courses.some(function (c) { return c.tag === tag; });
    });
  }

  // ── LMSC filter ───────────────────────────────────────────────────────────

  function locMatchesLmsc(loc, lmscVal) {
    if (!lmscVal || lmscVal === 'all') return true;
    return loc.lmsc === lmscVal;
  }

  function syncLmscTag() {
    if (!tagsContainer) return;
    var existing = tagsContainer.querySelector('.tag-list--item[data-filter-name="lmsc"]');
    if (existing) tagsContainer.removeChild(existing);
    if (!lmscSelect || lmscSelect.value === 'all') return;
    var tag = document.createElement('span');
    tag.className = 'tag-list--item';
    tag.textContent = lmscSelect.options[lmscSelect.selectedIndex].text;
    tag.dataset.filterName  = 'lmsc';
    tag.dataset.filterValue = lmscSelect.value;
    tagsContainer.appendChild(tag);
  }

  if (tagsContainer) {
    tagsContainer.addEventListener('click', function (e) {
      var tag = e.target.closest('.tag-list--item[data-filter-name="lmsc"]');
      if (!tag) return;
      if (lmscSelect) lmscSelect.value = 'all';
      syncLmscTag();
      withLoader(applyFilters);
    });
  }

  // ── Summary ────────────────────────────────────────────────────────────────

  function updateSummary(count) {
    if (summaryCount) summaryCount.textContent = count;
    if (summaryRange && rangeSelect) {
      summaryRange.textContent = rangeSelect.options[rangeSelect.selectedIndex].text;
    }
    if (summaryLoc && locationInput) {
      summaryLoc.textContent = locationInput.value.trim() || 'Nationwide';
    }
  }

  // ── Apply all filters ──────────────────────────────────────────────────────

  function applyFilters() {
    var nameQuery     = nameInput ? nameInput.value.trim().toLowerCase() : '';
    var rangeMiles    = getSelectedRange();
    var parsedLoc     = (userLat === null && locationInput) ? parseLocation(locationInput.value) : null;
    var checkedValues = [];
    courseBoxes.forEach(function (cb) { if (cb.checked) checkedValues.push(cb.value); });
    var lmscVal = lmscSelect ? lmscSelect.value : 'all';

    var matched = allLocations.filter(function (loc) {
      var nameOk   = !nameQuery || (loc.name || '').toLowerCase().includes(nameQuery);
      var distOk   = locMatchesDistance(loc, rangeMiles);
      var locOk    = distOk || locMatchesText(loc, parsedLoc);
      var courseOk = locMatchesCourses(loc, checkedValues);
      var lmscOk   = locMatchesLmsc(loc, lmscVal);
      return nameOk && (userLat !== null ? distOk : locOk) && courseOk && lmscOk;
    });

    if (locationColumn) {
      locationColumn.innerHTML = matched.map(renderCard).join('');
    }

    updateSummary(matched.length);
  }

  // ── Loading indicator ──────────────────────────────────────────────────────

  var loaderEl = document.querySelector('.loading');

  function withLoader(fn) {
    if (loaderEl) loaderEl.style.display = 'flex';
    setTimeout(function () {
      fn();
      if (loaderEl) loaderEl.style.display = 'none';
    }, 1000);
  }

  // ── Event listeners ────────────────────────────────────────────────────────

  submitBtn.addEventListener('click', function () {
    geocodeAddress(locationInput ? locationInput.value : '');
  });

  if (nameInput) {
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') withLoader(applyFilters);
    });
  }

  if (locationInput) {
    locationInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') geocodeAddress(locationInput.value);
    });
  }

  if (locationInput) {
    locationInput.addEventListener('focus', function () {
      this.value = '';
      userLat = null;
      userLng = null;
    });
    locationInput.addEventListener('input', function () {
      userLat = null;
      userLng = null;
    });
  }

  if (rangeSelect) {
    rangeSelect.addEventListener('change', function () { withLoader(applyFilters); });
  }

  if (lmscSelect) {
    lmscSelect.addEventListener('change', function () {
      if (lmscSelect.value !== 'all') {
        if (rangeSelect) rangeSelect.value = 'max';
        if (locationInput) locationInput.value = '';
        userLat = null;
        userLng = null;
      }
      syncLmscTag();
      withLoader(applyFilters);
    });
  }

  document.addEventListener('filtersChanged', function () {
    syncLmscTag();
    applyFilters();
  });

  // ── Init ───────────────────────────────────────────────────────────────────

  function geocodeAddress(address) {
    if (!address) { withLoader(applyFilters); return; }
    if (loaderEl) loaderEl.style.display = 'flex';
    var start = Date.now();
    function done() {
      var wait = Math.max(0, 1000 - (Date.now() - start));
      setTimeout(function () {
        applyFilters();
        if (loaderEl) loaderEl.style.display = 'none';
      }, wait);
    }
    fetch(
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=' + encodeURIComponent(address),
      { headers: { 'Accept-Language': 'en-US,en' } }
    )
    .then(function (r) { return r.json(); })
    .then(function (results) {
      if (results && results[0]) {
        userLat = parseFloat(results[0].lat);
        userLng = parseFloat(results[0].lon);
      }
      done();
    })
    .catch(function () { done(); });
  }

  if (locationInput) locationInput.value = 'Sarasota, FL';
  geocodeAddress(locationInput ? locationInput.value : '');

}());
