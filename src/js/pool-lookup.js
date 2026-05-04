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

    var coursesEl = document.getElementById('poolDetailCourses');
    if (courses.length) {
      var items = courses.map(function (c) {
        var poolName  = c.pool || data.name;
        var line1     = poolName + (c.length ? ' - ' + c.length : '');
        var certified = c.certified
          ? 'Certified ' + (c.certifiedDate || '')
          : 'Not Certified';
        var touchpadTxt = '1 Touchpad, 2 Touchpads, No Touchpads';
        var line2 = certified + (touchpadTxt ? ' \u2013 ' + touchpadTxt : '');
        return '<li class="pool-course-item">'
          + line1
          + '<span class="pool-course-item__meta">' + line2 + '</span>'
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
  var summaryCount  = document.querySelector('.summary-count');
  var summaryRange  = document.querySelector('.summary-range');
  var summaryLoc    = document.querySelector('.summary-location');

  // User's resolved coordinates from Google Places
  var userLat = null;
  var userLng = null;

  // ── Google Places Autocomplete ─────────────────────────────────────────────

  window.initPoolPlaces = function () {
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
      applyFilters();
    });
  };

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

    var matched = allLocations.filter(function (loc) {
      var nameOk   = !nameQuery || (loc.name || '').toLowerCase().includes(nameQuery);
      var distOk   = locMatchesDistance(loc, rangeMiles);
      var locOk    = distOk || locMatchesText(loc, parsedLoc);
      var courseOk = locMatchesCourses(loc, checkedValues);
      return nameOk && (userLat !== null ? distOk : locOk) && courseOk;
    });

    if (locationColumn) {
      locationColumn.innerHTML = matched.map(renderCard).join('');
    }

    updateSummary(matched.length);
  }

  // ── Event listeners ────────────────────────────────────────────────────────

  submitBtn.addEventListener('click', applyFilters);

  [nameInput, locationInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') applyFilters();
    });
  });

  if (locationInput) {
    locationInput.addEventListener('input', function () {
      userLat = null;
      userLng = null;
    });
  }

  if (rangeSelect) {
    rangeSelect.addEventListener('change', applyFilters);
  }

  document.addEventListener('filtersChanged', applyFilters);

  // ── Init ───────────────────────────────────────────────────────────────────

  function geocodeAddress(address) {
    if (!address) { applyFilters(); return; }
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
      applyFilters();
    })
    .catch(function () { applyFilters(); });
  }

  if (locationInput) locationInput.value = 'Sarasota, FL';
  geocodeAddress(locationInput ? locationInput.value : '');

}());
