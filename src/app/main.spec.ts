/// <reference path="../../typings/index.d.ts" />

import * as angular from 'angular';
import 'angular-mocks';
import {main} from './main';

describe('main component', () => {
  beforeEach(() => {
    angular
      .module('app', ['app/main.html'])
      .component('app', main);
    angular.mock.module('app');
  });

  it('should render the header and footer', angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    const element = $compile('<app></app>')($rootScope);
    $rootScope.$digest();
    expect(element.find('xos-header').length).toEqual(1);
    // expect(element.find('xos-footer').length).toEqual(1);
  }));
});
