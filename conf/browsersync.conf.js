const conf = require('./gulp.conf');
const httpProxy = require('http-proxy');

// TODO move the proxy config in a separate file and share with browsersync.dist.js

const proxy = httpProxy.createProxyServer({
  target: 'http://xos.dev:9101'
});

proxy.on('error', function(error, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  console.error('[Proxy]', error);
});

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
