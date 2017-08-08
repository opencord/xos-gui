
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
import {xosLoader} from './loader';

let loaded = true;
let authenticated = true;

const MockConfig = {
  lastVisitedUrl: '/test'
};

const MockDiscover = {
  areModelsLoaded: () => loaded,
  discover: null
};

const MockOnboarder = {
  onboard: null
};

const MockAuth = {
  isAuthenticated: jasmine.createSpy('isAuthenticated')
    .and.callFake(() => authenticated)
};

const MockState = {
  go: jasmine.createSpy('state.go')
};

describe('The XosLoader component', () => {
  beforeEach(() => {
    angular
      .module('loader', [])
      .value('XosConfig', MockConfig)
      .value('XosModelDiscoverer', MockDiscover)
      .value('XosOnboarder', MockOnboarder)
      .value('AuthService', MockAuth)
      .value('$state', MockState)
      .component('xosLoader', xosLoader);
    angular.mock.module('loader');
  });

  let scope, element, isolatedScope, rootScope, compile, timeout, location;
  const compileElement = () => {

    if (!scope) {
      scope = rootScope.$new();
    }

    element = angular.element('<xos-loader></xos-loader>');
    compile(element)(scope);
    scope.$digest();
    isolatedScope = element.isolateScope().vm;
  };

  beforeEach(inject(function ($q: ng.IQService, $compile: ng.ICompileService, $rootScope: ng.IScope, $timeout: ng.ITimeoutService, $location: ng.ILocationService) {
    compile = $compile;
    rootScope = $rootScope;
    timeout = $timeout;
    location = $location;
    spyOn(location, 'path');

    MockDiscover.discover = jasmine.createSpy('discover')
      .and.callFake(() => {
        const d = $q.defer();
        d.resolve(true);
        return d.promise;
      });

    MockOnboarder.onboard = jasmine.createSpy('onboard')
      .and.callFake(() => {
        const d = $q.defer();
        d.resolve();
        return d.promise;
      });
  }));

  describe('when models are already loaded', () => {

    beforeEach(() => {
      compileElement();
      spyOn(isolatedScope, 'moveOnTo');
      isolatedScope.run();
      timeout.flush();
    });

    it('should redirect to the last visited page', (done) => {
      window.setTimeout(() => {
        expect(isolatedScope.moveOnTo).toHaveBeenCalledWith('/test');
        expect(location.path).toHaveBeenCalledWith('/test');
        done();
      }, 600);
    });
  });

  describe('when the last visited page is "loader"', () => {

    beforeEach(() => {
      MockConfig.lastVisitedUrl = '/loader';
      compileElement();
      spyOn(isolatedScope, 'moveOnTo');
      isolatedScope.run();
    });

    it('should redirect to the "dashboard" page', (done) => {
      window.setTimeout(() => {
        expect(isolatedScope.moveOnTo).toHaveBeenCalledWith('/loader');
        expect(location.path).toHaveBeenCalledWith('/dashboard');
        done();
      }, 600);
    });
  });

  describe('when user is not authenticated', () => {

    beforeEach(() => {
      loaded = false;
      authenticated = false;
      compileElement();
      isolatedScope.run();
    });

    it('should redirect to the login page', () => {
      expect(MockState.go).toHaveBeenCalledWith('xos.login');
    });

    afterEach(() => {
      authenticated = true;
    });
  });

  describe('when models are not loaded', () => {

    beforeEach(() => {
      loaded = false;
      compileElement();
      spyOn(isolatedScope, 'moveOnTo');
    });

    it('should call XosModelDiscoverer.discover', () => {
      expect(MockDiscover.discover).toHaveBeenCalled();
    });
  });

});
