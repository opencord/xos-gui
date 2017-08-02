import {IXosTableCfg} from '../../core/table/table';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';
import * as _ from 'lodash';
import {IXosResourceService} from '../../datasources/rest/model.rest';
import {IStoreHelpersService} from '../../datasources/helpers/store.helpers';
import {IXosModelDiscovererService} from '../../datasources/helpers/model-discoverer.service';

export interface IXosModelRelation {
  model: string;
  type: string;
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
    'XosModelDiscoverer'
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
  public related: IXosModelRelation[];
  public relatedModels: any = {};

  constructor(
    private $scope: angular.IScope,
    private $log: angular.ILogService,
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

    this.$log.debug('[XosCrud]', $state.current.data);

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
              this.related = $state.current.data.relations;
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

  public getRelatedItemId(relation: IXosModelRelation, item: any): number {
    if (item && angular.isDefined(item[`${relation.model.toLowerCase()}_id`])) {
      return item[`${relation.model.toLowerCase()}_id`];
    }
    // ids cannot be 0
    return 0;
  }

  public getRelatedModels(relations: IXosModelRelation[], item: any) {

    const _getModels = (model, id) => {
      this.store.get(model, id)
        .subscribe(item => {
          this.$log.debug('[XosCrud] Loaded relation:', model, item);
          this.relatedModels[model] = {
            model: item,
            formConfig: this.XosModelDiscovererService.get(model).formCfg
          };
        });
    };

    _.forEach(relations, (r: IXosModelRelation) => {
      if (item[`${r.model.toLowerCase()}_id`]) {
        this.$log.debug('[XosCrud] Loading relation:', r.model, item[`${r.model.toLowerCase()}_id`]);
        _getModels(r.model, item[`${r.model.toLowerCase()}_id`]);
      }
    });
  }
}

export const xosCrud: angular.IComponentOptions = {
  template: require('./crud.html'),
  controllerAs: 'vm',
  controller: CrudController
};
