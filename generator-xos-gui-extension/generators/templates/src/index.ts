
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/// <reference path="../typings/index.d.ts" />
import * as angular from 'angular';

import 'angular-ui-router';
import 'angular-resource';
import 'angular-cookies';
import routesConfig from './routes';
import {xosDemoComponent} from './app/components/demo';



angular.module('<%= name %>', [
    'ui.router',
    'app'
  ])
  .config(routesConfig)
  .component('demo', xosDemoComponent)
  .run(function(
    $log: ng.ILogService,
    $state: ng.ui.IStateService,
    XosNavigationService: any) {
    $log.info('[<%= name %>] App is running');

    XosNavigationService.add({
      label: '<%= name %>',
      state: 'xos.<%= name %>.demo',
    });

  });
