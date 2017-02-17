import {ModelRest} from './rest/model.rest';
import {AuthService} from './rest/auth.rest';
import {WebSocketEvent} from './websocket/global';
import {XosModelStore} from './stores/model.store';
import {StoreHelpers} from './helpers/store.helpers';
import {SynchronizerStore} from './stores/synchronizer.store';
import {XosModeldefsService} from './rest/modeldefs.rest';
import {xosCore} from '../core/index';
import {SearchService} from './helpers/search.service';
import {XosModelDiscovererService} from './helpers/model-discoverer.service';

export const xosDataSources = 'xosDataSources';

angular
  .module(xosDataSources, ['ngCookies', 'ngResource', xosCore])
  .service('ModelRest', ModelRest)
  .service('AuthService', AuthService)
  .service('WebSocket', WebSocketEvent)
  .service('StoreHelpers', StoreHelpers)
  .service('SynchronizerStore', SynchronizerStore)
  .service('XosModelStore', XosModelStore)
  .service('XosModelDefs', XosModeldefsService)
  .service('SearchService', SearchService);

angular
  .module(xosDataSources)
  .service('XosModelDiscoverer', XosModelDiscovererService);
