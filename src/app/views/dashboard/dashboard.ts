import {IModelStoreService} from '../../datasources/stores/model.store';
import {IXosAuthService} from '../../datasources/rest/auth.rest';
class DashboardController {
  static $inject = ['$scope', '$state', 'ModelStore', 'AuthService'];

  public nodes: number;
  public slices: number;
  public instances: number;

  constructor(
    private $scope: ng.IScope,
    private $state: ng.ui.IStateService,
    private store: IModelStoreService,
    private auth: IXosAuthService
  ) {

    if (!this.auth.isAuthenticated()) {
      this.$state.go('login');
    }
    else {
      this.store.query('Node')
        .subscribe((event) => {
          this.$scope.$evalAsync(() => {
            this.nodes = event.length;
          });
        });
      this.store.query('Instance')
        .subscribe((event) => {
          this.$scope.$evalAsync(() => {
            this.instances = event.length;
          });
        });
      this.store.query('Slice')
        .subscribe((event) => {
          this.$scope.$evalAsync(() => {
            this.slices = event.length;
          });
        });
      this.instances = 0;
      this.nodes = 0;
      this.slices = 0;
    }
  }
}

export const xosDashboard: angular.IComponentOptions = {
  template: require('./dashboard.html'),
  controllerAs: 'vm',
  controller: DashboardController
};
