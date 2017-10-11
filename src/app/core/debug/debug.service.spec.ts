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
import {XosDebugService, IXosDebugService} from './debug.service';

const MockShortcut = {};

describe('The XOS Debug service', () => {
  let service, $log, $scope, XosKeyboardShortcut;

  beforeEach(() => {
    angular.module('testDebug', [])
      .service('XosDebug', XosDebugService)
      .value('XosKeyboardShortcut', MockShortcut);

    angular.mock.module('testDebug');
  });

  beforeEach(angular.mock.inject((
    XosDebug: IXosDebugService,
    _$log_: ng.ILogService,
    _$rootScope_: ng.IScope,
    _XosKeyboardShortcut_: any
  ) => {
    service = XosDebug;
    $log = _$log_;
    $scope = _$rootScope_;
    XosKeyboardShortcut = _XosKeyboardShortcut_;
    spyOn(window.localStorage, 'setItem');
    spyOn($scope, '$broadcast');
  }));

  it('should read the debug status from localStorage', () => {
    spyOn(window.localStorage, 'getItem')
      .and.returnValue('true');
    service = new XosDebugService($log, $scope, XosKeyboardShortcut);
    expect(service.status.global).toBeTruthy();
    expect(service.status.events).toBeTruthy();
  });

  it('should read the notification status from localStorage', () => {
    spyOn(window.localStorage, 'getItem')
      .and.returnValue(null);
    service = new XosDebugService($log, $scope, XosKeyboardShortcut);
    expect(service.status.notifications).toBeTruthy();
  });

  it('should disable the global debug status', () => {
    spyOn(window.localStorage, 'getItem')
      .and.returnValue('true');
    service.toggleDebug('global');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('debug-global', 'false');
    expect(service.status.global).toBeFalsy();
    expect($scope.$broadcast).toHaveBeenCalledWith('xos.debug.status', service.status);
  });
  it('should enable the global debug status', () => {
    spyOn(window.localStorage, 'getItem')
      .and.returnValue('false');
    service.toggleDebug('global');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('debug-global', 'true');
    expect(service.status.global).toBeTruthy();
    expect($scope.$broadcast).toHaveBeenCalledWith('xos.debug.status', service.status);
  });
});
