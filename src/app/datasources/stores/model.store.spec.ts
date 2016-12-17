import * as angular from 'angular';
import 'angular-mocks';
import 'angular-resource';
import {IModelStoreService, ModelStore} from './model.store';
import {Subject} from 'rxjs';
import {IWSEvent} from '../websocket/global';
import {StoreHelpers} from '../helpers/store.helpers';
import {ModelRest} from '../rest/model.rest';
import {AppConfig} from '../../config/app.config';

let service: IModelStoreService;
let httpBackend: ng.IHttpBackendService;
let $scope;
let WebSocket;

class MockWs {
  private _list;
  constructor() {
    this._list = new Subject<IWSEvent>();
  }
  list() {
    return this._list.asObservable();
  }

  next(event: IWSEvent) {
    this._list.next(event);
  }
}

const queryData = [
  {id: 1, name: 'foo'},
  {id: 1, name: 'bar'}
];

describe('The ModelStore service', () => {

  beforeEach(() => {
    angular
      .module('ModelStore', ['ngResource'])
      .service('WebSocket', MockWs)
      .service('StoreHelpers', StoreHelpers) // TODO mock
      .service('ModelRest', ModelRest) // TODO mock
      .service('ModelStore', ModelStore);

    angular.mock.module('ModelStore');
  });

  beforeEach(angular.mock.inject((
    ModelStore: IModelStoreService,
    $httpBackend: ng.IHttpBackendService,
    _$rootScope_: ng.IRootScopeService,
    _WebSocket_: any
  ) => {
    service = ModelStore;
    httpBackend = $httpBackend;
    $scope = _$rootScope_;
    WebSocket = _WebSocket_;

    // ModelRest will call the backend
    httpBackend.expectGET(`${AppConfig.apiEndpoint}/core/samples`)
      .respond(queryData);
  }));

  it('should return an Observable', () => {
    expect(typeof service.query('test').subscribe).toBe('function');
  });

  it('the first event should be the resource response', (done) => {
    let event = 0;
    service.query('sample')
      .subscribe(collection => {
        event++;
        if (event === 2) {
          expect(collection[0].id).toEqual(queryData[0].id);
          expect(collection[1].id).toEqual(queryData[1].id);
          done();
        }
      });
    $scope.$apply();
    httpBackend.flush();
  });

  describe('when a web-socket event is received for that model', () => {
    it('should update the collection', (done) => {
      let event = 0;
      service.query('sample')
        .subscribe(
          collection => {
            event++;
            if (event === 3) {
              expect(collection[0].id).toEqual(queryData[0].id);
              expect(collection[1].id).toEqual(queryData[1].id);
              expect(collection[2].id).toEqual(3);
              expect(collection[2].name).toEqual('baz');
              done();
            }
          },
          err => {
            console.log(err);
            done(err);
          }
        );
      window.setTimeout(() => {
        WebSocket.next({
          model: 'sample',
          msg: {
            changed_fields: ['id'],
            object: {id: 3, name: 'baz'},
            pk: 3
          }
        });
      }, 1);
      $scope.$apply();
      httpBackend.flush();
    });
  });
});
