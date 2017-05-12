# End to end test

NOTE: Require protractor to be installed as a global module.

## Setup
```
webdriver-manager update
webdriver-manager start
```

## Run tests

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
 
 ### Test suites
 
 If you need to run test for only a particural suite you can use:
 
 `protractor conf/protractor.conf.js --suite login`
 
 Suites are defined in `cong/protractor.conf.js`