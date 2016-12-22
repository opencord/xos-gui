import {IModelStoreService} from '../../datasources/stores/model.store';
import {IXosAuthService} from '../../datasources/rest/auth.rest';
class DashboardController {
  static $inject = ['$state', 'ModelStore', 'AuthService'];

  public nodes: number;
  public slices: number;
  public instances: number;

  constructor(
    private $state: ng.ui.IStateService,
    private store: IModelStoreService,
    private auth: IXosAuthService
  ) {

    if (!this.auth.isAuthenticated()) {
      this.$state.go('login');
    }
    else {
      // this.store.query('node')
      //   .subscribe((event) => {
      //     console.log(`node`, event);
      //     this.nodes = event.length;
      // });
      this.store.query('slice')
        .subscribe((event) => {
          // console.log('slice', event);
          this.slices = event.length;
      });
      // this.store.query('instance')
      //   .subscribe((event) => {
      //     console.log('isntance', event);
      //     this.instances = event.length;
      // });
      this.instances = 0;
      this.nodes = 2;
      this.slices = 3;
    }
  }
}

export const xosDashboard: angular.IComponentOptions = {
  template: require('./dashboard.html'),
  controllerAs: 'vm',
  controller: DashboardController
};
