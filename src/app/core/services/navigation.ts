export interface IXosNavigationRoute {
  label: string;
  state?: string;
  url?: string;
}

export interface IXosNavigationService {
  query(): IXosNavigationRoute[];
  add(route: IXosNavigationRoute): void;
}

export class NavigationService {
  private routes: IXosNavigationRoute[];

  constructor() {
    this.routes = [
      {
        label: 'Home',
        state: 'xos.dashboard'
      }
    ];
  }

  query() {
    return this.routes;
  }

  add(route: IXosNavigationRoute) {
    if (angular.isDefined(route.state) && angular.isDefined(route.url)) {
      throw new Error('[XosNavigation] You can\'t provide both state and url');
    }
    this.routes.push(route);
  }
}
