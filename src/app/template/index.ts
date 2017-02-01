// TODO check used deps

import {minimalizaMenu, panelTools} from './directives/directives';
export const xosTemplate = 'xosTemplate';

import 'angular-ui-bootstrap';
import 'angular-animate';
import 'angular-toastr';
import 'bootstrap/dist/css/bootstrap.css';
import 'angular-toastr/dist/angular-toastr.min.css';
import '../style/style.scss';
import '../style/stroke-icons/style.css';
import '../style/pe-icons/pe-icon-7-stroke.css';
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
    .directive('minimalizaMenu', minimalizaMenu)
    // .directive('sparkline', sparkline)
    .directive('panelTools', panelTools)
    .filter('capitalize', capitalize);
})();

