
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


const fs = require('fs');
const path = require('path');
const config = require('./config');
const P = require('bluebird');

const username = 'xosadmin@opencord.org';

const getPwd = () => {

  if (process.env.UI_PWD) {
    return process.env.UI_PWD;
  }

  const pwdFile = fs.readFileSync(path.join(__dirname, '../../../../build/platform-install/credentials/xosadmin@opencord.org'), 'utf8');
  return pwdFile;
};

exports.pwd = getPwd();

exports.username = username;

exports.login = P.promisify((done) => {
  browser.get(`${config.url}/login`);

  browser.getCurrentUrl()
    .then((url) => {
      // NOTE login only if it is not yet
      if (url.indexOf('login') !== -1) {
        const loginPage = require('../login/login.po');
        loginPage.sendUsername(username);
        loginPage.sendPassword(getPwd());
        loginPage.submit();
      }
      browser.waitForAngular();
      done();
    });
});