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

import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {xosDebugModel} from './debug-model';

const MockConfigHelpers = {
  toLabel: jasmine.createSpy('toLabel')
};

const model = {
  policed: 1503009920,
  backend_register: '{\"next_run\": 0, \"last_success\": 1502860176.52445, \"exponent\": 0}',
  backend_status: '1 - OK',
  id: 1,
  backend_need_delete: true,
  self_content_type_id: 'core.instance',
  backend_need_reap: false,
  no_sync: false,
  updated: 1503009920,
  deleted: false,
  policy_status: '2 - AuthorizationFailure(Authorization Failed: SSL exception connecting to https://192.168.108.119:5000/v2.0/tokens,) // Exception(Ansible playbook failed. // Error in creating the server, please check logs,) // The VM is available but not Active. state:ERROR,)',
  lazy_blocked: false,
  enacted: 1503009920,
  enabled: 1503009920,
  leaf_model_name: 'Instance',
  created: 1503009920,
  write_protect: false,
  no_policy: false,
  class_names: 'Instance,XOSBase'
};

describe('The xosDebugModel component', () => {
  let scope, rootScope, element, compile , isolatedScope;

  const compileElement = () => {

    if (!scope) {
      scope = rootScope.$new();
    }

    element = angular.element(`<xos-debug-model ng-model="model"></xos-debug-model>`);
    compile(element)(scope);
    scope.$digest();
    isolatedScope = element.isolateScope().vm;
  };

  beforeEach(() => {
    angular.module('xosDebugModel', [])
      .component('xosDebugModel', xosDebugModel)
      .value('ConfigHelpers', MockConfigHelpers);
    angular.mock.module('xosDebugModel');

    inject(($compile: ng.ICompileService, $rootScope: ng.IScope) => {
      rootScope = $rootScope;
      compile = $compile;
    });
  });

  it('should have a toLabel method', () => {
    compileElement();
    expect(isolatedScope.toLabel).toBeDefined();
    isolatedScope.toLabel('a');
    expect(MockConfigHelpers.toLabel).toHaveBeenCalledWith('a');
  });

  describe('the parseField method', () => {
    beforeEach(() => {
      scope = rootScope.$new();
      scope.model = model;
      compileElement();
    });

    it('should convert dates', () => {
      const dateFields = ['created', 'updated', 'enacted', 'policed'];

      dateFields.forEach(f => {
        const date = isolatedScope.parseField(f, model[f]);
        expect(date).toEqual(new Date(model[f] * 1000).toString());
      });
    });

    it('should convert strings to JSON', () => {
      const res = isolatedScope.parseField('backend_register', model['backend_register']);
      expect(res.next_run).toBe(0);
      expect(res.exponent).toBe(0);
    });

    it('should parse backend_status and policy_status', () => {
      const policy = isolatedScope.parseField('policy_status', model['policy_status']);
      expect(policy.match(/\n/g).length).toBe(3);
    });
  });
});
