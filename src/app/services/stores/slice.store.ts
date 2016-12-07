/// <reference path="../../../../typings/index.d.ts"/>

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {ISlice} from '../../interfaces/models.interface';
import * as _ from 'lodash';
import {IWSEvent} from '../../interfaces/ws.interface';
import {GlobalEvent} from '../websockets/websocket.global';
import {SliceService} from '../rest/slices.service';

@Injectable()
export class SliceStore {
  private _slices: BehaviorSubject<ISlice[]> = new BehaviorSubject([]);
  constructor(private sliceService: SliceService, private globalEvent: GlobalEvent) {
    this.loadInitialData();
    this.globalEvent.list()
      .filter((e: IWSEvent) => e.model === 'Slice')
      .subscribe(
        (event: IWSEvent) => {

          const collection = this._slices.value;

          const exist = _.find(collection, (i) => {
            return i.id === event.msg.object.id;
          });

          // remove in order to update
          if (exist) {
            _.remove(collection, {id: event.msg.object.id});
          }
          collection.push(event.msg.object);
          this._slices.next(collection);
        }
      );
  }

  loadInitialData() {
    this.sliceService.query()
      .subscribe(
        res => {
          this._slices.next(res);
        },
        err => console.log('Error retrieving Instances', err)
      );
  }

  query() {
    return this._slices.asObservable();
  }

}
