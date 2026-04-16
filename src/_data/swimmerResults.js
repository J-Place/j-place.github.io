const fs   = require('fs');
const path = require('path');

module.exports = () => {
  const dir = path.join(__dirname, 'swimmerResults');
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .reduce((acc, f) => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      acc[data.usmsId] = data;
      return acc;
    }, {});
};
