
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
import * as $ from 'jquery';
import 'angular-mocks';
import {xosForm, IXosFormCfg, IXosFormInput} from './form';
import {XosFormHelpers} from './form-helpers';
import {xosField} from '../field/field';
import {xosAlert} from '../alert/alert';

describe('The Xos Form component', () => {

  let element, scope, isolatedScope, rootScope, compile;

  const compileElement = () => {

    if (!scope) {
      scope = rootScope.$new();
    }

    element = angular.element(`<xos-form config="config" ng-model="model"></xos-form>`);
    compile(element)(scope);
    scope.$digest();
    isolatedScope = element.isolateScope().vm;
  };

  const MockConfigHelpers = {
    toLabel: string => string
  };

  beforeEach(() => {

    angular
      .module('form', [])
      .component('xosForm', xosForm)
      .service('XosFormHelpers', XosFormHelpers)
      .component('xosField', xosField) // NOTE does it make sense to mock it?
      .component('xosAlert', xosAlert)
      .value('ConfigHelpers', MockConfigHelpers);

    angular.mock.module('form');

    inject(($compile: ng.ICompileService, $rootScope: ng.IScope) => {
      rootScope = $rootScope;
      compile = $compile;
    });
  });

  it('should throw an error if no config is specified', () => {
    function errorFunctionWrapper() {
      compileElement();
    }
    expect(errorFunctionWrapper).toThrow(new Error('[xosForm] Please provide a configuration via the "config" attribute'));
  });

  it('should throw an error if no actions are specified in config', () => {
    function errorFunctionWrapper() {
      scope = rootScope.$new();
      scope.config = 'green';
      compileElement();
    }
    expect(errorFunctionWrapper).toThrow(new Error('[xosForm] Please provide an action list in the configuration'));
  });

  it('should throw an error if no formName is specified in config', () => {
    function errorFunctionWrapper() {
      scope = rootScope.$new();
      scope.config = {
        actions: []
      };
      compileElement();
    }
    expect(errorFunctionWrapper).toThrow(new Error('[xosForm] Please provide a formName property in the config'));
  });

  describe('when correctly configured', () => {

    let cb = jasmine.createSpy('callback');

    beforeEach(inject(($rootScope) => {

      scope = $rootScope.$new();

      let inputs: IXosFormInput[] = [
        {
          name: 'id',
          label: 'Id:',
          type: 'number',
          validators: {}
        },
        {
          name: 'first_name',
          label: 'Name:',
          type: 'text',
          validators: {}
        },
        {
          name: 'email',
          label: 'Mail:',
          type: 'email',
          validators: {
            required: true
          }
        },
        {
          name: 'birthDate',
          label: 'DOB:',
          type: 'date',
          validators: {}
        },
        {
          name: 'enabled',
          label: 'Status:',
          type: 'boolean',
          validators: {}
        },
        {
          name: 'role',
          label: 'Role:',
          type: 'select',
          options: [
            {id: 1, label: 'user'},
            {id: 2, label: 'admin'}
          ],
          validators: {}
        }
      ];

      let config: IXosFormCfg = {
        formName: 'testForm',
        actions: [
          {
            label: 'Save',
            icon: 'ok',
            cb: cb,
            class: 'success'
          }
        ],
        inputs: inputs
      };

      scope.config = config;

      scope.model = {
        id: 1,
        first_name: 'Jhon',
        email: 'test@onlab.us',
        birthDate: new Date('2016-04-18T23:44:16.883181Z'),
        enabled: true,
        role: 1, // select
      };

      compileElement();
    }));

    it('should render 4 input field', () => {
      // boolean and select are in the form model, but are not input
      expect(Object.keys(isolatedScope.config.inputs).length).toEqual(6);
      const htmlInputs = $('input', element);
      expect(htmlInputs.length).toEqual(4);
    });

    it('should render 1 boolean field', () => {
      expect($(element).find('.boolean-field > a').length).toEqual(2);
    });

    it('when clicking on action should invoke callback', () => {
      const link = $(element).find('[role="button"]');
      link.click();
      // TODO : Check correct parameters
      expect(cb).toHaveBeenCalled();

    });

    // TODO move in xosField test
    it('should set a custom label', () => {
      let nameField = element[0].getElementsByClassName('form-group')[1];
      let label = angular.element(nameField.getElementsByTagName('label')[0]).text();
      expect(label).toContain('Name:');
      expect(label).not.toContain('*');
    });

    it('should print an * for required fields', () => {
      let nameField = element[0].getElementsByClassName('form-group')[2];
      let label = angular.element(nameField.getElementsByTagName('label')[0]).text();
      expect(label).toContain('*');
    });

    // TODO move test in xos-field
    xdescribe('the boolean field test', () => {

      let setFalse, setTrue;

      beforeEach(() => {
        setFalse = $('.boolean-field > button:first-child', element);
        setTrue = $('.boolean-field > button:last-child', element);
      });

      it('should change value to false', () => {
        expect(isolatedScope.ngModel.enabled).toEqual(true);
        setFalse.click();
        expect(isolatedScope.ngModel.enabled).toEqual(false);
      });

      it('should change value to true', () => {
        isolatedScope.ngModel.enabled = false;
        scope.$apply();
        expect(isolatedScope.ngModel.enabled).toEqual(false);
        setTrue.click();
        expect(isolatedScope.ngModel.enabled).toEqual(true);
      });
    });
  });
  describe('when correctly configured for feedback', () => {
    // NOTE move this tests in xos-alert??
    let fb = jasmine.createSpy('feedback').and.callFake(function(statusFlag: boolean) {
      if (statusFlag) {
        scope.config.feedback.show = true;
        scope.config.feedback.message = 'Form Submitted';
        scope.config.feedback.type = 'success';
      }
      else {
        scope.config.feedback.show = true;
        scope.config.feedback.message = 'Error';
        scope.config.feedback.type = 'danger';
      }
    });

    beforeEach(() => {
      scope = rootScope.$new();
      scope.config = {
          formName: 'testForm',
          feedback: {
            show: false,
            message: 'Form submitted successfully !!!',
            type: 'success'
          },
          actions: [
            {
              label: 'Save',
              icon: 'ok', // refers to bootstraps glyphicon
              cb: () => null,
              class: 'success'
            }
          ]
        };
      scope.model = {};
      compileElement();
    });

    it('should not show feedback when loaded', () => {
      expect($(element).find('xos-alert > div')).toHaveClass('alert alert-success ng-hide');
    });

    it('should show a success feedback', () => {
      fb(true);
      scope.$digest();
      expect(isolatedScope.config.feedback.type).toEqual('success');
      expect(fb).toHaveBeenCalledWith(true);
      expect($(element).find('xos-alert > div')).toHaveClass('alert alert-success');
    });

    it('should show an error feedback', function() {
      fb(false);
      scope.$digest();
      expect(isolatedScope.config.feedback.type).toEqual('danger');
      expect(fb).toHaveBeenCalledWith(false);
      expect($(element).find('xos-alert > div')).toHaveClass('alert alert-danger');
    });
  });
});
