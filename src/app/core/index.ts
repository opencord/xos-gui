
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


import {xosHeader} from './header/header';
import {xosFooter} from './footer/footer';
import {xosNav} from './nav/nav';
import routesConfig from './routes';
import {xosLogin} from './login/login';
import {xosTable} from './table/table';
import {XosRuntimeStates} from './services/runtime-states';
import {IXosNavigationService} from './services/navigation';
import {PageTitle} from './services/page-title';
import {ConfigHelpers} from './services/helpers/config.helpers';
import {xosLinkWrapper} from './link-wrapper/link-wrapper';
import {XosFormHelpers} from './form/form-helpers';
import {xosForm} from './form/form';
import {xosField} from './field/field';
import 'angular-toastr';
import {xosAlert} from './alert/alert';
import {xosValidation} from './validation/validation';
import {xosSidePanel} from './side-panel/side-panel';
import {XosSidePanel} from './side-panel/side-panel.service';
import {XosComponentInjector} from './services/helpers/component-injector.helpers';
import {XosKeyboardShortcut} from './services/keyboard-shortcut';
import {xosKeyBindingPanel} from './key-binding/key-binding-panel';
import {xosPagination} from './pagination/pagination';
import {PaginationFilter} from './pagination/pagination.filter';
import {XosDebouncer} from './services/helpers/debounce.helper';
import {ArrayToListFilter} from './table/array-to-list.filter';
import {xosLoader} from './loader/loader';
import {xosDebugSummary} from './debug/debug-summary';
import {XosDebugService} from './debug/debug.service';
import {xosDebugModel} from './debug/debug-model';
import {xosConfirm} from './confirm/confirm';
import {XosConfirm} from './confirm/confirm.service';

export const xosCore = 'xosCore';

angular
  .module('xosCore', [
    'ui.router',
    'toastr',
    'ui.bootstrap.typeahead',
    'ui.bootstrap.tabs'
  ])
  .config(routesConfig)
  .provider('XosRuntimeStates', XosRuntimeStates)
  .service('XosNavigationService', IXosNavigationService)
  .service('PageTitle', PageTitle)
  .service('XosFormHelpers', XosFormHelpers)
  .service('ConfigHelpers', ConfigHelpers)
  .service('XosSidePanel', XosSidePanel)
  .service('XosKeyboardShortcut', XosKeyboardShortcut)
  .service('XosComponentInjector', XosComponentInjector)
  .service('XosDebouncer', XosDebouncer)
  .service('XosDebug', XosDebugService)
  .service('XosConfirm', XosConfirm)
  .directive('xosLinkWrapper', xosLinkWrapper)
  .component('xosHeader', xosHeader)
  .component('xosFooter', xosFooter)
  .component('xosNav', xosNav)
  .component('xosLogin', xosLogin)
  .component('xosLoader', xosLoader)
  .component('xosPagination', xosPagination)
  .component('xosTable', xosTable)
  .component('xosForm', xosForm)
  .component('xosField', xosField)
  .component('xosAlert', xosAlert)
  .component('xosValidation', xosValidation)
  .component('xosSidePanel', xosSidePanel)
  .component('xosKeyBindingPanel', xosKeyBindingPanel)
  .component('xosDebugSummary', xosDebugSummary)
  .component('xosDebugModel', xosDebugModel)
  .component('xosConfirm', xosConfirm)
  .filter('pagination', PaginationFilter)
  .filter('arrayToList', ArrayToListFilter);
