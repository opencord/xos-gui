
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


import {
  IXosCrudRelationService, XosCrudRelationService, IXosCrudRelationFormTabData,
  IXosCrudRelationTableTabData
} from './crud.relations.service';
import {BehaviorSubject} from 'rxjs';
import {ConfigHelpers} from '../../core/services/helpers/config.helpers';
import {XosFormHelpers} from '../../core/form/form-helpers';

const XosModelStoreMock = {
  get: null,
  query: null
};

const XosModeldefsCacheMock = {
  get: null
};

let service, scope;

describe('The XosCrudRelation service', () => {
  beforeEach(() => {
    angular
      .module('test', ['ui.router', 'toastr'])
      .service('XosCrudRelation', XosCrudRelationService)
      .value('XosModelStore', XosModelStoreMock)
      .value('XosModeldefsCache', XosModeldefsCacheMock)
      .service('ConfigHelpers', ConfigHelpers)
      .service('XosFormHelpers', XosFormHelpers);

    angular.mock.module('test');
  });

  beforeEach(angular.mock.inject((XosCrudRelation: IXosCrudRelationService, $rootScope: ng.IScope) => {
    service = XosCrudRelation;
    scope = $rootScope;
  }));

  it('should have the correct methods', () => {
    expect(service.getModel).toBeDefined();
    expect(service.getModels).toBeDefined();
    expect(service.existsRelatedItem).toBeDefined();
  });

  describe('the existsRelatedItem method', () => {
    it('should return true if the we have a reference to the related model', () => {
      const relation = {
        model: 'Test',
        type: 'manytoone',
        on_field: 'test'
      };
      const item = {test_id: 5};

      const res = service.existsRelatedItem(relation, item);
      expect(res).toBeTruthy();
    });
    it('should return false if the we don\'t have a reference to the related model', () => {
      const relation = {
        model: 'Test',
        type: 'manytoone',
        on_field: 'test'
      };
      const item = {foo: 5};

      const res = service.existsRelatedItem(relation, item);
      expect(res).toBeFalsy();
    });
  });

  describe('the getHumanReadableOnField method', () => {
    it('should return a human readable version of the on_field param', () => {
      const relation = {
        model: 'Test',
        type: 'onetomany',
        on_field: 'relate_to_test'
      };

      const res = service.getHumanReadableOnField(relation, 'Instance');
      expect(res).toEqual('[Relate to test]');
    });

    it('should return am empty string if the on_field param equal the model param', () => {
      const relation = {
        model: 'Test',
        type: 'onetomany',
        on_field: 'test'
      };

      const res = service.getHumanReadableOnField(relation, 'Instance');
      expect(res).toEqual('');
    });

    it('should return am empty string if the type on_field equal the base model', () => {
      const relation = {
        model: 'Test',
        type: 'manytoone',
        on_field: 'instance'
      };

      const res = service.getHumanReadableOnField(relation, 'Instance');
      expect(res).toEqual('');
    });
  });

  describe('the getModel method', () => {
    it('should return the tab config for a single object', (done) => {
      const relation = {
        model: 'Test',
        type: 'manytoone',
        on_field: 'test'
      };

      const resModel = {foo: 'bar'};
      const resFormCfg = {form: 'config'};

      spyOn(XosModelStoreMock, 'get').and.callFake(() => {
        const subject = new BehaviorSubject({});
        subject.next(resModel);
        return subject.asObservable();
      });
      spyOn(XosModeldefsCacheMock, 'get').and.returnValue({formCfg: resFormCfg});

      service.getModel(relation, '5')
        .then((res: IXosCrudRelationFormTabData) => {
          expect(res.model).toEqual(resModel);
          expect(res.class).toEqual('full');
          expect(res.formConfig).toEqual(resFormCfg);
          done();
        });
      scope.$apply();
    });
  });

  describe('the getModels method', () => {
    it('should return one related model', (done) => {
      const relation = {
        model: 'Test',
        type: 'onetomany',
        on_field: 'test'
      };

      const resModels = [
        {test_id: 5},
        {test_id: 25}
      ];
      const resTableCfg = {table: 'config'};

      spyOn(XosModelStoreMock, 'query').and.callFake(() => {
        const subject = new BehaviorSubject(resModels);
        return subject.asObservable();
      });
      spyOn(XosModeldefsCacheMock, 'get').and.returnValue({tableCfg: resTableCfg});

      service.getModels(relation, 5)
        .then((res: IXosCrudRelationTableTabData) => {
          expect(res.model.length).toEqual(1);
          expect(res.class).toEqual('full');
          expect(res.tableConfig).toEqual({
            table: 'config',
            filter: null
          });
          done();
        });
      scope.$apply();
    });

    it('should not return related models', (done) => {
      const relation = {
        model: 'Test',
        type: 'onetomany',
        on_field: 'test'
      };

      const resModels = [
        {test_id: 15},
        {test_id: 25}
      ];
      const resTableCfg = {table: 'config'};

      spyOn(XosModelStoreMock, 'query').and.callFake(() => {
        const subject = new BehaviorSubject(resModels);
        return subject.asObservable();
      });
      spyOn(XosModeldefsCacheMock, 'get').and.returnValue({tableCfg: resTableCfg});

      service.getModels(relation, 5)
        .then((res: IXosCrudRelationTableTabData) => {
          expect(res.model.length).toEqual(0);
          expect(res.class).toEqual('empty');
          expect(res.tableConfig).toEqual({
            table: 'config',
            filter: null
          });
          done();
        });
      scope.$apply();
    });
  });
});
