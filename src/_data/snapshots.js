const registry = require('../../snapshot-registry.json');

function labelFromKey(key) {
  return key
    .replace(/-\d{6}$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatDate(iso) {
  const [year, month, day] = iso.split('-');
  return `${month}/${day}/${year.slice(2)}`;
}

module.exports = function () {
  return Object.entries(registry)
    .map(([key, entry]) => ({
      key,
      label: entry.label || labelFromKey(key),
      url: entry.url,
      date: entry.date,
      displayDate: formatDate(entry.date),
      notes: entry.notes || null,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
};
