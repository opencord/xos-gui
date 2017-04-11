import * as angular from 'angular';
import 'angular-mocks';
import 'angular-resource';
import 'angular-cookies';
import {xosDataSources} from '../index';
import {IXosModeldefsService} from './modeldefs.rest';

let service: IXosModeldefsService;
let httpBackend: ng.IHttpBackendService;
let $scope;

const MockAppCfg = {
  apiEndpoint: 'http://xos-test:3000/api',
  websocketClient: 'http://xos-test:3000'
};

describe('The XosModelDefs service', () => {

  beforeEach(angular.mock.module(xosDataSources));

  beforeEach(() => {

    angular.module(xosDataSources)
      .constant('AppConfig', MockAppCfg);

    angular.mock.module(xosDataSources);
  });

  beforeEach(angular.mock.inject((
    XosModelDefs: IXosModeldefsService,
    $httpBackend: ng.IHttpBackendService,
    _$resource_: ng.resource.IResourceService,
    _$rootScope_: ng.IRootScopeService
  ) => {
    service = XosModelDefs;
    httpBackend = $httpBackend;
    $scope = _$rootScope_;
  }));

  it('should have a get method', (done) => {
    httpBackend.expectGET(`${MockAppCfg.apiEndpoint}/utility/modeldefs/`)
      .respond([
        {name: 'ok'}
      ]);
    service.get()
      .then((res) => {
        expect(res[0].name).toEqual('ok');
        done();
      })
      .catch(e => {
        done(e);
      });
    $scope.$apply();
    // httpBackend.flush();
  });
});
