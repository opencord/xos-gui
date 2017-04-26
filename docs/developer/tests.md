# Test

## Unit Tests

There is a quite extensive suite of Unit Tests that are provided along with the code to help your development.

These tests are defined using [Karma](https://karma-runner.github.io/1.0/index.html) as test runner and [Jasmine](https://jasmine.github.io/) as assertion library. Test are defied along with the code, you can look for any `.spec.ts` file in the source tree.

You can execute them in two flavors:
- Single run (this is the same flavor that is used on Jenkins): `npm test`
- Watch mode: `npm run test:auto`

While developing the GUI we'll suggest you to run the test in watch mode, and they'll be executed anytime a file changes. It will help you in catchings bugs immediately. It also provide more information on which tests are executed.

## End to End Tests

There is a suite of basic end to test that are defined using [protractor](http://www.protractortest.org/#/), an AngularJs oriented version of Selenium.

These tests can be found in the `e2e` folder.

_NOTE: Require protractor to be installed as a global module._

### Setup
```
webdriver-manager update
webdriver-manager start
```

### Run the tests

_Note that this tests are designed to work with the Mock R-CORD config_

```
protractor conf/protractor.conf.js 
```
 
Other paramenters you can pass are:

| Variable Name | Description                                                  |
|---------------|--------------------------------------------------------------|
| UI_URL        | Address of the GUI (deaults to `http://192.168.46.100/spa/#` |
| UI_PWD        | Password to login (needed only for remote connections)       |
| TIMEOUT       | Time allowed for each test                                   |
 
 #### Test suites
 
 If you need to run test for only a particural suite you can use:
 
 `protractor conf/protractor.conf.js --suite login`
 
 Suites are defined in `cong/protractor.conf.js`