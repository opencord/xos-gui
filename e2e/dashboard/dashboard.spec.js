
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
const dashboardPage = require('./dashboard.po');

describe('XOS Dashboard', function() {
  it('should have a graph and system summary', () => {
    user.login();
    expect(dashboardPage.graphTitle.isPresent()).toBeTruthy();
    expect(dashboardPage.graphSvg.isPresent()).toBeTruthy();
    expect(dashboardPage.summaryTitle.isPresent()).toBeTruthy();
    expect(dashboardPage.summaryBoxes.count()).toBe(3);
  });
});