module.exports = function(eleventyConfig) {

  // Copy public/ to _site/public/ untouched
  eleventyConfig.addPassthroughCopy("public");

  // Course type abbreviation for small list view
  const courseTypeMap = { "OPEN WATER": "OW", "SHORT COURSE YARDS": "SCY", "SHORT COURSE METERS": "SCM", "LONG COURSE METERS": "LCM" };
  eleventyConfig.addFilter("courseTypeAbbr", val => courseTypeMap[val.toUpperCase()] || val);

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
