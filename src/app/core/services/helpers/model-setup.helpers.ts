import {XosModeldefsService, IXosModeldef} from '../../../datasources/rest/modeldefs.rest';
import {IXosConfigHelpersService} from './config.helpers';
import {IXosRuntimeStatesService, IXosState} from '../runtime-states';
import {IXosNavigationService} from '../navigation';
import * as _ from 'lodash';
import IPromise = angular.IPromise;

export interface IXosModelSetupService {
  setup(): IPromise<null>;
}

export class ModelSetup {
  static $inject = ['$rootScope', '$q', 'XosModelDefs', 'ConfigHelpers', 'XosRuntimeStates', 'XosNavigationService'];

  constructor(
    private $rootScope: ng.IScope,
    private $q: ng.IQService,
    private ModelDefs: XosModeldefsService,
    private ConfigHelpers: IXosConfigHelpersService,
    private RuntimeStates: IXosRuntimeStatesService,
    private NavigationService: IXosNavigationService
  ) {

  }

  public setup(): IPromise<null> {
    const d = this.$q.defer();
    this.ModelDefs.get()
      .then((models: IXosModeldef[]) => {
        _.forEach(models, (m: IXosModeldef) => {
          const stateUrl = `/${this.ConfigHelpers.pluralize(m.name.toLowerCase())}/:id?`;
          const stateName = `xos.core.${this.ConfigHelpers.pluralize(m.name.toLowerCase())}`;
          const state: IXosState = {
            parent: 'core',
            url: stateUrl,
            component: 'xosCrud',
            params: {
              id: null
            },
            data: {
              model: m.name,
              // related: m.relations,
              // xosTableCfg: this.ConfigHelpers.modelToTableCfg(m, stateUrl),
              // xosFormCfg: this.ConfigHelpers.modelToFormCfg(m)
            }
          };

          this.RuntimeStates.addState(stateName, state);
          this.NavigationService.add({
            label: this.ConfigHelpers.pluralize(m.name),
            state: stateName,
            parent: 'xos.core'
          });
        });

        d.resolve();
      })
      .catch(d.reject);

    return d.promise;
  }
}
