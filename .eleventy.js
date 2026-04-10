module.exports = function(eleventyConfig) {
  eleventyConfig.addWatchTarget("src/_data/");

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
