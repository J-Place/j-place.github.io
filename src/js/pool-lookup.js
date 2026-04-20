(function () {
  'use strict';

  // ── Haversine distance (miles) ─────────────────────────────────────────────

  function haversine(lat1, lng1, lat2, lng2) {
    var R  = 3958.8; // Earth radius in miles
    var d1 = (lat2 - lat1) * Math.PI / 180;
    var d2 = (lng2 - lng1) * Math.PI / 180;
    var a  = Math.sin(d1 / 2) * Math.sin(d1 / 2)
           + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
           * Math.sin(d2 / 2) * Math.sin(d2 / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ── Modal ──────────────────────────────────────────────────────────────────

  var modal    = document.getElementById('modalPoolDetail');
  var backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop fade in';

  function openModal(data) {
    document.getElementById('poolDetailName').textContent = data.name;
    document.getElementById('poolDetailAddress').textContent = data.address;
    document.getElementById('poolDetailCityState').textContent =
      data.city + ', ' + data.state + ' ' + data.zip;

    var courses = [];
    try { courses = JSON.parse(data.courses || '[]'); } catch (e) {}

    var coursesEl = document.getElementById('poolDetailCourses');
    if (courses.length) {
      var rows = courses.map(function (c) {
        return '<tr>'
          + '<td>' + (c.tag       || '')              + '</td>'
          + '<td>' + (c.length    || '')              + '</td>'
          + '<td>' + (c.type      || '')              + '</td>'
          + '<td>' + (c.lanes     != null ? c.lanes     : '') + '</td>'
          + '<td>' + (c.touchpads != null ? c.touchpads : '') + '</td>'
          + '<td>' + (c.certified ? (c.certifiedDate || 'Yes') : 'No') + '</td>'
          + '<td>' + (c.measured  ? (c.measuredDate  || 'Yes') : 'No') + '</td>'
          + '</tr>';
      }).join('');
      coursesEl.innerHTML =
        '<table class="table table-sm pool-detail__table">'
        + '<thead><tr>'
        + '<th>Course</th><th>Length</th><th>Type</th>'
        + '<th>Lanes</th><th>Touchpads</th><th>Certified</th><th>Measured</th>'
        + '</tr></thead>'
        + '<tbody>' + rows + '</tbody>'
        + '</table>';
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

    document.getElementById('poolDetailClose').addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
  }

  // ── Search filters ─────────────────────────────────────────────────────────

  var submitBtn     = document.getElementById('listSearchSubmit');
  if (!submitBtn) return;

  var nameInput     = document.querySelector('input[name="search-filter__club-name"]');
  var locationInput = document.getElementById('locationSearch');
  var courseBoxes   = document.querySelectorAll('input[name="check-list--searchCourseTypes"]');
  var rangeSelect   = document.getElementById('search-filter__range');
  var items         = document.querySelectorAll('.list-item[data-location-id]');
  var summaryCount  = document.querySelector('.summary-count');
  var summaryRange  = document.querySelector('.summary-range');
  var summaryLoc    = document.querySelector('.summary-location');

  // User's resolved coordinates from Google Places
  var userLat = null;
  var userLng = null;

  var courseTagMap = { '25y': 'SCY', '25m': 'SCM', '50m': 'LCM' };

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

  function itemMatchesLocation(item, parsed) {
    if (!parsed) return true;
    if (parsed.zip) return (item.dataset.zip || '') === parsed.zip;
    var cityOk  = !parsed.city  || (item.dataset.city  || '').toLowerCase().includes(parsed.city);
    var stateOk = !parsed.state || (item.dataset.state || '').toLowerCase().includes(parsed.state);
    return cityOk && stateOk;
  }

  // ── Distance filter ────────────────────────────────────────────────────────

  function getSelectedRange() {
    if (!rangeSelect) return null;
    var val = rangeSelect.value;
    if (val === 'max') return null; // Nationwide — no distance filter
    return parseFloat(val);        // miles
  }

  function itemMatchesDistance(item, rangeMiles) {
    if (rangeMiles === null) return true;      // Nationwide
    if (userLat === null || userLng === null) return true; // no user coords yet

    var itemLat = parseFloat(item.dataset.lat);
    var itemLng = parseFloat(item.dataset.lng);
    if (isNaN(itemLat) || isNaN(itemLng)) return false; // no coords — exclude when range is active

    return haversine(userLat, userLng, itemLat, itemLng) <= rangeMiles;
  }

  // ── Course filter ──────────────────────────────────────────────────────────

  function itemMatchesCourses(item, checkedValues) {
    if (!checkedValues.length) return true;
    var courses = [];
    try { courses = JSON.parse(item.dataset.courses || '[]'); } catch (e) {}
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

    var visible = 0;
    items.forEach(function (item) {
      var nameOk   = !nameQuery || (item.dataset.name || '').toLowerCase().includes(nameQuery);
      var distOk   = itemMatchesDistance(item, rangeMiles);
      var locOk    = distOk || itemMatchesLocation(item, parsedLoc); // fallback to text if no coords
      var courseOk = itemMatchesCourses(item, checkedValues);
      var show     = nameOk && (userLat !== null ? distOk : locOk) && courseOk;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    updateSummary(visible);
  }

  // ── Event listeners ────────────────────────────────────────────────────────

  submitBtn.addEventListener('click', applyFilters);

  [nameInput, locationInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') applyFilters();
    });
  });

  // Clear resolved coords if user edits the location field manually
  if (locationInput) {
    locationInput.addEventListener('input', function () {
      userLat = null;
      userLng = null;
    });
  }

  if (rangeSelect) {
    rangeSelect.addEventListener('change', applyFilters);
  }

  // Checkbox changes and tag pill removals are handled by filters.js;
  // it dispatches 'filtersChanged' when the selection changes.
  document.addEventListener('filtersChanged', applyFilters);

  // ── Init ───────────────────────────────────────────────────────────────────

  if (locationInput) locationInput.value = 'Tampa, FL';
  applyFilters();

}());
