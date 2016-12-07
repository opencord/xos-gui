/// <reference path="../../../../typings/index.d.ts"/>

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {IInstance} from '../../interfaces/instance.interface';
import {InstanceService} from '../rest/instance.service';
import * as _ from 'lodash';
import {IWSEvent} from '../../interfaces/ws.interface';
import {GlobalEvent} from '../websockets/websocket.global';

@Injectable()
export class InstanceStore {
  private _instances: BehaviorSubject<IInstance[]> = new BehaviorSubject([]);
  constructor(private instanceService: InstanceService, private globalEvent: GlobalEvent) {
    this.loadInitialData();
    this.globalEvent.list()
      .filter((e: IWSEvent) => {
        console.log('filter', e);
        return e.model === 'Instance';
      })
      .subscribe(
        (event: IWSEvent) => {

          const collection = this._instances.value;

          const exist = _.find(collection, (i) => {
            return i.id === event.msg.object.id;
          });

          // remove in order to update
          if (exist) {
            _.remove(collection, {id: event.msg.object.id});
          }
          collection.push(event.msg.object);
          this._instances.next(collection);
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
