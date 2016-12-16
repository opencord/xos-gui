/// <reference path="../../../../typings/index.d.ts" />

import * as $ from 'jquery';
import 'jasmine-jquery';
import * as angular from 'angular';
import 'angular-mocks';
import {xosHeader, INotification} from './header';
import {StyleConfig} from '../../config/style.config';
import {Subject} from 'rxjs';

let element, scope: angular.IRootScopeService, compile: ng.ICompileService, isolatedScope;
const events = new Subject();
const sendEvent = (event: INotification): void => {
  events.next(event);
};
const MockStore = function() {
  this.query = () => {
    return events.asObservable();
  };
};
const sampleNotification = {
  model: 'TestModel',
  msg: {
    changed_fields: ['backend_status'],
    pk: 1,
    object: {
      name: 'TestName',
      backend_status: 'Test Status'
    }
  }
};

describe('header component', () => {
  beforeEach(() => {
    angular
      .module('xosHeader', ['app/core/header/header.html'])
      .component('xosHeader', xosHeader)
      .service('SynchronizerStore', MockStore);
    angular.mock.module('xosHeader');
  });

  beforeEach(angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    scope = $rootScope;
    compile = $compile;
    element = $compile('<xos-header></xos-header>')($rootScope);
    $rootScope.$digest();
    isolatedScope = element.isolateScope();

    // clear notifications
    isolatedScope.notifications = [];
  }));

  it('should render the appropriate title', () => {
    const header = element.find('a');
    expect(header.html().trim()).toEqual(StyleConfig.projectName);

    const badge = $('i.badge', element);
    expect(badge.length).toBe(0);
  });

  it('should display a badge if there are unread notifications', () => {
    sendEvent(sampleNotification);
    scope.$digest();

    const badge = $('i.badge', element);
    expect(badge.length).toBe(1);
  });

  it('should not display a badge if there are notifications have been read', () => {
    sendEvent(angular.extend({viewed: true}, sampleNotification));
    scope.$digest();

    const badge = $('i.badge', element);
    expect(badge.length).toBe(0);
  });

  it('should display a list of notifications', () => {
    isolatedScope.showNotification = true;
    sendEvent(angular.extend({viewed: true}, sampleNotification));
    sendEvent(angular.extend({viewed: false}, sampleNotification));
    scope.$digest();

    const badge = $('i.badge', element);
    expect(badge.length).toBe(1);
    const notificationPanel = $('.notification-panel', element);
    expect(notificationPanel.length).toBe(1);

    expect($('.notification-panel li', element).length).toBe(2);
  });

  it('should add the viewed class to an readed notification', () => {
    isolatedScope.showNotification = true;
    sendEvent(angular.extend({viewed: true}, sampleNotification));
    scope.$digest();
    expect($('.notification-panel li:first-child', element)).toHaveClass('viewed');
    scope.$digest();
  });

  it('should not add the viewed class to an unread notification', () => {
    isolatedScope.showNotification = true;
    sendEvent(angular.extend({viewed: false}, sampleNotification));
    scope.$digest();
    expect($('.notification-panel li:first-child', element)).not.toHaveClass('viewed');
    scope.$digest();
  });

});
