import * as _ from 'lodash';
import * as pluralize from 'pluralize';
import {IXosTableColumn, IXosTableCfg} from '../../table/table';
import {IXosModeldef} from '../../../datasources/rest/modeldefs.rest';
import {IXosFormCfg, IXosFormInput} from '../../form/form';
import {IXosAuthService} from '../../../datasources/rest/auth.rest';
import {IXosModelStoreService} from '../../../datasources/stores/model.store';
import {IXosState} from '../runtime-states';

export interface IXosModelDefsField {
  name: string;
  type: string;
  validators?: any;
  hint?: string;
  relation?: {
    model: string;
    type: string;
  };
}

export interface IXosConfigHelpersService {
  excluded_fields: string[];
  modelFieldsToColumnsCfg(model: IXosModeldef): IXosTableColumn[];
  modelToTableCfg(model: IXosModeldef, modelName: string): IXosTableCfg;
  modelFieldToInputCfg(fields: IXosModelDefsField[]): IXosFormInput[];
  modelToFormCfg(model: IXosModeldef): IXosFormCfg;
  pluralize(string: string, quantity?: number, count?: boolean): string;
  toLabel(string: string, pluralize?: boolean): string;
  toLabels(string: string[], pluralize?: boolean): string[];
  stateFromCoreModel(name: string): string;
  stateWithParams(name: string, model: any): string;
  stateWithParamsForJs(name: string, model: any): any;
}

export class ConfigHelpers implements IXosConfigHelpersService {
  static $inject = [
    '$state',
    'toastr',
    'AuthService',
    'XosModelStore'];

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
    private $state: ng.ui.IStateService,
    private toastr: ng.toastr.IToastrService,
    private AuthService: IXosAuthService,
    private XosModelStore: IXosModelStoreService
  ) {
    pluralize.addIrregularRule('xos', 'xoses');
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

  public modelToTableCfg(model: IXosModeldef, baseUrl: string): IXosTableCfg {
    const cfg = {
      columns: this.modelFieldsToColumnsCfg(model),
      filter: 'fulltext',
      order: {field: 'id', reverse: false},
      pagination: {
        pageSize: 10
      },
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

  public modelFieldsToColumnsCfg(model: IXosModeldef): IXosTableColumn[] {
    const fields: IXosModelDefsField[] = model.fields;
    const modelName: string = model.name;
    const columns =  _.map(fields, (f) => {
      if (!angular.isDefined(f) || this.excluded_fields.indexOf(f.name) > -1) {
        return;
      }
      const col: IXosTableColumn =  {
        label: this.toLabel(f.name),
        prop: f.name
      };

      if (f.name === 'id' || f.name === 'name') {
        col.link = item => this.stateWithParams(modelName, item);
      }

      // if the field identify a relation, create a link
      if (f.relation && f.relation.type === 'many_to_one') {
        col.type = 'custom';
        col.formatter = item => {
          this.populateRelated(item, item[f.name], f);
          return item[f.name];
        };
        col.link = item => this.stateWithParams(f.relation.model, item);
      }

      if (f.name === 'backend_status') {
        col.type = 'icon';
        col.hover = (item) => {
          return item[f.name];
        };
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

  public stateFromCoreModel(name: string): string {
    const state: ng.ui.IState = _.find(this.$state.get(), (s: IXosState) => {
      if (s.data) {
        return s.data.model === name;
      }
      return false;
    });
    return state.name;
  }

  public stateWithParams(name: string, model: any): string {
    const state = this.stateFromCoreModel(name);
    return `${state}({id: ${model['id']}})`;
  }

  public stateWithParamsForJs(name: string, model: any): any {
    // TODO test and interface
    const state = this.stateFromCoreModel(name);
    return {name: state, params: {id: model.id}};
  }

  public modelFieldToInputCfg(fields: IXosModelDefsField[]): IXosFormInput[] {

    return _.map(fields, (f: IXosModelDefsField) => {
      if (f.relation) {
        const input: IXosFormInput = {
          name: f.name,
          label: this.toLabel(f.name),
          type: 'select',
          validators: f.validators,
          hint: f.hint
        };
        this.populateSelectField(f, input);
        return input;
      }

      return {
        name: f.name,
        label: this.toLabel(f.name),
        type: f.type,
        validators: f.validators
      };
    })
      .filter(f => this.excluded_fields.indexOf(f.name) === -1);
  }

  public modelToFormCfg(model: IXosModeldef): IXosFormCfg {
    const formCfg: IXosFormCfg = {
      formName: `${model.name}Form`,
      exclude: ['backend_status', 'creator'],
      actions: [{
        label: 'Save',
        class: 'success',
        icon: 'ok',
        cb: null
      }],
      inputs: this.modelFieldToInputCfg(model.fields)
    };

    formCfg.actions[0].cb = (item, form: angular.IFormController) => {

      if (!form.$valid) {
        formCfg.feedback = {
          show: true,
          message: 'Form is invalid',
          type: 'danger',
          closeBtn: true
        };

        return;
      }

      const model = angular.copy(item);

      // TODO remove ManyToMany relations and save them separately (how??)
      delete item.networks;

      // adding userId as creator
      item.creator = this.AuthService.getUser().id;

      item.$save()
        .then((res) => {
          if (res.status === 403 || res.status === 405 || res.status === 500) {
            // TODO understand why 405 does not go directly in catch (it may be related to ng-rest-gw)
            throw new Error();
          }
          formCfg.feedback = {
            show: true,
            message: `${model.name} succesfully saved`,
            type: 'success',
            closeBtn: true
          };
          this.toastr.success(`${model.name} succesfully saved`);
        })
        .catch(err => {
          // TODO keep the edited model
          this.toastr.error(`Error while saving ${model.name}`);
        });
    };

    return formCfg;
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

  private populateRelated(item: any, fk: string, field: IXosModelDefsField): any {
    // if the relation is not defined return
    if (!fk || angular.isUndefined(fk) || fk === null) {
      return;
    }
    this.XosModelStore.query(field.relation.model)
      .subscribe(res => {
        if (angular.isDefined(res) && angular.isDefined(fk)) {
          let ri = _.find(res, {id: fk});
          if (angular.isDefined(ri)) {
            item[`${field.name}-formatted`] = angular.isDefined(ri.name) ? ri.name : ri.humanReadableName;
          }
        }
      });
  }

  // augment a select field with related model informations
  private populateSelectField(field: IXosModelDefsField, input: IXosFormInput): void {
    this.XosModelStore.query(field.relation.model)
      .subscribe(res => {
        input.options = _.map(res, item => {
          return {id: item.id, label: item.humanReadableName ? item.humanReadableName : item.name};
        });
      });
  }
}
