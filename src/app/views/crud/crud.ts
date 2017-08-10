
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


import {IXosTableCfg} from '../../core/table/table';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';
import * as _ from 'lodash';
import {IXosResourceService} from '../../datasources/rest/model.rest';
import {IStoreHelpersService} from '../../datasources/helpers/store.helpers';
import {IXosModelDiscovererService} from '../../datasources/helpers/model-discoverer.service';
import './crud.scss';
import {IXosCrudRelationService} from './crud.relations.service';

export interface IXosModelRelation {
  model: string;
  type: string;
  on_field: string;
}

class CrudController {
  static $inject = [
    '$scope',
    '$log',
    '$state',
    '$stateParams',
    'XosModelStore',
    'ConfigHelpers',
    'ModelRest',
    'StoreHelpers',
    'XosModelDiscoverer',
    'XosCrudRelation'
  ];

  // bindings

  public data: {model: string};
  public tableCfg: IXosTableCfg;
  public formCfg: any;
  public baseUrl: string;
  public list: boolean;
  public title: string;
  public tableData: any[];
  public model: any;
  public related: {manytoone: IXosModelRelation[], onetomany: IXosModelRelation[]} = {
    manytoone: [],
    onetomany: []
  };
  public relatedModels: {manytoone: any, onetomany: any} = {
    manytoone: {},
    onetomany: {}
  };

  constructor(
    private $scope: angular.IScope,
    private $log: angular.ILogService,
    private $state: angular.ui.IStateService,
    private $stateParams: ng.ui.IStateParamsService,
    private store: IXosModelStoreService,
    private ConfigHelpers: IXosConfigHelpersService,
    private ModelRest: IXosResourceService,
    private StoreHelpers: IStoreHelpersService,
    private XosModelDiscovererService: IXosModelDiscovererService,
    private XosCrudRelation: IXosCrudRelationService
  ) {
    this.$log.info('[XosCrud] Setup', $state.current.data);

    this.data = this.$state.current.data;
    this.model = this.XosModelDiscovererService.get(this.data.model);
    this.title = this.ConfigHelpers.pluralize(this.data.model);

    this.list = true;

    // TODO get the proper URL from model discoverer
    this.baseUrl = '#/' + this.model.clientUrl.replace(':id?', '');


    this.tableCfg = this.model.tableCfg;
    this.formCfg = this.model.formCfg;

    this.store.query(this.data.model)
      .subscribe(
        (event) => {
          // NOTE Observable mess with $digest cycles, we need to schedule the expression later
          $scope.$evalAsync(() => {
            this.title = this.ConfigHelpers.pluralize(this.data.model, event.length);
            this.tableData = event;

            // if it is a detail page for an existing model
            if ($stateParams['id'] && $stateParams['id'] !== 'add') {
              this.related.onetomany = _.filter($state.current.data.relations, {type: 'onetomany'});
              this.related.manytoone = _.filter($state.current.data.relations, {type: 'manytoone'});
              this.model = _.find(this.tableData, {id: parseInt($stateParams['id'], 10)});
              this.getRelatedModels(this.related, this.model);
            }
          });
        }
      );

    // if it is a detail page
    if ($stateParams['id']) {
      this.list = false;

      // if it is the create page
      if ($stateParams['id'] === 'add') {
        // generate a resource for an empty model
        const endpoint = this.XosModelDiscovererService.getApiUrlFromModel(this.XosModelDiscovererService.get(this.data.model));
        const resource = this.ModelRest.getResource(endpoint);
        this.model = new resource({});
      }
    }
  }


  public getRelatedItemId(relation: IXosModelRelation, item: any): boolean {
    return this.XosCrudRelation.existsRelatedItem(relation, item);
  }

  public getHumanReadableOnField(r: IXosModelRelation) {
    return this.XosCrudRelation.getHumanReadableOnField(r, this.data.model);
  }

  public getRelatedModels(relations: {manytoone: IXosModelRelation[], onetomany: IXosModelRelation[]}, item: any) {
    this.$log.debug(`[XosCrud] Managing relation for ${this.data.model}:`, relations);

    // loading many to one relations (you'll get a model)
    _.forEach(relations.manytoone, (r: IXosModelRelation) => {
      if (!item || !item[`${r.on_field.toLowerCase()}_id`]) {
        return;
      }

      this.$log.debug(`[XosCrud] Loading manytoone relation with ${r.model} on ${r.on_field}`);

      if (!angular.isDefined(this.relatedModels.manytoone[r.model])) {
        this.relatedModels.manytoone[r.model] = {};
      }

      this.XosCrudRelation.getModel(r, item[`${r.on_field.toLowerCase()}_id`])
        .then(res => {
          this.relatedModels.manytoone[r.model][r.on_field] = res;
        })
        .catch(err => {
          this.$log.error(`[XosCrud] Error loading manytoone relation with ${r.model} on ${r.on_field}`, err);
        });
    });

    // loading onetomany relations (you'll get a list of models)
    _.forEach(relations.onetomany, (r: IXosModelRelation) => {
      if (!item) {
        return;
      }

      this.$log.debug(`[XosCrud] Loading onetomany relation with ${r.model} on ${r.on_field}`);

      if (!angular.isDefined(this.relatedModels.onetomany[r.model])) {
        this.relatedModels.onetomany[r.model] = {};
      }

      this.XosCrudRelation.getModels(r, item.id)
        .then(res => {
          this.relatedModels.onetomany[r.model][r.on_field] = res;
        })
        .catch(err => {
          this.$log.error(`[XosCrud] Error loading onetomany relation with ${r.model} on ${r.on_field}`, err);
        });
    });
  }
}

export const xosCrud: angular.IComponentOptions = {
  template: require('./crud.html'),
  controllerAs: 'vm',
  controller: CrudController
};
