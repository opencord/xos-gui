import * as angular from 'angular';
import 'angular-mocks';
import 'angular-resource';
import 'angular-cookies';
import {IXosResourceService} from './model.rest';
import {xosDataSources} from '../index';
import {AppConfig} from '../../config/app.config';

let service: IXosResourceService;
let resource: ng.resource.IResourceClass<any>;
let httpBackend: ng.IHttpBackendService;
let $resource;
let $scope;

describe('The ModelRest service', () => {

  beforeEach(angular.mock.module(xosDataSources));

  beforeEach(() => {
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
    httpBackend.expectGET(`${AppConfig.apiEndpoint}/core/test`)
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
    httpBackend.expectGET(`${AppConfig.apiEndpoint}/core/test/1`)
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
