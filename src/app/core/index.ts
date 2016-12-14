import {xosHeader} from './header/header';
import {xosFooter} from './footer/footer';
import {xosNav} from './nav/nav';
import routesConfig from './routes';
import {xosLogin} from './login/login';
import {xosTable} from './table/table';

export const xosCore = 'xosCore';

angular
  .module('xosCore', ['ui.router'])
  .config(routesConfig)
  .component('xosHeader', xosHeader)
  .component('xosFooter', xosFooter)
  .component('xosNav', xosNav)
  .component('xosLogin', xosLogin)
  .component('xosTable', xosTable);
