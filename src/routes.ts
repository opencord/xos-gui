/// <reference path="../typings/index.d.ts" />

export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider, $locationProvider: angular.ILocationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('xos', {
      abstract: true,
      url: '/',
      component: 'xos'
    })
    .state('xos.dashboard', {
      url: '',
      parent: 'xos',
      template: '<h1>Dashboard</h1>'
    })
    .state('xos.instances', {
      url: 'instances',
      parent: 'xos',
      template: '<h1>Instances</h1>'
    })
    .state('xos.slices', {
      url: 'slices',
      parent: 'xos',
      component: `xosCrud`,
      data: {
        title: 'Slices',
        resource: 'SlicesRest',
        xosTableCfg: {
          columns: [
            {
              label: 'Name',
              prop: 'name'
            },
            {
              label: 'Default Isolation',
              prop: 'default_isolation'
            }
          ]
        }
      }
    })
    .state('xos.nodes', {
      url: 'nodes',
      parent: 'xos',
      template: '<h1>Nodes</h1>'
    });
}
