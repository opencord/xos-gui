const conf = require('./gulp.conf');
const proxy = require('./proxy');

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ],
      middleware: function(req, res, next){
        if (req.url.indexOf('xosapi') !== -1) {
          proxy.web(req, res);
        }
        else{
          next();
        }
      }
    },
    open: true
  };
};
