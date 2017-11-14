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

import {XosServiceGraphExtender, IXosServiceGraphExtender} from './services/graph.extender';
import {XosGraphHelpers} from './services/d3-helpers/graph-elements.helpers';
import {XosServiceGraph} from './components/graph/graph.component';
import {XosGraphStore} from './services/graph.store';
import {XosServiceGraphIcons} from './services/d3-helpers/graph-icons.service';
import {XosNodePositioner} from './services/node-positioner.service';
import {XosGraphConfig} from './services/graph.config';
import {XosNodeRenderer} from './services/renderer/node.renderer';

export const xosServiceGraph = 'xosServiceGraph';

angular
  .module(xosServiceGraph, [])
  .service('XosServiceGraphExtender', XosServiceGraphExtender)
  .service('XosGraphHelpers', XosGraphHelpers)
  .service('XosGraphStore', XosGraphStore)
  .service('XosServiceGraphIcons', XosServiceGraphIcons)
  .service('XosNodePositioner', XosNodePositioner)
  .service('XosGraphConfig', XosGraphConfig)
  .service('XosNodeRenderer', XosNodeRenderer)
  .component('xosServiceGraph', XosServiceGraph)
  .run((
    $log: ng.ILogService,
    XosServiceGraphExtender: IXosServiceGraphExtender
  ) => {
    $log.info(`[${xosServiceGraph}] Module Setup`);
  });
