const conf = require('./gulp.conf');
const proxy = require('./proxy');

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.dist
      ],
      middleware: function(req, res, next){
        if (req.url.indexOf('xosapi') !== -1) {
          proxy.web(req, res);
        }
        else{
          next();
        }
      },
      routes: {
        "/spa": "./dist"
      }
    },
    open: true
  };
};
