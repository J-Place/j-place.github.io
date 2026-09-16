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

  var dataEl = document.getElementById('events-data');
  if (!dataEl) return;
  var allEvents = JSON.parse(dataEl.textContent);

  // Keep the baked-in scrape as an enrichment lookup (venue/course/sanction data
  // that production's live search API doesn't return) once the live list loads.
  var enrichmentByUrl = {};
  allEvents.forEach(function (item) { enrichmentByUrl[item.url] = item; });

  var LIVE_EVENTS_URL = 'https://www.usms.org/apis/v1/ctsearch?contentType%5B0%5D=event&filter=&placeText=&startDate=&endDate=&page=1&perPage=200&filterType=showall';

  var pageSizeEl = document.getElementById('events-page-size');
  var pageSize   = pageSizeEl ? JSON.parse(pageSizeEl.textContent) : 10;

  var mapsKeyEl = document.getElementById('google-maps-key');
  var mapsKey   = mapsKeyEl ? JSON.parse(mapsKeyEl.textContent) : '';

  var courseAbbr = { 'OPEN WATER': 'OW', 'SHORT COURSE YARDS': 'SCY', 'SHORT COURSE METERS': 'SCM', 'LONG COURSE METERS': 'LCM' };

  var stateAbbr = {
    'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
    'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
    'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA',
    'Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD',
    'Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS',
    'Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV',
    'New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY',
    'North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
    'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
    'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
    'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI',
    'Wyoming':'WY','District of Columbia':'DC'
  };

  var largeList  = document.querySelector('.results-list-large');
  var smallList  = document.querySelector('.results-list-small');
  var pagination = document.querySelector('.results-list__pagination-container ul');
  if (!largeList) return;

  // ── Inputs ─────────────────────────────────────────────────────────────────

  var nameInput      = document.querySelector('input[name="filter-name"]');
  var rangeSelect     = document.getElementById('search-filter__range');
  var locationInput   = document.getElementById('location');
  var submitBtn       = document.getElementById('listSearchSubmit');
  var startDateInput  = document.querySelector('input[name="startDate"]');
  var endDateInput    = document.querySelector('input[name="endDate"]');
  var courseBoxes     = document.querySelectorAll('.check-list--course-type input[type="checkbox"]');
  var detailBoxes     = document.querySelectorAll('.check-list--other-event-details input[type="checkbox"]');
  var sanctionBoxes   = document.querySelectorAll('.check-list--sanction-type input[type="checkbox"]');
  var virtualBox      = document.getElementById('ShowVirtualEvents');

  var resultsCountEl = document.getElementById('resultsCount');
  var rangePrefixEl  = document.getElementById('rangePrefix');
  var rangeTextEl    = document.getElementById('rangeText');
  var cityStateTextEl = document.getElementById('cityStateText');

  var userLat = null;
  var userLng = null;
  var currentPage = 0;
  var lastMatched = allEvents.slice();

  // ── Helpers ────────────────────────────────────────────────────────────────

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseMDY(str) {
    if (!str) return null;
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(str.trim());
    if (!m) return null;
    var d = new Date(parseInt(m[3], 10), parseInt(m[1], 10) - 1, parseInt(m[2], 10));
    return isNaN(d.getTime()) ? null : d;
  }

  function parseEventDate(item) {
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(item.startDate || '');
    if (!m) return null;
    return new Date(parseInt(m[3], 10), parseInt(m[1], 10) - 1, parseInt(m[2], 10));
  }

  function checkedValues(boxes) {
    var vals = [];
    boxes.forEach(function (cb) { if (cb.checked) vals.push(cb.value); });
    return vals;
  }

  function getRange() {
    if (!rangeSelect) return null;
    var v = rangeSelect.value;
    return v === 'max' ? null : parseFloat(v);
  }

  // Merge a raw production search-result item with our scraped enrichment
  // (venue/course/sanction) when the URL matches a previously scraped event.
  // Events added on production since our last scrape have no enrichment —
  // they still show (title/date/location filter by distance still works),
  // just without venue name, course badge, or sanction badge.
  function normalizeLiveEvent(raw) {
    var known = enrichmentByUrl[raw.url];
    var lat = raw.lat, long = raw.long;
    var isVirtual = !lat || !long || parseFloat(lat) === 0;

    if (known) {
      return {
        contentType: 'event',
        title: raw.title,
        url: raw.url,
        startDate: raw.startDate,
        formattedDate: raw.formattedDate,
        lat: lat,
        long: long,
        venueName: known.venueName,
        venueAddress: known.venueAddress,
        venueCity: known.venueCity,
        venueState: known.venueState,
        venueZip: known.venueZip,
        courseType: known.courseType,
        courseTypeValue: known.courseTypeValue,
        classification: known.classification,
        classificationValue: known.classificationValue,
        image: known.image,
        virtual: known.virtual,
        championship: !!raw.championship,
        internationalEvent: !!raw.internationEvent,
        clinic: /\bclinic\b/i.test(raw.title || '')
      };
    }

    return {
      contentType: 'event',
      title: raw.title,
      url: raw.url,
      startDate: raw.startDate,
      formattedDate: raw.formattedDate,
      lat: lat,
      long: long,
      venueName: null,
      venueAddress: null,
      venueCity: null,
      venueState: null,
      venueZip: null,
      courseType: null,
      courseTypeValue: null,
      classification: null,
      classificationValue: null,
      image: null,
      virtual: isVirtual,
      championship: !!raw.championship,
      internationalEvent: !!raw.internationEvent,
      clinic: /\bclinic\b/i.test(raw.title || '')
    };
  }

  function loadLiveEvents() {
    fetch(LIVE_EVENTS_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var items = data && data.data && data.data.items;
        if (!items || !items.length) return;
        allEvents = items.map(normalizeLiveEvent);
        applyFilters();
      })
      .catch(function () {
        // Live fetch failed (offline, network error, API change) — keep
        // rendering from the baked-in scrape already loaded above.
      });
  }

  function mapImageUrl(item) {
    // Production's own uploaded event image (hotlinked from its CDN, same as
    // club badges elsewhere in this project) when the event has one. Otherwise
    // a live Static Maps call using our own key (keys.googleMaps — already
    // exposed client-side for the club-detail Maps JS embed; requires Static
    // Maps API enabled on that key, see CLAUDE.md).
    if (item.image) return item.image;
    if (item.virtual || !item.lat || !item.long || item.lat === '0') return '';
    return 'https://maps.googleapis.com/maps/api/staticmap?markers=size:tiny%7C' +
      item.lat + ',' + item.long + '&zoom=12&size=360x270&maptype=roadmap&scale=1&key=' + mapsKey;
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  function renderLarge(item) {
    var courseClass = String(item.courseType || '').toLowerCase().replace(/ /g, '-');
    var location = (!item.virtual && (item.venueName || item.venueAddress))
      ? '<p class="results-list__item-location">' + esc(item.venueName) + '<br>' +
        esc(item.venueAddress) + ', ' + esc(item.venueCity) + ', ' + esc(item.venueState) + ' ' + esc(item.venueZip) + '</p>'
      : '';
    var badge = (item.classification && item.classification !== 'Not Sanctioned' && item.classification !== 'Pending')
      ? '<div class="results-list__event-status--' + String(item.classification).toLowerCase().replace(/ /g, '') + '">' + esc(item.classification) + '</div>'
      : '';

    return (
      '<div class="results-list__item">' +
        '<div class="results-list__item-detail" role="main">' +
          '<div class="results-list__item-type--container">' +
            '<div class="results-list__item-type item-type--course-' + courseClass + ' text-uppercase">' + esc(item.courseType) + '</div>' +
          '</div>' +
          '<h3 class="results-list__item-title"><a href="' + esc(item.url) + '">' + esc(item.title) + '</a></h3>' +
          '<div class="results-list__item-date">' + esc(item.formattedDate) + '</div>' +
          location +
          '<div class="results-list__item-footer"><a href="' + esc(item.url) + '">More Info</a></div>' +
        '</div>' +
        '<a class="results-list__item-image-container" href="' + esc(item.url) + '">' +
          '<div class="results-list__item-image" style="background-image: url(\'' + mapImageUrl(item) + '\');">' + badge + '</div>' +
        '</a>' +
      '</div>'
    );
  }

  function renderSmall(item) {
    var abbr = courseAbbr[String(item.courseType || '').toUpperCase()] || item.courseType;
    var location = (!item.virtual && (item.venueCity || item.venueState))
      ? '<p class="results-list__item-location">' + esc(item.venueCity) + ', ' + esc(item.venueState) + '</p>'
      : '';
    var status = (item.classification && item.classification !== 'Not Sanctioned' && item.classification !== 'Pending')
      ? '<p class="results-list__item-status sanctioned">' + esc(item.classification) + '</p>'
      : '';

    return (
      '<a href="' + esc(item.url) + '">' +
        '<div class="results-list__item-detail">' +
          '<p class="results-list__item-date">' + esc(item.formattedDate) + '</p>' +
          '<p class="results-list__item-type">' + esc(abbr) + '</p>' +
          '<h3 class="results-list__item-title">' + esc(item.title) + '</h3>' +
          location +
          status +
        '</div>' +
      '</a>'
    );
  }

  function renderPagination(totalPages) {
    if (!pagination) return;
    var container = pagination.closest('.results-list__pagination-container');
    // Matches production: no page controls at all when everything fits on one page.
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      if (container) container.style.display = 'none';
      return;
    }
    if (container) container.style.display = '';

    var html = '';
    html += '<li><button class="btn btn-chevron-left" data-page="' + (currentPage - 1) + '"' +
      (currentPage === 0 ? ' disabled' : '') + '><i class="fa-solid fa-chevron-left"></i></button></li>';
    for (var p = 0; p < totalPages; p++) {
      html += '<li><button class="btn btn-results-' + p + (p === currentPage ? ' btn-active' : '') +
        '" data-page="' + p + '">' + (p + 1) + '</button></li>';
    }
    html += '<li><button class="btn btn-chevron-right" data-page="' + (currentPage + 1) + '"' +
      (currentPage === totalPages - 1 ? ' disabled' : '') + '><i class="fa-solid fa-chevron-right"></i></button></li>';
    pagination.innerHTML = html;
  }

  function render(matched) {
    var totalPages = Math.max(1, Math.ceil(matched.length / pageSize));
    if (currentPage >= totalPages) currentPage = totalPages - 1;
    if (currentPage < 0) currentPage = 0;

    var pageItems = matched.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    largeList.innerHTML = pageItems.map(renderLarge).join('');
    if (smallList) smallList.innerHTML = pageItems.map(renderSmall).join('');
    renderPagination(totalPages);

    if (resultsCountEl) {
      resultsCountEl.textContent = matched.length + (matched.length === 1 ? ' Event' : ' Events');
    }
    var rangeMiles = getRange();
    var locText = locationInput && locationInput.value.trim();
    if (userLat !== null && locText) {
      if (rangePrefixEl) rangePrefixEl.textContent = ' within ';
      if (rangeTextEl) rangeTextEl.textContent = rangeSelect.options[rangeSelect.selectedIndex].text;
      if (cityStateTextEl) cityStateTextEl.textContent = ' of ' + locText;
    } else {
      if (rangePrefixEl) rangePrefixEl.textContent = '';
      if (rangeTextEl) rangeTextEl.textContent = '';
      if (cityStateTextEl) cityStateTextEl.textContent = '';
    }
  }

  // ── Filters ────────────────────────────────────────────────────────────────

  function applyFilters() {
    var nameQuery   = nameInput ? nameInput.value.trim().toLowerCase() : '';
    var rangeMiles  = getRange();
    var courseVals   = checkedValues(courseBoxes);
    var detailVals   = checkedValues(detailBoxes);
    var sanctionVals = checkedValues(sanctionBoxes);
    var showVirtual  = virtualBox ? virtualBox.checked : false;
    var startDate    = parseMDY(startDateInput ? startDateInput.value : '');
    var endDate      = parseMDY(endDateInput ? endDateInput.value : '');
    var haveLocation = userLat !== null && userLng !== null;

    var matched = allEvents.filter(function (item) {
      if (item.virtual && !showVirtual) return false;

      if (nameQuery && item.title.toLowerCase().indexOf(nameQuery) === -1) return false;

      if (courseVals.length && courseVals.indexOf(item.courseTypeValue) === -1) return false;

      if (sanctionVals.length && sanctionVals.indexOf(item.classificationValue) === -1) return false;

      if (detailVals.length) {
        var detailOk = detailVals.some(function (v) {
          if (v === 'Championship') return item.championship;
          if (v === 'InternationalEvent') return item.internationalEvent;
          if (v === 'Clinic') return item.clinic;
          return false;
        });
        if (!detailOk) return false;
      }

      if (haveLocation && rangeMiles !== null && !item.virtual) {
        var lat = parseFloat(item.lat), lng = parseFloat(item.long);
        if (isNaN(lat) || isNaN(lng)) return false;
        if (haversine(userLat, userLng, lat, lng) > rangeMiles) return false;
      }

      var eventDate = parseEventDate(item);
      if (startDate && eventDate && eventDate < startDate) return false;
      if (endDate && eventDate && eventDate > endDate) return false;

      return true;
    });

    // Production sorts strictly by date within whatever range/filters apply —
    // not by distance (confirmed: the nearest of its 4 default results is not
    // the one shown first).
    matched.sort(function (a, b) {
      var da = parseEventDate(a), db = parseEventDate(b);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da - db;
    });

    lastMatched = matched;
    currentPage = 0;
    render(matched);
  }

  // ── Geocode via Nominatim ────────────────────────────────────────────────────

  function geocodeAndFilter(address) {
    if (!address || !address.trim()) {
      userLat = null;
      userLng = null;
      applyFilters();
      return;
    }

    fetch(
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=' +
        encodeURIComponent(address),
      { headers: { 'Accept-Language': 'en-US,en' } }
    )
    .then(function (r) { return r.json(); })
    .then(function (results) {
      if (results && results[0]) {
        userLat = parseFloat(results[0].lat);
        userLng = parseFloat(results[0].lon);
      } else {
        userLat = null;
        userLng = null;
      }
      applyFilters();
    })
    .catch(function () { applyFilters(); });
  }

  // ── Events ─────────────────────────────────────────────────────────────────

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      geocodeAndFilter(locationInput ? locationInput.value : '');
    });
  }

  if (nameInput) {
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') applyFilters();
    });
  }

  if (locationInput) {
    locationInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') geocodeAndFilter(locationInput.value);
    });
  }

  if (rangeSelect) {
    rangeSelect.addEventListener('change', function () {
      if (userLat !== null) applyFilters();
    });
  }

  if (startDateInput) startDateInput.addEventListener('change', applyFilters);
  if (endDateInput) endDateInput.addEventListener('change', applyFilters);

  document.addEventListener('filtersChanged', applyFilters);

  if (pagination) {
    pagination.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-page]');
      if (!btn || btn.disabled) return;
      var page = parseInt(btn.getAttribute('data-page'), 10);
      var totalPages = Math.max(1, Math.ceil(lastMatched.length / pageSize));
      if (isNaN(page) || page < 0 || page >= totalPages) return;
      currentPage = page;
      render(lastMatched);
      var container = document.querySelector('.results-content');
      if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  // Default to Sarasota (USMS HQ) so the list renders sorted/filtered
  // immediately, then refine to the visitor's IP-based location.
  var defaultLat = 27.3364, defaultLng = -82.5307;
  userLat = defaultLat;
  userLng = defaultLng;
  if (locationInput) locationInput.value = 'Sarasota, FL';

  applyFilters();
  loadLiveEvents();

  fetch('https://ipinfo.io/json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data || data.country !== 'US' || !data.loc) return;
      var coords = data.loc.split(',');
      userLat = parseFloat(coords[0]);
      userLng = parseFloat(coords[1]);
      if (locationInput && data.city && data.region) {
        var abbr = stateAbbr[data.region] || data.region;
        locationInput.value = data.city + ', ' + abbr;
      }
      applyFilters();
    })
    .catch(function () {});

}());
