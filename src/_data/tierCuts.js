// src/_data/tierCuts.js
// Swim Tools v3's tier data, trimmed from timeStandards.json (about 470 KB)
// for embedding as #tier-cuts-data: one entry per course, gender and age
// group (by its youngest age), and for each stroke and distance:
//   n     how many swimmers the ranking held (rows_returned; capped at 500)
//   cuts  [tier, row, seconds] fastest first: row 1 is the fastest swim,
//         then AAAA … B, then row n is the slowest
// The rows let the page place any time in the field (its percentile), not
// just between tiers, and find 10th place for the Top 10 tier. The page
// uses AAA … B as they are, with Top 10 in place of AAAA (swim-tools-v3.js
// TIERS).

'use strict';

const standards = require('./timeStandards.json');

const TIERS = ['AAAA', 'AAA', 'AA', 'A', 'BB', 'B'];

function secs(text) {
  return String(text).split(':').reduce((a, p) => a * 60 + Number(p), 0);
}

module.exports = standards.slices.map((slice) => {
  const events = {};
  slice.events.forEach((e) => {
    const cuts = [['fastest', 1, secs(e.fastest_time)]];
    TIERS.forEach((t) => {
      if (e.cutoffs[t]) cuts.push([t, e.cutoffs[t].row, e.cutoffs[t].seconds]);
    });
    cuts.push(['slowest', e.rows_returned, secs(e.slowest_time)]);
    (events[e.stroke] = events[e.stroke] || {})[e.distance] = { n: e.rows_returned, capped: e.cap_hit, cuts };
  });
  return { course: slice.course, gender: slice.sex_label, ageGroup: slice.low_age, events };
});
