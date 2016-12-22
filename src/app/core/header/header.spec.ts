/// <reference path="../../../../typings/index.d.ts" />

import * as $ from 'jquery';
import 'jasmine-jquery';
import * as angular from 'angular';
import 'angular-mocks';
import {xosHeader, INotification} from './header';
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

const MockToastr = {
  info: jasmine.createSpy('info')
};

const MockAuth = {
  getUser: () => {
    return {email: 'test@xos.us'};
  }
};

const MockToastrConfig = {};

const infoNotification = {
  model: 'TestModel',
  msg: {
    changed_fields: ['backend_status'],
    pk: 1,
    object: {
      name: 'TestName',
      backend_status: '0 - In Progress'
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
      .value('toastrConfig', MockToastrConfig)
      .value('AuthService', MockAuth);
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

  it('should render the appropriate logo', () => {
    const header = $('a.navbar-brand img', element).attr('src');
    // webpack convert img to base64, how to test?
    expect(header.trim()).not.toBeNull();
  });

  it('should print user email', () => {
    expect($('.profile-address', element).text()).toBe('test@xos.us');
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
