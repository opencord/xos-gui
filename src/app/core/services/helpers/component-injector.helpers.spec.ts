import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import * as $ from 'jquery';
import {XosComponentInjector, IXosComponentInjectorService} from './component-injector.helpers';

let service: IXosComponentInjectorService;
let element, scope: angular.IRootScopeService, compile: ng.ICompileService;

describe('The XosComponentInjector service', () => {
  beforeEach(() => {
    angular
      .module('test', [])
      .component('extension', {
        template: 'extended'
      })
      .component('target', {
        template: `<div id="target"></div>`
      })
      .service('XosComponentInjector', XosComponentInjector);

    angular.mock.module('test');
  });

  beforeEach(angular.mock.inject((
    XosComponentInjector: IXosComponentInjectorService,
  ) => {
    service = XosComponentInjector;
  }));

  beforeEach(angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    scope = $rootScope;
    compile = $compile;
    element = $compile('<target></target>')($rootScope);
    $rootScope.$digest();
  }));

  it('should have an InjectComponent method', () => {
    expect(service.injectComponent).toBeDefined();
  });

  it('should have an removeInjectedComponents method', () => {
    expect(service.removeInjectedComponents).toBeDefined();
  });

  it('should add a component to the target container', () => {
    service.injectComponent($('#target', element), 'extension');
    scope.$apply();
    const extension = $('extension', element);
    expect(extension.text()).toBe('extended');
  });
});
