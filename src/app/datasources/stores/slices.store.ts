/// <reference path="../../../../typings/index.d.ts"/>

import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {IWSEvent, IWSEventService} from '../websocket/global';
import {IXosResourceService} from '../rest/slices.rest';
import {IStoreHelpersService} from '../helpers/store.helpers';

export interface  IStoreService {
  query(): Observable<any>;
}

export class SliceStore {
  static $inject = ['WebSocket', 'StoreHelpers', 'SlicesRest'];
  private _slices: BehaviorSubject<any[]> = new BehaviorSubject([]);
  constructor(
    private webSocket: IWSEventService,
    private storeHelpers: IStoreHelpersService,
    private sliceService: IXosResourceService
  ) {
    this.loadInitialData();
    this.webSocket.list()
      .filter((e: IWSEvent) => e.model === 'Slice')
      .subscribe(
        (event: IWSEvent) => {
          this.storeHelpers.updateCollection(event, this._slices);
        }
      );
  }

  query() {
    return this._slices.asObservable();
  }

  private loadInitialData() {
    this.sliceService.getResource().query().$promise
      .then(
        res => {
          this._slices.next(res);
        },
        err => console.log('Error retrieving Slices', err)
      );
  }
}
