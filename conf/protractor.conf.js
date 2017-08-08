
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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