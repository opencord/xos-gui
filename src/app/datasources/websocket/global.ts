import * as io from 'socket.io-client';
import {Subject, Observable} from 'rxjs/Rx';
import {AppConfig} from '../../config/app.config';

export interface IWSEvent {
  model: string;
  msg: {
    changed_fields: string[],
    object?: any,
    pk?: number
  };
}

export interface IWSEventService {
  list(): Observable<IWSEvent>;
}

export class WebSocketEvent {
  private _events: Subject<IWSEvent> = new Subject<IWSEvent>();
    private socket;
    constructor() {
      console.log('socket.io');
      this.socket = io(AppConfig.websocketClient);
      this.socket.on('event', (data: IWSEvent): void => {
          this._events.next(data);
        });
    }
    list() {
      return this._events.asObservable();
    }
}
