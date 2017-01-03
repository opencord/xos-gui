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
import {IRuntimeStatesService} from './app/core/services/runtime-states';
import {IModeldefsService, IModeldef} from './app/datasources/rest/modeldefs.rest';
import {IXosCrudData} from './app/views/crud/crud';
import * as _ from 'lodash';
import {IXosNavigationService} from './app/core/services/navigation';
import {IXosPageTitleService} from './app/core/services/page-title';
import {IXosConfigHelpersService} from './app/core/services/helpers/config.helpers';
import {StyleConfig} from './app/config/style.config';

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
    $location: ng.ILocationService,
    $state: ng.ui.IStateService,
    ModelDefs: IModeldefsService,
    RuntimeStates: IRuntimeStatesService,
    NavigationService: IXosNavigationService,
    ConfigHelpers: IXosConfigHelpersService,
    PageTitle: IXosPageTitleService
  ) => {

    // save the last visited state before reload
    const lastRoute = window.location.hash.replace('#', '');

    // Dinamically add a  core states
    ModelDefs.get()
      .then((models: IModeldef[]) => {
        // TODO move in a separate service and test
        _.forEach(models, (m: IModeldef) => {
          const stateUrl = `/${ConfigHelpers.pluralize(m.name.toLowerCase())}/:id?`;
          const stateName = `xos.core.${ConfigHelpers.pluralize(m.name.toLowerCase())}`;
          const state: IXosState = {
            parent: 'core',
            url: stateUrl,
            component: 'xosCrud',
            params: {
              id: null
            },
            data: {
              model: m.name,
              related: m.relations,
              xosTableCfg: {
                columns: ConfigHelpers.modeldefToTableCfg(m.fields, stateUrl),
                filter: 'fulltext',
                order: {field: 'id', reverse: false}, // TODO understand dynamic interfaces
                actions: [
                  {
                    label: 'delete',
                    icon: 'remove',
                    color: 'red',
                    cb: (item) => {
                      console.log(item);
                      item.$delete()
                        .then(res => {
                          console.log(res);
                        })
                        .catch(err => {
                          console.error(err);
                        });
                    }
                  }
                ]
              },
              // TODO add form config
            }
          };

          RuntimeStates.addState(stateName, state);
          NavigationService.add({
            label: ConfigHelpers.pluralize(m.name),
            state: stateName,
            parent: 'xos.core'
          });
        });

        // after setting up dynamic routes, redirect to previous state
        $location.path(lastRoute);
        // $state.get().forEach(s => {
        //   console.log(s.name, $state.href(s.name), s);
        // });
      });
  });
