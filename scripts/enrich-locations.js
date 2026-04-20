#!/usr/bin/env node
/**
 * Enrich locations.json with lat/lng coordinates via ZIP code lookup.
 *
 * Uses Zippopotam.us — free, no API key required.
 * Rate-limited to one request per 250ms to be a polite client.
 *
 * Usage:
 *   node scripts/enrich-locations.js
 */

'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const DATA_FILE = path.join(__dirname, '../src/_data/locations.json');
const DELAY_MS  = 250;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchZip(zip) {
  return new Promise(resolve => {
    const url = 'https://api.zippopotam.us/us/' + zip;
    https.get(url, function (res) {
      var data = '';
      res.on('data', function (c) { data += c; });
      res.on('end', function () {
        if (res.statusCode === 200) {
          try {
            var json  = JSON.parse(data);
            var place = json.places && json.places[0];
            if (place) {
              resolve({ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) });
              return;
            }
          } catch (e) { /* fall through */ }
        }
        resolve(null);
      });
    }).on('error', function () { resolve(null); });
  });
}

async function main() {
  var raw       = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  var locations = raw.data.locations;

  // Collect unique ZIP codes (skip blanks, already-enriched locations)
  var zipMap = {};
  var alreadyDone = 0;
  locations.forEach(function (l) {
    if (l.Lat != null && l.Lng != null) { alreadyDone++; return; }
    if (l.ZipCode) zipMap[l.ZipCode] = null;
  });

  if (alreadyDone > 0) {
    console.log(alreadyDone + ' location(s) already have coordinates — skipping.');
  }

  var zips = Object.keys(zipMap);
  if (zips.length === 0) {
    console.log('All locations already enriched.');
    return;
  }

  console.log('Geocoding ' + zips.length + ' unique ZIP codes...');

  var done = 0;
  for (var i = 0; i < zips.length; i++) {
    var zip    = zips[i];
    var coords = await fetchZip(zip);
    zipMap[zip] = coords;
    done++;
    if (done % 20 === 0 || done === zips.length) {
      process.stdout.write('  ' + done + '/' + zips.length + '\r');
    }
    if (i < zips.length - 1) await sleep(DELAY_MS);
  }
  console.log('');

  // Apply coordinates to locations
  var enriched = 0, failed = 0;
  locations.forEach(function (l) {
    if (l.Lat != null && l.Lng != null) return; // already had coords
    var coords = l.ZipCode ? zipMap[l.ZipCode] : null;
    if (coords) {
      l.Lat = coords.lat;
      l.Lng = coords.lng;
      enriched++;
    } else {
      failed++;
      if (failed <= 10) console.warn('  No coords for ZIP ' + l.ZipCode + ' (' + l.Name + ')');
    }
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(raw, null, 2));
  console.log('\nDone. Enriched: ' + enriched + ' | Failed: ' + failed);
}

main().catch(function (err) { console.error(err); process.exit(1); });
