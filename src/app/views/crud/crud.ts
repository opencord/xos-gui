
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
import {IXosModelDiscovererService, IXosModel} from '../../datasources/helpers/model-discoverer.service';
import './crud.scss';
import {IXosCrudRelationService} from './crud.relations.service';
import {IXosDebugService, IXosDebugStatus} from '../../core/debug/debug.service';
import {IXosKeyboardShortcutService} from '../../core/services/keyboard-shortcut';
import {Subscription} from 'rxjs';
import {IXosModeldefsCache} from '../../datasources/helpers/modeldefs.service';

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
    'XosCrudRelation',
    'XosDebug',
    'XosKeyboardShortcut',
    'XosModeldefsCache'
  ];

  // bindings

  public data: {model: string};
  public tableCfg: IXosTableCfg;
  public formCfg: any;
  public baseUrl: string;
  public list: boolean;
  public modelName: string;
  public pluralTitle: string;
  public singularTitle: string;
  public tableData: any[];
  public model: any; // holds the real model
  public modelDef: IXosModel;
  public related: {manytoone: IXosModelRelation[], onetomany: IXosModelRelation[]} = {
    manytoone: [],
    onetomany: []
  };
  public relatedModels: {manytoone: any, onetomany: any} = {
    manytoone: {},
    onetomany: {}
  };
  public debugTab: boolean;

  public getRelatedModels = _.memoize(this._getRelatedModels);

  private subscription: Subscription;

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
    private XosCrudRelation: IXosCrudRelationService,
    private XosDebug: IXosDebugService,
    private XosKeyboardShortcut: IXosKeyboardShortcutService,
    private XosModeldefsCache: IXosModeldefsCache
  ) {
    this.$log.info('[XosCrud] Setup', $state.current.data);

    this.data = this.$state.current.data;
    this.modelDef = this.XosModeldefsCache.get(this.data.model);
    this.modelName = this.modelDef.verbose_name ? this.modelDef.verbose_name : this.modelDef.name;
    this.pluralTitle = this.ConfigHelpers.pluralize(this.modelName);
    this.singularTitle = this.ConfigHelpers.pluralize(this.modelName, 1);

    this.list = true;

    // TODO get the proper URL from model discoverer
    this.baseUrl = '#/' + this.modelDef.clientUrl.replace(':id?', '');

    this.tableCfg = this.modelDef.tableCfg;
    this.formCfg = this.modelDef.formCfg;

    this.debugTab = this.XosDebug.status.modelsTab;
    this.$scope.$on('xos.debug.status', (e, status: IXosDebugStatus) => {
      this.debugTab = status.modelsTab;
      this.$scope.$apply();
    });

    // if it is a detail page
    if ($stateParams['id']) {
      this.list = false;

      // if it is the create page
      if ($stateParams['id'] === 'add') {
        // generate a resource for an empty model
        const endpoint = this.XosModelDiscovererService.getApiUrlFromModel(this.XosModeldefsCache.get(this.data.model));
        const resource = this.ModelRest.getResource(endpoint);
        this.model = new resource({});

        // attach a redirect to the $save method
        const originalSave = angular.copy(this.formCfg.actions[0].cb);
        this.formCfg.actions[0].cb = (item, form: angular.IFormController) => {
          originalSave(item, form)
            .then(res => {
              this.$state.go(this.$state.current, {id: res.id});
            })
            .catch(err => {
              this.$log.error(`[XosCrud] Error while saving:`, item, err);
            });
        };
      }
      else {
        this.subscription = this.store.get(this.data.model, $stateParams['id'])
          .subscribe(res => {
            $scope.$evalAsync(() => {
              this.related.onetomany = _.filter($state.current.data.relations, {type: 'onetomany'});
              this.related.manytoone = _.filter($state.current.data.relations, {type: 'manytoone'});
              this.model = res;
              this.getRelatedModels(this.related, this.model);
            });
          });
      }

      this.XosKeyboardShortcut.registerKeyBinding({
        key: 'A',
        cb: () => this.XosDebug.toggleDebug('modelsTab'),
        description: 'Toggle Debug tab in model details view'
      }, 'view');

      this.XosKeyboardShortcut.registerKeyBinding({
        key: 'delete',
        cb: () => {
          this.$state.go(this.$state.current.name, {id: null});
        },
        description: 'Go back to the list view'
      }, 'view');
    }
    // list page
    else {
      this.tableCfg.selectedRow = -1;

      this.XosKeyboardShortcut.registerKeyBinding({
        key: 'Tab',
        cb: () => this.iterateItems(),
        description: 'Iterate trough items in the list'
      }, 'view');

      this.XosKeyboardShortcut.registerKeyBinding({
        key: 'Enter',
        cb: () => {
          if (this.tableCfg.selectedRow < 0) {
            return;
          }
          this.$state.go(this.$state.current.name, {id: this.tableCfg.filteredData[this.tableCfg.selectedRow].id});
        },
        description: 'View details of selected item'
      }, 'view');

      this.XosKeyboardShortcut.registerKeyBinding({
        key: 'Delete',
        cb: () => {
          if (this.tableCfg.selectedRow < 0) {
            return;
          }
          const deleteFn = _.find(this.tableCfg.actions, {label: 'delete'});
          deleteFn.cb(this.tableCfg.filteredData[this.tableCfg.selectedRow]);
        },
        description: 'View details of selected item'
      }, 'view');

      this.subscription = this.store.query(this.data.model)
        .subscribe(
          (event) => {
            // NOTE Observable mess with $digest cycles, we need to schedule the expression later
            $scope.$evalAsync(() => {
              this.tableData = event;
            });
          }
        );
    }
  }

  $onDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.$log.info(`[XosCrud] Destroying component`);
  }

  public iterateItems() {
    const rowCount = this.tableCfg.filteredData.length > this.tableCfg.pagination.pageSize ? this.tableCfg.pagination.pageSize : this.tableCfg.filteredData.length;
    if ((this.tableCfg.selectedRow + 1) < rowCount) {
      this.tableCfg.selectedRow++;
    }
    else {
      this.tableCfg.selectedRow = 0;
    }
    this.$scope.$apply();
  }

  public getRelatedItemId(relation: IXosModelRelation, item: any): boolean {
    return this.XosCrudRelation.existsRelatedItem(relation, item);
  }

  public getHumanReadableOnField(r: IXosModelRelation) {
    return this.XosCrudRelation.getHumanReadableOnField(r, this.data.model);
  }

  private _getRelatedModels(relations: {manytoone: IXosModelRelation[], onetomany: IXosModelRelation[]}, item: any) {
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
