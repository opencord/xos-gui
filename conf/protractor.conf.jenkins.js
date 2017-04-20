exports.config = {
  seleniumServerJar: '/home/teone/selenium/selenium-server-standalone-2.44.0.jar',
  capabilities: {
    'browserName': 'firefox'
  },
  specs: [
    '../e2e/**/*.spec.js'
  ],
  jasmineNodeOpts: {
    showColors: true
  }
};