const conf = require('./gulp.conf');
const proxy = require('./proxy').proxy;
const extensionsProxy = require('./proxy').extensionsProxy;

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ],
      middleware: function(req, res, next){
        if (req.url.indexOf('xosapi') !== -1 || req.url.indexOf('socket.io') !== -1) {
          proxy.web(req, res);
        }
        else if (req.url.indexOf('extensions') !== -1) {
          extensionsProxy.web(req, res);
        }
        else{
          next();
        }
      }
    },
    open: true
  };
};
