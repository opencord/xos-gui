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
import {IWSEvent, IWSEventService, WebSocketEvent} from './global';

const MockAppCfg = {
  apiEndpoint: 'http://xos-test:3000/api',
  websocketClient: 'http://xos-test:3000'
};

class MockSocket {
  private cbs = {};

  public on(event: string, cb: any) {
    this.cbs[event] = cb;
  }

  public send(evt: string, data: any) {
    const cb = this.cbs[evt];
    cb(data);
  }

  public clean() {
    this.cbs = {};
  }
}

describe('The WebSocket service', () => {

  let service, observable, mockWS;

  beforeEach(() => {

    mockWS = new MockSocket();

    angular
      .module('WebSocketEvent', [])
      .service('WebSocket', WebSocketEvent)
      .constant('AppConfig', MockAppCfg)
      .value('SocketIo', {socket: mockWS});

    angular.mock.module('WebSocketEvent');
  });

  beforeEach(angular.mock.inject((
    WebSocket: IWSEventService
  ) => {
    service = WebSocket;
    observable = service['_events'];

    spyOn(observable, 'next');
  }));

  afterEach(() => {
    mockWS.clean();
    observable.next.calls.reset();
  });

  it('should have a list method', () => {
    expect(service.list).toBeDefined();
  });

  describe('the update event', () => {
    it('should update the base class', () => {
      const data: IWSEvent = {
        model: 'Test',
        msg: {
          pk: 1,
          changed_fields: ['name'],
          object: {}
        }
      };
      mockWS.send('update', data);
      expect(observable.next).toHaveBeenCalledWith(data);
      expect(observable.next.calls.count()).toBe(1);
    });

    it('should not update the class if the changed_fields are not useful to the UI', () => {
      const data: IWSEvent = {
        model: 'Test',
        msg: {
          pk: 1,
          changed_fields: ['created', 'updated', 'backend_register', 'backend_status', 'policy_status'],
          object: {}
        }
      };
      mockWS.send('update', data);
      expect(observable.next).not.toHaveBeenCalled();
    });

    it('should update parent classes (if any)', () => {
      const data: IWSEvent = {
        model: 'ONOSApp',
        msg: {
          pk: 1,
          changed_fields: ['name'],
          object: {
            class_names: 'ONOSApp,ONOSApp_decl,ServiceInstance,XOSBase,Model,PlModelMixIn,AttributeMixin,object'
          }
        }
      };
      mockWS.send('update', data);
      expect(observable.next).toHaveBeenCalledWith(data);
      const siEvent = data;
      siEvent.model = 'ServiceInstance';
      siEvent.skip_notification = true;
      expect(observable.next).toHaveBeenCalledWith(siEvent);
      expect(observable.next.calls.count()).toBe(2);
    });
  });

  describe('the remove event', () => {
    it('should trigger the remove event', () => {
      const data: IWSEvent = {
        model: 'Test',
        msg: {
          pk: 1,
          changed_fields: [],
          object: {}
        },
      };
      mockWS.send('remove', data);
      expect(observable.next).toHaveBeenCalledWith(data);
    });

    it('should update parent classes (if any)', () => {
      const data: IWSEvent = {
        model: 'ONOSApp',
        msg: {
          pk: 1,
          changed_fields: ['name'],
          object: {
            class_names: 'ONOSApp,ONOSApp_decl,ServiceInstance,XOSBase,Model,PlModelMixIn,AttributeMixin,object'
          }
        }
      };
      mockWS.send('remove', data);
      expect(observable.next).toHaveBeenCalledWith(data);
      const siEvent = data;
      siEvent.model = 'ServiceInstance';
      siEvent.skip_notification = true;
      expect(observable.next).toHaveBeenCalledWith(siEvent);
      expect(observable.next.calls.count()).toBe(2);
    });

    it('should update derived class if the original is _decl', () => {
      const data: IWSEvent = {
        model: 'ONOSApp_decl',
        msg: {
          pk: 1,
          changed_fields: ['name'],
          object: {
            class_names: 'ONOSApp_decl,ServiceInstance,XOSBase,Model,PlModelMixIn,AttributeMixin,object'
          }
        }
      };
      mockWS.send('remove', data);

      const nextData = angular.copy(data);
      nextData.model = 'ONOSApp';
      expect(observable.next).toHaveBeenCalledWith(nextData);
      const declEvent = nextData;
      declEvent.model = 'ServiceInstance';
      declEvent.skip_notification = true;
      expect(observable.next).toHaveBeenCalledWith(declEvent);
      expect(observable.next.calls.count()).toBe(2);
    });
  });
});
