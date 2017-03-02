import {xosDataSources} from '../datasources/index';
import {XosServiceGraphStore} from './services/graph.store';
import {xosCore} from '../core/index';
export const xosServiceGraph = 'xosServiceGraph';

angular
  .module(xosServiceGraph, [xosDataSources, xosCore])
  .service('XosServiceGraphStore', XosServiceGraphStore)
  .run(($log: ng.ILogService, XosServiceGraphStore) => {
    $log.info(`[${xosServiceGraph}] Module Setup`);
  });
