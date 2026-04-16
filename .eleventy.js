const fs   = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  eleventyConfig.addWatchTarget("src/_data/");

  // Build swimmer registry from all swimmer-*.json files in _data/.
  // Using addGlobalData (called fresh each build) instead of a _data/swimmers.js
  // module (which Node caches between hot-reloads, causing stale registry).
  eleventyConfig.addGlobalData('swimmers', function () {
    const dir = path.join(__dirname, 'src/_data');
    const registry = {};
    fs.readdirSync(dir)
      .filter(f => /^swimmer-.+\.json$/.test(f))
      .forEach(f => {
        const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        if (data && data.usmsId) registry[data.usmsId] = data;
      });
    return registry;
  });

  // Copy public/ to _site/public/ untouched
  eleventyConfig.addPassthroughCopy("public");

  // Also copy public subdirectory CSS folders to root so legacy
  // Sergey pages with root-relative /xxx/css/ paths resolve correctly
  eleventyConfig.addPassthroughCopy({ "public/css": "css" });
  eleventyConfig.addPassthroughCopy({ "public/search/css": "search/css" });
  eleventyConfig.addPassthroughCopy({ "public/event/css": "event/css" });
  eleventyConfig.addPassthroughCopy({ "public/lanemate/css": "lanemate/css" });
  eleventyConfig.addPassthroughCopy({ "public/lanemate/css-components": "lanemate/css-components" });
  eleventyConfig.addPassthroughCopy({ "public/registration/css": "registration/css" });
  eleventyConfig.addPassthroughCopy({ "public/swimmer/css": "swimmer/css" });
  eleventyConfig.addPassthroughCopy({ "public/forum-comments/css": "forum-comments/css" });

  // Course type abbreviation for small list view
  const courseTypeMap = { "OPEN WATER": "OW", "SHORT COURSE YARDS": "SCY", "SHORT COURSE METERS": "SCM", "LONG COURSE METERS": "LCM" };
  eleventyConfig.addFilter("courseTypeAbbr", val => courseTypeMap[val.toUpperCase()] || val);

  // Format a number as a price with always-two decimal places: 110 → "110.00"
  eleventyConfig.addFilter("price", val => parseFloat(val || 0).toFixed(2));

  // Copy src/js to _site/js
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // Copy src/css to _site/css
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });

  // Copy src/assets and src/img to _site root
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  }
}
