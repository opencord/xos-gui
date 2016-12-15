import {IXosTableCfg} from '../../core/table/table';
import {IModelStoreService} from '../../datasources/stores/model.store';
export interface IXosCrudData {
  model: string;
  xosTableCfg: IXosTableCfg;
}

class CrudController {
  static $inject = ['$state', '$scope', 'ModelStore'];

  public data: IXosCrudData;
  public tableCfg: IXosTableCfg;
  public title: string;
  public tableData: any[];

  constructor(
    private $state: angular.ui.IStateService,
    private $scope: angular.IScope,
    private store: IModelStoreService
  ) {
    this.data = this.$state.current.data;
    this.tableCfg = this.data.xosTableCfg;
    this.title = this.data.model;

    this.store.query(this.data.model)
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

export const xosCrud: angular.IComponentOptions = {
  template: require('./crud.html'),
  controllerAs: 'vm',
  controller: CrudController
};
