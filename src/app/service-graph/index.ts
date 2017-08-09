
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


import {xosDataSources} from '../datasources/index';
import {XosServiceGraphStore} from './services/service-graph.store';
import {xosCore} from '../core/index';
import {XosCoarseTenancyGraph} from './components/coarse/coarse.component';
import {XosFineGrainedTenancyGraph} from './components/fine-grained/fine-grained.component';
import {XosServiceGraphExtender, IXosServiceGraphExtender} from './services/graph.extender';
import {XosGraphHelpers} from './services/d3-helpers/graph.helpers';
import {XosServiceInstanceGraphStore} from './services/service-instance.graph.store';
export const xosServiceGraph = 'xosServiceGraph';

angular
  .module(xosServiceGraph, [xosDataSources, xosCore])
  .service('XosServiceGraphStore', XosServiceGraphStore)
  .service('XosServiceInstanceGraphStore', XosServiceInstanceGraphStore)
  .service('XosServiceGraphExtender', XosServiceGraphExtender)
  .service('XosGraphHelpers', XosGraphHelpers)
  .component('xosCoarseTenancyGraph', XosCoarseTenancyGraph)
  .component('xosFineGrainedTenancyGraph', XosFineGrainedTenancyGraph)
  .config(($stateProvider) => {
    $stateProvider
      .state('xos.fine-grained-graph', {
        url: 'tenancy-graph',
        component: 'xosFineGrainedTenancyGraph',
      });
  })
  .run(($log: ng.ILogService, XosServiceGraphExtender: IXosServiceGraphExtender) => {
    $log.info(`[${xosServiceGraph}] Module Setup`);
  });
