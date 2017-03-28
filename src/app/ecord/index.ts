import * as angular from 'angular';

import 'angular-ui-router';
import 'angular-resource';
import 'angular-cookies';

import 'ngmap';
import 'angular-chart.js';

import {ecordTopology} from './components/topology/ecord-topo.component';
import {ecordLineSideForm} from './components/line-side-form/line-side-form.component';
import {ecordBandwithProfile} from './components/bandwith-profile/bandwith-profile';
import {ecordStats} from './components/stats/stats';
import {ECordGraphReducer, IECordGraphReducer} from './service/graph.extender';
import {MicrosemiStats} from './components/stats/stat-service';

export const ecordModule = 'xos-ecord-global-gui-extension';

angular.module(ecordModule, [
  'ngMap',
  'chart.js'
])
  .component('ecordTopology', ecordTopology)
  .component('ecordLineSideForm', ecordLineSideForm)
  .component('ecordBandwithProfile', ecordBandwithProfile)
  .component('ecordStats', ecordStats)
  .service('ECordGraphReducer', ECordGraphReducer)
  .service('MicrosemiStats', MicrosemiStats)
  .run(function($log: ng.ILogService, XosNavigationService: any, XosRuntimeStates: any, ECordGraphReducer: IECordGraphReducer) {
    $log.info('[xos-ecord-global-gui-extension] App is running');

    XosRuntimeStates.addState(`xos.ecord`, {
      abstract: true,
      template: '<div ui-view></div>'
    });

    XosRuntimeStates.addState(`xos.ecord.topology`, {
      url: 'topology',
      parent: 'xos.ecord',
      component: 'ecordTopology'
    });

    XosRuntimeStates.addState(`xos.ecord.stats`, {
      url: 'stats/:maName/:mepId',
      parent: 'xos.ecord',
      component: 'ecordStats'
    });

    XosNavigationService.add({
      label: 'Topology',
      state: 'xos.ecord.topology',
    });

    ECordGraphReducer.setup();
  });
