/// <reference path="../../../../typings/index.d.ts"/>

import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {IWSEvent, IWSEventService} from '../websocket/global';
import {IXosResourceService} from '../rest/model.rest';
import {IStoreHelpersService} from '../helpers/store.helpers';
import {IXosModelHelpersService} from '../helpers/model.helpers';

export interface  IModelStoreService {
  query(model: string): Observable<any>;
}

export class ModelStore {
  static $inject = ['WebSocket', 'StoreHelpers', 'ModelRest', 'ModelHelpers'];
  private _collections: any; // NOTE contains a map of {model: BehaviourSubject}
  constructor(
    private webSocket: IWSEventService,
    private storeHelpers: IStoreHelpersService,
    private ModelRest: IXosResourceService,
    private ModelHelpers: IXosModelHelpersService
  ) {
    this._collections = {};
  }

  query(model: string) {
    // if there isn't already an observable for that item
    if (!this._collections[model]) {
      this._collections[model] = new BehaviorSubject([]); // NOTE maybe this can be created when we get response from the resource
      this.loadInitialData(model);
    }

    this.webSocket.list()
      .filter((e: IWSEvent) => e.model === model)
      .subscribe(
        (event: IWSEvent) => {
          this.storeHelpers.updateCollection(event, this._collections[model]);
        },
        err => console.error
      );

    return this._collections[model].asObservable();
  }

  private loadInitialData(model: string) {
    // NOTE check what is the correct pattern to pluralize this
    const endpoint = this.ModelHelpers.urlFromCoreModel(model);
    this.ModelRest.getResource(endpoint).query().$promise
      .then(
        res => {
          this._collections[model].next(res);
        },
        err => console.log(`Error retrieving ${model}`, err)
      );
  }
}
