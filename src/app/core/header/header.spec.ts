
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
    changed_fields: ['backend_status', 'backend_code'],
    pk: 1,
    object: {
      name: 'TestName',
      backend_status: 'In Progress',
      backend_code: 0
    }
  }
};

const noNotification = {
  model: 'TestModel',
  skip_notification: true,
  msg: {
    changed_fields: ['backend_status', 'backend_code'],
    pk: 1,
    object: {
      name: 'TestName',
      backend_status: 'In Progress',
      backend_code: 0
    }
  }
};

const MockXosKeyboardShortcut = {
  registerKeyBinding: jasmine.createSpy('registerKeyBinding')
};

describe('header component', () => {
  beforeEach(() => {
    angular
      .module('xosHeader', ['app/core/header/header.html', 'ui.router'])
      .component('xosHeader', xosHeader)
      .service('SynchronizerStore', MockStore)
      .value('toastr', MockToastr)
      .value('toastrConfig', MockToastrConfig)
      .value('AuthService', MockAuth)
      .value('XosNavigationService', {})
      .value('ConfigHelpers', {
        stateWithParamsForJs: () => null
      })
      .value('XosKeyboardShortcut', MockXosKeyboardShortcut)
      .value('StyleConfig', {
        logo: 'cord-logo.png',
      })
      .value('SearchService', {});

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
    MockToastr.info.calls.reset();
  }));

  it('should render the appropriate logo', () => {
    const header = $('a.navbar-brand img', element).attr('src');
    // webpack convert img to base64, how to test?
    expect(header.trim()).not.toBeNull();
  });

  it('should register a keyboard shortcut', () => {
    expect(MockXosKeyboardShortcut.registerKeyBinding).toHaveBeenCalled();
    // expect(MockXosKeyboardShortcut.registerKeyBinding).toHaveBeenCalledWith({
    //   key: 'f',
    //   description: 'Select search box',
    //   cb: () => {
    //     $('.navbar-form input').focus();
    //   },
    // }, 'global');
  });

  it('should print user email', () => {
    expect($('.profile-address', element).text()).toBe('test@xos.us');
  });

  it('should configure toastr', () => {
    delete MockToastrConfig['onTap'];

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

    expect(MockToastr.info).toHaveBeenCalledWith('Synchronization started for: TestName', 'TestModel', {extraData: {dest: null}});
  });

  it('should not display a toastr for a new event that use skip_notification', () => {
    sendEvent(noNotification);
    scope.$digest();

    expect(MockToastr.info).not.toHaveBeenCalled();
  });

  // TODO test error and success toaster call
});
