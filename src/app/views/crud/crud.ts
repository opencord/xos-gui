import {IXosTableCfg} from '../../core/table/table';
import {IModelStoreService} from '../../datasources/stores/model.store';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';
import * as _ from 'lodash';
export interface IXosCrudData {
  model: string;
  related: string[];
  xosTableCfg: IXosTableCfg;
}

class CrudController {
  static $inject = ['$scope', '$state', '$stateParams', 'ModelStore', 'ConfigHelpers'];

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
    private ConfigHelpers: IXosConfigHelpersService
  ) {
    this.data = this.$state.current.data;
    this.tableCfg = this.data.xosTableCfg;
    this.title = this.ConfigHelpers.pluralize(this.data.model);

    this.list = true;
    this.stateName = $state.current.name;
    this.baseUrl = '#/core' + $state.current.url.toString().replace(':id?', '');

    this.related = $state.current.data.related;

    this.formCfg = {
      formName: 'sampleForm',
      actions: [
        {
          label: 'Save',
          icon: 'ok', // refers to bootstraps glyphicon
          cb: (item) => { // receive the model
            console.log(item);
          },
          class: 'success'
        }
      ]
    };

    this.store.query(this.data.model)
      .subscribe(
        (event) => {
          // NOTE Observable mess with $digest cycles, we need to schedule the expression later
          $scope.$evalAsync(() => {
            this.title = this.ConfigHelpers.pluralize(this.data.model, event.length);
            this.tableData = event;

            // if it is a detail page
            if ($stateParams['id']) {
              this.model = _.find(this.tableData, {id: parseInt($stateParams['id'], 10)});
            }
          });
        }
      );

    // if it is a detail page
    if ($stateParams['id']) {
      this.list = false;
    }
  }

  public getRelatedItem(relation: string, item: any): number {
    if (angular.isDefined(item[relation.toLowerCase()])) {
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
