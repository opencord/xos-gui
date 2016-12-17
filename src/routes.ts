/// <reference path="../typings/index.d.ts" />

export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider, $locationProvider: angular.ILocationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('');
  $urlRouterProvider.otherwise('/');

  // TODO onload redirect to correct URL
  // routes are created asynchronously so by default any time you reload
  // you end up in /

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
    .state('xos.nodes', {
      url: 'nodes',
      parent: 'xos',
      template: '<h1>Nodes</h1>'
    });
}
