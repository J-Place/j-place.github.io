window.initEventPlaces = function () {};

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

  var dataEl = document.getElementById('location-search-data');
  if (!dataEl) return;
  var allLocations = [];
  try { allLocations = JSON.parse(dataEl.textContent); } catch (e) {}

  // ── DOM refs ───────────────────────────────────────────────────────────────

  var locationColumn    = document.querySelector('.section-location-information .location-column');
  var searchPanel       = document.querySelector('.location-search-panel');
  var savedPanel        = document.querySelector('.location-saved-panel');
  var courseDescContent = document.getElementById('courseDescriptionContent');
  var savedItems        = document.getElementById('savedLocationItems');
  var editLocationBtn  = document.getElementById('editLocationBtn');
  var doneEditBtn      = document.getElementById('doneEditLocationBtn');
  var cancelBtn        = document.getElementById('cancelAddLocationBtn');
  var confirmRemove    = document.getElementById('confirmRemoveLocation');
  var confirmSelect    = document.getElementById('confirmLocationSelection');
  var sectionEl        = document.querySelector('.section-location-information');
  var sectionEditBtn   = document.querySelector('.section-location-information .section__edit-btn');
  var summaryCount     = document.querySelector('.section-location-information .summary-count');
  var summaryRange     = document.querySelector('.section-location-information .summary-range');
  var summaryLoc       = document.querySelector('.section-location-information .summary-location');
  var nameInput        = document.querySelector('.section-location-information input[name="search-filter__club-name"]');
  var locationInput    = document.getElementById('locationSearch');
  var rangeSelect      = document.getElementById('search-filter__range');
  var submitBtn        = document.getElementById('listSearchSubmit');
  var courseBoxes      = document.querySelectorAll('.section-location-information input[name="check-list--searchCourseTypes"]');

  // ── Helpers ────────────────────────────────────────────────────────────────

  var courseTagMap = { '25y': 'SCY', '25m': 'SCM', '50m': 'LCM' };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function uniqueTags(courses) {
    var seen = {}, tags = [];
    (courses || []).forEach(function (c) {
      if (c.tag && !seen[c.tag]) { seen[c.tag] = true; tags.push(c.tag); }
    });
    return tags;
  }

  function renderCourseTags(courses) {
    return uniqueTags(courses).map(function (tag) {
      return '<p class="event-location--course">' + escapeHtml(tag) + '</p>';
    }).join('');
  }

  // ── Card rendering ─────────────────────────────────────────────────────────

  function renderCard(loc) {
    return '<div class="list-item list-item--location"'
      + ' data-location-id="' + escapeHtml(loc.id)      + '"'
      + ' data-name="'        + escapeHtml(loc.name)    + '"'
      + ' data-address="'     + escapeHtml(loc.address) + '"'
      + ' data-city="'        + escapeHtml(loc.city)    + '"'
      + ' data-state="'       + escapeHtml(loc.state)   + '"'
      + ' data-zip="'         + escapeHtml(loc.zip)     + '"'
      + ' data-lat="'         + escapeHtml(loc.lat)     + '"'
      + ' data-lng="'         + escapeHtml(loc.lng)     + '"'
      + ' data-courses="'     + escapeHtml(JSON.stringify(loc.courses)) + '">'
      + '<button type="button" class="btn btn-small btn-select-location">Select</button>'
      + '<p class="event-location__address--name">'   + escapeHtml(loc.name)    + '</p>'
      + '<p class="event-location__address--street">' + escapeHtml(loc.address) + '</p>'
      + '<p class="event-location__city-state">'      + escapeHtml(loc.city) + ', ' + escapeHtml(loc.state) + ' ' + escapeHtml(loc.zip) + '</p>'
      + '<div class="event-location--course-tags">' + renderCourseTags(loc.courses) + '</div>'
      + '</div>';
  }

  // ── Modal population ───────────────────────────────────────────────────────

  var pendingLocation = null;

  function populateSelectionModal(data) {
    var courses = [];
    try { courses = JSON.parse(data.courses || '[]'); } catch (e) {}

    var modalBody = document.querySelector('#modalCourseSelection .modal-body');
    if (!modalBody) return;

    var locId = escapeHtml(data.locationId || 'loc');

    var radiosHtml = courses.map(function (c, i) {
      var poolName = c.pool || data.name;

      var detailParts = [];
      if (c.length) detailParts.push(escapeHtml(c.length));
      if (c.lanes)  detailParts.push(escapeHtml(c.lanes) + ' Lanes');
      detailParts.push(c.bulkhead ? 'Bulkhead' : 'No Bulkhead');

      var certHtml = '';
      if (c.certified && c.certifiedDate) {
        var tp          = parseInt(c.touchpads, 10);
        var touchpadTxt = isNaN(tp) ? 'No Touchpads' : tp + ' Touchpad' + (tp !== 1 ? 's' : '');
        certHtml = '<p class="pool-course-item__certified">Certified ' + escapeHtml(c.certifiedDate) + ' - ' + touchpadTxt + '</p>';
      }

      return '<label class="radio-label" for="course-' + locId + '-' + i + '">'
        + '<span class="radio-container">'
        + '<input type="radio" name="configuration-' + locId + '" id="course-' + locId + '-' + i + '" value="' + i + '">'
        + '<span class="radio__placeholder"></span>'
        + '</span>'
        + '<span class="pool-course-item">'
        + '<p class="pool-course-item__name">' + escapeHtml(poolName) + '</p>'
        + '<p class="pool-course-item__details">' + detailParts.join(', ') + '</p>'
        + certHtml
        + '</span>'
        + '</label>';
    }).join('');

    modalBody.innerHTML = '<p>Now that you have selected a location, please select the course of the pool that the event will take place. The courses that have been certified in our database are highlighted. If a course is not certified, the meet\'s times will not count. <a href="https://www.usms.org/volunteer-central/guide-to-local-operations/event-management/top-10-and-records-and-tabulation/pool-length-form-and-measurement-procedures">Learn more here.</a></p>'
      + '<p class="location-name">' + escapeHtml(data.name) + '</p>'
      + '<div class="input-group chose-pool-configuration">'
      + '<span class="help-block help-block--chosePoolConfiguration">Please select a configuration</span>'
      + radiosHtml
      + '</div>'
      + '<br><p>If your course is not listed, please contact USMS to have it added: <a href="mailto:events@usmastersswimming.org">events@usmastersswimming.org</a></p>';

    if (confirmSelect) confirmSelect.disabled = true;
    modalBody.addEventListener('change', function (e) {
      if (e.target.type === 'radio' && confirmSelect) confirmSelect.disabled = false;
    });
  }

  // ── Saved-location rendering ───────────────────────────────────────────────

  function renderSavedLocation(data, selectedCourseIdx) {
    var courses = [];
    try { courses = JSON.parse(data.courses || '[]'); } catch (e) {}

    var selectedCourse = courses[selectedCourseIdx] || null;
    var selectedPool   = selectedCourse ? (selectedCourse.pool || data.name) : null;

    // Group courses by pool name, preserving order
    var venueMap   = {};
    var venueOrder = [];
    courses.forEach(function (c) {
      var poolName = c.pool || data.name;
      if (!venueMap[poolName]) {
        venueMap[poolName] = { name: poolName, type: c.type || '', courses: [] };
        venueOrder.push(poolName);
      }
      venueMap[poolName].courses.push(c);
    });

    var venuesHtml = venueOrder.map(function (poolName) {
      var venue           = venueMap[poolName];
      var isSelectedVenue = poolName === selectedPool;

      var configsHtml = '';
      if (isSelectedVenue && selectedCourse) {
        var configTitle = escapeHtml(selectedCourse.length || '') + (selectedCourse.lanes ? ', ' + selectedCourse.lanes + ' Lanes' : '');
        configsHtml = '<div class="configuration__list--item selected">'
          + '<div class="list__controls" style="display:none">'
          + '<a class="btn btn-link configuration-edit-button">Edit</a>'
          + '<a class="btn btn-link configuration-remove-button">Remove</a>'
          + '</div>'
          + '<p class="configuration-title">' + configTitle + '</p>'
          + '</div>';
      }

      return '<div class="venue__list--item' + (isSelectedVenue ? ' selected' : '') + '">'
        + '<div class="list__controls" style="display:none">'
        + '<a class="btn btn-link venue-remove-button">Remove</a>'
        + '</div>'
        + '<div>'
        + '<p class="venue-name' + (isSelectedVenue ? ' selected' : '') + '">' + escapeHtml(venue.name) + '</p>'
        + '<p class="venue-type">(' + escapeHtml(venue.type || 'Indoor') + ')</p>'
        + '</div>'
        + '<div class="configuration__list">' + configsHtml + '</div>'
        + '</div>';
    }).join('');

    return '<div class="list-item list-item-existing">'
      + '<div class="list__controls" style="display:none">'
      + '<a class="btn btn-link list-item__delete" data-bs-toggle="modal" data-bs-target="#modalRemoveLocation">Remove</a>'
      + '</div>'
      + '<p class="location-name text-bold">' + escapeHtml(data.name) + '</p>'
      + '<p class="location-address-street">' + escapeHtml(data.address) + ' | ' + escapeHtml(data.city) + ', ' + escapeHtml(data.state) + ' ' + escapeHtml(data.zip) + '</p>'
      + '<div class="venue__list">' + venuesHtml + '</div>'
      + '</div>';
  }

  // ── Show / clear saved state ───────────────────────────────────────────────

  function showSaved(data, selectedCourseIdx) {
    if (savedItems) savedItems.innerHTML = renderSavedLocation(data, selectedCourseIdx);

    var courses = [];
    try { courses = JSON.parse(data.courses || '[]'); } catch (e) {}
    var selectedCourse = courses[selectedCourseIdx] || null;

    searchPanel.style.display = 'none';
    savedPanel.style.display  = '';
    setCourseDescriptionSelected(selectedCourse);

    if (sectionEl)      sectionEl.classList.remove('hasNoData');
    if (sectionEditBtn) sectionEditBtn.textContent = data.name;

    setEditMode(false);
  }

  function clearSaved() {
    searchPanel.style.display = '';
    savedPanel.style.display  = 'none';
    setCourseDescriptionDefault();

    if (sectionEl)      sectionEl.classList.add('hasNoData');
    if (sectionEditBtn) sectionEditBtn.textContent = '';

    setEditMode(false);
  }

  // ── Edit / Done Editing / Cancel ───────────────────────────────────────────

  function setEditMode(on) {
    if (!editLocationBtn || !doneEditBtn || !cancelBtn) return;
    editLocationBtn.style.display = on ? 'none' : '';
    doneEditBtn.style.display     = on ? '' : 'none';
    cancelBtn.style.display       = on ? '' : 'none';

    // Show/hide list__controls inside the saved item
    var controls = (savedItems || document).querySelectorAll('.list__controls');
    controls.forEach(function (el) { el.style.display = on ? '' : 'none'; });
  }

  if (editLocationBtn) {
    editLocationBtn.addEventListener('click', function () { setEditMode(true); });
  }

  if (doneEditBtn) {
    doneEditBtn.addEventListener('click', function () { setEditMode(false); });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () { setEditMode(false); });
  }

  // ── Course Description content ─────────────────────────────────────────────

  var defaultCourseDescHtml = '<div class="list-item list-item-default">'
    + '<p class="course-description-link">Once a pool configuration is selected, a course description will be shown. After selection, if you feel this description is not accurate, please contact <a href="mailto:events@usmastersswimming.org">events@usmastersswimming.org</a>.</p>'
    + '</div>';

  function deriveCourseDescription(course) {
    if (!course) return defaultCourseDescHtml;
    var text;
    if (course.certified && course.bulkhead) {
      text = 'The length of the competition course is in compliance and on file with USMS in accordance with articles 105.1.7 and 106.2.1, but as a bulkhead course, is subject to length confirmation. Eligibility of times for USMS Top 10 and records will be contingent on verification of bulkhead placement.';
    } else if (course.certified) {
      text = 'The length of the competition course without a bulkhead is in compliance and on file with USMS in accordance with articles 105.1.7 and 106.2.1.';
    } else if (course.measured) {
      text = 'The length of the competition course has been measured and is NOT in compliance with USMS articles 105.1.7 and 106.2.1: Times achieved in the meet will NOT be eligible for USMS Top 10 and records.';
    } else {
      text = 'The length of the competition course is not on file with USMS. Eligibility of times achieved in this meet will be contingent upon pool length measurement and approval with USMS; if bulkheads are present, their placement must also be confirmed by measurements at the meet (USMS articles 105.1.7 and 106.2.1).';
    }
    return '<div class="list-item"><p>' + text + '</p></div>';
  }

  function setCourseDescriptionDefault() {
    if (courseDescContent) courseDescContent.innerHTML = defaultCourseDescHtml;
  }

  function setCourseDescriptionSelected(course) {
    if (courseDescContent) courseDescContent.innerHTML = deriveCourseDescription(course);
  }

  if (confirmRemove) {
    confirmRemove.addEventListener('click', function () {
      var modal = bootstrap.Modal.getInstance(document.getElementById('modalRemoveLocation'));
      if (modal) modal.hide();
      clearSaved();
    });
  }

  // ── Select button → open modal ─────────────────────────────────────────────

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-select-location');
    if (!btn) return;
    var item = btn.closest('.list-item[data-location-id]');
    if (!item) return;
    pendingLocation = item.dataset;
    populateSelectionModal(pendingLocation);
    var modal = new bootstrap.Modal(document.getElementById('modalCourseSelection'));
    modal.show();
  });

  // ── Confirm selection ──────────────────────────────────────────────────────

  if (confirmSelect) {
    confirmSelect.addEventListener('click', function () {
      if (!pendingLocation) return;
      var selectedRadio = document.querySelector('#modalCourseSelection input[type="radio"]:checked');
      var courseIdx = selectedRadio ? parseInt(selectedRadio.value, 10) : 0;
      var modal = bootstrap.Modal.getInstance(document.getElementById('modalCourseSelection'));
      if (modal) modal.hide();
      showSaved(pendingLocation, courseIdx);
      pendingLocation = null;
    });
  }

  // ── Loader ────────────────────────────────────────────────────────────────

  var loaderEl = document.querySelector('.loading');

  function withLoader(fn) {
    if (loaderEl) loaderEl.style.display = 'flex';
    setTimeout(function () {
      fn();
      if (loaderEl) loaderEl.style.display = 'none';
    }, 400);
  }

  // ── Filtering (from pool-lookup.js) ───────────────────────────────────────

  var userLat = null;
  var userLng = null;
  var _placesSelected = false;

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
      _placesSelected = true;
      withLoader(applyFilters);
    });
  }
  window.initEventPlaces = initPlaces;
  if (window.google && window.google.maps) initPlaces();

  if (locationInput) {
    locationInput.addEventListener('focus', function () {
      this.value = '';
      userLat = null;
      userLng = null;
      _placesSelected = false;
    });
    locationInput.addEventListener('input', function () {
      userLat = null;
      userLng = null;
      _placesSelected = false;
    });
  }

  function parseLocation(raw) {
    var s = (raw || '').trim();
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

  function getSelectedRange() {
    if (!rangeSelect) return null;
    var val = rangeSelect.value;
    return val === 'max' ? null : parseFloat(val);
  }

  function locMatchesDistance(loc, rangeMiles) {
    if (rangeMiles === null) return true;
    if (userLat === null || userLng === null) return true;
    var itemLat = parseFloat(loc.lat);
    var itemLng = parseFloat(loc.lng);
    if (isNaN(itemLat) || isNaN(itemLng)) return false;
    return haversine(userLat, userLng, itemLat, itemLng) <= rangeMiles;
  }

  function locMatchesCourses(loc, checkedValues) {
    if (!checkedValues.length) return true;
    var courses  = loc.courses || [];
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

  function updateSummary(count) {
    if (summaryCount) summaryCount.textContent = count;
    if (summaryRange && rangeSelect) {
      summaryRange.textContent = rangeSelect.options[rangeSelect.selectedIndex].text;
    }
    if (summaryLoc && locationInput) {
      summaryLoc.textContent = locationInput.value.trim() || 'Nationwide';
    }
  }

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

    if (locationColumn) locationColumn.innerHTML = matched.map(renderCard).join('');
    updateSummary(matched.length);
  }

  if (submitBtn) submitBtn.addEventListener('click', function () {
    geocodeAddress(locationInput ? locationInput.value : '');
  });

  if (nameInput) {
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') withLoader(applyFilters);
    });
  }

  if (locationInput) {
    locationInput.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      setTimeout(function () {
        if (!_placesSelected) geocodeAddress(locationInput.value);
      }, 50);
    });
  }

  if (rangeSelect) rangeSelect.addEventListener('change', function () { withLoader(applyFilters); });

  courseBoxes.forEach(function (cb) { cb.addEventListener('change', function () { withLoader(applyFilters); }); });

  // ── Timing System statement toggle ────────────────────────────────────────

  var timingTextMap = {
    'Automatic_with_semiautomatic_backup':                          'Times from this competition will be eligible for world record, USMS record, and Top 10 consideration. For more information, see 103.18.9 in the USMS Rule Book.',
    'Semiautomatic_with_manual_backup_of_at_least2valid_watches':   'Times from this competition will be eligible for USMS records and Top 10 consideration, but not for world records. For more information, see 103.18.9 in the USMS Rule Book.',
    'Semiautomatic_with_manual_backup_of1valid_watch':              'Times from this competition will be eligible for USMS records and Top 10 consideration, but not for world records. For more information, see 103.18.9 in the USMS Rule Book.',
    'Manual_with_at_least2valid_watches':                           'Times from this competition will be eligible for USMS Top 10 consideration, but not for world or USMS records. For more information, see 103.18.9 in the USMS Rule Book.',
    'Manual_with1valid_watch':                                      'Times from this competition will not be eligible for world record, USMS record, or Top 10 consideration. For more information, see 103.18.9 in the USMS Rule Book.',
    'Automatic_with_manual_backup_of_at_least2valid_watches_only':  'Times from this competition will not be eligible for world record, USMS record, or Top 10 consideration. For more information, see 103.18.9 in the USMS Rule Book.'
  };
  var defaultTimingText = 'Please review 103.18.5—103.18.9 in the USMS Rule Book for more information on these statements. They are based on your timing system set up and usage.';

  var timingSelect = document.getElementById('selectTimingSystem');
  if (timingSelect) {
    timingSelect.addEventListener('change', function () {
      var timingText = document.querySelector('.timing-system-note .timing-system-text');
      if (!timingText) return;
      timingText.textContent = timingTextMap[this.value] || defaultTimingText;
    });
  }

  // ── Section open/close → isEdit class ────────────────────────────────────

  var collapseEl = document.getElementById('location-information__content');
  if (collapseEl && sectionEl) {
    collapseEl.addEventListener('show.bs.collapse',   function () { sectionEl.classList.add('isEdit'); });
    collapseEl.addEventListener('hide.bs.collapse',   function () { sectionEl.classList.remove('isEdit'); });
  }

  // ── Init: geocode default location then render ─────────────────────────────

  function geocodeAddress(address) {
    if (!address) { withLoader(applyFilters); return; }
    if (loaderEl) loaderEl.style.display = 'flex';
    var start = Date.now();
    function done() {
      var wait = Math.max(0, 400 - (Date.now() - start));
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
