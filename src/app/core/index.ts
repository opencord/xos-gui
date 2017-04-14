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

export const xosCore = 'xosCore';

angular
  .module('xosCore', [
    'ui.router',
    'toastr',
    'ui.bootstrap.typeahead'
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
  .filter('pagination', PaginationFilter)
  .filter('arrayToList', ArrayToListFilter);
