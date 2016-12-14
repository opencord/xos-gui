import {IXosTableCfg} from '../../core/table/table';
import {IStoreService} from '../../datasources/stores/slices.store';
export interface IXosCrudData {
  title: string;
  store: string;
  xosTableCfg: IXosTableCfg;
}

class CrudController {
  // TODO dynamically inject store
  static $inject = ['$state', '$injector', '$scope'];

  public data: IXosCrudData;
  public tableCfg: IXosTableCfg;
  public title: string;
  public storeName: string;
  public store: IStoreService;
  public tableData: any[];

  constructor(
    private $state: angular.ui.IStateService,
    private $injector: angular.Injectable<any>,
    private $scope: angular.IScope
  ) {
    this.data = this.$state.current.data;
    this.tableCfg = this.data.xosTableCfg;
    this.title = this.data.title;
    this.storeName = this.data.store;
    this.store = this.$injector.get(this.storeName);

    this.store.query()
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
