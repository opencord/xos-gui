import * as io from 'socket.io-client';
import * as _ from 'lodash';
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

  static $inject = [
    'AppConfig',
    '$log'
  ];


  private _events: Subject<IWSEvent> = new Subject<IWSEvent>();
  private socket;
  constructor(
    private AppConfig: IXosAppConfig,
    private $log: ng.ILogService
  ) {
    // NOTE list of field that are not useful to the UI
    const ignoredFields: string[] = ['created', 'updated', 'backend_register'];

    this.socket = io(this.AppConfig.websocketClient);
    this.socket.on('event', (data: IWSEvent): void => {
        this.$log.debug(`[WebSocket] Received Event for: ${data.model} [${data.msg.pk}]`);

        if (data.msg.changed_fields.length === 0 || _.intersection(data.msg.changed_fields, ignoredFields).length === data.msg.changed_fields.length) {
          // NOTE means that the only updated fields does not change anything in the UI, so don't send events around
          this.$log.debug(`[WebSocket] Ignoring Event for: ${data.model} [${data.msg.pk}]`);
          return;
        }

        this._events.next(data);

        // NOTE update observers of parent classes
        if (data.msg.object.class_names && angular.isString(data.msg.object.class_names)) {
          const models = data.msg.object.class_names.split(',');
          _.forEach(models, (m: string) => {
            data.model = m;
            this._events.next(data);
          });
        }

      });
    }
    list() {
      return this._events.asObservable();
    }
}
