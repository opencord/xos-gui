import {xosDataSources} from '../datasources/index';
import {XosServiceGraphStore} from './services/graph.store';
import {xosCore} from '../core/index';
import {XosCoarseTenancyGraph} from './components/coarse/coarse.component';
import {XosFineGrainedTenancyGraph} from './components/fine-grained/fine-grained.component';
import {XosServiceGraphExtender, IXosServiceGraphExtender} from './services/graph.extender';
import {XosGraphHelpers} from './services/d3-helpers/graph.helpers';
export const xosServiceGraph = 'xosServiceGraph';

angular
  .module(xosServiceGraph, [xosDataSources, xosCore])
  .service('XosServiceGraphStore', XosServiceGraphStore)
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
