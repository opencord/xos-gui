exports.config = {
  seleniumServerJar: '~/selenium/selenium-server-standalone-2.44.0.jar',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  suites: {
    login: '../e2e/login/*.spec.js',
    dashboard: '../e2e/dashboard/*.spec.js',
  },
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
    defaultTimeoutInterval: (parseInt(process.env.TIMEOUT, 10) + 1000) || 30 * 1000
  },
  allScriptsTimeout: parseInt(process.env.TIMEOUT, 10) || 10 * 1000
};