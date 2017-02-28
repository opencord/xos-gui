// TODO test me hard!!!

import * as _ from 'lodash';
import {IXosModeldefsService, IXosModeldef, IXosModelDefsField, IXosModelDefsRelation} from '../rest/modeldefs.rest';
import {IXosTableCfg} from '../../core/table/table';
import {IXosFormCfg} from '../../core/form/form';
import {IXosNavigationService} from '../../core/services/navigation';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';
import {IXosRuntimeStatesService, IXosState} from '../../core/services/runtime-states';
import {IXosModelStoreService} from '../stores/model.store';

export interface IXosModel {
  name: string; // the model name
  app: string; // the service to wich it belong
  fields: IXosModelDefsField[];
  relations?: IXosModelDefsRelation[];
  backendUrl?: string; // the api endpoint
  clientUrl?: string; // the view url
  tableCfg?: IXosTableCfg;
  formCfg?: IXosFormCfg;
}

// Service
export interface IXosModelDiscovererService {
  discover(): ng.IPromise<boolean>;
  get(modelName: string): IXosModel;
}

export class XosModelDiscovererService implements IXosModelDiscovererService {
  static $inject = [
    '$log',
    '$q',
    'XosModelDefs',
    'ConfigHelpers',
    'XosRuntimeStates',
    'XosNavigationService',
    'XosModelStore'
  ];
  private xosModels: IXosModel[] = []; // list of augmented model definitions;
  private xosServices: string[] = []; // list of loaded services

  constructor (
    private $log: ng.ILogService,
    private $q: ng.IQService,
    private XosModelDefs: IXosModeldefsService,
    private ConfigHelpers: IXosConfigHelpersService,
    private XosRuntimeStates: IXosRuntimeStatesService,
    private XosNavigationService: IXosNavigationService,
    private XosModelStore: IXosModelStoreService
  ) {
  }

  public get(modelName: string): IXosModel|null {
    return _.find(this.xosModels, m => m.name === modelName);
  }

  public discover() {
    const d = this.$q.defer();

    this.XosModelDefs.get()
      .then((modelsDef: IXosModeldef[]) => {

        const pArray = [];
        _.forEach(modelsDef, (model: IXosModeldef) => {
          this.$log.debug(`[XosModelDiscovererService] Loading: ${model.name}`);
          let p = this.cacheModelEntries(model)
            .then(model => {
              return this.addState(model);
            })
            .then(model => {
              return this.addNavItem(model);
            })
            .then(model => {
              return this.getTableCfg(model);
            })
            .then(model => {
              return this.getFormCfg(model);
            })
            .then(model => {
              return this.storeModel(model);
            })
            .then(model => {
              this.$log.debug(`[XosModelDiscovererService] Model ${model.name} stored`);
              return this.$q.resolve();
            })
            .catch(err => {
              this.$log.error(`[XosModelDiscovererService] Model ${model.name} NOT stored`);
              // NOTE why this does not resolve?????
              // return this.$q.resolve();
              return this.$q.reject();
            });
            pArray.push(p);
        });
        this.$q.all(pArray)
          .then(() => {
            d.resolve(true);
            this.$log.info('[XosModelDiscovererService] All models loaded!');
          })
          .catch(() => {
            d.resolve(false);
          });
      });
    return d.promise;
  }

  private serviceNameFromAppName(appName: string): string {
    return appName.replace('services.', '');
  }

  private stateNameFromModel(model: IXosModel): string {
    return `xos.${this.serviceNameFromAppName(model.app)}.${model.name.toLowerCase()}`;
  }

  private getParentStateFromModel(model: IXosModel): string {
    let parentState: string;
    if (model.app === 'core') {
      parentState = 'xos.core';
    }
    else {
      const serviceName = this.addService(model);
      parentState = `xos.${serviceName}`;
    }
    return parentState;
  }

  private getApiUrlFromModel(model: IXosModel): string {
    if (model.app === 'core') {
      return `/core/${this.ConfigHelpers.pluralize(model.name.toLowerCase())}`;
    }
    else {
      const serviceName = this.serviceNameFromAppName(model.app);
      return `/${serviceName}/${this.ConfigHelpers.pluralize(model.name.toLowerCase())}`;
    }
  }

  // add a service state and navigation item if it is not already there
  private addService(model: IXosModel): string {
    const serviceName: string = this.serviceNameFromAppName(model.app);
    if (!_.find(this.xosServices, n => n === serviceName)) {
      const serviceState = {
        url: serviceName,
        parent: 'xos',
        abstract: true,
        template: '<div ui-view></div>'
      };
      this.XosRuntimeStates.addState(`xos.${serviceName}`, serviceState);

      this.XosNavigationService.add({
        label: this.ConfigHelpers.toLabel(serviceName),
        state: `xos.${serviceName}`,
      });
      this.xosServices.push(serviceName);
    }
    return serviceName;
  }

  private addState(model: IXosModel): ng.IPromise<IXosModel> {
    const d = this.$q.defer();
    const clientUrl = `/${this.ConfigHelpers.pluralize(model.name.toLowerCase())}/:id?`;
    const state: IXosState = {
      parent: this.getParentStateFromModel(model),
      url: clientUrl,
      params: {
        id: null
      },
      data: {
        model: model.name
      },
      component: 'xosCrud',
    };

    try {
      this.XosRuntimeStates.addState(
        this.stateNameFromModel(model),
        state
      );

      // extend model
      model.clientUrl = `${this.serviceNameFromAppName(model.app)}${clientUrl}`;

      d.resolve(model);
    } catch (e) {
      d.reject(e);
    }
    return d.promise;
  }

  private addNavItem(model: IXosModel): ng.IPromise<IXosModel> {
    const d = this.$q.defer();

    const stateName = this.stateNameFromModel(model);

    const parentState: string = this.getParentStateFromModel(model);

    try {
      this.XosNavigationService.add({
        label: this.ConfigHelpers.pluralize(model.name),
        state: stateName,
        parent: parentState
      });
      d.resolve(model);
    } catch (e) {
      d.reject(e);
    }


    return d.promise;
  }

  private cacheModelEntries(model: IXosModel): ng.IPromise<IXosModel> {
    const d = this.$q.defer();

    let called = false;
    const apiUrl = this.getApiUrlFromModel(model);
    this.XosModelStore.query(model.name, apiUrl)
      .subscribe(
        () => {
          // skipping the first response as the observable gets created as an empty array
          if (called) {
            return d.resolve(model);
          }
          called = true;
        },
        err => {
          d.reject(err);
        }
      );

    return d.promise;
  }

  private getTableCfg(model: IXosModel): ng.IPromise<IXosModel> {

    const d = this.$q.defer();

    const stateUrl = this.stateNameFromModel(model);

    model.tableCfg = this.ConfigHelpers.modelToTableCfg(model, stateUrl);

    d.resolve(model);

    return d.promise;
  }

  private getFormCfg(model: IXosModel): ng.IPromise<IXosModel> {

    const d = this.$q.defer();

    model.formCfg = this.ConfigHelpers.modelToFormCfg(model);

    d.resolve(model);

    return d.promise;
  }

  private storeModel(model: IXosModel): ng.IPromise<IXosModel> {

    const d = this.$q.defer();

    if (!_.find(this.xosModels, m => m.name === model.name)) {
      this.xosModels.push(model);
    }

    d.resolve(model);

    return d.promise;
  }
}
