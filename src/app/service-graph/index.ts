import {xosDataSources} from '../datasources/index';
import {XosServiceGraphStore} from './services/graph.store';
import {xosCore} from '../core/index';
import {XosCoarseTenancyGraph} from './components/coarse/coarse.component';
import {XosFineGrainedTenancyGraph} from './components/fine-grained/fine-grained.component';
import {XosServiceGraphExtender, IXosServiceGraphExtender} from './services/graph.extender';
import {IXosServiceGraph} from './interfaces';
export const xosServiceGraph = 'xosServiceGraph';

angular
  .module(xosServiceGraph, [xosDataSources, xosCore])
  .service('XosServiceGraphStore', XosServiceGraphStore)
  .service('XosServiceGraphExtender', XosServiceGraphExtender)
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

    XosServiceGraphExtender.register('coarse', 'test', (graph: IXosServiceGraph) => {
      graph.nodes = graph.nodes.map(n => {
        n.label = `reduced_${n.label}`;
        return n;
      });
      return graph;
    });
  });
