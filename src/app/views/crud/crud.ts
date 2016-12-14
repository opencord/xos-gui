import {IXosTableCfg} from '../../core/table/table';
import {IStoreService} from '../../datasources/stores/slices.store';
export interface IXosCrudData {
  title: string;
  resource: string;
  xosTableCfg: IXosTableCfg;
}

class CrudController {
  // TODO dynamically inject store
  static $inject = ['$state', '$injector', '$scope', 'SliceStore'];

  public data: IXosCrudData;
  public tableCfg: IXosTableCfg;
  public title: string;
  public resourceName: string;
  public resource: ng.resource.IResourceClass<ng.resource.IResource<any>>;
  public tableData: any[];

  constructor(
    private $state: angular.ui.IStateService,
    private $injector: angular.Injectable<any>,
    private $scope: angular.IScope,
    private store: IStoreService
  ) {
    this.data = this.$state.current.data;
    this.tableCfg = this.data.xosTableCfg;
    this.title = this.data.title;
    this.resourceName = this.data.resource;
    this.resource = this.$injector.get(this.resourceName).getResource();

    this.store.query()
      .subscribe(
        (event) => {
          // NOTE Observable mess with $digest cicles, we need to schedule the expression later
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
