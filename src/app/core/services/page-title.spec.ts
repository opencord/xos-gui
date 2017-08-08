
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


import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {xosCore} from '../index';
import {IXosPageTitleService} from './page-title';
import IWindowService = angular.IWindowService;

let service: IXosPageTitleService, $window: IWindowService;

const MockStyleConfig = {
  projectName: 'CORD'
};

describe('The PageTitle service', () => {

  beforeEach(() => {
    angular.module(xosCore)
      .constant('StyleConfig', MockStyleConfig);
    angular.mock.module(xosCore);
  });

  beforeEach(angular.mock.inject((
    PageTitle: IXosPageTitleService,
    _$window_: IWindowService
  ) => {
    service = PageTitle;
    $window = _$window_;
  }));

  it('should get the page title', () => {
    $window.document.title = 'test';
    expect(service.get()).toEqual('test');
  });

  it('should set a page title', () => {
    service.set('sample');
    expect($window.document.title).toEqual(`${MockStyleConfig.projectName} - sample`);
  });

  it('should convert dots to >', () => {
    service.set('core.sample.bread.crumb');
    expect($window.document.title).toEqual(`${MockStyleConfig.projectName} - core > sample > bread > crumb`);
  });
});
