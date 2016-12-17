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
  private _collection: BehaviorSubject<any[]> = new BehaviorSubject([]);
  constructor(
    private webSocket: IWSEventService,
    private storeHelpers: IStoreHelpersService,
    private ModelRest: IXosResourceService
  ) {
  }

  query(model: string) {
    this.loadInitialData(model);
    this.webSocket.list()
      .filter((e: IWSEvent) => e.model === model)
      .subscribe(
        (event: IWSEvent) => {
          this.storeHelpers.updateCollection(event, this._collection);
        },
        err => console.error
      );
    return this._collection.asObservable();
  }

  private loadInitialData(model: string) {
    const endpoint = `/core/${model.toLowerCase()}s`; // NOTE check is pluralize is better
    this.ModelRest.getResource(endpoint).query().$promise
      .then(
        res => {
          this._collection.next(res);
        },
        err => console.log(`Error retrieving ${model}`, err)
      );
  }
}
