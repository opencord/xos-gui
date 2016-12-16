const context = require.context('./app', true, /\.(js|ts|tsx)$/);
context.keys().forEach(function(f) {
  // console.log(f);
  context(f);
});