
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


// TODO check used deps

import {minimalizaMenu, panelTools, XosNavHandlerService} from './directives/directives';
export const xosTemplate = 'xosTemplate';

import 'angular-ui-bootstrap';
import 'angular-animate';
import 'angular-toastr';
import 'angular-toastr/dist/angular-toastr.min.css';
// import '../style/style.scss';
// import '../style/stroke-icons/style.css';
// import '../style/pe-icons/pe-icon-7-stroke.css';
import {capitalize} from './filters/capitalize';


(function () {
  angular.module('xosTemplate', [
    'ui.router',                // Angular flexible routing
    'ui.bootstrap',             // AngularJS native directives for Bootstrap
    // 'angular-flot',             // Flot chart
    // 'datamaps',                 // Datamaps directive
    'ngAnimate',                // Angular animations
    'toastr',                   // Toastr notification
    // 'ui.sortable',              // AngularJS ui-sortable
    // 'datatables',               // Angular datatables plugin
    // 'datatables.buttons',       // Datatables Buttons
    // 'ui.tree'                   // Angular ui Tree
  ])
    .service('XosNavHandler', XosNavHandlerService)
    .directive('minimalizaMenu', minimalizaMenu)
    // .directive('sparkline', sparkline)
    .directive('panelTools', panelTools)
    .filter('capitalize', capitalize);
})();

