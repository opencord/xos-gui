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
  .run(function($log: ng.ILogService, $rootScope: ng.IRootScopeService, $transitions: any, StyleConfig: IXosStyleConfig) {
    $rootScope['favicon'] = `./app/images/brand/${StyleConfig.favicon}`;
    $transitions.onSuccess({ to: '**' }, (transtion) => {
      if (transtion.$to().name === 'login') {
        $rootScope['class'] = 'blank';
      }
      else {
        $rootScope['class'] = '';
      }
    });
  })
  .run((
    $rootScope: ng.IRootScopeService,
    $transitions: any,
    $log: ng.ILogService,
    $location: ng.ILocationService,
    $state: ng.ui.IStateService,
    XosModelDiscoverer: IXosModelDiscovererService,
    AuthService: IXosAuthService,
    XosKeyboardShortcut: IXosKeyboardShortcutService,
    toastr: ng.toastr.IToastrService,
    PageTitle: IXosPageTitleService
  ) => {

    // check the user login
    $transitions.onSuccess({ to: '**' }, (transtion) => {
      if (!AuthService.isAuthenticated()) {
        AuthService.clearUser();
        $state.go('login');
      }
    });

    // preserve debug=true query string parameter
    $transitions.onStart({ to: '**' }, (transtion) => {
      // save location.search so we can add it back after transition is done
      this.locationSearch = $location.search();
    });

    $transitions.onSuccess({ to: '**' }, (transtion) => {
      // restore all query string parameters back to $location.search
      if (angular.isDefined(this.locationSearch.debug) && this.locationSearch.debug) {
        $location.search({debug: 'true'});
      }
    });

    // save the last visited state before reload
    const lastRoute = $location.path();
    const lastQueryString = $location.search();

    // if the user is authenticated
    $log.info(`[XOS] Is user authenticated? ${AuthService.isAuthenticated()}`);
    if (AuthService.isAuthenticated()) {
      XosModelDiscoverer.discover()
        .then((res) => {
          if (res) {
            $log.info('[XOS] All models loaded');
          }
          else {
            $log.info('[XOS] Failed to load some models, moving on.');
          }
          // after setting up dynamic routes, redirect to previous state
          $location.path(lastRoute).search(lastQueryString);
        })
        .finally(() => {
          $rootScope.$emit('xos.core.modelSetup');
        });
    }
    else {
      AuthService.clearUser();
      $state.go('login');
    }

    // register keyboard shortcut
    XosKeyboardShortcut.setup();

    XosKeyboardShortcut.registerKeyBinding({
      key: 'D',
      // modifiers: ['Command'],
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

