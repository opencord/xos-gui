import {CoreRest} from './rest/core.rest';
import {SlicesRest} from './rest/slices.rest';
import {AuthService} from './rest/auth.rest';
import {WebSocketEvent} from './websocket/global';
import {SliceStore} from './stores/slices.store';
import {StoreHelpers} from './helpers/store.helpers';

export const xosRest = 'xosDataSources';

angular
  .module('xosDataSources', ['ngCookies'])
  .service('CoreRest', CoreRest)
  .service('SlicesRest', SlicesRest)
  .service('AuthService', AuthService)
  .service('WebSocket', WebSocketEvent);

angular
  .module('xosDataSources')
  .service('StoreHelpers', StoreHelpers)
  .service('SlicesStore', SliceStore);
