import './nav.scss';
import {IXosNavigationService, IXosNavigationRoute} from '../services/navigation';

class NavCtrl {
  static $inject = ['$state', 'NavigationService'];
  public routes: IXosNavigationRoute[];

  constructor(
    private $state: angular.ui.IStateService,
    private navigationService: IXosNavigationService
  ) {
    this.routes = this.navigationService.query();
  }

  isRouteActive(route: IXosNavigationRoute) {
    return this.$state.current.url === route.url ? 'active' : '';
  }
}

export const xosNav: angular.IComponentOptions = {
  template: require('./nav.html'),
  controllerAs: 'vm',
  controller: NavCtrl
};
