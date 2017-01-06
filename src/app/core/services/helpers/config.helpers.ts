import * as _ from 'lodash';
import * as pluralize from 'pluralize';
import {IXosTableColumn, IXosTableCfg} from '../../table/table';
import {IModeldef} from '../../../datasources/rest/modeldefs.rest';
import {IXosFormConfig, IXosFormInput} from '../../form/form';

export interface IXosModelDefsField {
  name: string;
  type: string;
  validators?: any;
}

export interface IXosConfigHelpersService {
  excluded_fields: string[];
  modelFieldsToColumnsCfg(fields: IXosModelDefsField[], baseUrl: string): IXosTableColumn[]; // TODO use a proper interface
  modelToTableCfg(model: IModeldef, baseUrl: string): IXosTableCfg;
  modelFieldToInputCfg(fields: IXosModelDefsField[]): IXosFormInput[];
  modelToFormCfg(model: IModeldef): IXosFormConfig;
  pluralize(string: string, quantity?: number, count?: boolean): string;
  toLabel(string: string, pluralize?: boolean): string;
  toLabels(string: string[], pluralize?: boolean): string[];
  urlFromCoreModel(name: string): string;
}

export class ConfigHelpers {

  excluded_fields = [
    'created',
    'updated',
    'enacted',
    'policed',
    'backend_register',
    'deleted',
    'write_protect',
    'lazy_blocked',
    'no_sync',
    'no_policy',
    'omf_friendly',
    'enabled',
    'validators',
    'password',
    'backend_need_delete',
    'backend_need_reap'
  ];

  constructor(
    private toastr: ng.toastr.IToastrService
  ) {
    pluralize.addIrregularRule('xos', 'xosses');
    pluralize.addPluralRule(/slice$/i, 'slices');
    pluralize.addSingularRule(/slice$/i, 'slice');
  }

  public pluralize(string: string, quantity?: number, count?: boolean): string {
    return pluralize(string, quantity, count);
  }

  public toLabels(strings: string[], pluralize?: boolean): string[] {
    if (angular.isArray(strings)) {
      return _.map(strings, s => {
        return this.toLabel(s, pluralize);
      });
    }
  }

  public toLabel(string: string, pluralize?: boolean): string {

    if (pluralize) {
      string = this.pluralize(string);
    }

    string = this.fromCamelCase(string);
    string = this.fromSnakeCase(string);
    string = this.fromKebabCase(string);

    return this.capitalizeFirst(string);
  }

  public modelToTableCfg(model: IModeldef, baseUrl: string): IXosTableCfg {
    const cfg = {
      columns: this.modelFieldsToColumnsCfg(model.fields, baseUrl),
      filter: 'fulltext',
      order: {field: 'id', reverse: false},
      actions: [
        {
          label: 'delete',
          icon: 'remove',
          color: 'red',
          cb: (item) => {
            let obj = angular.copy(item);

            item.$delete()
              .then((res) => {
                if (res.status === 404) {
                  // TODO understand why it does not go directly in catch
                  throw new Error();
                }
                this.toastr.info(`${model.name} ${obj.name} succesfully deleted`);
              })
              .catch(() => {
                this.toastr.error(`Error while deleting ${obj.name}`);
              });
          }
        }
      ]
    };
    return cfg;
  }

  public modelFieldsToColumnsCfg(fields: IXosModelDefsField[], baseUrl: string): IXosTableColumn[] {

    const columns =  _.map(fields, (f) => {
      if (this.excluded_fields.indexOf(f.name) > -1) {
        return;
      }
      const col: IXosTableColumn =  {
        label: this.toLabel(f.name),
        prop: f.name
      };

      if (f.name === 'id' || f.name === 'name') {
        // NOTE can we find a better method to generalize the route?
        col.link = item => `#/core${baseUrl.replace(':id?', item.id)}`;
      }

      if (f.name === 'backend_status') {
        col.type = 'icon';
        col.formatter = (item) => {
          if (item.backend_status.indexOf('1') > -1) {
            return 'check';
          }
          if (item.backend_status.indexOf('2') > -1) {
            return 'exclamation-circle';
          }
          if (item.backend_status.indexOf('0') > -1) {
            return 'clock-o';
          }
        };
      }

      return col;
    })
      .filter(v => angular.isDefined(v));

    return columns;
  };

  public urlFromCoreModel(name: string): string {
    return `/core/${this.pluralize(name.toLowerCase())}`;
  }

  public modelFieldToInputCfg(fields: IXosModelDefsField[]): IXosFormInput[] {

    return _.map(fields, f => {
      return {
        name: f.name,
        label: this.toLabel(f.name),
        type: f.type,
        validators: f.validators
      };
    })
      .filter(f => this.excluded_fields.indexOf(f.name) === -1);
  }

  public modelToFormCfg(model: IModeldef): IXosFormConfig {
    return {
      formName: `${model.name}Form`,
      exclude: ['backend_status'],
      actions: [{
        label: 'Save',
        class: 'success',
        icon: 'ok',
        cb: (item, form) => {
          item.$save()
            .then(res => {
              this.toastr.success(`${item.name} succesfully saved`);
            })
            .catch(err => {
              this.toastr.error(`Error while saving ${item.name}`);
            });
        }
      }],
      inputs: this.modelFieldToInputCfg(model.fields)
    };
  }

  private fromCamelCase(string: string): string {
    return string.split(/(?=[A-Z])/).map(w => w.toLowerCase()).join(' ');
  }

  private fromSnakeCase(string: string): string {
    return string.split('_').join(' ').trim();
  }

  private fromKebabCase(string: string): string {
    return string.split('-').join(' ').trim();
  }

  private capitalizeFirst(string: string): string {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
  }
}
