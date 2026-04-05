module.exports = function(eleventyConfig) {

  // Copy public/ to _site/public/ untouched
  eleventyConfig.addPassthroughCopy("public");

  // Copy src/js to _site/js
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // Also copy public subfolders to root so legacy root-relative CSS/JS paths resolve
  // e.g. /css/rte-updates.css, /search/css/ResultList.css, /swimmer/js/carousel.js
  const legacyDirs = [
    "css", "club", "club-dashboard", "college-club",
    "event", "forum-comments", "gtd", "homepage", "join-usms",
    "lanemate", "misc", "registration", "search", "swimmer", "video"
  ];
  for (const dir of legacyDirs) {
    eleventyConfig.addPassthroughCopy({ [`public/${dir}`]: dir });
  }

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  }
}
