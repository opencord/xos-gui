import {IXosTableCfg} from '../../core/table/table';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';
import * as _ from 'lodash';
import {IXosResourceService} from '../../datasources/rest/model.rest';
import {IStoreHelpersService} from '../../datasources/helpers/store.helpers';
import {IXosModelDiscovererService} from '../../datasources/helpers/model-discoverer.service';
import './crud.scss';

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

  public getRelatedItemId(relation: IXosModelRelation, item: any): number {
    if (item && angular.isDefined(item[`${relation.on_field.toLowerCase()}_id`])) {
      return item[`${relation.on_field.toLowerCase()}_id`];
    }
    // ids cannot be 0
    return 0;
  }

  public getRelatedModels(relations: {manytoone: IXosModelRelation[], onetomany: IXosModelRelation[]}, item: any) {
    this.$log.info(`[XosCrud] Managing relation for ${this.data.model}:`, relations);
    const _getModel = (r: IXosModelRelation, id) => {
      this.store.get(r.model, id)
        .subscribe(item => {
          this.$log.debug(`[XosCrud] Loaded manytoone relation with ${r.model} on ${r.on_field}`, item);

          if (!angular.isDefined(this.relatedModels.manytoone[r.model])) {
            this.relatedModels.manytoone[r.model] = {};
          }

          this.relatedModels.manytoone[r.model][r.on_field] = {
            model: item,
            formConfig: this.XosModelDiscovererService.get(r.model).formCfg
          };
        });
    };

    const _getModels = (r: IXosModelRelation, id: number) => {
      this.store.query(r.model)
        .subscribe(items => {
          this.$log.debug(`[XosCrud] Loaded onetomany relation with ${r.model} on ${r.on_field}`, items);

          // building the filter parameters
          const match = {};
          match[`${r.on_field.toLowerCase()}_id`] = id;
          const filtered = _.filter(items, match);

          // removing search bar from table
          const tableCfg = this.XosModelDiscovererService.get(r.model).tableCfg;
          tableCfg.filter = null;

          if (!angular.isDefined(this.relatedModels.onetomany[r.model])) {
            this.relatedModels.onetomany[r.model] = {};
          }

          this.relatedModels.onetomany[r.model][r.on_field] = {
            model: filtered,
            tableConfig: tableCfg,
            class: filtered.length > 0 ? 'full' : 'empty'
          };
        });
    };

    _.forEach(relations.manytoone, (r: IXosModelRelation) => {
      if (item[`${r.on_field.toLowerCase()}_id`]) {
        this.$log.debug(`[XosCrud] Loading manytoone relation with ${r.model} on ${r.on_field}`);
        _getModel(r, item[`${r.on_field.toLowerCase()}_id`]);
      }
    });

    _.forEach(relations.onetomany, (r: IXosModelRelation) => {
      this.$log.debug(`[XosCrud] Loading onetomany relation with ${r.model} on ${r.on_field}`);
      _getModels(r, item.id);
    });
  }
}

export const xosCrud: angular.IComponentOptions = {
  template: require('./crud.html'),
  controllerAs: 'vm',
  controller: CrudController
};
