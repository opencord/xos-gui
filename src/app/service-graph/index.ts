import {xosDataSources} from '../datasources/index';
import {XosServiceGraphStore} from './services/graph.store';
import {xosCore} from '../core/index';
import {XosCoarseTenancyGraph} from './three/coarse/coarse.component';
import {XosCameraService} from './three/helpers/camera.service';
import {XosNodeService} from './three/helpers/node.service';
import {XosLabelService} from './three/helpers/label.service';
import {XosLinkService} from './three/helpers/link.service';
import {GraphPositionerService} from './three/services/positioner';
export const xosServiceGraph = 'xosServiceGraph';


angular
  .module(xosServiceGraph, [xosDataSources, xosCore])
  .service('XosServiceGraphStore', XosServiceGraphStore)
  .component('xosCoarseTenancyGraph', XosCoarseTenancyGraph)
  .run(($log: ng.ILogService) => {
    $log.info(`[${xosServiceGraph}] Module Setup`);
  });

// three.js related services
angular.module(xosServiceGraph)
  .service('GraphPositionerService', GraphPositionerService)
  .service('XosCameraService', XosCameraService)
  .service('XosNodeService', XosNodeService)
  .service('XosLabelService', XosLabelService)
  .service('XosLinkService', XosLinkService);
