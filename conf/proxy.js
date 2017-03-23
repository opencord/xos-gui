const httpProxy = require('http-proxy');

const target = process.env.PROXY || '192.168.46.100';

const proxy = httpProxy.createProxyServer({
  target: `http://${target}:9101`
});

const extensionsProxy = httpProxy.createProxyServer({
  target: `http://${target}/spa/`
});

proxy.on('error', function(error, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  console.error('[Proxy]', error);
});

module.exports = {
  proxy,
  extensionsProxy
};