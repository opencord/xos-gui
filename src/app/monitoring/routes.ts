export default routesConfig;

function routesConfig($stateProvider: angular.ui.IStateProvider, $locationProvider: angular.ILocationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('');

  $stateProvider
    .state('xos.xosMonitoringDashboard', {
      url: 'monitoring',
      abstract: true,
      template: '<div ui-view></div>'
    })
    .state('xos.xosMonitoringDashboard.dashboard', {
      url: '/dashboard',
      parent: 'xos.xosMonitoringDashboard',
      component: 'xosMonitoringDashboard'
    })
    .state('xos.xosMonitoringDashboard.samples', {
      url: '/dashboard/:name/:tenant/samples',
      parent: 'xos.xosMonitoringDashboard',
      component: 'xosMonitoringSamples'
    });
}
