
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
import {StoreHelpers, IStoreHelpersService} from './store.helpers';
import {ModelRest} from '../rest/model.rest';
import {BehaviorSubject} from 'rxjs';
import {IWSEvent} from '../websocket/global';
import {ConfigHelpers} from '../../core/services/helpers/config.helpers';
import {AuthService} from '../rest/auth.rest';
import {IXosModeldefsCache} from './modeldefs.service';

let service: IStoreHelpersService;
let subject: BehaviorSubject<any>;
let resource: ng.resource.IResourceClass<any>;
let $resource: ng.resource.IResourceService;
let xosModelCache: IXosModeldefsCache;

describe('The StoreHelpers service', () => {

  beforeEach(() => {
    angular
      .module('test', ['ngResource', 'toastr', 'ngCookies'])
      .service('ConfigHelpers', ConfigHelpers) // NOTE evaluate mock
      .service('ModelRest', ModelRest) // NOTE evaluate mock
      .service('StoreHelpers', StoreHelpers)
      .service('AuthService', AuthService)
      .value('XosModeldefsCache', {
        get: jasmine.createSpy('XosModeldefsCache.get'),
        getApiUrlFromModel: jasmine.createSpy('XosModeldefsCache.getApiUrlFromModel')
      })
      .value('AppConfig', {});

    angular.mock.module('test');
  });

  beforeEach(angular.mock.inject((
    StoreHelpers: IStoreHelpersService,
    XosModeldefsCache: IXosModeldefsCache,
    _$resource_: ng.resource.IResourceService
  ) => {
    $resource = _$resource_;
    resource = $resource('/test');
    xosModelCache = XosModeldefsCache;
    service = StoreHelpers;
  }));

  it('should have an update collection method', () => {
    expect(service.updateCollection).toBeDefined();
  });

  describe('the updateCollection method', () => {

    beforeEach(() => {
      subject = new BehaviorSubject([
        new resource({id: 1, name: 'test'})
      ]);

    });

    it('should get the correct url for a core model', () => {
      const mockModelDef = {
        name: 'Node',
        app: 'core'
      };

      xosModelCache.get['and'].returnValue(mockModelDef);

      const event: IWSEvent = {
        model: 'TestModel',
        msg: {
          object: {
            id: 1,
            name: 'test'
          },
          changed_fields: ['deleted']
        }
      };

      service.updateCollection(event, subject);
      expect(xosModelCache.get).toHaveBeenCalledWith('TestModel');
      expect(xosModelCache.getApiUrlFromModel).toHaveBeenCalledWith(mockModelDef);
    });
  });

  describe('when updating a collection', () => {

    beforeEach(() => {
      subject = new BehaviorSubject([
        new resource({id: 1, name: 'test'})
      ]);
    });

    it('should remove a model if it has been deleted', () => {
      const event: IWSEvent = {
        model: 'Test',
        msg: {
          object: {
            id: 1,
            name: 'test'
          },
          changed_fields: ['deleted']
        }
      };
      service.updateCollection(event, subject);
      expect(subject.value.length).toBe(0);
    });

    it('should update a model if it has been updated', () => {
      const event: IWSEvent = {
        model: 'Test',
        msg: {
          object: {
            id: 1,
            name: 'test-updated'
          },
          changed_fields: ['name']
        }
      };
      service.updateCollection(event, subject);
      expect(subject.value.length).toBe(1);
      expect(subject.value[0].name).toBe('test-updated');
    });

    it('should add a model if it has been created', () => {
      const event: IWSEvent = {
        model: 'Test',
        msg: {
          object: {
            id: 2,
            name: 'another-test'
          },
          changed_fields: ['created']
        }
      };
      service.updateCollection(event, subject);
      expect(subject.value.length).toBe(2);
      expect(subject.value[0].name).toBe('test');
      expect(subject.value[1].name).toBe('another-test');
    });

    describe('when adding a model', () => {

      beforeEach(() => {
        const event: IWSEvent = {
          model: 'Test',
          msg: {
            object: {
              id: 2,
              name: 'another-test'
            },
            changed_fields: ['created']
          }
        };
        service.updateCollection(event, subject);
      });

      it('should create a resource', () => {
        expect(subject.value[1].$save).toBeDefined();
        expect(subject.value[1].$delete).toBeDefined();
      });

      xit('should automatically create the appropriate resource', () => {
        // TODO test that the url of the resource is the correct one,
        // use httpbackend and mock a call?? any faster way??
      });
    });
  });

});
