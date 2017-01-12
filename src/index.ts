/// <reference path="../typings/index.d.ts" />


import * as angular from 'angular';

import 'angular-ui-router';
import 'angular-resource';
import 'angular-cookies';
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
import {IXosCrudData} from './app/views/crud/crud';
import {IXosPageTitleService} from './app/core/services/page-title';
import {StyleConfig} from './app/config/style.config';
import {IXosAuthService} from './app/datasources/rest/auth.rest';
import {IXosModelSetupService} from './app/core/services/helpers/model-setup.helpers';

export interface IXosState extends angular.ui.IState {
  data: IXosCrudData;
};

angular
  .module('app', [
    xosCore,
    xosDataSources,
    xosViews,
    'ui.router',
    'ngResource',
    xosTemplate // template module
  ])
  .config(routesConfig)
  .config(interceptorConfig)
  .factory('UserStatusInterceptor', userStatusInterceptor)
  .factory('CredentialsInterceptor', CredentialsInterceptor)
  .factory('NoHyperlinksInterceptor', NoHyperlinksInterceptor)
  .component('xos', main)
  .run(function($rootScope: ng.IRootScopeService, $transitions: any) {
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
    $transitions: any,
    $location: ng.ILocationService,
    $state: ng.ui.IStateService,
    ModelSetup: IXosModelSetupService,
    AuthService: IXosAuthService,
    toastr: ng.toastr.IToastrService,
    PageTitle: IXosPageTitleService
  ) => {

    // check the user login
    $transitions.onSuccess({ to: '**' }, (transtion) => {
      if (!AuthService.getUser()) {
        $state.go('login');
      }
    });

    // save the last visited state before reload
    const lastRoute = window.location.hash.replace('#', '');

    // if the user is authenticated
    if (AuthService.getUser()) {
      ModelSetup.setup()
        .then(() => {
          // after setting up dynamic routes, redirect to previous state
          $location.path(lastRoute);
        });
    }

  });

