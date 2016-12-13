import {CoreRest} from './core.rest';
import {SlicesRest} from './slices.rest';
import {AuthService} from './auth.rest';

export const xosRest = 'xosRest';

angular
  .module('xosRest', ['ngCookies'])
  .service('CoreRest', CoreRest)
  .service('SlicesRest', SlicesRest)
  .service('AuthService', AuthService);
