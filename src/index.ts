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

export interface IXosState extends angular.ui.IState {
  data: IXosCrudData;
};

const modeldefToTableCfg = (fields: {name: string, type: string}[]): any[] => {
  const excluded_fields = [
    'created',
    'updated',
    'enacted',
    'policed',
    'backend_register',
    'deleted',
    'write_protect',
    'lazy_blocked',
    'no_sync',
    'no_policy',
    'omf_friendly',
    'enabled'
  ];
  const cfg =  _.map(fields, (f) => {
    if (excluded_fields.indexOf(f.name) > -1) {
      return;
    }
    return {
      label: `${f.name}`, // TODO confert name to label
      prop: f.name
    };
  })
    .filter(v => angular.isDefined(v));

  return cfg;
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
    PageTitle: IXosPageTitleService
  ) => {
    // Dinamically add a  core states
    ModelDefs.get()
      .then((models: IModeldef[]) => {
        _.forEach(models, (m: IModeldef) => {
          const state: IXosState = {
            parent: 'xos',
            url: `${m.name.toLowerCase()}s`, // TODO use https://github.com/blakeembrey/pluralize
            component: 'xosCrud',
            data: {
              model: m.name,
              xosTableCfg: {
                columns: modeldefToTableCfg(m.fields)
              }
            }
          };
          RuntimeStates.addState(`${m.name.toLowerCase()}s`, state);
          NavigationService.add({label: `${m.name}s`, url: `${m.name.toLowerCase()}s`});
        });
      });
  });
