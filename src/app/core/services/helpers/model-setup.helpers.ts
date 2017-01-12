import {ModeldefsService, IModeldef} from '../../../datasources/rest/modeldefs.rest';
import {IXosConfigHelpersService} from './config.helpers';
import {IRuntimeStatesService} from '../runtime-states';
import {NavigationService} from '../navigation';
import {IXosState} from '../../../../index';
import * as _ from 'lodash';
import IPromise = angular.IPromise;

export interface IXosModelSetupService {
  setup(): IPromise<null>;
}

export class ModelSetup {
  static $inject = ['$q', 'ModelDefs', 'ConfigHelpers', 'RuntimeStates', 'NavigationService'];

  constructor(
    private $q: ng.IQService,
    private ModelDefs: ModeldefsService,
    private ConfigHelpers: IXosConfigHelpersService,
    private RuntimeStates: IRuntimeStatesService,
    private NavigationService: NavigationService
  ) {

  }

  public setup(): IPromise<null> {
    const d = this.$q.defer();
    this.ModelDefs.get()
      .then((models: IModeldef[]) => {
        _.forEach(models, (m: IModeldef) => {
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
              related: m.relations,
              xosTableCfg: this.ConfigHelpers.modelToTableCfg(m, stateUrl),
              xosFormCfg: this.ConfigHelpers.modelToFormCfg(m)
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
