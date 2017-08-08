
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/// <reference path="../typings/index.d.ts" />

export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider, $locationProvider: angular.ILocationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('');
  $urlRouterProvider.otherwise('/loader');

  // declare here static endpoints,
  // core related endpoints are dynamically generated
  $stateProvider
    .state('loader', {
      url: '/loader',
      component: 'xosLoader',
      data: {
        specialClass: 'blank'
      }
    })
    .state('xos', {
      abstract: true,
      url: '/',
      component: 'xos'
    })
    .state('xos.dashboard', {
      url: 'dashboard',
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
