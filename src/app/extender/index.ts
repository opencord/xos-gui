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
    .run(function ($timeout: ng.ITimeoutService, $ocLazyLoad: any, XosOnboarder: IXosOnboarder) {
      console.log('xosExtender');
      // $ocLazyLoad.load([
      //   'http://xos.dev:4001/spa/vendor.js',
      // ]);
      //
      // $timeout(() => {
      //   $ocLazyLoad.load([
      //     'http://xos.dev:4001/spa/app.js'
      //   ]);
      // }, 1000);
    });
})();

