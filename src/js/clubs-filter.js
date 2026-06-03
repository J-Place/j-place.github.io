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

  var userLat = null;
  var userLng = null;

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

    var locations = (club.location || []).map(function (loc) {
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
        '<button type="button" class="club-list-item-new__locations-item">' +
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

  function clubMatchesCerts(club, checkedValues) {
    if (!checkedValues.length) return true;
    var badgeAlts = (club.badges || []).map(function (b) { return b.alt; });
    return checkedValues.every(function (val) {
      if (val === 'gc')   return club.isGold === true;
      if (val === 'sslf') return club.sslf === true;
      if (val === 'cc')   return badgeAlts.indexOf('USMS-certified-coach') !== -1;
      if (val === 'alts') return badgeAlts.indexOf('USMS-alts-instructor') !== -1;
      return true;
    });
  }

  // ── Apply ──────────────────────────────────────────────────────────────────

  function applyFilters() {
    var nameQuery    = nameInput ? nameInput.value.trim().toLowerCase() : '';
    var rangeMiles   = getRange();
    var checkedCerts = [];
    certBoxes.forEach(function (cb) { if (cb.checked) checkedCerts.push(cb.value); });

    var matched = allClubs.filter(function (club) {
      var nameOk = !nameQuery || club.title.toLowerCase().indexOf(nameQuery) !== -1;
      var distOk = clubMatchesDistance(club, rangeMiles);
      var certOk = clubMatchesCerts(club, checkedCerts);
      return nameOk && distOk && certOk;
    });

    if (userLat !== null && userLng !== null) {
      matched.sort(function (a, b) {
        return nearestDistance(a) - nearestDistance(b);
      });
    }

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

    if (matched.length) {
      updateMapMarkers(matched);
    } else {
      clearMarkers();
    }
  }

  // ── Map ────────────────────────────────────────────────────────────────────

  var map            = null;
  var activeMarkers  = [];
  var openInfoWindow = null;

  function clearMarkers() {
    activeMarkers.forEach(function (m) { m.setMap(null); });
    activeMarkers = [];
    if (openInfoWindow) { openInfoWindow.close(); openInfoWindow = null; }
  }

  function updateMapMarkers(clubs) {
    if (!map) return;
    clearMarkers();

    if (userLat === null) {
      map.setCenter({ lat: 39.5, lng: -98.35 });
      map.setZoom(4);
      return;
    }

    var bounds = new google.maps.LatLngBounds();
    var markerSize = new google.maps.Size(20, 32);

    clubs.forEach(function (club) {
      (club.location || []).forEach(function (loc) {
        var lat = parseFloat(loc.lat);
        var lng = parseFloat(loc.long);
        if (isNaN(lat) || isNaN(lng)) return;

        var position = { lat: lat, lng: lng };
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          icon: {
            url: club.isGold ? markerOrange : markerBlue,
            scaledSize: markerSize
          },
          title: club.title
        });

        var infoContent =
          '<div style="max-width:200px;padding:2px 0">' +
            '<strong>' + esc(club.title) + '</strong>' +
            (loc.name ? '<br><span style="font-size:12px;color:#666">' + esc(loc.name) + '</span>' : '') +
            '<br><a href="' + esc(club.url) + '" style="font-size:13px">Club Details &rsaquo;</a>' +
          '</div>';

        marker.addListener('click', (function (m, content) {
          return function () {
            if (openInfoWindow) openInfoWindow.close();
            openInfoWindow = new google.maps.InfoWindow({ content: content });
            openInfoWindow.open(map, m);
          };
        }(marker, infoContent)));

        bounds.extend(position);
        activeMarkers.push(marker);
      });
    });

    if (activeMarkers.length) {
      map.fitBounds(bounds);
      // Don't zoom in too close for a single result
      google.maps.event.addListenerOnce(map, 'bounds_changed', function () {
        if (map.getZoom() > 13) map.setZoom(13);
      });
    } else {
      map.setCenter({ lat: userLat, lng: userLng });
      map.setZoom(10);
    }
  }

  window.initClubMap = function () {
    var mapEl = document.querySelector('.club-map-new');
    if (!mapEl) return;

    map = new google.maps.Map(mapEl, {
      center: { lat: 39.5, lng: -98.35 },
      zoom: 4
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

  initAutocomplete();

}());
