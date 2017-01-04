import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {StoreHelpers, IStoreHelpersService} from './store.helpers';
import {ModelHelpers} from './model.helpers';
import {ModelRest} from '../rest/model.rest';
import {BehaviorSubject} from 'rxjs';
import {IWSEvent} from '../websocket/global';

let service: IStoreHelpersService;
let subject: BehaviorSubject<any>;
let resource: ng.resource.IResourceClass<any>;
let $resource: ng.resource.IResourceService;

describe('The StoreHelpers service', () => {

  beforeEach(() => {
    angular
      .module('test', ['ngResource'])
      .service('ModelHelpers', ModelHelpers) // NOTE evaluate mock
      .service('ModelRest', ModelRest) // NOTE evaluate mock
      .service('StoreHelpers', StoreHelpers);

    angular.mock.module('test');
  });

  beforeEach(angular.mock.inject((
    StoreHelpers: IStoreHelpersService,
    _$resource_: ng.resource.IResourceService
  ) => {
    $resource = _$resource_;
    resource = $resource('/test');
    service = StoreHelpers;
  }));

  it('should have an update collection method', () => {
    expect(service.updateCollection).toBeDefined();
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
