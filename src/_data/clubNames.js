// src/_data/clubNames.js
// Club names by abbreviation (e.g. SRQM), gathered from every club record in
// clubs.json, for pages that only have a persona's club abbreviation.

'use strict';

const clubs = require('./clubs.json');

const names = {};
(function walk(node) {
  if (Array.isArray(node)) return node.forEach(walk);
  if (!node || typeof node !== 'object') return;
  if (node.abbreviation && node.title && !names[node.abbreviation]) names[node.abbreviation] = node.title;
  Object.values(node).forEach(walk);
})(clubs);

module.exports = names;
