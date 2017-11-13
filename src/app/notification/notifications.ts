
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

import './notifications.scss';
import {IXosModelStoreService, XosModelStore} from "../datasources/stores/model.store";
import {XosModelDiscovererService} from "../datasources/helpers/model-discoverer.service";
import {ModelRest} from "../datasources/rest/model.rest";

class XosNotifications {
  static $inject = [XosModelStore, XosModelDiscovererService, ModelRest];
  public constructor (
    private XosModelStore: IXosModelStoreService,
    private XosModelDiscovererService: any,
    private ModelRest: any
  ){
  }

  // store length of the notifications
  // create a notifications array
  // create notification fetching service (maybe this should go in a separate .ts file

}

export const xosNotifications: angular.IComponentOptions = {
  template: require('./notifications.html'),
  controllerAs: 'vm',
  controller: XosNotifications,
};
