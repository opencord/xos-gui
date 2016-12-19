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
