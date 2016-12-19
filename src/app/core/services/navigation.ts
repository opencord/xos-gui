/// <reference path="../../../../typings/index.d.ts" />

import * as _ from 'lodash';
import {StyleConfig} from '../../config/style.config';

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
  private routes: IXosNavigationRoute[];

  constructor() {
    const defaultRoutes = [
      {
        label: 'Core',
        state: 'xos.core'
      },
      {
        label: 'Home',
        state: 'xos.dashboard'
      }
    ];
    // adding configuration defined routes
    this.routes = StyleConfig.routes.concat(defaultRoutes).reverse();
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
