import {xosDataSources} from '../datasources/index';
import {XosServiceGraphStore} from './services/graph.store';
import {xosCore} from '../core/index';
import {XosCoarseTenancyGraph} from './components/coarse/coarse.component';
import {XosFineGrainedTenancyGraph} from './components/fine-grained/fine-grained.component';
export const xosServiceGraph = 'xosServiceGraph';

angular
  .module(xosServiceGraph, [xosDataSources, xosCore])
  .service('XosServiceGraphStore', XosServiceGraphStore)
  .component('xosCoarseTenancyGraph', XosCoarseTenancyGraph)
  .component('xosFineGrainedTenancyGraph', XosFineGrainedTenancyGraph)
  .config(($stateProvider) => {
    $stateProvider
      .state('xos.fine-grained-graph', {
        url: 'tenancy-graph',
        component: 'xosFineGrainedTenancyGraph',
      });
  })
  .run(($log: ng.ILogService) => {
    $log.info(`[${xosServiceGraph}] Module Setup`);
  });
