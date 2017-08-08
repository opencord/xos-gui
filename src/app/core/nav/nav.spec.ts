
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


/// <reference path="../../../../typings/index.d.ts" />

import * as $ from 'jquery';
import 'jasmine-jquery';
import * as angular from 'angular';
import 'angular-mocks';
import {IXosNavigationRoute} from '../services/navigation';
import {xosNav} from './nav';

let element, scope: angular.IRootScopeService, compile: ng.ICompileService, isolatedScope;

let baseRoutes: IXosNavigationRoute[] = [
  {label: 'Home', state: 'xos'},
  {label: 'Core', state: 'xos.core'}
];

const NavigationService = function(){
  this.query = () => baseRoutes;
};

const AuthMock = {
  logout: jasmine.createSpy('logout').and.returnValue({then: () => {
    return;
  }})
};

describe('Nav component', () => {
  beforeEach(() => {
    angular
      .module('xosNav', ['app/core/nav/nav.html', 'ui.router'])
      .component('xosNav', xosNav)
      .service('XosNavigationService', NavigationService)
      .value('AuthService', AuthMock)
      .value('StyleConfig', {})
      .value('XosSidePanel', {})
      .value('XosComponentInjector', {});
    angular.mock.module('xosNav');
  });

  beforeEach(angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    scope = $rootScope;
    compile = $compile;
    element = $compile('<xos-nav></xos-nav>')($rootScope);
    $rootScope.$digest();
    isolatedScope = element.isolateScope();

    // clear routes
    isolatedScope.routes = [];
  }));

  it('should render a list of routes', () => {
    const routes = $('.nav li:not(.nav-info)', element);
    expect(routes.length).toBe(2);
  });

  it('should render child routes', () => {
    baseRoutes = [
      {label: 'Home', state: 'xos'},
      {label: 'Core', state: 'xos.core', children: [
        {label: 'Slices', state: 'xos.core.slices', parent: 'xos.core'}
      ]}
    ];
    scope.$apply();
    const childRouteContainer = $('.nav-second li', element);
    expect(childRouteContainer.length).toBe(1);
  });

  it('should call the logout method', () => {
    // NOTE upgrade to test the ng-click binding
    // const btn = $(element).find('.nav-info .btn-block');
    // btn.click();
    // scope.$digest();
    isolatedScope.vm.logout();
    expect(AuthMock.logout).toHaveBeenCalled();
  });
});
