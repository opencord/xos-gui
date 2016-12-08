Error.stackTraceLimit = Infinity;
require('core-js/client/shim');

require('@angular/common');
require('rxjs');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

// loading app files
const context = require.context('./app', true, /\.(js|ts|tsx)$/);
context.keys().forEach(context);

// use this for debug
// context.keys().forEach(function(path) {
//   try {
//     context(path);
//   } catch(err) {
//     console.error('[ERROR] WITH SPEC FILE: ', path);
//     console.error(err);
//   }
// });

// loading specs
const specFiles = require.context('../spec', true, /\.(js|ts|tsx)$/);
specFiles.keys().forEach(specFiles);
// use this for debug
// specFiles.keys().forEach(function(path) {
//   try {
//     specFiles(path);
//   } catch(err) {
//     console.error('[ERROR] WITH SPEC FILE: ', path);
//     console.error(err);
//   }
// });

const testing = require('@angular/core/testing');
const testingBrowser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(testingBrowser.BrowserDynamicTestingModule, testingBrowser.platformBrowserDynamicTesting());
