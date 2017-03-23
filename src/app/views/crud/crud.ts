import {IXosTableCfg} from '../../core/table/table';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';
import * as _ from 'lodash';
import {IXosFormCfg} from '../../core/form/form';
import {IXosResourceService} from '../../datasources/rest/model.rest';
import {IStoreHelpersService} from '../../datasources/helpers/store.helpers';
import {IXosModelDiscovererService} from '../../datasources/helpers/model-discoverer.service';

export interface IXosCrudData {
  model: string;
  related: IXosModelRelation[];
  xosTableCfg: IXosTableCfg;
  xosFormCfg: IXosFormCfg;
}

export interface IXosModelRelation {
  model: string;
  type: string;
}

class CrudController {
  static $inject = [
    '$scope',
    '$state',
    '$stateParams',
    'XosModelStore',
    'ConfigHelpers',
    'ModelRest',
    'StoreHelpers',
    'XosModelDiscoverer'
  ];

  public data: {model: string};
  public tableCfg: IXosTableCfg;
  public formCfg: any;
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
    private store: IXosModelStoreService,
    private ConfigHelpers: IXosConfigHelpersService,
    private ModelRest: IXosResourceService,
    private StoreHelpers: IStoreHelpersService,
    private XosModelDiscovererService: IXosModelDiscovererService
  ) {
    this.data = this.$state.current.data;
    this.model = this.XosModelDiscovererService.get(this.data.model);
    this.title = this.ConfigHelpers.pluralize(this.data.model);

    this.list = true;

    // TODO get the proper URL from model discoverer
    this.baseUrl = '#/' + this.model.clientUrl.replace(':id?', '');


    this.related = $state.current.data.related;

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
        const endpoint = this.XosModelDiscovererService.getApiUrlFromModel(this.XosModelDiscovererService.get(this.data.model));
        const resource = this.ModelRest.getResource(endpoint);
        this.model = new resource({});
      }
    }
  }

  public getRelatedItem(relation: IXosModelRelation, item: any): number {
    if (item && angular.isDefined(item[`${relation.model.toLowerCase()}_id`])) {
      return item[`${relation.model.toLowerCase()}_id`];
    }
    return 0;
  }
}

export const xosCrud: angular.IComponentOptions = {
  template: require('./crud.html'),
  controllerAs: 'vm',
  controller: CrudController
};
