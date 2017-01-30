import {xosDataSources} from '../datasources/index';
export const xosExtender = 'xosExtender';

import 'angular-ui-bootstrap';
import 'angular-animate';
import 'angular-toastr';
import 'oclazyload';
import {XosOnboarder, IXosOnboarder} from './services/onboard.service';


(function () {
  angular.module(xosExtender, [
    'oc.lazyLoad',
    xosDataSources
  ])
    .service('XosOnboarder', XosOnboarder)
    .run(function ($log: ng.ILogService, XosOnboarder: IXosOnboarder) {
      $log.info('[XosOnboarder] Setup');
    });
})();

