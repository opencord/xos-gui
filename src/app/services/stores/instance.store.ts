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
import {GlobalEvent} from '../websockets/websocket.global';

@Injectable()
export class InstanceStore {
  private _instances: BehaviorSubject<IInstance[]> = new BehaviorSubject([]);
  private socket;
  constructor(private instanceService: InstanceService, private globalEvent: GlobalEvent) {
    this.loadInitialData();
    this.globalEvent.list()
      .filter((e, i) => {
        console.log('filter', e, i, e[i - 1]);
        if(!e[i - 1]){
          return false;
        }
        return e[i - 1].model === 'Instance';
      })
      .subscribe(
        (data: IWSEvent[]) => {
          const event = data[data.length - 1];

          const collection = this._instances.value;

          const exist = _.find(collection, (i) => {
            return i.id === event.msg.object.id;
          });

          // remove in order to update
          if(exist){
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
