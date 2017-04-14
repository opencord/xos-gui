/// <reference path="../typings/index.d.ts" />

import * as angular from 'angular';

import 'angular-ui-router';
import 'angular-resource';
import 'angular-cookies';
import '../node_modules/ngprogress/build/ngProgress';
import routesConfig from './routes';

import {main} from './app/main';

import './index.scss';
import {xosCore} from './app/core/index';
import {xosDataSources} from './app/datasources/index';
import {xosViews} from './app/views/index';
import {xosTemplate} from './app/template/index';

import {
  interceptorConfig, userStatusInterceptor, CredentialsInterceptor,
  NoHyperlinksInterceptor
} from './interceptors';
import {IXosPageTitleService} from './app/core/services/page-title';
import {IXosAuthService} from './app/datasources/rest/auth.rest';
import {IXosNavigationRoute} from './app/core/services/navigation';
import XosLogDecorator from './decorators';
import {xosExtender} from './app/extender/index';
import {IXosKeyboardShortcutService} from './app/core/services/keyboard-shortcut';
import {IXosModelDiscovererService} from './app/datasources/helpers/model-discoverer.service';
import {xosServiceGraph} from './app/service-graph/index';

export interface IXosAppConfig {
  apiEndpoint: string;
  websocketClient: string;
}

export interface IXosStyleConfig {
  projectName: string;
  payoff: string;
  favicon: string;
  background: string;
  logo: string;
  routes: IXosNavigationRoute[];
}

angular
  .module('app', [
    xosCore,
    xosDataSources,
    xosViews,
    xosExtender,
    xosTemplate, // template module
    xosServiceGraph,
    'ui.router',
    'ngResource',
    'ngProgress'
  ])
  .config(XosLogDecorator)
  .config(routesConfig)
  .config(interceptorConfig)
  .factory('UserStatusInterceptor', userStatusInterceptor)
  .factory('CredentialsInterceptor', CredentialsInterceptor)
  .factory('NoHyperlinksInterceptor', NoHyperlinksInterceptor)
  .component('xos', main)
  .provider('XosConfig', function(){
    // save the last visited state before reload
    const lastVisitedUrl = window.location.hash.replace('#', '');
    this.$get = [() => {
      return {
        lastVisitedUrl
      };
    }] ;
    return this;
  })
  .run((
    $rootScope: ng.IRootScopeService,
    $transitions: any,
    $log: ng.ILogService,
    $location: ng.ILocationService,
    $state: ng.ui.IStateService,
    StyleConfig: IXosStyleConfig,
    XosModelDiscoverer: IXosModelDiscovererService,
    AuthService: IXosAuthService,
    XosKeyboardShortcut: IXosKeyboardShortcutService,
    PageTitle: IXosPageTitleService // NOTE this service is not used, but needs to be loaded somewhere
  ) => {
    // handle style configs
    $rootScope['favicon'] = `./app/images/brand/${StyleConfig.favicon}`;
    if ($state.current.data && $state.current.data.specialClass) {
      $rootScope['class'] = $state.current.data.specialClass;
    }
    $transitions.onSuccess({ to: '**' }, (transtion) => {
      if ($state.current.data && $state.current.data.specialClass) {
        $rootScope['class'] = transtion.$to().data.specialClass;
      }
      else {
        $rootScope['class'] = '';
      }
    });

    // check the user login (on route change)
    $transitions.onSuccess({ to: '**' }, (transtion) => {
      if (!AuthService.isAuthenticated()) {
        AuthService.clearUser();
        $state.go('login');
      }
    });

    // if the user is authenticated
    $log.info(`[XOS] Is user authenticated? ${AuthService.isAuthenticated()}`);
    if (AuthService.isAuthenticated()) {
      $state.go('loader');
    }
    else {
      AuthService.clearUser();
      $state.go('login');
    }

    // register keyboard shortcut
    XosKeyboardShortcut.setup();

    XosKeyboardShortcut.registerKeyBinding({
      key: 'D',
      cb: () => {
        if (window.localStorage.getItem('debug') === 'true') {
          $log.info(`[XosKeyboardShortcut] Disabling debug`);
          window.localStorage.setItem('debug', 'false');
        }
        else {
          window.localStorage.setItem('debug', 'true');
          $log.info(`[XosKeyboardShortcut] Enabling debug`);
        }
      },
      description: 'Toggle debug messages in browser console'
    }, 'global');

  });

