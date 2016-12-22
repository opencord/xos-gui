import {xosCore} from '../core/index';
import {xosCrud} from './crud/crud';
import {xosDashboard} from './dashboard/dashboard';

export const xosViews = 'xosViews';

angular
  .module('xosViews', [xosCore])
  .component('xosCrud', xosCrud)
  .component('xosDashboard', xosDashboard);
