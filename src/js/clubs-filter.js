window.initClubMap = function () {};

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

  function roundCoord(coord) {
    return Math.floor(Number(coord) * 1000 + 0.5) / 1000;
  }

  // ── Data ───────────────────────────────────────────────────────────────────

  var dataEl = document.getElementById('clubs-data');
  if (!dataEl) return;
  var allClubs = JSON.parse(dataEl.textContent);

  var clubList = document.querySelector('.club-list-new');
  var summary  = document.querySelector('.list-control-search--summary');
  if (!clubList) return;

  // ── Inputs ─────────────────────────────────────────────────────────────────

  var nameInput     = document.querySelector('input[name="search-filter__club-name"]');
  var locationInput = document.getElementById('location');
  var rangeSelect   = document.getElementById('search-filter__range');
  var submitBtn     = document.getElementById('listSearchSubmit');
  var loaderEl      = document.querySelector('.loading');
  var certBoxes     = document.querySelectorAll('.check-list--certifications input[type="checkbox"]');
  var facilityBoxes = document.querySelectorAll('.check-list--facility-type input[type="checkbox"]');
  var poolLenBoxes  = document.querySelectorAll('.check-list--pool-length input[type="checkbox"]');

  var userLat  = null;
  var userLng  = null;
  var mapReady       = false;
  var keepMapView    = false;  // true when Search This Area triggered the search
  var searchZoom     = null;   // zoom level recorded after each applyFilters

  // ── State ──────────────────────────────────────────────────────────────────

  var lastMatchedClubs = [];

  // ── Helpers ────────────────────────────────────────────────────────────────

  var markerOrange = '/img/marker_orange.webp';
  var markerBlue   = '/img/marker_blue.webp';

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  function renderClub(club) {
    var markerImg = club.isGold ? markerOrange : markerBlue;

    var locations = (club.location || []).map(function (loc, i) {
      var dist = '';
      if (userLat !== null && userLng !== null) {
        var lat = parseFloat(loc.lat);
        var lng = parseFloat(loc.long);
        if (!isNaN(lat) && !isNaN(lng)) {
          dist = Math.round(haversine(userLat, userLng, lat, lng)) + ' mi.';
        }
      } else if (loc.distance) {
        dist = Math.round(loc.distance) + ' mi.';
      }

      return (
        '<button type="button" class="club-list-item-new__locations-item"' +
            ' data-club-id="' + esc(club.id) + '" data-loc-index="' + i + '">' +
          '<div class="row">' +
            '<div class="col-2">' +
              '<div class="club-list-item-new__marker-container">' +
                '<div class="club-list-item-new__marker">' +
                  '<img src="' + markerImg + '" alt="Map pin">' +
                '</div>' +
                (dist ? '<p class="club-list-item-new__distance text-center">' + esc(dist) + '</p>' : '') +
              '</div>' +
            '</div>' +
            '<div class="col-10">' +
              '<h5 class="club-list-item-new__locations-item--name">' + esc(loc.name || '') + '</h5>' +
              '<p>' + esc(loc.address1 || '') + '</p>' +
              (loc.address2 ? '<p>' + esc(loc.address2) + '</p>' : '') +
              '<p>' + esc(loc.city) + ', ' + esc(loc.state) + ' ' + esc(loc.zip) + '</p>' +
            '</div>' +
          '</div>' +
        '</button>'
      );
    }).join('');

    var badges = (club.badges || []).slice(0, 3).map(function (badge) {
      return (
        '<div class="club-list-item-new__badge-item">' +
          '<img class="club-list-item-new__badge" src="' + esc(badge.src) + '" alt="' + esc(badge.alt) + '">' +
          '<p class="text-center">' + esc(badge.label) + '</p>' +
        '</div>'
      );
    }).join('');

    return (
      '<li class="club-list-item-new">' +
        '<input type="hidden" value="' + esc(club.id) + '">' +
        '<a href="' + esc(club.url) + '" class="club-list-item-new__title-link">' +
          '<h4 class="club-list-item-new__title">' + esc(club.title) + (club.abbreviation ? ' (' + esc(club.abbreviation) + ')' : '') + '</h4>' +
        '</a>' +
        '<div class="club-list-item-new__locations">' + locations + '</div>' +
        '<div class="club-list-item-new__badges-container">' + badges + '</div>' +
        '<a href="' + esc(club.url) + '" class="club-list-item-new__details-link">' +
          '<button type="button" class="club-list-item-new__action">Club Details</button>' +
        '</a>' +
      '</li>'
    );
  }

  // ── Filters ────────────────────────────────────────────────────────────────

  function getRange() {
    if (!rangeSelect) return null;
    var v = rangeSelect.value;
    return v === 'max' ? null : parseFloat(v);
  }

  function nearestDistance(club) {
    if (userLat === null || userLng === null) return Infinity;
    var min = Infinity;
    (club.location || []).forEach(function (loc) {
      var lat = parseFloat(loc.lat);
      var lng = parseFloat(loc.long);
      if (!isNaN(lat) && !isNaN(lng)) {
        var d = haversine(userLat, userLng, lat, lng);
        if (d < min) min = d;
      }
    });
    return min;
  }

  function clubMatchesDistance(club, rangeMiles) {
    if (rangeMiles === null) return true;
    if (userLat === null || userLng === null) return true;
    return (club.location || []).some(function (loc) {
      var lat = parseFloat(loc.lat);
      var lng = parseFloat(loc.long);
      if (isNaN(lat) || isNaN(lng)) return false;
      return haversine(userLat, userLng, lat, lng) <= rangeMiles;
    });
  }

  // OR logic: club matches if it satisfies ANY checked cert (matches Algolia facet behavior)
  function clubMatchesCerts(club, checkedValues) {
    if (!checkedValues.length) return true;
    var badgeAlts = (club.badges || []).map(function (b) { return b.alt; });
    return checkedValues.some(function (val) {
      if (val === 'gc')   return club.isGold === true;
      if (val === 'sslf') return club.sslf === true;
      if (val === 'cc')   return badgeAlts.indexOf('USMS-certified-coach') !== -1;
      if (val === 'alts') return badgeAlts.indexOf('USMS-alts-instructor') !== -1;
      return false;
    });
  }

  function clubMatchesFacility(club, checked) {
    if (!checked.length) return true;
    var types = club.poolTypes || [];
    return checked.some(function (val) { return types.indexOf(val) !== -1; });
  }

  function clubMatchesPoolLen(club, checked) {
    if (!checked.length) return true;
    var lengths = club.poolLengths || [];
    return checked.some(function (val) { return lengths.indexOf(val) !== -1; });
  }

  // ── URL state ──────────────────────────────────────────────────────────────

  function syncUrl() {
    var params = new URLSearchParams();
    var name  = nameInput ? nameInput.value.trim() : '';
    var place = locationInput ? locationInput.value.trim() : '';
    var range = rangeSelect ? rangeSelect.value : '25';

    if (name)  params.set('q', name);
    if (place) params.set('placeText', place);
    if (userLat !== null) params.set('lat', userLat);
    if (userLng !== null) params.set('long', userLng);
    if (range && range !== '25') params.set('r', range);

    var certs = [];
    certBoxes.forEach(function (cb)     { if (cb.checked) certs.push(cb.value); });
    var pts   = [];
    facilityBoxes.forEach(function (cb) { if (cb.checked) pts.push(cb.value); });
    var lens  = [];
    poolLenBoxes.forEach(function (cb)  { if (cb.checked) lens.push(cb.value); });

    if (certs.length) params.set('c', certs.join(','));
    if (pts.length)   params.set('pt', pts.join(','));
    if (lens.length)  params.set('l', lens.join(','));

    var str = params.toString();
    history.replaceState({}, '', str ? ('?' + str) : window.location.pathname);
  }

  function readUrlParams() {
    if (!document.location.search) return;
    var params = new URLSearchParams(document.location.search);

    var name = params.get('q');
    if (name && nameInput) nameInput.value = decodeURIComponent(name);

    var place = params.get('placeText');
    if (place && locationInput) locationInput.value = decodeURIComponent(place);

    var lat = params.get('lat'), lng = params.get('long');
    if (lat && lng) { userLat = parseFloat(lat); userLng = parseFloat(lng); }

    var range = params.get('r');
    if (range && rangeSelect) rangeSelect.value = range;

    var cStr = params.get('c');
    if (cStr) cStr.split(',').forEach(function (v) {
      certBoxes.forEach(function (cb) { if (cb.value === v) cb.checked = true; });
    });

    var ptStr = params.get('pt');
    if (ptStr) ptStr.split(',').forEach(function (v) {
      facilityBoxes.forEach(function (cb) { if (cb.value === v) cb.checked = true; });
    });

    var lStr = params.get('l');
    if (lStr) lStr.split(',').forEach(function (v) {
      poolLenBoxes.forEach(function (cb) { if (cb.value === v) cb.checked = true; });
    });
  }

  // ── Apply ──────────────────────────────────────────────────────────────────

  function applyFilters() {
    var nameQuery      = nameInput ? nameInput.value.trim().toLowerCase() : '';
    var rangeMiles     = getRange();
    var checkedCerts   = [];
    var checkedFacility = [];
    var checkedPoolLen  = [];
    certBoxes.forEach(function (cb)     { if (cb.checked) checkedCerts.push(cb.value); });
    facilityBoxes.forEach(function (cb) { if (cb.checked) checkedFacility.push(cb.value); });
    poolLenBoxes.forEach(function (cb)  { if (cb.checked) checkedPoolLen.push(cb.value); });

    var matched = allClubs.filter(function (club) {
      var nameOk     = !nameQuery || club.title.toLowerCase().indexOf(nameQuery) !== -1;
      var distOk     = clubMatchesDistance(club, rangeMiles);
      var certOk     = clubMatchesCerts(club, checkedCerts);
      var facilityOk = clubMatchesFacility(club, checkedFacility);
      var poolLenOk  = clubMatchesPoolLen(club, checkedPoolLen);
      return nameOk && distOk && certOk && facilityOk && poolLenOk;
    });

    // Sort by distance first, then float gold clubs to top (matches production)
    if (userLat !== null && userLng !== null) {
      matched.sort(function (a, b) { return nearestDistance(a) - nearestDistance(b); });
    }
    matched.sort(function (a, b) {
      if (a.isGold && !b.isGold) return -1;
      if (!a.isGold && b.isGold) return 1;
      return 0;
    });

    lastMatchedClubs = matched;

    if (matched.length) {
      clubList.className = 'club-list-new list--nostyle';
      clubList.innerHTML = matched.map(renderClub).join('');
    } else {
      var tpl = document.getElementById('no-clubs-tpl');
      clubList.className = 'club-list-new no-clubs-form no-clubs-form--finder list--nostyle';
      clubList.innerHTML = tpl ? tpl.textContent : '';
    }

    if (summary) {
      var count     = matched.length;
      var rangeText = rangeSelect
        ? rangeSelect.options[rangeSelect.selectedIndex].text
        : '25 Miles';
      var locText = locationInput && locationInput.value.trim()
        ? locationInput.value.trim()
        : '';
      summary.innerHTML =
        'Showing <strong>' + count + ' Club' + (count !== 1 ? 's' : '') + '</strong>' +
        (locText ? ' near <strong>' + esc(locText) + '</strong>' : '') +
        ' within <strong>' + rangeText + '</strong>';
    }

    syncUrl();

    if (matched.length) {
      updateMapMarkers(matched);
    } else {
      clearMarkers();
    }

    mapReady    = true;
    keepMapView = false;
    if (map) searchZoom = map.getZoom();
  }

  // ── Map ────────────────────────────────────────────────────────────────────

  var map            = null;
  var activeMarkers  = [];
  var markerMap      = {};  // key: "clubId:locIndex" → google.maps.Marker
  var openInfoWindow = null;

  function clearMarkers() {
    activeMarkers.forEach(function (m) { m.setMap(null); });
    activeMarkers = [];
    markerMap     = {};
    if (openInfoWindow) { openInfoWindow.close(); openInfoWindow = null; }
  }

  function showInfoWindow(marker, content) {
    if (openInfoWindow) openInfoWindow.close();
    openInfoWindow = new google.maps.InfoWindow({ content: content });
    openInfoWindow.open(map, marker);
  }

  function buildSingleInfoContent(club, loc) {
    return (
      '<div style="max-width:220px;padding:2px 0">' +
        '<h4 class="club-list-item-new__info-window--club-title" style="margin:0 0 4px;font-size:14px">' + esc(club.title) + '</h4>' +
        '<p class="club-list-item-new__info-window--location-name" style="margin:0;font-size:12px;color:#666">' + esc(loc.name || '') + '</p>' +
        '<p class="club-list-item-new__info-window--address" style="margin:2px 0 0;font-size:12px">' + esc(loc.address1 || '') + (loc.address2 ? ' ' + esc(loc.address2) : '') + '</p>' +
        '<p class="club-list-item-new__info-window--city-state-zip" style="margin:0;font-size:12px">' + esc(loc.city) + ', ' + esc(loc.state) + ' ' + esc(loc.zip) + '</p>' +
        '<p class="club-list-item-new__info-window--details" style="margin:4px 0 0"><a href="' + esc(club.url) + '" style="font-size:13px">Club Details</a></p>' +
      '</div>'
    );
  }

  function buildSharedInfoContent(sharedClubs, loc) {
    var links = sharedClubs.map(function (c) {
      return (
        '<a class="info-window-shared--link" href="' + esc(c.url) + '" style="display:flex;align-items:center;gap:6px;margin:4px 0;text-decoration:none">' +
          '<img class="info-window-shared--marker" src="' + (c.isGold ? markerOrange : markerBlue) + '" alt="Map pin" style="width:14px">' +
          '<h5 class="info-window-shared--club-title" style="margin:0;font-size:13px">' + esc(c.title) + '</h5>' +
        '</a>'
      );
    }).join('');
    return (
      '<div style="max-width:220px;padding:2px 0">' +
        '<p class="info-window-shared--street" style="margin:0 0 2px;font-size:12px"><strong>*Multiple Clubs at this location:</strong></p>' +
        '<p class="info-window-shared--street" style="margin:0;font-size:12px">' + esc(loc.address1 || '') + '</p>' +
        '<p class="info-window-shared--city-state-zip" style="margin:0 0 6px;font-size:12px">' + esc(loc.city) + ', ' + esc(loc.state) + ' ' + esc(loc.zip) + '</p>' +
        links +
      '</div>'
    );
  }

  function getClubsAtPosition(lat, lng) {
    var rLat = roundCoord(lat), rLng = roundCoord(lng);
    return lastMatchedClubs.filter(function (club) {
      return (club.location || []).some(function (loc) {
        return roundCoord(loc.lat) === rLat && roundCoord(loc.long) === rLng;
      });
    });
  }

  function updateMapMarkers(clubs) {
    if (!map) return;
    clearMarkers();

    if (userLat === null) {
      map.setCenter({ lat: 39.5, lng: -98.35 });
      map.setZoom(4);
      return;
    }

    var rangeMiles = getRange();

    clubs.forEach(function (club) {
      (club.location || []).forEach(function (loc, locIndex) {
        var lat = parseFloat(loc.lat);
        var lng = parseFloat(loc.long);
        if (isNaN(lat) || isNaN(lng)) return;
        if (rangeMiles !== null && haversine(userLat, userLng, lat, lng) > rangeMiles) return;

        var position = { lat: lat, lng: lng };
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          icon: club.isGold ? markerOrange : markerBlue,
          title: club.title
        });

        markerMap[club.id + ':' + locIndex] = marker;

        marker.addListener('click', (function (m, c, l) {
          return function () {
            var shared = getClubsAtPosition(l.lat, l.long);
            var content = shared.length > 1
              ? buildSharedInfoContent(shared, l)
              : buildSingleInfoContent(c, l);
            showInfoWindow(m, content);
          };
        }(marker, club, loc)));

        activeMarkers.push(marker);
      });
    });

    if (keepMapView) {
      // Search This Area: markers placed but viewport left exactly as-is
    } else if (activeMarkers.length === 1) {
      // Single result: zoom to range circle like production
      var radiusMeters = rangeMiles !== null ? rangeMiles * 1609.34 : 500 * 1609.34;
      var circle = new google.maps.Circle({
        center: activeMarkers[0].getPosition(),
        radius: radiusMeters
      });
      map.fitBounds(circle.getBounds());
    } else if (activeMarkers.length > 1) {
      var bounds = new google.maps.LatLngBounds();
      activeMarkers.forEach(function (m) { bounds.extend(m.getPosition()); });
      map.fitBounds(bounds);
      google.maps.event.addListenerOnce(map, 'bounds_changed', function () {
        if (map.getZoom() > 13) map.setZoom(13);
      });
    } else {
      map.setCenter({ lat: userLat, lng: userLng });
      map.setZoom(10);
    }
  }

  // ── List → map click wiring ────────────────────────────────────────────────

  function initListMapLink() {
    clubList.addEventListener('click', function (e) {
      var btn = e.target.closest('.club-list-item-new__locations-item[data-club-id]');
      if (!btn || !map) return;
      var clubId   = btn.getAttribute('data-club-id');
      var locIndex = parseInt(btn.getAttribute('data-loc-index'), 10);
      var key      = clubId + ':' + locIndex;
      var marker   = markerMap[key];
      if (!marker) return;
      map.panTo(marker.getPosition());
      google.maps.event.trigger(marker, 'click');
    });
  }

  // ── No-clubs form ──────────────────────────────────────────────────────────

  function initNoClubsForm() {
    clubList.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'noClubSubmit') {
        var li = e.target.closest('li.club-list-item-new');
        if (li) {
          li.innerHTML =
            '<div style="padding:1rem 0">' +
              '<h4 style="color:#0070c0">Thank you!</h4>' +
              '<p>We\'ll notify you when a club opens near you.</p>' +
            '</div>';
        }
      }
    });
  }

  window.initClubMap = function () {
    var mapEl = document.querySelector('.club-map-new');
    if (!mapEl) return;

    map = new google.maps.Map(mapEl, {
      center: { lat: 39.5, lng: -98.35 },
      zoom: 4
    });

    // ── Search This Area button ──────────────────────────────────────────────
    var searchAreaBtn = document.createElement('button');
    searchAreaBtn.type = 'button';
    searchAreaBtn.textContent = 'Search This Area';
    searchAreaBtn.style.cssText = [
      'display:none',
      'margin:10px',
      'padding:0 16px',
      'height:40px',
      'background:#fff',
      'color:#1a73e8',
      'border:1px solid rgba(0,0,0,.12)',
      'border-radius:2px',
      'font-size:14px',
      'font-weight:500',
      'font-family:Roboto,Arial,sans-serif',
      'cursor:pointer',
      'box-shadow:0 1px 4px rgba(0,0,0,.3)',
      'letter-spacing:.025em',
      'text-transform:uppercase'
    ].join(';');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchAreaBtn);

    map.addListener('idle', function () {
      if (!mapReady) return;
      var bounds = map.getBounds();
      if (!bounds) return;
      var anyVisible = activeMarkers.some(function (m) {
        return bounds.contains(m.getPosition());
      });
      var zoomedOut = searchZoom !== null && map.getZoom() < searchZoom;
      var showBtn   = !anyVisible || zoomedOut;
      searchAreaBtn.style.display = showBtn ? 'block' : 'none';
      if (!anyVisible && locationInput) {
        locationInput.value = '';
      }
    });

    searchAreaBtn.addEventListener('click', function () {
      var center = map.getCenter();
      var bounds = map.getBounds();
      userLat = center.lat();
      userLng = center.lng();

      // Snap range select to cover the visible map area so "Search This Area"
      // returns clubs actually visible in the viewport, not just those within
      // whatever narrow radius was previously selected.
      if (bounds && rangeSelect) {
        var ne = bounds.getNorthEast();
        var visibleMiles = haversine(userLat, userLng, ne.lat(), ne.lng());
        var steps = [10, 25, 50, 100, 250];
        var snapped = null;
        for (var i = 0; i < steps.length; i++) {
          if (steps[i] >= visibleMiles) { snapped = steps[i]; break; }
        }
        rangeSelect.value = snapped ? String(snapped) : 'max';
      }

      searchAreaBtn.style.display = 'none';
      mapReady      = false;
      keepMapView   = true;
      withLoader(applyFilters);
    });

    // Swap Nominatim dropdown for Google Places Autocomplete
    if (locationInput) {
      if (acList) acList.style.display = 'none';

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

    // If URL params provided lat/lng, run filter now that map is ready
    if (userLat !== null) {
      withLoader(applyFilters);
      return;
    }

    // Seed map and filter from user's IP location
    fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || data.country_code !== 'US' || !data.latitude) return;
        userLat = parseFloat(data.latitude);
        userLng = parseFloat(data.longitude);
        if (locationInput && data.city && data.region_code) {
          locationInput.value = data.city + ', ' + data.region_code;
        }
        withLoader(applyFilters);
      })
      .catch(function () {});
  };

  // ── Geocode via Nominatim (Submit fallback) ────────────────────────────────

  function geocodeAndFilter(address) {
    if (!address || !address.trim()) {
      userLat = null;
      userLng = null;
      withLoader(applyFilters);
      return;
    }

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
      done();
    })
    .catch(function () {
      userLat = null;
      userLng = null;
      done();
    });
  }

  // ── Loader ─────────────────────────────────────────────────────────────────

  function withLoader(fn) {
    if (loaderEl) loaderEl.style.display = 'flex';
    setTimeout(function () {
      fn();
      if (loaderEl) loaderEl.style.display = 'none';
    }, 1000);
  }

  // ── Location Autocomplete (Nominatim — active until Google Maps loads) ─────

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

  var acList     = null;
  var acItems    = [];
  var acIndex    = -1;
  var acDebounce = null;

  function formatSuggestion(r) {
    var a     = r.address || {};
    var city  = a.city || a.town || a.village || a.municipality || a.hamlet || '';
    var state = a.state || '';
    var abbr  = stateAbbr[state] || state;
    var zip   = a.postcode || '';
    if (r.type === 'postcode' && zip) {
      return zip + (city ? ' (' + city + ', ' + abbr + ')' : '');
    }
    if (city && abbr) return city + ', ' + abbr;
    if (state && !city) return state;
    return r.display_name.split(',').slice(0, 2).join(',').trim();
  }

  function renderAc() {
    acList.innerHTML = acItems.map(function (item, i) {
      return '<li data-index="' + i + '">' + esc(item.label) + '</li>';
    }).join('');
  }

  function highlightAc() {
    acList.querySelectorAll('li').forEach(function (li, i) {
      li.classList.toggle('is-active', i === acIndex);
    });
  }

  function closeAc() {
    acItems = []; acIndex = -1;
    if (acList) acList.innerHTML = '';
  }

  function selectAc(i) {
    var item = acItems[i];
    if (!item) return;
    locationInput.value = item.label;
    userLat = parseFloat(item.result.lat);
    userLng = parseFloat(item.result.lon);
    closeAc();
    withLoader(applyFilters);
  }

  function fetchSuggestions(q) {
    fetch(
      'https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=us&addressdetails=1&q=' +
        encodeURIComponent(q),
      { headers: { 'Accept-Language': 'en-US,en' } }
    )
    .then(function (r) { return r.json(); })
    .then(function (results) {
      if (!results || !results.length) { closeAc(); return; }
      var seen = {};
      acItems = [];
      results.forEach(function (r) {
        var label = formatSuggestion(r);
        if (!seen[label]) { seen[label] = true; acItems.push({ result: r, label: label }); }
      });
      acIndex = -1;
      renderAc();
    })
    .catch(function () { closeAc(); });
  }

  function initAutocomplete() {
    if (!locationInput) return;
    locationInput.parentNode.style.position = 'relative';
    acList = document.createElement('ul');
    acList.className = 'location-ac';
    locationInput.parentNode.appendChild(acList);

    locationInput.addEventListener('input', function () {
      userLat = null; userLng = null;
      clearTimeout(acDebounce);
      var q = locationInput.value.trim();
      if (q.length < 3) { closeAc(); return; }
      acDebounce = setTimeout(function () { fetchSuggestions(q); }, 350);
    });

    locationInput.addEventListener('keydown', function (e) {
      if (!acItems.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        acIndex = Math.min(acIndex + 1, acItems.length - 1);
        highlightAc();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        acIndex = Math.max(acIndex - 1, 0);
        highlightAc();
      } else if (e.key === 'Enter' && acIndex >= 0) {
        e.preventDefault(); selectAc(acIndex);
      } else if (e.key === 'Escape') {
        closeAc();
      }
    });

    acList.addEventListener('click', function (e) {
      var li = e.target.closest('li[data-index]');
      if (li) selectAc(parseInt(li.dataset.index, 10));
    });

    acList.addEventListener('mouseover', function (e) {
      var li = e.target.closest('li[data-index]');
      if (li) { acIndex = parseInt(li.dataset.index, 10); highlightAc(); }
    });

    document.addEventListener('click', function (e) {
      if (!locationInput.contains(e.target) && !acList.contains(e.target)) closeAc();
    });
  }

  // ── Event listeners ────────────────────────────────────────────────────────

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      closeAc();
      geocodeAndFilter(locationInput ? locationInput.value : '');
    });
  }

  if (nameInput) {
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') withLoader(applyFilters);
    });
  }

  if (locationInput) {
    locationInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && acIndex < 0) geocodeAndFilter(locationInput.value);
    });
  }

  if (rangeSelect) {
    rangeSelect.addEventListener('change', function () {
      if (userLat !== null) withLoader(applyFilters);
    });
  }

  document.addEventListener('filtersChanged', function () { withLoader(applyFilters); });

  // ── Init ───────────────────────────────────────────────────────────────────

  readUrlParams();
  initAutocomplete();
  initListMapLink();
  initNoClubsForm();

}());
