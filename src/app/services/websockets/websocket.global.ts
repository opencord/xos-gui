/// <reference path="../../../../typings/index.d.ts"/>

import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Rx';
import * as io from 'socket.io-client';
import {AppConfig} from '../../config/app.config';
import {IWSEvent} from '../../interfaces/ws.interface';

@Injectable()
export class GlobalEvent {
  private _events: Subject<IWSEvent> = new Subject<IWSEvent>();
  private socket;
  constructor() {
    this.socket = io(AppConfig.websocketClient);
    this.socket.on('event', (data: IWSEvent): void => {
      console.log('event', data);
      this._events.next(data);
    });
  }
  list() {
    return this._events.asObservable();
  }
}
