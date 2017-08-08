
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
import {IXosResourceService} from './model.rest';
import {xosDataSources} from '../index';

let service: IXosResourceService;
let resource: ng.resource.IResourceClass<any>;
let httpBackend: ng.IHttpBackendService;
let $resource;
let $scope;

const MockAppCfg = {
  apiEndpoint: 'http://xos-test:3000/api',
  websocketClient: 'http://xos-test:3000'
};

describe('The ModelRest service', () => {

  beforeEach(angular.mock.module(xosDataSources));

  beforeEach(() => {

    angular.module(xosDataSources)
      .constant('AppConfig', MockAppCfg);

    angular.mock.module(xosDataSources);
  });


  beforeEach(angular.mock.inject((
    ModelRest: IXosResourceService,
    $httpBackend: ng.IHttpBackendService,
    _$resource_: ng.resource.IResourceService,
    _$rootScope_: ng.IRootScopeService
  ) => {
    service = ModelRest;
    httpBackend = $httpBackend;
    $resource = _$resource_;
    $scope = _$rootScope_;
  }));

  it('should return a resource based on the URL', () => {
    resource = service.getResource('/core/test');
    expect(resource.constructor).toEqual($resource.constructor);
  });

  it('should have a query method', (done) => {
    httpBackend.expectGET(`${MockAppCfg.apiEndpoint}/core/test`)
      .respond([
        {status: 'ok'}
      ]);
    resource = service.getResource('/core/test');
    resource.query().$promise
      .then((res) => {
        expect(res[0].status).toEqual('ok');
        done();
      })
      .catch(e => {
        done(e);
      });
    $scope.$apply();
    httpBackend.flush();
  });

  it('should have a get method', (done) => {
    httpBackend.expectGET(`${MockAppCfg.apiEndpoint}/core/test/1`)
      .respond([
        {status: 'ok'}
      ]);
    resource = service.getResource('/core/test');
    resource.get({id: 1}).$promise
      .then((res) => {
        expect(res[0].status).toEqual('ok');
        done();
      })
      .catch(e => {
        done(e);
      });
    $scope.$apply();
    httpBackend.flush();
  });
});
