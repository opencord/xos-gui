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

// TODO support 3rd level to group service model under "Services"

export class IXosNavigationService {
  static $inject = ['$log', 'StyleConfig'];
  private routes: IXosNavigationRoute[];

  constructor(
    private $log: ng.ILogService,
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
      // {
      //   label: 'Service',
      //   state: 'xos.services'
      // },
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

    const routeExist = _.findIndex(this.routes, (r: IXosNavigationRoute) => {
      if (r.label === route.label && r.state === route.state && r.parent === route.parent) {
        return true;
      }
      return false;
    }) > -1;

    if (routeExist) {
      this.$log.warn(`[XosNavigation] Route with label: ${route.label}, state: ${route.state} and parent: ${route.parent} already exist`);
      return;
    }

    if (angular.isDefined(route.parent)) {
      // route parent should be a state for now
      const parentRoute = _.find(this.routes, {state: route.parent});
      if (angular.isDefined(parentRoute)) {
        if (angular.isArray(parentRoute.children)) {
          parentRoute.children.push(route);
        }
        else {
          parentRoute.children = [route];
        }
      }
      else {
        this.$log.warn(`[XosNavigation] Parent State (${route.parent}) for state: ${route.state} does not exists`);
        return;
      }
    }
    else {
      this.routes.push(route);
    }
  }
}
