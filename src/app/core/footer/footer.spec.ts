
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


/// <reference path="../../../../typings/index.d.ts" />

import * as angular from 'angular';
import 'angular-mocks';
import {xosFooter} from './footer';

const MockStyleConfig = {
  projectName: 'CORD'
};

describe('footer component', () => {
  beforeEach(() => {
    angular
      .module('xosFooter', ['app/core/footer/footer.html'])
      .component('xosFooter', xosFooter)
      .constant('StyleConfig', MockStyleConfig);

    angular.mock.module('xosFooter');
  });

  it('should render "XOS Team"', angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    const element = $compile('<xos-footer></xos-footer>')($rootScope);
    $rootScope.$digest();
    const footer = element.find('a');
    expect(footer.html().trim()).toEqual(`${MockStyleConfig.projectName} Team`);
  }));
});
