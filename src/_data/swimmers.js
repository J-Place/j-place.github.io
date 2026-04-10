const fs   = require('fs');
const path = require('path');

module.exports = function () {
  const dir = path.join(__dirname);
  const registry = {};

  fs.readdirSync(dir)
    .filter(f => /^swimmer-.+\.json$/.test(f))
    .forEach(f => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (data && data.usmsId) registry[data.usmsId] = data;
    });

  return registry;
};
