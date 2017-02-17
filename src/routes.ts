/// <reference path="../typings/index.d.ts" />

export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider, $locationProvider: angular.ILocationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('');
  $urlRouterProvider.otherwise('/');

  // declare here static endpoints,
  // core related endpoints are dynamically generated
  $stateProvider
    .state('xos', {
      abstract: true,
      url: '/',
      component: 'xos'
    })
    .state('xos.dashboard', {
      url: '',
      parent: 'xos',
      template: '<xos-dashboard></xos-dashboard>'
    })
    .state('xos.core', {
      url: 'core',
      parent: 'xos',
      abstract: true,
      template: '<div ui-view></div>'
    });
}
