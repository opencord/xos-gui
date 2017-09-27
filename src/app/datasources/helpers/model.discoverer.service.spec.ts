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
import 'angular-ui-router';
import {XosModelDiscovererService, IXosModelDiscovererService} from './model-discoverer.service';
import {IXosModeldef} from '../rest/modeldefs.rest';
import {BehaviorSubject} from 'rxjs';
import {XosModeldefsCache} from './modeldefs.service';

const stubModels: IXosModeldef[] = [
  {
    fields: [
      {name: 'id', type: 'number'},
      {name: 'foo', type: 'string'}
    ],
    relations: [],
    name: 'Node',
    app: 'core',
    description: '',
    verbose_name: ''
  },
  {
    fields: [
      {name: 'id', type: 'number'},
      {name: 'bar', type: 'string'}
    ],
    relations: [],
    name: 'VSGTenant',
    app: 'service.vsg',
    description: '',
    verbose_name: ''
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
      .value('XosNavigationService', MockXosNavigationService)
      .value('AuthService', {})
      .service('XosModeldefsCache', XosModeldefsCache);

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
      fields: [],
      description: '',
      verbose_name: ''
    };
    expect(service.getApiUrlFromModel(model)).toBe('/core/nodes');
  });

  it('should get the url from a service model', () => {
    const model = {
      name: 'Tenant',
      app: 'services.test',
      fields: [],
      description: '',
      verbose_name: ''
    };
    expect(service.getApiUrlFromModel(model)).toBe('/test/tenants');
  });

  it('should get the state name from the model', () => {
    expect(service['stateNameFromModel']({name: 'Tenant', app: 'services.vsg'})).toBe('xos.vsg.tenant');
  });

  it('should get the parent state name from a core model', () => {
    expect(service['getParentStateFromModel']({name: 'Nodes', app: 'core'})).toBe('xos.core');
  });

  it('should get the parent state name from a service model', () => {
    expect(service['getParentStateFromModel']({name: 'Tenant', app: 'services.vsg'})).toBe('xos.vsg');
  });

  it('should add a new service entry in the system', () => {
    service['addService']({name: 'Tenant', app: 'services.vsg'});
    expect(MockXosRuntimeStates.addState).toHaveBeenCalledWith('xos.vsg', {
      url: 'vsg',
      parent: 'xos',
      abstract: true,
      template: '<div ui-view></div>'
    });
    expect(MockXosNavigationService.add).toHaveBeenCalledWith({
      label: 'vsg',
      state: 'xos.vsg'
    });
    expect(service['xosServices'][0]).toEqual('vsg');
    expect(service['xosServices'].length).toBe(1);
  });

  it('should add a state in the system', (done) => {
    MockXosRuntimeStates.addState.calls.reset();
    service['addState']({name: 'Tenant', app: 'services.vsg'})
      .then((model) => {
        expect(MockXosRuntimeStates.addState).toHaveBeenCalledWith('xos.vsg.tenant', {
          parent: 'xos.vsg',
          url: '/tenants/:id?',
          params: {
            id: null
          },
          data: {
            model: 'Tenant'
          },
          component: 'xosCrud',
        });
        expect(model.clientUrl).toBe('vsg/tenants/:id?');
        done();
      });
    scope.$apply();
  });

  it('should add a state with relations in the system', (done) => {
    MockXosRuntimeStates.addState.calls.reset();
    service['addState']({name: 'Tenant', app: 'services.vsg', relations: [{model: 'Something', type: 'manytoone'}]})
      .then((model) => {
        expect(MockXosRuntimeStates.addState).toHaveBeenCalledWith('xos.vsg.tenant', {
          parent: 'xos.vsg',
          url: '/tenants/:id?',
          params: {
            id: null
          },
          data: {
            model: 'Tenant',
            relations: [
              {model: 'Something', type: 'manytoone'}
            ]
          },
          component: 'xosCrud',
        });
        expect(model.clientUrl).toBe('vsg/tenants/:id?');
        done();
      });
    scope.$apply();
  });

  it('should add an item to navigation', () => {
    service['addNavItem']({name: 'Tenant', app: 'services.vsg'});
    expect(MockXosNavigationService.add).toHaveBeenCalledWith({
      label: 'Tenants',
      state: 'xos.vsg.tenant',
      parent: 'xos.vsg'
    });

    service['addNavItem']({name: 'Tenant', verbose_name: 'Verbose', app: 'services.vsg'});
    expect(MockXosNavigationService.add).toHaveBeenCalledWith({
      label: 'Verboses',
      state: 'xos.vsg.tenant',
      parent: 'xos.vsg'
    });
  });

  it('should cache a model', () => {
    service['cacheModelEntries']({name: 'Tenant', app: 'services.vsg'});
    expect(MockXosModelStore.query).toHaveBeenCalledWith('Tenant', '/vsg/tenants');
  });

  it('should get the table config', () => {
    service['getTableCfg']({name: 'Tenant', app: 'services.vsg'});
    expect(MockConfigHelpers.modelToTableCfg).toHaveBeenCalledWith(
      {name: 'Tenant', app: 'services.vsg', tableCfg: true},
      'xos.vsg.tenant'
    );
  });

  it('should get the form config', () => {
    service['getFormCfg']({name: 'Tenant', app: 'services.vsg'});
    expect(MockConfigHelpers.modelToFormCfg).toHaveBeenCalledWith(
      {name: 'Tenant', app: 'services.vsg', formCfg: true}
    );
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
          expect(MockXosModelDefs.get).toHaveBeenCalled(); // FIXME replace correct spy
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
