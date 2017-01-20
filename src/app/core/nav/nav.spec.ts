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
      .service('NavigationService', NavigationService)
      .value('AuthService', AuthMock)
      .value('StyleConfig', {})
      .value('XosSidePanel', {});
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
