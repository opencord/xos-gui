import {xosDataSources} from '../datasources/index';
import {XosServiceGraphStore} from './services/graph.store';
import {xosCore} from '../core/index';
import {XosCoarseTenancyGraph} from './components/coarse/coarse.component';
export const xosServiceGraph = 'xosServiceGraph';

angular
  .module(xosServiceGraph, [xosDataSources, xosCore])
  .service('XosServiceGraphStore', XosServiceGraphStore)
  .component('xosCoarseTenancyGraph', XosCoarseTenancyGraph)
  .run(($log: ng.ILogService) => {
    $log.info(`[${xosServiceGraph}] Module Setup`);
  });
