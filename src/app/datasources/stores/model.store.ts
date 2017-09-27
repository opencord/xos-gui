
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/// <reference path="../../../../typings/index.d.ts"/>
import * as _ from 'lodash';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {IWSEvent, IWSEventService} from '../websocket/global';
import {IXosResourceService} from '../rest/model.rest';
import {IStoreHelpersService} from '../helpers/store.helpers';
import {IXosDebouncer} from '../../core/services/helpers/debounce.helper';
import {IXosModeldefsCache} from '../helpers/modeldefs.service';

export interface  IXosModelStoreService {
  query(model: string, apiUrl?: string): Observable<any>;
  get(model: string, id: string | number): Observable<any>;
  search(modelName: string): any[];
}

export class XosModelStore implements IXosModelStoreService {
  static $inject = [
    '$log',
    'WebSocket',
    'StoreHelpers',
    'ModelRest',
    'XosDebouncer',
    'XosModeldefsCache'
  ];
  private _collections: any; // NOTE contains a map of {model: BehaviourSubject}
  private efficientNext: any; // NOTE debounce next
  constructor(
    private $log: ng.ILogService,
    private webSocket: IWSEventService,
    private storeHelpers: IStoreHelpersService,
    private ModelRest: IXosResourceService,
    private XosDebouncer: IXosDebouncer,
    private XosModeldefsCache: IXosModeldefsCache
  ) {
    this._collections = {};
    this.efficientNext = this.XosDebouncer.debounce(this.next, 500, this, false);
  }

  public query(modelName: string, apiUrl?: string): Observable<any> {
    this.$log.debug(`[XosModelStore] QUERY: ${modelName}`);
    // if there isn't already an observable for that item
    // create a new one and .next() is called by this.loadInitialData once data are received
    if (!this._collections[modelName]) {
      this._collections[modelName] = new BehaviorSubject([]); // NOTE maybe this can be created when we get response from the resource
      this.loadInitialData(modelName, apiUrl);
    }
    // else manually trigger the next with the last know value to trigger the subscribe method of who's requesting this data
    else {
      this.$log.debug(`[XosModelStore] QUERY: Calling "next" on: ${modelName}`);
      this.efficientNext(this._collections[modelName]);
    }

    // NOTE do we need to subscriber every time we query?
    this.webSocket.list()
      .filter((e: IWSEvent) => e.model === modelName)
      .subscribe(
        (event: IWSEvent) => {
          this.storeHelpers.updateCollection(event, this._collections[modelName]);
        },
        err => this.$log.error
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

  public get(modelName: string, modelId: string | number): Observable<any> {
    this.$log.debug(`[XosModelStore] GET: ${modelName} [${modelId}]`);
    const subject = new BehaviorSubject({});

    if (angular.isString(modelId)) {
      modelId = parseInt(modelId, 10);
    }

    this.query(modelName)
      .subscribe((res) => {
        const model = _.find(res, {id: modelId});
        if (model) {
          this.$log.debug(`[XosModelStore] GET: Calling "next" on: ${modelName} [${modelId}]`);
          subject.next(model);
        }
      });

    return subject.asObservable();
  }

  private next(subject: BehaviorSubject<any>): void {
    subject.next(subject.value);
  }

  private loadInitialData(model: string, apiUrl?: string) {
    // TODO provide always the apiUrl together with the query() params
    if (!angular.isDefined(apiUrl)) {
      apiUrl = this.XosModeldefsCache.getApiUrlFromModel(this.XosModeldefsCache.get(model));
    }
    this.ModelRest.getResource(apiUrl).query().$promise
      .then(
        res => {
          this._collections[model].next(res);
        })
      .catch(
        err => {
          this._collections[model].error(err);
        }
      );
  }
}
