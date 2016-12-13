/// <reference path="../../../../typings/index.d.ts" />

import * as angular from 'angular';
import 'angular-mocks';
import {xosFooter} from './footer';
import {StyleConfig} from '../../config/style.config';

describe('footer component', () => {
  beforeEach(() => {
    angular
      .module('xosFooter', ['app/core/footer/footer.html'])
      .component('xosFooter', xosFooter);
    angular.mock.module('xosFooter');
  });

  it('should render "XOS Team"', angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    const element = $compile('<xos-footer></xos-footer>')($rootScope);
    $rootScope.$digest();
    const footer = element.find('a');
    expect(footer.html().trim()).toEqual(`${StyleConfig.projectName} Team`);
  }));
});
