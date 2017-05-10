const httpProxy = require('http-proxy');

const target = process.env.PROXY || '192.168.46.100';

const proxy = httpProxy.createProxyServer({
  target: `http://${target}`
});

const extensionsProxy = httpProxy.createProxyServer({
  target: `http://${target}/xos/`
});

const socketProxy = httpProxy.createProxyServer({
  target: `http://${target}/`
});

proxy.on('error', function(error, req, res) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
  console.error('[Proxy]', error);
});

extensionsProxy.on('error', function(error, req, res) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
  console.error('[extensionsProxy]', error);
});

socketProxy.on('error', function(error, req, res) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
  console.error('[socketProxy]', error);
});

module.exports = {
  proxy,
  extensionsProxy,
  socketProxy
};