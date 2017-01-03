import * as _ from 'lodash';
import * as pluralize from 'pluralize';
import {IXosTableColumn} from '../../table/table';

export interface IXosModelDefsField {
  name: string;
  type: string;
}

export interface IXosConfigHelpersService {
  excluded_fields: string[];
  modeldefToTableCfg(fields: IXosModelDefsField[], baseUrl: string): any[]; // TODO use a proper interface
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

  constructor() {
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

  modeldefToTableCfg(fields: IXosModelDefsField[], baseUrl: string): IXosTableColumn[] {

    const cfg =  _.map(fields, (f) => {
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

    return cfg;
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

