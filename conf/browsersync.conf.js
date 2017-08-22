const conf = require('./gulp.conf');

const httpProxy = require('http-proxy');

const target = process.env.PROXY || 'xos.dev:8183';

const proxy = httpProxy.createProxyServer({
  target: `http://${target}`
});

proxy.on('error', function(error, req, res) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
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
        if (req.url.indexOf('onos') !== -1) {
          proxy.web(req, res);
        }
        else{
          next();
        }
      }
    },
    open: false
  };
};
