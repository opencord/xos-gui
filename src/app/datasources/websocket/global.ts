import * as io from 'socket.io-client';
import {Subject, Observable} from 'rxjs/Rx';
import {IXosAppConfig} from '../../../index';

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

  static $inject = ['AppConfig'];

  private _events: Subject<IWSEvent> = new Subject<IWSEvent>();
    private socket;
    constructor(
      private AppConfig: IXosAppConfig
    ) {
      this.socket = io(this.AppConfig.websocketClient);
      this.socket.on('event', (data: IWSEvent): void => {
          this._events.next(data);
        });
    }
    list() {
      return this._events.asObservable();
    }
}
