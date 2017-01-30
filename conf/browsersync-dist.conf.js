const conf = require('./gulp.conf');

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.dist
      ],
      routes: {
        "/spa": "./dist"
      }
    },
    open: false
  };
};
