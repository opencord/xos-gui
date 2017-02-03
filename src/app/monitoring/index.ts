import * as angular from 'angular';

import 'angular-ui-router';
import 'angular-resource';
import 'angular-cookies';
import routesConfig from './routes';
import {xosMonitoringDashboardComponent} from './app/dashboard/monitoring-dashboard';
import {XosMonitoringApi} from './app/services/montoring-api';
import {xosMonitoringStatsComponent} from './app/monitoring-stats/monitoring-stats';
import {xosMonitoringSamplesComponent} from './app/monitoring-samples/monitoring-samples';
import 'chart.js';
import 'angular-chart.js';

angular.module('xosMonitoringDashboard', [
  'ui.router',
  'ui.bootstrap',
  'chart.js' // TODO should this be global??
  ])
  .config(routesConfig)
  .service('XosMonitoringApi', XosMonitoringApi)
  .component('xosMonitoringDashboard', xosMonitoringDashboardComponent)
  .component('ceilometerStats', xosMonitoringStatsComponent)
  .component('xosMonitoringSamples', xosMonitoringSamplesComponent)
  .run((
    $log: ng.ILogService,
    NavigationService: any,
  ) => {
    $log.info('[xosMonitoringDashboard] App is running');

    // registering navigation items
    NavigationService.add({
      label: 'Monitoring',
      state: 'xos.xosMonitoringDashboard',
    });
    NavigationService.add({
      label: 'Dashboard',
      parent: 'xos.xosMonitoringDashboard',
      state: 'xos.xosMonitoringDashboard.dashboard',
    });
  });
