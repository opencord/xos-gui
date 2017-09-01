
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


/// <reference path="../../../../typings/index.d.ts"/>

import {Subject, Observable} from 'rxjs/Rx';
import {IWSEvent, IWSEventService} from '../websocket/global';

export interface  IStoreService {
  query(): Observable<any>;
}

export class SynchronizerStore {
  static $inject = ['WebSocket'];
  private _notifications: Subject<IWSEvent> = new Subject();
  constructor(
    private webSocket: IWSEventService
  ) {
    this.webSocket.list()
      .filter((e: IWSEvent) => {
        if (!e.msg || !e.msg.changed_fields) {
          return false;
        }
        return (e.msg.changed_fields.indexOf('backend_status') > -1 || e.msg.changed_fields.indexOf('backend_code') > -1) && !e.skip_notification;
      })
      .subscribe(
        (event: IWSEvent) => {
          this._notifications.next(event);
        }
      );
  }

  query() {
    return this._notifications.asObservable();
  }
}
