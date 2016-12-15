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
        return e.msg.changed_fields.indexOf('backend_status') > -1;
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
