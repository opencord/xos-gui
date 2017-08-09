
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


const config = require('../test_helpers/config');
const user = require('../test_helpers/user');
const pwd = user.pwd;
const username = user.username;
const loginPage = require('./login.po');

describe('XOS Login page', function() {

  beforeEach(() => {
    browser.get(`${config.url}/login`);
  });

  it('should not login with a wrong password', function() {
    loginPage.sendUsername(username);
    loginPage.sendPassword('wrongpwd');
    loginPage.submit();

    const alert = element(by.css('.alert.alert-danger'));
    expect(alert.isDisplayed()).toBeTruthy();
  });

  it('should login', () => {
    loginPage.sendUsername(username);
    loginPage.sendPassword(pwd);
    loginPage.submit();

    expect(browser.getCurrentUrl()).toEqual(`${config.url}/dashboard`);
  });
});