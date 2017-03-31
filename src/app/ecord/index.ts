import * as angular from 'angular';
import 'angular-ui-router';
import 'angular-resource';
import 'angular-cookies';
import './components/app-policies/angular-drop.js';
import {ECordFineGrainedGraphReducer, IECordFineGrainedGraphReducer} from './services/fine-grained.graph.extension';
import {ecordMicrosemi} from './components/cpe/microsemi';
import {ecordEE} from './components/ee/ee';
import {ecordAppPolicies} from './components/app-policies/app-policies';

export const ecordModule = 'xos-ecord-local-gui-extension';

angular.module(ecordModule, [
    'ui.router',
    'app',
    'ui.drop'
  ])
  .service('ECordFineGrainedGraphReducer', ECordFineGrainedGraphReducer)
  .component('ecordMicrosemi', ecordMicrosemi)
  .component('ecordEE', ecordEE)
  .component('ecordAppPolicies', ecordAppPolicies)
  .run(function($log: ng.ILogService, ECordFineGrainedGraphReducer: IECordFineGrainedGraphReducer, XosRuntimeStates: any, XosNavigationService: any) {
    $log.info('[xos-ecord-local-gui-extension] App is running');
    ECordFineGrainedGraphReducer.setup();

    XosRuntimeStates.addState(`xos.vee`, {
      abstract: true,
      template: '<div ui-view></div>'
    });

    XosRuntimeStates.addState(`xos.vee.cpe`, {
      url: 'cpe',
      parent: 'xos.vee',
      component: 'ecordMicrosemi'
    });

    XosRuntimeStates.addState(`xos.vee.ee`, {
      url: 'ee',
      parent: 'xos.vee',
      component: 'ecordEE'
    });

    XosRuntimeStates.addState(`xos.vee.app`, {
      url: 'app-policies',
      parent: 'xos.vee',
      component: 'ecordAppPolicies'
    });

    XosNavigationService.add({
      label: 'Vee',
      state: 'xos.vee',
    });

    XosNavigationService.add({
      label: 'CPE',
      state: 'xos.vee.cpe',
      parent: 'xos.vee'
    });

    XosNavigationService.add({
      label: 'EE',
      state: 'xos.vee.ee',
      parent: 'xos.vee'
    });

    XosNavigationService.add({
      label: 'App Policies',
      state: 'xos.vee.app',
      parent: 'xos.vee'
    });
  });
