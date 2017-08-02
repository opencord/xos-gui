import {xosCore} from '../core/index';
import {xosCrud} from './crud/crud';
import {xosDashboard} from './dashboard/dashboard';
import {XosCrudRelationService} from './crud/crud.relations.service';

export const xosViews = 'xosViews';

angular
  .module('xosViews', [xosCore])
  .service('XosCrudRelation', XosCrudRelationService)
  .component('xosCrud', xosCrud)
  .component('xosDashboard', xosDashboard);
