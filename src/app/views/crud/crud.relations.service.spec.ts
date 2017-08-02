import {
  IXosCrudRelationService, XosCrudRelationService, IXosCrudRelationFormTabData,
  IXosCrudRelationTableTabData
} from './crud.relations.service';
import {BehaviorSubject} from 'rxjs';

const XosModelStoreMock = {
  get: null,
  query: null
};

const XosModelDiscovererMock = {
  get: null
};

let service, scope;

describe('The XosCrudRelation service', () => {
  beforeEach(() => {
    angular
      .module('test', [])
      .service('XosCrudRelation', XosCrudRelationService)
      .value('XosModelStore', XosModelStoreMock)
      .value('XosModelDiscoverer', XosModelDiscovererMock);

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
      spyOn(XosModelDiscovererMock, 'get').and.returnValue({formCfg: resFormCfg});

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
      spyOn(XosModelDiscovererMock, 'get').and.returnValue({tableCfg: resTableCfg});

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
      spyOn(XosModelDiscovererMock, 'get').and.returnValue({tableCfg: resTableCfg});

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
