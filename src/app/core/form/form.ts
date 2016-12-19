// TODO clean this mess

import * as _ from 'lodash';
import {IXosFormHelpersService} from './form-helpers';
import {IXosConfigHelpersService} from '../services/helpers/config.helpers';

class FormCtrl {
  $inject = ['$onInit', '$scope', 'XosFormHelpers', 'ConfigHelpers'];

  public ngModel: any;
  public excludedField: string[];
  public formField: any;
  private config: any;

  constructor (
    private $scope: ng.IScope,
    private XosFormHelpers: IXosFormHelpersService,
    private ConfigHelpers: IXosConfigHelpersService
  ) {

  }

  $onInit() {
    if (!this.config) {
      throw new Error('[xosForm] Please provide a configuration via the "config" attribute');
    }

    if (!this.config.actions) {
      throw new Error('[xosForm] Please provide an action list in the configuration');
    }

    if (!this.config.feedback) {
      this.config.feedback =  {
        show: false,
        message: 'Form submitted successfully !!!',
        type: 'success'
      };
    }

    // TODO Define this list in a service (eg: ConfigHelper)
    this.excludedField = this.ConfigHelpers.excluded_fields;
    if (this.config && this.config.exclude) {
      this.excludedField = this.excludedField.concat(this.config.exclude);
    }

    this.formField = [];

    this.$scope.$watch(() => this.config, () => {
      if (!this.ngModel) {
        return;
      }
      let diff = _.difference(Object.keys(this.ngModel), this.excludedField);
      let modelField = this.XosFormHelpers.parseModelField(diff);
      this.formField = this.XosFormHelpers.buildFormStructure(modelField, this.config.fields, this.ngModel, this.config.order);
    }, true);

    this.$scope.$watch(() => this.ngModel, (model) => {
      console.log(this.ngModel);
      // empty from old stuff
      this.formField = {};
      if (!model) {
        return;
      }
      let diff = _.difference(Object.keys(model), this.excludedField);
      let modelField = this.XosFormHelpers.parseModelField(diff);
      this.formField = this.XosFormHelpers.buildFormStructure(modelField, this.config.fields, model, this.config.order);
      console.log(this.formField);
    });

  }
}

export const xosForm: angular.IComponentOptions = {
  template: require('./form.html'),
  controllerAs: 'vm',
  controller: FormCtrl,
  bindings: {
    ngModel: '=',
    config: '='
  }
};
