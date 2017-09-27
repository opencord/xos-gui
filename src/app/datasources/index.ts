
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


import {ModelRest} from './rest/model.rest';
import {AuthService} from './rest/auth.rest';
import {WebSocketEvent} from './websocket/global';
import {XosModelStore} from './stores/model.store';
import {StoreHelpers} from './helpers/store.helpers';
import {SynchronizerStore} from './stores/synchronizer.store';
import {XosModeldefsService} from './rest/modeldefs.rest';
import {xosCore} from '../core/index';
import {SearchService} from './helpers/search.service';
import {XosModelDiscovererService} from './helpers/model-discoverer.service';
import {XosModeldefsCache} from './helpers/modeldefs.service';

export const xosDataSources = 'xosDataSources';

angular
  .module(xosDataSources, ['ngCookies', 'ngResource', xosCore])
  .service('ModelRest', ModelRest)
  .service('AuthService', AuthService)
  .service('WebSocket', WebSocketEvent)
  .service('XosModeldefsCache', XosModeldefsCache)
  .service('StoreHelpers', StoreHelpers)
  .service('SynchronizerStore', SynchronizerStore)
  .service('XosModelStore', XosModelStore)
  .service('XosModelDefs', XosModeldefsService)
  .service('SearchService', SearchService);

angular
  .module(xosDataSources)
  .service('XosModelDiscoverer', XosModelDiscovererService);
