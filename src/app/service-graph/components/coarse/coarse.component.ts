import {IXosServiceGraphStore} from '../../services/graph.store';
import {IXosServiceGraph} from '../../interfaces';
class XosCoarseTenancyGraphCtrl {

  static $inject = ['$log', 'XosServiceGraphStore'];

  public graph: IXosServiceGraph;

  constructor (
    private $log: ng.ILogService,
    private XosServiceGraphStore: IXosServiceGraphStore
  ) {

    this.XosServiceGraphStore.getCoarse()
      .subscribe((res) => {
        this.graph = res;
      });
  }
}

export const XosCoarseTenancyGraph: angular.IComponentOptions = {
  template: require('./coarse.component.html'),
  controllerAs: 'vm',
  controller: XosCoarseTenancyGraphCtrl,
};
