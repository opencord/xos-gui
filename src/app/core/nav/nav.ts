import './nav.scss';

interface INavItem {
  label: string;
  state: string;
}

class NavCtrl {
  public routes: INavItem[];

  constructor() {
    this.routes = [
      {
        label: 'Home',
        state: 'xos.dashboard'
      },
      {
        label: 'Instances',
        state: 'xos.instances'
      },
      {
        label: 'Slices',
        state: 'xos.slices'
      },
      {
        label: 'Nodes',
        state: 'xos.nodes'
      }
    ];
  }
}

export const xosNav: angular.IComponentOptions = {
  template: require('./nav.html'),
  controllerAs: 'vm',
  controller: NavCtrl
};
