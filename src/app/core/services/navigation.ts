/// <reference path="../../../../typings/index.d.ts" />

import * as _ from 'lodash';
import {IXosStyleConfig} from '../../../index';

export interface IXosNavigationRoute {
  label: string;
  state?: string;
  url?: string;
  parent?: string;
  children?: [IXosNavigationRoute];
  opened?: boolean;
}

export interface IXosNavigationService {
  query(): IXosNavigationRoute[];
  add(route: IXosNavigationRoute): void;
}

export class NavigationService {
  static $inject = ['StyleConfig'];
  private routes: IXosNavigationRoute[];

  constructor(
    private StyleConfig: IXosStyleConfig
  ) {
    const defaultRoutes = [
      {
        label: 'Home',
        state: 'xos.dashboard'
      },
      {
        label: 'Core',
        state: 'xos.core'
      },
    ];
    // adding configuration defined routes
    // this.routes = StyleConfig.routes.concat(defaultRoutes).reverse();
    this.routes = defaultRoutes;
    this.StyleConfig.routes.forEach(r => {
      this.add(r);
    });
  }

  query() {
    return this.routes;
  }

  add(route: IXosNavigationRoute) {
    if (angular.isDefined(route.state) && angular.isDefined(route.url)) {
      throw new Error('[XosNavigation] You can\'t provide both state and url');
    }


    if (angular.isDefined(route.parent)) {
      // route parent should be a state for now
      const parentRoute = _.find(this.routes, {state: route.parent});

      if (angular.isArray(parentRoute.children)) {
        parentRoute.children.push(route);
      }
      else {
        parentRoute.children = [route];
      }
    }
    else {
      this.routes.push(route);
    }
  }
}
