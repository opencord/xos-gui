import {IXosTableCfg} from '../../core/table/table';
import {IModelStoreService} from '../../datasources/stores/model.store';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';
import * as _ from 'lodash';
import {IXosFormConfig} from '../../core/form/form';
import {IXosResourceService} from '../../datasources/rest/model.rest';
export interface IXosCrudData {
  model: string;
  related: string[];
  xosTableCfg: IXosTableCfg;
  xosFormCfg: IXosFormConfig;
}

class CrudController {
  static $inject = ['$scope', '$state', '$stateParams', 'ModelStore', 'ConfigHelpers', 'ModelRest'];

  public data: IXosCrudData;
  public tableCfg: IXosTableCfg;
  public formCfg: any;
  public stateName: string;
  public baseUrl: string;
  public list: boolean;
  public title: string;
  public tableData: any[];
  public model: any;
  public related: string[];

  constructor(
    private $scope: angular.IScope,
    private $state: angular.ui.IStateService,
    private $stateParams: ng.ui.IStateParamsService,
    private store: IModelStoreService,
    private ConfigHelpers: IXosConfigHelpersService,
    private ModelRest: IXosResourceService
  ) {
    this.data = this.$state.current.data;
    this.tableCfg = this.data.xosTableCfg;
    this.title = this.ConfigHelpers.pluralize(this.data.model);

    this.list = true;
    this.stateName = $state.current.name;
    this.baseUrl = '#/core' + $state.current.url.toString().replace(':id?', '');

    this.related = $state.current.data.related;

    this.formCfg = $state.current.data.xosFormCfg;

    this.store.query(this.data.model)
      .subscribe(
        (event) => {
          // NOTE Observable mess with $digest cycles, we need to schedule the expression later
          $scope.$evalAsync(() => {
            this.title = this.ConfigHelpers.pluralize(this.data.model, event.length);
            this.tableData = event;

            // if it is a detail page for an existing model
            if ($stateParams['id'] && $stateParams['id'] !== 'add') {
              this.model = _.find(this.tableData, {id: parseInt($stateParams['id'], 10)});
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
        const endpoint = this.ConfigHelpers.urlFromCoreModel(this.data.model);
        const resource = this.ModelRest.getResource(endpoint);
        this.model = new resource({});
      }
    }
  }

  public getRelatedItem(relation: string, item: any): number {
    if (item && angular.isDefined(item[relation.toLowerCase()])) {
      return item[relation.toLowerCase()];
    }
    return 0;
  }
}

export const xosCrud: angular.IComponentOptions = {
  template: require('./crud.html'),
  controllerAs: 'vm',
  controller: CrudController
};

