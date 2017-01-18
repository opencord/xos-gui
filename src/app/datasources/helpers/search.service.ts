import * as _ from 'lodash';
import {IXosNavigationService} from '../../core/services/navigation';
import {IXosState} from '../../../index';
import {IModelStoreService} from '../stores/model.store';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';

export interface IXosSearchResult {
  label: string;
  state: string | {name: string, params: any};
  type?: string;
}

export interface IXosSearchService {
  search(query: string): IXosSearchResult[];
}

export class SearchService {
  static $inject = ['$rootScope', 'NavigationService', 'ModelStore', 'ConfigHelpers'];
  private states: IXosState[];

  constructor (
    private $rootScope: ng.IScope,
    private NavigationService: IXosNavigationService,
    private ModelStore: IModelStoreService,
    private ConfigHelpers: IXosConfigHelpersService
  ) {
    this.$rootScope.$on('xos.core.modelSetup', () => {
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
    });
  }

  public search(query: string): IXosSearchResult[] {
    const routes: IXosSearchResult[] = _.filter(this.states, s => {
      return s.label.toLowerCase().indexOf(query) > -1;
    }).map(r => {
      r.type = 'View';
      return r;
    });

    const models = _.map(this.ModelStore.search(query), m => {
      return {
        label: m.humanReadableName ? m.humanReadableName : m.name,
        state: this.ConfigHelpers.stateWithParamsForJs(m.modelName, m),
        type: m.modelName
      };
    });
    return routes.concat(models);
  }
}
