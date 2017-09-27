
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


import {IXosModelRelation} from './crud';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import * as _ from 'lodash';
import {IXosFormCfg} from '../../core/form/form';
import {IXosTableCfg} from '../../core/table/table';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';
import {Subscription} from 'rxjs';
import {IXosModeldefsCache} from '../../datasources/helpers/modeldefs.service';

interface IXosCrudRelationBaseTabData {
  model: any;
  class?: 'full' | 'empty';
}

export interface IXosCrudRelationFormTabData extends IXosCrudRelationBaseTabData {
  formConfig: IXosFormCfg;
}

export interface IXosCrudRelationTableTabData extends IXosCrudRelationBaseTabData {
  tableConfig: IXosTableCfg;
}

export interface IXosCrudRelationService {
  getModel(r: IXosModelRelation, id: string | number): Promise<IXosCrudRelationFormTabData>;
  getModels(r: IXosModelRelation, source_id: string | number): Promise<IXosCrudRelationTableTabData>;
  existsRelatedItem(r: IXosModelRelation, item: any): boolean;
  getHumanReadableOnField(r: IXosModelRelation, baseModel: string): string;
}

export class XosCrudRelationService implements IXosCrudRelationService {

  static $inject = [
    '$log',
    '$q',
    'XosModelStore',
    'ConfigHelpers',
    'XosModeldefsCache'
  ];

  constructor (
    private $log: ng.ILogService,
    private $q: ng.IQService,
    private XosModelStore: IXosModelStoreService,
    private ConfigHelpers: IXosConfigHelpersService,
    private XosModeldefsCache: IXosModeldefsCache
  ) {}

  public getModel (r: IXosModelRelation, id: string | number): Promise<IXosCrudRelationFormTabData> {
    const d = this.$q.defer();
    const subscription: Subscription = this.XosModelStore.get(r.model, id)
      .subscribe(
        item => {
          this.$log.debug(`[XosCrud] Loaded manytoone relation with ${r.model} on ${r.on_field}`, item);

          const data: IXosCrudRelationFormTabData = {
            model: item,
            formConfig: this.XosModeldefsCache.get(r.model).formCfg,
            class: angular ? 'full' : 'empty'
          };

          d.resolve(data);

          subscription.unsubscribe();
        },
        err => d.reject
      );
    return d.promise;
  };

  public getModels(r: IXosModelRelation, source_id: string | number): Promise<IXosCrudRelationTableTabData> {
    const d = this.$q.defer();
    this.XosModelStore.query(r.model)
      .subscribe(
        items => {
          this.$log.debug(`[XosCrud] Loaded onetomany relation with ${r.model} on ${r.on_field}`, items);
          // building the filter parameters
          const match = {};
          match[`${r.on_field.toLowerCase()}_id`] = source_id;
          const filtered = _.filter(items, match);
          // removing search bar from table
          const tableCfg = this.XosModeldefsCache.get(r.model).tableCfg;
          tableCfg.filter = null;

          const data: IXosCrudRelationTableTabData = {
            model: filtered,
            tableConfig: tableCfg,
            class: filtered.length > 0 ? 'full' : 'empty'
          };

          d.resolve(data);
        },
        err => d.reject
      );

    return d.promise;
  }

  public existsRelatedItem(r: IXosModelRelation, item: any): boolean {
    return item && angular.isDefined(item[`${r.on_field.toLowerCase()}_id`]);
  }

  public getHumanReadableOnField(r: IXosModelRelation, baseModel: string): string {
    if (r.on_field.toLowerCase() === baseModel.toLowerCase()) {
      return '';
    }
    if (r.model.toLowerCase() === r.on_field.toLowerCase()) {
      return '';
    }
    return `[${this.ConfigHelpers.toLabel(r.on_field, false)}]`;
  }
}
