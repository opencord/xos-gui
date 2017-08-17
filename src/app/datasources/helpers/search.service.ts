
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


import * as _ from 'lodash';
import {IXosNavigationService} from '../../core/services/navigation';
import {IXosModelStoreService} from '../stores/model.store';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';
import {IXosState} from '../../core/services/runtime-states';

export interface IXosSearchResult {
  label: string;
  state: string | {name: string, params: any};
  type?: string;
}

export interface IXosSearchService {
  search(query: string): IXosSearchResult[];
}

export class SearchService {
  static $inject = ['$rootScope', '$log', 'XosNavigationService', 'XosModelStore', 'ConfigHelpers'];
  private states: IXosState[];

  constructor (
    private $rootScope: ng.IScope,
    private $log: ng.ILogService,
    private NavigationService: IXosNavigationService,
    private XosModelStore: IXosModelStoreService,
    private ConfigHelpers: IXosConfigHelpersService
  ) {
    this.$rootScope.$on('xos.core.modelSetup', () => {
      this.$log.info(`[XosSearchService] Loading views`);
      this.states = this.NavigationService.query().reduce((list, state) => {
        // if it does not have child (otherwise it is abstract)
        if (!state.children || state.children.length === 0) {
          list.push(state);
        }
        // else push child
        if (state.children && state.children.length > 0) {
          state.children.forEach(c => {
            list.push(c);
          });
        }
        return list;
      }, []);
      this.states = _.uniqBy(this.states, 'state');
      this.$log.debug(`[XosSearchService] States: `, this.states);
    });
  }

  public search(query: string): IXosSearchResult[] {
    this.$log.debug(`[XosSearchService] Searching for: ${query}`);
    const routes: IXosSearchResult[] = _.filter(this.states, s => {
      return s.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
    }).map(r => {
      r.type = 'View';
      return r;
    });
    // TODO XosModelStore.search throws an error,
    // probably there is something wrong saved in the cache!!
    const models = _.map(this.XosModelStore.search(query), m => {
      return {
        label: m.humanReadableName ? m.humanReadableName : m.name,
        state: this.ConfigHelpers.stateWithParamsForJs(m.modelName, m),
        type: m.modelName
      };
    });
    return routes.concat(models);
  }
}
