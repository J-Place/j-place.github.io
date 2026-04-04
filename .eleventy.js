module.exports = function(eleventyConfig) {

  // Copy public/ to _site/public/ untouched
  eleventyConfig.addPassthroughCopy("public");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  }
}
