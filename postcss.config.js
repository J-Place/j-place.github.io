module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-custom-media'),
    require('postcss-custom-properties')({ preserve: true }),
    require('postcss-nested'),
    require('postcss-calc'),
    require('postcss-flexbugs-fixes'),
    require('autoprefixer'),
  ],
};
