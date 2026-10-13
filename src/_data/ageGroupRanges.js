// src/_data/ageGroupRanges.js
// The Race Time Predictor's age group range, trimmed from timeStandards.json
// (about 470 KB) to just what the chart draws, for embedding as
// #age-group-ranges-data: one entry per course, gender and age group (by its
// youngest age), each event's A (top 15%) and B (top 55%) times in seconds.

'use strict';

const standards = require('./timeStandards.json');

module.exports = standards.slices.map((slice) => {
  const times = {};
  slice.events.forEach((e) => {
    if (!e.cutoffs.A || !e.cutoffs.B) return;
    (times[e.stroke] = times[e.stroke] || {})[e.distance] = [e.cutoffs.A.seconds, e.cutoffs.B.seconds];
  });
  return { course: slice.course, gender: slice.sex_label, ageGroup: slice.low_age, times };
});
