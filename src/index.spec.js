const context = require.context('./app', true, /\.(js|ts|tsx)$/);

context.keys().forEach(function(f) {
  // FIXME exclude mcord from test (it mess up with loading order, Module "app" not found)
  if (f.indexOf('mcord') > -1) {
    return;
  }
  context(f);
});