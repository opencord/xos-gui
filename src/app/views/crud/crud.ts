import {IXosTableCfg} from '../../core/table/table';
import {IModelStoreService} from '../../datasources/stores/model.store';
import {IXosConfigHelpersService} from '../../core/services/helpers/config.helpers';
export interface IXosCrudData {
  model: string;
  xosTableCfg: IXosTableCfg;
}

class CrudController {
  static $inject = ['$state', '$scope', 'ModelStore', 'ConfigHelpers'];

  public data: IXosCrudData;
  public tableCfg: IXosTableCfg;
  public title: string;
  public tableData: any[];

  constructor(
    private $state: angular.ui.IStateService,
    private $scope: angular.IScope,
    private store: IModelStoreService,
    private ConfigHelpers: IXosConfigHelpersService
  ) {
    this.data = this.$state.current.data;
    this.tableCfg = this.data.xosTableCfg;
    this.title = this.ConfigHelpers.pluralize(this.data.model);

    this.store.query(this.data.model)
      .subscribe(
        (event) => {
          // NOTE Observable mess with $digest cycles, we need to schedule the expression later
          $scope.$evalAsync(() => {
            this.title = this.ConfigHelpers.pluralize(this.data.model, event.length);
            this.tableData = event;
          });
        }
      );
  }
}

export const xosCrud: angular.IComponentOptions = {
  template: require('./crud.html'),
  controllerAs: 'vm',
  controller: CrudController
};
