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
