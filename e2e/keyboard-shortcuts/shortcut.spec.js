
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


const user = require('../test_helpers/user');
const page = require('./keyboard.po');

describe('XOS Keyboard Shortcuts', function() {

  beforeEach(() => {
    user.login();
  });

  it('should open the side panel when ? is pressed', () => {
    page.pressKey('?');
    expect(page.sidePanel.getAttribute('class')).toMatch('open');
  });

  it('should select the search form when f is pressed', () => {
    page.pressKey('f');
    expect(page.searchField.getAttribute('placeholder')).toEqual(browser.driver.switchTo().activeElement().getAttribute('placeholder'));
  });
});