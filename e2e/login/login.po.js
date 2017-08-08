
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


module.exports = new function(){

  const usernameField = element(by.model('username'));
  const passwordField = element(by.model('password'));
  const submitBtn = element(by.css('.btn.btn-accent'));

  this.sendUsername = (username) => {
    usernameField.sendKeys(username);
  };

  this.sendPassword = (pwd) => {
    passwordField.sendKeys(pwd);
  };

  this.submit = () => {
    submitBtn.click();
  }
};
