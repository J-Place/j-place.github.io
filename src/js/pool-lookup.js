(function () {
  'use strict';

  // ── Modal ──────────────────────────────────────────────────────────────────

  var modal   = document.getElementById('modalPoolDetail');
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
          + '<td>' + (c.certified ? 'Yes' : 'No')    + '</td>'
          + '</tr>';
      }).join('');
      coursesEl.innerHTML =
        '<table class="table table-sm pool-detail__table">'
        + '<thead><tr>'
        + '<th>Course</th><th>Length</th><th>Type</th>'
        + '<th>Lanes</th><th>Touchpads</th><th>Certified</th>'
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
  var tagsContainer = document.querySelector('.list-control-search--tags');
  var rangeSelect   = document.getElementById('search-filter__range');
  var items         = document.querySelectorAll('.list-item[data-location-id]');
  var summaryCount  = document.querySelector('.summary-count');
  var summaryRange  = document.querySelector('.summary-range');
  var summaryLoc    = document.querySelector('.summary-location');

  var courseTagMap = { '25y': 'SCY', '25m': 'SCM', '50m': 'LCM' };

  var courseLabels = {
    '25y':   'Short Course Yards',
    '25m':   'Short Course Meters',
    '50m':   'Long Course Meters',
    'other': 'Other'
  };

  function syncTags() {
    if (!tagsContainer) return;
    tagsContainer.innerHTML = '';
    courseBoxes.forEach(function (cb) {
      if (!cb.checked) return;
      var tag = document.createElement('span');
      tag.className = 'tag-list--item';
      tag.textContent = courseLabels[cb.value] || cb.value;
      tag.dataset.courseValue = cb.value;
      tagsContainer.appendChild(tag);
    });
  }

  // Parse free-text location entry into a structured filter object.
  // Handles: ZIP (34239), state abbr (FL), "City, ST", plain city.
  function parseLocation(raw) {
    var s = raw.trim();
    if (!s) return null;

    if (/^\d{5}$/.test(s)) {
      return { zip: s };
    }

    if (s.indexOf(',') !== -1) {
      var parts = s.split(',');
      return {
        city:  parts[0].trim().toLowerCase(),
        state: parts[1].trim().toLowerCase()
      };
    }

    if (/^[a-zA-Z]{2}$/.test(s)) {
      return { state: s.toLowerCase() };
    }

    return { city: s.toLowerCase() };
  }

  function itemMatchesLocation(item, parsed) {
    if (!parsed) return true;

    if (parsed.zip) {
      return (item.dataset.zip || '') === parsed.zip;
    }

    var cityOk  = !parsed.city  || (item.dataset.city  || '').toLowerCase().includes(parsed.city);
    var stateOk = !parsed.state || (item.dataset.state || '').toLowerCase().includes(parsed.state);
    return cityOk && stateOk;
  }

  function updateSummary(count) {
    if (summaryCount) summaryCount.textContent = count;

    if (summaryRange && rangeSelect) {
      var rangeVal = rangeSelect.options[rangeSelect.selectedIndex].text;
      summaryRange.textContent = rangeVal;
    }

    if (summaryLoc && locationInput) {
      var loc = locationInput.value.trim();
      summaryLoc.textContent = loc || 'Nationwide';
    }
  }

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

  function applyFilters() {
    var nameQuery = nameInput     ? nameInput.value.trim().toLowerCase() : '';
    var parsedLoc = locationInput ? parseLocation(locationInput.value)   : null;

    var checkedValues = [];
    courseBoxes.forEach(function (cb) { if (cb.checked) checkedValues.push(cb.value); });

    var visible = 0;
    items.forEach(function (item) {
      var nameOk    = !nameQuery || (item.dataset.name || '').toLowerCase().includes(nameQuery);
      var locOk     = itemMatchesLocation(item, parsedLoc);
      var courseOk  = itemMatchesCourses(item, checkedValues);
      var show      = nameOk && locOk && courseOk;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    updateSummary(visible);
  }

  submitBtn.addEventListener('click', applyFilters);

  // Trigger on Enter in either text input
  [nameInput, locationInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') applyFilters();
    });
  });

  // Checkboxes filter immediately on change and sync tags
  courseBoxes.forEach(function (cb) {
    cb.addEventListener('change', function () {
      syncTags();
      applyFilters();
    });
  });

  // Clicking a tag pill unchecks the corresponding checkbox and re-filters
  if (tagsContainer) {
    tagsContainer.addEventListener('click', function (e) {
      var tag = e.target.closest('.tag-list--item');
      if (!tag) return;
      var val = tag.dataset.courseValue;
      courseBoxes.forEach(function (cb) {
        if (cb.value === val) cb.checked = false;
      });
      syncTags();
      applyFilters();
    });
  }

  // Default filter: Tampa, FL
  if (locationInput) locationInput.value = 'Tampa, FL';
  syncTags();
  applyFilters();

}());
