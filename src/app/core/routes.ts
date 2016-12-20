export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider, $locationProvider: angular.ILocationProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      component: 'xosLogin',
      data: {
        specialClass: 'blank'
      }
    });
}

