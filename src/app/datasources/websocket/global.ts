
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


import * as io from 'socket.io-client';
import * as _ from 'lodash';
import {Subject, Observable} from 'rxjs/Rx';
import {IXosAppConfig} from '../../../index';

export interface IWSEvent {
  model: string;
  skip_notification?: boolean;
  deleted?: boolean;
  msg: {
    changed_fields: string[],
    object?: any,
    pk?: number
  };
}

export interface IWSEventService {
  list(): Observable<IWSEvent>;
}

export class WebSocketEvent implements IWSEventService {

  static $inject = [
    'AppConfig',
    'SocketIo',
    '$log'
  ];


  private _events: Subject<IWSEvent> = new Subject<IWSEvent>();
  private socket;
  constructor(
    private AppConfig: IXosAppConfig,
    private SocketIo: any,
    private $log: ng.ILogService
  ) {
    // NOTE list of field that are not useful to the UI
    const ignoredFields: string[] = ['created', 'updated', 'backend_register', 'backend_status', 'policy_status'];

    this.socket = this.SocketIo.socket;

    this.socket.on('remove', (data: IWSEvent): void => {
      this.$log.info(`[WebSocket] Received Remove Event for: ${data.model} [${data.msg.pk}]`, data);

      if (data.model.indexOf('_decl') > -1) {
        // the GUI doesn't know about _decl models,
        // send the event for the actual model
        data.model = data.model.replace('_decl', '');
      }
      this._events.next(data);

      // NOTE update observers of parent classes
      this.updateParentClasses(data);
    });

    this.socket.on('update', (data: IWSEvent): void => {

        if (data.msg.changed_fields.length === 0 || _.intersection(data.msg.changed_fields, ignoredFields).length === data.msg.changed_fields.length) {
          // NOTE means that the only updated fields does not change anything in the UI, so don't send events around
          return;
        }

        this.$log.info(`[WebSocket] Received Event for: ${data.model} [${data.msg.pk}]`, data);

        this._events.next(data);

        // NOTE update observers of parent classes
        this.updateParentClasses(data);

      });
    }

    public list() {
      return this._events.asObservable();
    }

    private updateParentClasses(data: IWSEvent) {
      if (data.msg.object.class_names && angular.isString(data.msg.object.class_names)) {
        const models = data.msg.object.class_names.split(',');
        let event: IWSEvent = angular.copy(data);
        _.forEach(models, (m: string) => {

          switch (m) {
            case 'object':
            case 'XOSBase':
            case 'Model':
            case 'PlModelMixIn':
            case 'AttributeMixin':
              // do not send events for classes that we don't care about
              break;
            default:
              if (m.indexOf('_decl') > -1 || event.model === m) {
                // do not send events for _decl classes
                // or if the parent class is the same as the model class
                return;
              }

              event.model = m;
              event.skip_notification = true;
              this._events.next(event);
          }
        });
      }
    }
}

export class SocketIoService {

  static $inject = [
    'AppConfig'
  ];

  public socket;

  constructor(
    private AppConfig: IXosAppConfig,
    private $log: ng.ILogService
  ) {
    this.socket = io(this.AppConfig.websocketClient);
  }
}
