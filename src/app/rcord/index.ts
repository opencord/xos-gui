
import * as angular from 'angular';

import 'angular-ui-router';
import 'angular-resource';
import 'angular-cookies';
import {RCordGraphReducer, IRCordGraphReducer} from './services/graph.extension';

export const rcordModule = 'xos-rcordModule-gui-extension';

angular.module(rcordModule, [
  'ui.router',
])
  .service('RCordGraphReducer', RCordGraphReducer)
  .run(function($log: ng.ILogService, RCordGraphReducer: IRCordGraphReducer) {
    $log.info('[xos-rcordModule-graph-gui-extension] App is running');
    RCordGraphReducer.setup();
  });
