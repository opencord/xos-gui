import * as angular from 'angular';
import 'angular-mocks';
import 'angular-resource';
import 'angular-cookies';
import {xosDataSources} from '../index';
import {AppConfig} from '../../config/app.config';
import {IModeldefsService} from './modeldefs.rest';

let service: IModeldefsService;
let httpBackend: ng.IHttpBackendService;
let $scope;

describe('The ModelDefs service', () => {

  beforeEach(angular.mock.module(xosDataSources));

  beforeEach(() => {
    angular.mock.module(xosDataSources);
  });


  beforeEach(angular.mock.inject((
    ModelDefs: IModeldefsService,
    $httpBackend: ng.IHttpBackendService,
    _$resource_: ng.resource.IResourceService,
    _$rootScope_: ng.IRootScopeService
  ) => {
    service = ModelDefs;
    httpBackend = $httpBackend;
    $scope = _$rootScope_;
  }));

  it('should have a get method', (done) => {
    httpBackend.expectGET(`${AppConfig.apiEndpoint}/utility/modeldefs/`)
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
    httpBackend.flush();
  });
});
