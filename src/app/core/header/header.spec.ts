/// <reference path="../../../../typings/index.d.ts" />

import * as angular from 'angular';
import 'angular-mocks';
import {xosHeader} from './header';
import {StyleConfig} from '../../config/style.config';
import {Subject} from 'rxjs';

describe('header component', () => {
  beforeEach(() => {
    angular
      .module('xosHeader', ['app/core/header/header.html'])
      .component('xosHeader', xosHeader)
      .service('SynchronizerStore', function(){
        const events = new Subject();
        this.query = () => {
          return events.asObservable();
        };
      });
    angular.mock.module('xosHeader');
  });

  it('should render the appropriate title', angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    const element = $compile('<xos-header></xos-header>')($rootScope);
    $rootScope.$digest();
    const header = element.find('a');
    expect(header.html().trim()).toEqual(StyleConfig.projectName);
  }));
});
