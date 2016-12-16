import {ModelRest} from './rest/model.rest';
import {AuthService} from './rest/auth.rest';
import {WebSocketEvent} from './websocket/global';
import {ModelStore} from './stores/model.store';
import {StoreHelpers} from './helpers/store.helpers';
import {SynchronizerStore} from './stores/synchronizer.store';
import {ModeldefsService} from './rest/modeldefs.rest';

export const xosDataSources = 'xosDataSources';

angular
  .module('xosDataSources', ['ngCookies', 'ngResource'])
  .service('ModelRest', ModelRest)
  .service('AuthService', AuthService)
  .service('WebSocket', WebSocketEvent);

angular
  .module('xosDataSources')
  .service('StoreHelpers', StoreHelpers)
  .service('SynchronizerStore', SynchronizerStore)
  .service('ModelStore', ModelStore)
  .service('ModelDefs', ModeldefsService);
