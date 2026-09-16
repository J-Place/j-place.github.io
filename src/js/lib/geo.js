// Shared geo helpers used by clubs-filter.js and club-detail-map.js, so both
// compute "distance to me" the same way instead of drifting.
window.UsmsGeo = (function () {
  'use strict';

  // Sarasota, FL — USMS HQ. The default location until (unless) IP
  // geolocation resolves. Matches production's GeoService.GetDefaultGeo()
  // (production/src/Foundation/SitecoreExtensions/code/GeoLocation/GeoService.cs)
  // so our fallback distance figures agree with production's.
  var DEFAULT_LAT = 27.3288505;
  var DEFAULT_LNG = -82.5368164;
  var DEFAULT_CITY_STATE = 'Sarasota, FL';

  function haversineMiles(lat1, lng1, lat2, lng2) {
    var R  = 3958.8;
    var d1 = (lat2 - lat1) * Math.PI / 180;
    var d2 = (lng2 - lng1) * Math.PI / 180;
    var a  = Math.sin(d1 / 2) * Math.sin(d1 / 2)
           + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
           * Math.sin(d2 / 2) * Math.sin(d2 / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ?lat=&long= pins the viewer's location for testing/demo purposes — same
  // pattern as ?user=/?date=/?club= elsewhere in this project. Persisted to
  // sessionStorage so it carries forward across navigation in the same tab.
  function readOverride() {
    try {
      var params = new URLSearchParams(window.location.search);
      var lat = parseFloat(params.get('lat'));
      var lng = parseFloat(params.get('long'));
      if (!isNaN(lat) && !isNaN(lng)) {
        sessionStorage.setItem('activeGeo', lat + ',' + lng);
        return { lat: lat, lng: lng };
      }
      var stored = sessionStorage.getItem('activeGeo');
      if (stored) {
        var parts = stored.split(',');
        var storedLat = parseFloat(parts[0]);
        var storedLng = parseFloat(parts[1]);
        if (!isNaN(storedLat) && !isNaN(storedLng)) return { lat: storedLat, lng: storedLng };
      }
    } catch (e) {}
    return null;
  }

  // Calls onDefault(lat, lng) synchronously — with an active ?lat=/?long=
  // override if present, else the Sarasota default — then, if no override is
  // active and IP geolocation succeeds, calls onResolved(lat, lng, ipinfoData).
  function locate(onDefault, onResolved) {
    var override = readOverride();
    if (override) {
      onDefault(override.lat, override.lng);
      return;
    }

    onDefault(DEFAULT_LAT, DEFAULT_LNG);
    fetch('https://ipinfo.io/json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || data.country !== 'US' || !data.loc) return;
        var coords = data.loc.split(',');
        var lat = parseFloat(coords[0]);
        var lng = parseFloat(coords[1]);
        if (onResolved) onResolved(lat, lng, data);
      })
      .catch(function () {});
  }

  return {
    DEFAULT_LAT: DEFAULT_LAT,
    DEFAULT_LNG: DEFAULT_LNG,
    DEFAULT_CITY_STATE: DEFAULT_CITY_STATE,
    haversineMiles: haversineMiles,
    locate: locate
  };
}());
