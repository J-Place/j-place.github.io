(function () {
  'use strict';

  // Distance to each location is computed client-side from the viewer's
  // location — it isn't stored club data (production computes it per-request
  // the same way, from the visitor's geo vs. the location's lat/long).
  function renderDistances(lat, lng) {
    document.querySelectorAll('.club-location__map-pin[data-lat]').forEach(function (pin) {
      var locLat = parseFloat(pin.dataset.lat);
      var locLng = parseFloat(pin.dataset.lng);
      if (isNaN(locLat) || isNaN(locLng)) return;

      var miles = Math.round(window.UsmsGeo.haversineMiles(lat, lng, locLat, locLng));
      var distEl = pin.querySelector('.club-location__map-pin--distance');
      if (!distEl) {
        distEl = document.createElement('p');
        distEl.className = 'club-location__map-pin--distance';
        pin.appendChild(distEl);
      }
      // Trailing space matches production's rendered markup (Locations.cshtml
      // emits @roundDistance with surrounding whitespace Razor doesn't trim,
      // which collapses to one space before the "mi." the CSS :after adds).
      distEl.textContent = miles + ' ';
    });
  }

  if (document.querySelector('.club-location__map-pin[data-lat]')) {
    window.UsmsGeo.locate(renderDistances, renderDistances);
  }

  window.initClubDetailMap = function () {
    var mapEl = document.getElementById('club-detail-map');
    if (!mapEl) return;

    var locations = JSON.parse(mapEl.dataset.locations || '[]');
    if (!locations.length) return;

    var map = new google.maps.Map(mapEl, {
      zoom: 12,
      center: { lat: locations[0].lat, lng: locations[0].lng }
    });

    var markers = locations.map(function (loc) {
      return new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map: map,
        icon: loc.icon || undefined
      });
    });

    if (markers.length > 1) {
      var bounds = new google.maps.LatLngBounds();
      markers.forEach(function (m) { bounds.extend(m.getPosition()); });
      map.fitBounds(bounds);
    }
  };
}());
