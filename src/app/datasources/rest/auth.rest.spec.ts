
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
import 'angular-cookies';
import {xosDataSources} from '../index';
import {IXosAuthService} from './auth.rest';

let service: IXosAuthService;
let httpBackend: ng.IHttpBackendService;
let $scope;
let $cookies;

const MockAppCfg = {
  apiEndpoint: 'http://xos-test:3000/api',
  websocketClient: 'http://xos-test:3000'
};

describe('The AuthService service', () => {

  beforeEach(angular.mock.module(xosDataSources));

  beforeEach(() => {

    angular.module(xosDataSources)
      .constant('AppConfig', MockAppCfg);

    angular.mock.module(xosDataSources);
  });


  beforeEach(angular.mock.inject((
    AuthService: IXosAuthService,
    $httpBackend: ng.IHttpBackendService,
    _$rootScope_: ng.IRootScopeService,
    _$cookies_: ng.cookies.ICookiesService
  ) => {
    service = AuthService;
    httpBackend = $httpBackend;
    $scope = _$rootScope_;
    $cookies = _$cookies_;
  }));

  describe('when logging in', () => {
    beforeEach(() => {
      httpBackend.expectPOST(`${MockAppCfg.apiEndpoint}/utility/login/`)
        .respond({
          user: JSON.stringify({usernane: 'test@xos.org'}),
          xoscsrftoken: 'token',
          xossessionid: 'session'
        });
    });
    it('should store user auth in cookies', (done) => {
      service.login({username: 'test', password: 'xos'})
        .then((res) => {
          expect($cookies.get('xoscsrftoken')).toEqual('token');
          expect($cookies.get('xossessionid')).toEqual('session');
          expect($cookies.get('xosuser')).toEqual(JSON.stringify({usernane: 'test@xos.org'}));
          done();
        })
        .catch(e => {
          done(e);
        });
      $scope.$apply();
      // httpBackend.flush();
    });
  });

  describe('when logging out', () => {
    beforeEach(() => {
      httpBackend.expectPOST(`${MockAppCfg.apiEndpoint}/utility/logout/`)
        .respond({
          user: JSON.stringify({usernane: 'test@xos.org'}),
          xoscsrftoken: 'token',
          xossessionid: 'session'
        });
    });
    it('should remove user auth from cookies', (done) => {
      service.logout()
        .then((res) => {
          expect($cookies.get('sessionid')).toEqual(undefined);
          done();
        })
        .catch(e => {
          done(e);
        });
      $scope.$apply();
      // httpBackend.flush();
    });
  });

  describe('the handleUnauthenticatedRequest method', () => {

    beforeEach(() => {
      spyOn(service, 'clearUser');
    });

    it('should logout the user and redirect to login', () => {
      service.handleUnauthenticatedRequest({
        error: 'XOSPermissionDenied',
        fields: {},
        specific_error: 'test'
      });
      expect(service.clearUser).toHaveBeenCalled();
    });

    it('should catch errors from strings', () => {
      service.handleUnauthenticatedRequest('{"fields": {}, "specific_error": "failed to authenticate token g09et150o2s25kdzg8t2n9wotvds9jyl", "error": "XOSPermissionDenied"}');
      expect(service.clearUser).toHaveBeenCalled();
    });

    it('should not catch other errors', () => {
      service.handleUnauthenticatedRequest({
        error: 'XOSProgrammingError',
        fields: {},
        specific_error: 'test'
      });
      expect(service.clearUser).not.toHaveBeenCalled();

      service.handleUnauthenticatedRequest('some error');
      expect(service.clearUser).not.toHaveBeenCalled();
    });
  });
});
