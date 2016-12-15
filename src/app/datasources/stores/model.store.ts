/// <reference path="../../../../typings/index.d.ts"/>

import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {IWSEvent, IWSEventService} from '../websocket/global';
import {IXosResourceService} from '../rest/model.rest';
import {IStoreHelpersService} from '../helpers/store.helpers';

export interface  IModelStoreService {
  query(model: string): Observable<any>;
}

export class ModelStore {
  static $inject = ['WebSocket', 'StoreHelpers', 'ModelRest'];
  private _slices: BehaviorSubject<any[]> = new BehaviorSubject([]);
  constructor(
    private webSocket: IWSEventService,
    private storeHelpers: IStoreHelpersService,
    private sliceService: IXosResourceService
  ) {
  }

  query(model: string) {
    this.loadInitialData(model);
    this.webSocket.list()
      .filter((e: IWSEvent) => e.model === model)
      .subscribe(
        (event: IWSEvent) => {
          this.storeHelpers.updateCollection(event, this._slices);
        }
      );
    return this._slices.asObservable();
  }

  private loadInitialData(model: string) {
    const endpoint = `/core/${model.toLowerCase()}s/`;
    this.sliceService.getResource(endpoint).query().$promise
      .then(
        res => {
          this._slices.next(res);
        },
        err => console.log(`Error retrieving ${model}`, err)
      );
  }
}
