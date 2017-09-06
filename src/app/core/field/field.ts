
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


import './field.scss';
import {IXosConfigHelpersService} from '../services/helpers/config.helpers';
import {IXosFormHelpersService} from '../form/form-helpers';
import * as _ from 'lodash';

class FieldCtrl {
  static $inject = ['$attrs', '$scope', 'ConfigHelpers', 'XosFormHelpers'];
  // $inject = ['$onInit'];

  public field: any;
  public name: string;
  public ngModel: any;
  public getType = this.XosFormHelpers._getFieldFormat;
  public formatLabel = this.ConfigHelpers.toLabel;

  constructor(
    private $attrs: ng.IAttributes,
    private $scope: ng.IScope,
    private ConfigHelpers: IXosConfigHelpersService,
    private XosFormHelpers: IXosFormHelpersService
  ) {

  }

  public isEmptyObject = (o: any) => o ? Object.keys(o).length === 0 : true;

  $onInit() {
    if (!this.name) {
      throw new Error('[xosField] Please provide a field name');
    }
    if (!this.field) {
      throw new Error('[xosField] Please provide a field definition');
    }
    if (!this.field.type) {
      throw new Error('[xosField] Please provide a type in the field definition');
    }
    if (!this.$attrs['ngModel']) {
      throw new Error('[xosField] Please provide an ng-model');
    }

    // NOTE set default value (if any)
    if (angular.isDefined(this.field.default) && angular.isUndefined(this.ngModel)) {
      if (this.field.type === 'number') {
        this.ngModel = parseInt(this.field.default, 10);
      }
      else {
        this.ngModel = this.field.default;
      }
    }


    if (this.field.type === 'array') {
      this.$scope.$watch(() => this.ngModel.length, () => {
        this.field.availableOptions = _.difference(this.field.options, this.ngModel);
      });
    }

  }
}

export const xosField: angular.IComponentOptions = {
  template: require('./field.html'),
  controllerAs: 'vm',
  controller: FieldCtrl,
  bindings: {
    ngModel: '=',
    name: '=',
    field: '='
  }
};
