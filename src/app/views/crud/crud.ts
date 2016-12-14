import {IXosResourceService} from '../../rest/slices.rest';
import {IXosTableCfg} from '../../core/table/table';
export interface IXosCrudData {
  title: string;
  resource: string;
  xosTableCfg: IXosTableCfg;
}

class CrudController {
  static $inject = ['$state', '$injector'];

  public data: IXosCrudData;
  public tableCfg: IXosTableCfg;
  public title: string;
  public resourceName: string;
  public resource: ng.resource.IResourceClass<ng.resource.IResource<any>>;
  public tableData: any[];

  constructor(
    private $state: angular.ui.IStateService,
    private $injector: angular.Injectable<any>
  ) {
    this.data = this.$state.current.data;
    console.log('xosCrud', this.data);
    this.tableCfg = this.data.xosTableCfg;
    this.title = this.data.title;
    this.resourceName = this.data.resource;
    this.resource = this.$injector.get(this.resourceName).getResource();

    this.resource
      .query().$promise
      .then(res => {
        this.tableData = res;
      });
  }
}

export const xosCrud: angular.IComponentOptions = {
  template: require('./crud.html'),
  controllerAs: 'vm',
  controller: CrudController
};
