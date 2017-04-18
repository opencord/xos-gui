import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {XosModelDiscovererService, IXosModelDiscovererService} from './model-discoverer.service';
import {IXosModeldef} from '../rest/modeldefs.rest';
import {BehaviorSubject} from 'rxjs';

const stubModels: IXosModeldef[] = [
  {
    fields: [
      {name: 'id', type: 'number'},
      {name: 'foo', type: 'string'}
    ],
    relations: [],
    name: 'Node',
    app: 'core'
  },
  {
    fields: [
      {name: 'id', type: 'number'},
      {name: 'bar', type: 'string'}
    ],
    relations: [],
    name: 'VSGTenant',
    app: 'service.vsg'
  }
];

let service: IXosModelDiscovererService;
let scope: ng.IScope;
const MockXosModelDefs = {
  get: null
};
let MockXosRuntimeStates = {
  addState: jasmine.createSpy('runtimeState.addState')
    .and.callFake(() => true)
};
let MockConfigHelpers = {
  pluralize: jasmine.createSpy('config.pluralize')
    .and.callFake((string: string) => `${string}s`),
  toLabel: jasmine.createSpy('config.toLabel')
    .and.callFake((string: string) => string.toLowerCase()),
  modelToTableCfg: jasmine.createSpy('config.modelToTableCfg')
    .and.callFake(() => true),
  modelToFormCfg: jasmine.createSpy('config.modelToFormCfg')
    .and.callFake(() => true),
};
let MockXosNavigationService = {
  add: jasmine.createSpy('navigationService.add')
    .and.callFake(() => true)
};
const MockXosModelStore = {
  query: jasmine.createSpy('modelStore.query')
    .and.callFake(() => {
      const list = new BehaviorSubject([]);
      list.next([]);
      return list.asObservable();
    })
};
const MockProgressBar = {
  setColor: jasmine.createSpy('progressBar.setColor'),
  start: jasmine.createSpy('progressBar.start'),
  complete: jasmine.createSpy('progressBar.complete')
};
const MockngProgressFactory = {
  createInstance: jasmine.createSpy('ngProgress.createInstance')
    .and.callFake(() => MockProgressBar)
};

describe('The ModelDicoverer service', () => {

  beforeEach(() => {
    angular
      .module('test', [])
      .service('XosModelDiscoverer', XosModelDiscovererService)
      .value('ConfigHelpers', MockConfigHelpers)
      .value('XosModelDefs', MockXosModelDefs)
      .value('XosRuntimeStates', MockXosRuntimeStates)
      .value('XosModelStore', MockXosModelStore)
      .value('ngProgressFactory', MockngProgressFactory)
      .value('XosNavigationService', MockXosNavigationService);

    angular.mock.module('test');
  });

  beforeEach(angular.mock.inject((
    XosModelDiscoverer: IXosModelDiscovererService,
    $rootScope: ng.IScope,
    $q: ng.IQService
  ) => {
    service = XosModelDiscoverer;
    scope = $rootScope;
    MockXosModelDefs.get = jasmine.createSpy('modelDefs.get')
      .and.callFake(() => {
        const d = $q.defer();
        d.resolve(stubModels);
        return d.promise;
      });
  }));

  it('should setup the progress bar', () => {
    expect(MockngProgressFactory.createInstance).toHaveBeenCalled();
    expect(MockProgressBar.setColor).toHaveBeenCalled();
  });

  it('should not have loaded models', () => {
    expect(service.areModelsLoaded()).toBeFalsy();
  });

  it('should get the url from a core model', () => {
    const model = {
      name: 'Node',
      app: 'core',
      fields: []
    };
    expect(service.getApiUrlFromModel(model)).toBe('/core/nodes');
  });

  it('should get the url from a service model', () => {
    const model = {
      name: 'Tenant',
      app: 'services.test',
      fields: []
    };
    expect(service.getApiUrlFromModel(model)).toBe('/test/tenants');
  });

  it('should retrieve a model definition from local cache', () => {
    const model = {
      name: 'Node',
      app: 'core'
    };
    service['xosModels'] = [
      model
    ];
    expect(service.get('Node')).toEqual(model);
  });

  describe('when discovering models', () => {
    beforeEach(() => {
      spyOn(service, 'cacheModelEntries').and.callThrough();
      spyOn(service, 'addState').and.callThrough();
      spyOn(service, 'addNavItem').and.callThrough();
      spyOn(service, 'getTableCfg').and.callThrough();
      spyOn(service, 'getFormCfg').and.callThrough();
      spyOn(service, 'storeModel').and.callThrough();
    });

    it('should call all the function chain', (done) => {
      service.discover()
        .then((res) => {
          expect(MockProgressBar.start).toHaveBeenCalled();
          expect(MockXosModelDefs.get).toHaveBeenCalled();
          expect(service['cacheModelEntries'].calls.count()).toBe(2);
          expect(service['addState'].calls.count()).toBe(2);
          expect(service['addNavItem'].calls.count()).toBe(2);
          expect(service['getTableCfg'].calls.count()).toBe(2);
          expect(service['getFormCfg'].calls.count()).toBe(2);
          expect(service['storeModel'].calls.count()).toBe(2);
          expect(res).toBeTruthy();
          done();
        });
      scope.$apply();
    });
  });
});
