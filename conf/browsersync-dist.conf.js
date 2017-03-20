const conf = require('./gulp.conf');
const proxy = require('./proxy').proxy;
const extensionsProxy = require('./proxy').extensionsProxy;

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
        else if (req.url.indexOf('extensions') !== -1) {
          extensionsProxy.web(req, res);
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
