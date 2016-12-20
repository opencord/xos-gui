// TODO check used deps

import {pageTitle, minimalizaMenu, panelTools} from './directives/directives';
export const xosTemplate = 'luna';

import 'angular-ui-bootstrap';
import 'angular-animate';
import 'angular-toastr';
import 'bootstrap/dist/css/bootstrap.css';
import 'angular-toastr/dist/angular-toastr.min.css';
import '../style/style.scss';
import '../style/stroke-icons/style.css';


(function () {
  angular.module('luna', [
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
    .directive('pageTitle', pageTitle)
    .directive('minimalizaMenu', minimalizaMenu)
    // .directive('sparkline', sparkline)
    .directive('panelTools', panelTools);
})();

