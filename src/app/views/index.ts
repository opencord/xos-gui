import {xosCore} from '../core/index';
import {xosCrud} from './crud/crud';

export const xosViews = 'xosViews';

angular
  .module('xosViews', [xosCore])
  .component('xosCrud', xosCrud);
