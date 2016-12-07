/// <reference path="../../../../typings/index.d.ts"/>

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {IInstance} from '../../interfaces/models.interface';
import {InstanceService} from '../rest/instance.service';
import * as _ from 'lodash';
import {IWSEvent} from '../../interfaces/ws.interface';
import {GlobalEvent} from '../websockets/websocket.global';
import {ObservaleCollectionHandler} from '../helpers/store.service';

@Injectable()
export class InstanceStore {
  private _instances: BehaviorSubject<IInstance[]> = new BehaviorSubject([]);
  constructor(private instanceService: InstanceService, private globalEvent: GlobalEvent) {
    this.loadInitialData();
    this.globalEvent.list()
      .filter((e: IWSEvent) => e.model === 'Instance')
      .subscribe(
        (event: IWSEvent) => {
          ObservaleCollectionHandler.update(event, this._instances);
        }
      );
  }

  loadInitialData() {
    this.instanceService.query()
      .subscribe(
        res => {
          this._instances.next(res);
        },
        err => console.log('Error retrieving Instances', err)
      );
  }

  query() {
    return this._instances.asObservable();
  }

}
