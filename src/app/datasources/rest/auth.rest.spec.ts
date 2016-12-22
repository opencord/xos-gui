import * as angular from 'angular';
import 'angular-mocks';
import 'angular-resource';
import 'angular-cookies';
import {xosDataSources} from '../index';
import {AppConfig} from '../../config/app.config';
import {IXosAuthService} from './auth.rest';

let service: IXosAuthService;
let httpBackend: ng.IHttpBackendService;
let $scope;
let $cookies;

describe('The AuthService service', () => {

  beforeEach(angular.mock.module(xosDataSources));

  beforeEach(() => {
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
      httpBackend.expectPOST(`${AppConfig.apiEndpoint}/utility/login/`)
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
      httpBackend.flush();
    });
  });

  describe('when logging out', () => {
    beforeEach(() => {
      httpBackend.expectPOST(`${AppConfig.apiEndpoint}/utility/logout/`)
        .respond({
          user: JSON.stringify({usernane: 'test@xos.org'}),
          xoscsrftoken: 'token',
          xossessionid: 'session'
        });
    });
    it('should remove user auth from cookies', (done) => {
      service.logout()
        .then((res) => {
          expect($cookies.get('xoscsrftoken')).toEqual(undefined);
          expect($cookies.get('xossessionid')).toEqual(undefined);
          expect($cookies.get('xosuser')).toEqual(undefined);
          done();
        })
        .catch(e => {
          done(e);
        });
      $scope.$apply();
      httpBackend.flush();
    });
  });
});
