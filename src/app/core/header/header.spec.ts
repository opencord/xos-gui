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

interface ImockToastr {
  info(msg: string, title: string): void;
}

const MockToastr: ImockToastr = {
  info: jasmine.createSpy('info')
};

const MockToastrConfig = {};

const infoNotification = {
  model: 'TestModel',
  msg: {
    changed_fields: ['backend_status'],
    pk: 1,
    object: {
      name: 'TestName',
      backend_status: '1 - Test Status'
    }
  }
};

describe('header component', () => {
  beforeEach(() => {
    angular
      .module('xosHeader', ['app/core/header/header.html'])
      .component('xosHeader', xosHeader)
      .service('SynchronizerStore', MockStore)
      .value('toastr', MockToastr)
      .value('toastrConfig', MockToastrConfig);
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
    const header = $('a.navbar-brand .brand-title', element).text();
    expect(header.trim()).toEqual(StyleConfig.projectName);
  });

  it('should configure toastr', () => {
    expect(MockToastrConfig).toEqual({
      newestOnTop: false,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      preventOpenDuplicates: false,
      progressBar: true,
    });
  });

  it('should display a toastr for a new notification', () => {
    sendEvent(infoNotification);
    scope.$digest();

    expect(MockToastr.info).toHaveBeenCalledWith('Synchronization started for: TestName', 'TestModel');
  });

  // TODO test error and success toaster call
});
