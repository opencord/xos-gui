
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
}

export class StoreHelpers implements IStoreHelpersService {
  static $inject = [
    'ModelRest',
    'XosModeldefsCache'
  ];

  constructor (
    private modelRest: IXosResourceService,
    private XosModeldefsCache: IXosModeldefsCache
  ) {
  }

  public updateCollection(event: IWSEvent, subject: BehaviorSubject<any>): BehaviorSubject<any> {
    const collection: any[] = subject.value;
    const index: number = _.findIndex(collection, (i) => {
      // NOTE evaluate to use event.msg.pk
      return i.id === event.msg.object.id;
    });
    const exist: boolean = index > -1;
    const isDeleted: boolean = _.includes(event.msg.changed_fields, 'deleted');

    // generate a resource for the model
    const modelDef = this.XosModeldefsCache.get(event.model); // get the model definition
    const endpoint = this.XosModeldefsCache.getApiUrlFromModel(modelDef);
    const resource = this.modelRest.getResource(endpoint);
    const model = new resource(event.msg.object);

    // remove
    if (exist && isDeleted) {
       _.remove(collection, {id: event.msg.object.id});
     }
    // Replace item at index using native splice
    else if (exist && !isDeleted) {
       collection.splice(index, 1, model);
     }
    // if the element is not deleted add it
    else if (!exist && !isDeleted) {
      collection.push(model);
     }

    subject.next(collection);

    return subject;
    }
}
