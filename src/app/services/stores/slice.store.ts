/// <reference path="../../../../typings/index.d.ts"/>

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {ISlice} from '../../interfaces/models.interface';
import {IWSEvent} from '../../interfaces/ws.interface';
import {GlobalEvent} from '../websockets/websocket.global';
import {SliceService} from '../rest/slices.service';
import {ObservableCollectionHandler} from '../helpers/store.service';

@Injectable()
export class SliceStore {
  private _slices: BehaviorSubject<ISlice[]> = new BehaviorSubject([]);
  constructor(private sliceService: SliceService, private globalEvent: GlobalEvent) {
    this.loadInitialData();
    this.globalEvent.list()
      .filter((e: IWSEvent) => e.model === 'Slice')
      .subscribe(
        (event: IWSEvent) => {
          ObservableCollectionHandler.update(event, this._slices);
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
