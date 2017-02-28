const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: 'http://xos.dev:9101'
});

proxy.on('error', function(error, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  console.error('[Proxy]', error);
});

module.exports = proxy;