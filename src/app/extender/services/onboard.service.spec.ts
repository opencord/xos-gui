
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
import 'angular-resource';
import {Subject} from 'rxjs';
import {XosOnboarder, IXosOnboarder} from './onboard.service';
import {IWSEventService} from '../../datasources/websocket/global';

let service, $ocLazyLoad, $timeout;

const subject = new Subject();

const MockWs: IWSEventService = {
  list() {
    return subject.asObservable();
  }
};

const MockPromise = {
  then: (cb) => {
    cb('done');
    return MockPromise;
  },
  catch: (cb) => {
    cb('err');
    return MockPromise;
  }
};

const MockLoad = {
  load: () => {
    return MockPromise;
  }
};

const MockModelStore = {
  query: () => {
    return subject.asObservable();
  }
};

describe('The XosOnboarder service', () => {

  beforeEach(() => {

    angular
      .module('XosOnboarder', [])
      .value('WebSocket', MockWs)
      .value('$ocLazyLoad', MockLoad)
      .value('XosModelStore', MockModelStore)
      .service('XosOnboarder', XosOnboarder);

    angular.mock.module('XosOnboarder');
  });

  beforeEach(angular.mock.inject((
    XosOnboarder: IXosOnboarder,
    _$ocLazyLoad_: any,
    _$timeout_: ng.ITimeoutService
  ) => {
    $ocLazyLoad = _$ocLazyLoad_;
    spyOn($ocLazyLoad, 'load').and.callThrough();
    service = XosOnboarder;
    $timeout = _$timeout_;

    // start the service
    service.onboard();
  }));

  describe('when receive an event', () => {
    it('should use $ocLazyLoad to add modules to the app', () => {
      subject.next([
        {
          files: 'vendor.js,app.js',
          name: 'sample app'
        }
      ]);
      expect($ocLazyLoad.load).toHaveBeenCalledWith('vendor.js');
      expect($ocLazyLoad.load).toHaveBeenCalledWith('app.js');
    });
  });
});
