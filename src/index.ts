/// <reference path="../typings/index.d.ts" />

import * as angular from 'angular';

import 'angular-ui-router';
import 'angular-resource';
import 'angular-cookies';
import routesConfig from './routes';

import {main} from './app/main';

import './index.scss';
import {xosCore} from './app/core/index';
import {xosRest} from './app/rest/index';
import {xosViews} from './app/views/index';
import {interceptorConfig, userStatusInterceptor, CredentialsInterceptor} from './interceptors';

angular
  .module('app', [xosCore, xosRest, xosViews, 'ui.router', 'ngResource'])
  .config(routesConfig)
  .config(interceptorConfig)
  .factory('UserStatusInterceptor', userStatusInterceptor)
  .factory('CredentialsInterceptor', CredentialsInterceptor)
  .component('xos', main);

