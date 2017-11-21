
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


import {BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';
import {IWSEvent} from '../websocket/global';
import {IXosResourceService} from '../rest/model.rest';
import {IXosModeldefsCache} from './modeldefs.service';

export interface IStoreHelpersService {
  updateCollection(event: IWSEvent, subject: BehaviorSubject<any>): BehaviorSubject<any>;
  removeItemFromCollection(event: IWSEvent, subject: BehaviorSubject<any>): BehaviorSubject<any>;
}

export class StoreHelpers implements IStoreHelpersService {
  static $inject = [
    '$log',
    'ModelRest',
    'XosModeldefsCache'
  ];

  constructor (
    private $log: ng.ILogService,
    private modelRest: IXosResourceService,
    private XosModeldefsCache: IXosModeldefsCache
  ) {
  }

  public updateCollection(event: IWSEvent, subject: BehaviorSubject<any>): BehaviorSubject<any> {
    if (event.deleted) {
      this.$log.error('[XosStoreHelpers] updateCollection method has been called for a delete event, in this cale please use "removeItemFromCollection"', event);
      return;
    }
    const collection: any[] = subject.value;
    const index: number = _.findIndex(collection, (i) => {
      // NOTE evaluate to use event.msg.pk
      return i.id === event.msg.object.id;
    });
    const exist: boolean = index > -1;

    // generate a resource for the model
    const modelDef = this.XosModeldefsCache.get(event.model); // get the model definition
    const endpoint = this.XosModeldefsCache.getApiUrlFromModel(modelDef);
    const resource = this.modelRest.getResource(endpoint);
    const model = new resource(event.msg.object);

    // Replace item at index using native splice
    if (exist) {
       collection.splice(index, 1, model);
     }
    // if the element does not exist add it
    else {
      collection.push(model);
     }

    subject.next(collection);

    return subject;
    }

  public removeItemFromCollection(event: IWSEvent, subject: BehaviorSubject<any>): BehaviorSubject<any> {
    if (!event.deleted) {
      this.$log.error('[XosStoreHelpers] removeItemFromCollection method has been called for an update event, in this cale please use "updateCollection"', event);
      return;
    }
    const collection: any[] = subject.value;
    _.remove(collection, {id: event.msg.object.id});
    subject.next(collection);
    return subject;
  }
}
