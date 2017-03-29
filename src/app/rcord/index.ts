
import * as angular from 'angular';

import 'angular-ui-router';
import 'angular-resource';
import 'angular-cookies';
import {RCordGraphReducer, IRCordGraphReducer} from './services/graph.extension';
import {rcordSubscriber} from './components/subscribers/subscribers';
import {IXosRuntimeStatesService} from '../core/services/runtime-states';
import {IXosNavigationService} from '../core/services/navigation';

export const rcordModule = 'xos-rcordModule-gui-extension';

angular.module(rcordModule, [
  'ui.router',
])
  .service('RCordGraphReducer', RCordGraphReducer)
  .component('rcordSubscriber', rcordSubscriber)
  .run(function(
    $log: ng.ILogService,
    RCordGraphReducer: IRCordGraphReducer,
    XosRuntimeStates: IXosRuntimeStatesService,
    XosNavigationService: IXosNavigationService
  ) {
    $log.info('[xos-rcordModule-graph-gui-extension] App is running');
    RCordGraphReducer.setup();

    XosRuntimeStates.addState(`xos.subscribers-dashboard`, {
      url: 'subscriber',
      parent: 'xos',
      component: 'rcordSubscriber'
    });

    XosNavigationService.add({
      label: 'Subscribers',
      state: 'xos.subscribers-dashboard',
    });
  });
