import * as angular from 'angular';
import 'angular-mocks';
import 'angular-resource';
import {IXosModelStoreService, XosModelStore} from './model.store';
import {Subject} from 'rxjs';
import {IWSEvent} from '../websocket/global';
import {StoreHelpers} from '../helpers/store.helpers';
import {ModelRest} from '../rest/model.rest';
import {ConfigHelpers} from '../../core/services/helpers/config.helpers';
import {AuthService} from '../rest/auth.rest';
import {XosDebouncer} from '../../core/services/helpers/debounce.helper';

let service: IXosModelStoreService;
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

const MockAppCfg = {
  apiEndpoint: 'http://xos-test:3000/api',
  websocketClient: 'http://xos-test:3000'
};

describe('The ModelStore service', () => {

  beforeEach(() => {
    angular
      .module('ModelStore', ['ngResource', 'toastr', 'ngCookies'])
      .service('WebSocket', MockWs)
      .service('StoreHelpers', StoreHelpers) // TODO mock
      .service('ModelRest', ModelRest) // TODO mock
      .service('XosModelStore', XosModelStore)
      .service('ConfigHelpers', ConfigHelpers) // TODO mock
      .service('AuthService', AuthService)
      .constant('AppConfig', MockAppCfg)
      .service('XosDebouncer', XosDebouncer);

    angular.mock.module('ModelStore');
  });

  beforeEach(angular.mock.inject((
    XosModelStore: IXosModelStoreService,
    $httpBackend: ng.IHttpBackendService,
    _$rootScope_: ng.IRootScopeService,
    _WebSocket_: any
  ) => {
    service = XosModelStore;
    httpBackend = $httpBackend;
    $scope = _$rootScope_;
    WebSocket = _WebSocket_;

    // ModelRest will call the backend
    httpBackend.whenGET(`${MockAppCfg.apiEndpoint}/core/samples`)
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

  describe('when multiple stores are requested', () => {

    beforeEach(() => {
      httpBackend.expectGET(`${MockAppCfg.apiEndpoint}/core/firsts`)
        .respond([
          {first: 'foo'}
        ]);
      httpBackend.expectGET(`${MockAppCfg.apiEndpoint}/core/seconds`)
        .respond([
          {second: 'foo'}
        ]);
    });
    it('should create different Subject', (done) => {
      let fevent = 0;
      let sevent = 0;
      service.query('first')
        .subscribe(first => {
          fevent++;
          if (fevent >= 2) {
            service.query('second')
              .subscribe(second => {
                sevent++;
                if (sevent === 2) {
                  expect(first).not.toEqual(second);
                  done();
                }
              });
          }
        });
      $scope.$apply();
      httpBackend.flush();
    });
  });
});
