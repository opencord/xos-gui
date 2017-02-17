/// <reference path="../../../../typings/index.d.ts"/>
import * as _ from 'lodash';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {IWSEvent, IWSEventService} from '../websocket/global';
import {IXosResourceService} from '../rest/model.rest';
import {IStoreHelpersService} from '../helpers/store.helpers';

export interface  IXosModelStoreService {
  query(model: string, apiUrl?: string): Observable<any>;
  search(modelName: string): any[];
}

export class XosModelStore implements IXosModelStoreService {
  static $inject = ['$log', 'WebSocket', 'StoreHelpers', 'ModelRest'];
  private _collections: any; // NOTE contains a map of {model: BehaviourSubject}
  constructor(
    private $log: ng.ILogService,
    private webSocket: IWSEventService,
    private storeHelpers: IStoreHelpersService,
    private ModelRest: IXosResourceService,
  ) {
    this._collections = {};
  }

  public query(modelName: string, apiUrl: string): Observable<any> {
    // if there isn't already an observable for that item
    if (!this._collections[modelName]) {
      this._collections[modelName] = new BehaviorSubject([]); // NOTE maybe this can be created when we get response from the resource
      this.loadInitialData(modelName, apiUrl);
    }

    this.webSocket.list()
      .filter((e: IWSEvent) => e.model === modelName)
      .subscribe(
        (event: IWSEvent) => {
          this.storeHelpers.updateCollection(event, this._collections[modelName]);
        },
        err => console.error
      );

    return this._collections[modelName].asObservable();
  }

  public search(modelName: string): any[] {
    try {
      const res =  _.reduce(Object.keys(this._collections), (results, k) => {
        let partialRes;
        // NOTE wrapped in a try catch as some subject may be errored, due to not available REST endpoint
        try {
          partialRes = _.filter(this._collections[k].value, i => {
            if (i && i.humanReadableName) {
              return i.humanReadableName.toLowerCase().indexOf(modelName) > -1;
            }
            else if (i && i.name) {
              return i.name.toLowerCase().indexOf(modelName) > -1;
            }
            return false;
          });
        } catch (e) {
          partialRes = [];
        }
        partialRes.map(m => {
          m.modelName = k;
          return m;
        });
        return results.concat(partialRes);
      }, []);
      return res;
    } catch (e) {
      return [];
    }
  }

  public get(model: string, id: number) {
    // TODO implement a get method
  }

  private loadInitialData(model: string, apiUrl?: string) {
    // TODO provide alway the apiUrl togheter with the query() params
    if (!angular.isDefined(apiUrl)) {
      // NOTE check what is the correct pattern to pluralize this
      apiUrl = this.storeHelpers.urlFromCoreModel(model);
    }
    this.ModelRest.getResource(apiUrl).query().$promise
      .then(
        res => {
          this._collections[model].next(res);
        })
      .catch(
        // TODO understand how to send an error to an observable
        err => {
          this._collections[model].error(err);
          // this.$log.log(`Error retrieving ${model}`, err);
        }
      );
  }
}
