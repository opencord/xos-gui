import * as _ from 'lodash';
import * as pluralize from 'pluralize';
import {IXosTableColumn, IXosTableCfg} from '../../table/table';
import {IModeldef} from '../../../datasources/rest/modeldefs.rest';

export interface IXosModelDefsField {
  name: string;
  type: string;
  validators?: any;
}

export interface IXosConfigHelpersService {
  excluded_fields: string[];
  modelToTableCfg(model: IModeldef, baseUrl: string): IXosTableCfg;
  modelFieldsToColumnsCfg(fields: IXosModelDefsField[], baseUrl: string): IXosTableColumn[]; // TODO use a proper interface
  pluralize(string: string, quantity?: number, count?: boolean): string;
  toLabel(string: string, pluralize?: boolean): string;
  toLabels(string: string[], pluralize?: boolean): string[];
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
    'password'
  ];

  constructor(
    private toastr: ng.toastr.IToastrService
  ) {
    pluralize.addIrregularRule('xos', 'xosses');
    pluralize.addPluralRule(/slice$/i, 'slices');
  }

  pluralize(string: string, quantity?: number, count?: boolean): string {
    return pluralize(string, quantity, count);
  }

  toLabels(strings: string[], pluralize?: boolean): string[] {
    if (angular.isArray(strings)) {
      return _.map(strings, s => {
        return this.toLabel(s, pluralize);
      });
    }
  }

  toLabel(string: string, pluralize?: boolean): string {

    if (pluralize) {
      string = this.pluralize(string);
    }

    string = this.fromCamelCase(string);
    string = this.fromSnakeCase(string);
    string = this.fromKebabCase(string);

    return this.capitalizeFirst(string);
  }

  modelToTableCfg(model: IModeldef, baseUrl: string): IXosTableCfg {
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

  modelFieldsToColumnsCfg(fields: IXosModelDefsField[], baseUrl: string): IXosTableColumn[] {

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

