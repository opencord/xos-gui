
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
import {XosDebouncer, IXosDebouncer} from './debounce.helper';

let service: IXosDebouncer;

describe('The XosDebouncer service', () => {

  beforeEach(() => {
    angular
      .module('test', ['toastr'])
      .service('XosDebouncer', XosDebouncer);
    angular.mock.module('test');
  });

  beforeEach(angular.mock.inject((
    XosDebouncer: IXosDebouncer,
  ) => {
    service = XosDebouncer;
  }));

  it('should call a function only after it has not been called for 500ms', (done) => {
    const spy = jasmine.createSpy('fn');
    const efficientSpy = service.debounce(spy, 500, this, false);
    /* tslint:disable */
    efficientSpy();
    efficientSpy();
    /* tslint:enable */
    expect(spy).not.toHaveBeenCalled();
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 600);
  });
});

