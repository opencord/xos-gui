const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  suites: {
    login: '../e2e/login/*.spec.js',
    dashboard: '../e2e/dashboard/*.spec.js',
    keyboard: '../e2e/keyboard-shortcuts/*.spec.js',
    crud: '../e2e/crud/*.spec.js'
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  },
  jasmineNodeOpts: {
    print: function() {},
    showColors: true, // Use colors in the command line report.
    defaultTimeoutInterval: (parseInt(process.env.TIMEOUT, 10) + 1000) || 30 * 1000
  },
  allScriptsTimeout: parseInt(process.env.TIMEOUT, 10) || 10 * 1000
};