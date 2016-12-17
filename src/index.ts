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
import {
  interceptorConfig, userStatusInterceptor, CredentialsInterceptor,
  NoHyperlinksInterceptor
} from './interceptors';
import {IRuntimeStatesService} from './app/core/services/runtime-states';
import {IModeldefsService, IModeldef} from './app/datasources/rest/modeldefs.rest';
import {IXosCrudData} from './app/views/crud/crud';
import * as _ from 'lodash';
import {IXosNavigationService} from './app/core/services/navigation';
import {IXosPageTitleService} from './app/core/services/page-title';
import {IXosConfigHelpersService} from './app/core/services/helpers/config.helpers';

export interface IXosState extends angular.ui.IState {
  data: IXosCrudData;
};

angular
  .module('app', [xosCore, xosDataSources, xosViews, 'ui.router', 'ngResource'])
  .config(routesConfig)
  .config(interceptorConfig)
  .factory('UserStatusInterceptor', userStatusInterceptor)
  .factory('CredentialsInterceptor', CredentialsInterceptor)
  .factory('NoHyperlinksInterceptor', NoHyperlinksInterceptor)
  .component('xos', main)
  .run((
    ModelDefs: IModeldefsService,
    RuntimeStates: IRuntimeStatesService,
    NavigationService: IXosNavigationService,
    ConfigHelpers: IXosConfigHelpersService,
    PageTitle: IXosPageTitleService
  ) => {
    // Dinamically add a  core states
    ModelDefs.get()
      .then((models: IModeldef[]) => {
        // TODO move in a separate service and test
        _.forEach(models, (m: IModeldef) => {
          const state: IXosState = {
            parent: 'xos',
            url: ConfigHelpers.pluralize(m.name.toLowerCase()),
            component: 'xosCrud',
            data: {
              model: m.name,
              xosTableCfg: {
                columns: ConfigHelpers.modeldefToTableCfg(m.fields)
              }
            }
          };
          RuntimeStates.addState(ConfigHelpers.pluralize(m.name.toLowerCase()), state);
          NavigationService.add({label: ConfigHelpers.pluralize(m.name), url: ConfigHelpers.pluralize(m.name.toLowerCase())});
        });
      });
  });
