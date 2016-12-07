/// <reference path="../../../../typings/index.d.ts"/>

import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";
import {IInstance} from '../../interfaces/instance.interface';
import {InstanceService} from '../rest/instance.service';
import * as io from 'socket.io-client';
import {AppConfig} from '../../config/app.config';
import * as _ from 'lodash';
import {IWSEvent} from '../../interfaces/ws.interface';

@Injectable()
export class GlobalEvent {
  private _events: BehaviorSubject<IWSEvent[]> = new BehaviorSubject([]);
  private socket;
  constructor() {
    this.socket = io(AppConfig.websocketClient);
    this.socket.on('event', (data: IWSEvent) => {
      const collection = this._events.value;
      collection.push(data);
      this._events.next(collection);
    });
  }

  list() {
    return this._events.asObservable();
  }

}
