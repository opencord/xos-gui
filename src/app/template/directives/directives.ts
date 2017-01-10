/**
 * LUNA - Responsive Admin Theme
 *
 */
/* tslint:disable */

import * as $ from 'jquery';

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
export function minimalizaMenu($rootScope) {
  return {
    restrict: 'EA',
    template: '<div class="left-nav-toggle"><a href ng-click="minimalize()"><i class="stroke-hamburgermenu"></i> </a>',
    controller: function ($scope, $element) {
      $scope.minimalize = function () {
        $("body").toggleClass("nav-toggle");
      }
    }
  };
}


/**
 * sparkline - Directive for Sparkline chart
 */
// export function sparkline() {
//   return {
//     restrict: 'A',
//     scope: {
//       sparkData: '=',
//       sparkOptions: '=',
//     },
//     link: function (scope, element, attrs) {
//       scope.$watch(scope.sparkData, function () {
//         render();
//       });
//       scope.$watch(scope.sparkOptions, function(){
//         render();
//       });
//       var render = function () {
//         $(element).sparkline(scope.sparkData, scope.sparkOptions);
//       };
//     }
//   }
// }

/**
 * panelTools - Directive for panel tools elements in right corner of panel
 */
export function panelTools($timeout) {
  return {
    restrict: 'A',
    scope: true,
    templateUrl: 'views/common/panel_tools.html',
    controller: function ($scope, $element) {
      // Function for collapse ibox
      $scope.showhide = function () {
        var hpanel = $element.closest('div.panel');
        var icon = $element.find('i:first');
        var body = hpanel.find('div.panel-body');
        var footer = hpanel.find('div.panel-footer');
        body.slideToggle(300);
        footer.slideToggle(200);

        // Toggle icon from up to down
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        hpanel.toggleClass('').toggleClass('panel-collapse');
        $timeout(function () {
          hpanel.resize();
          hpanel.find('[id^=map-]').resize();
        }, 50);
      };

      // Function for close ibox
      $scope.closebox = function () {
        var hpanel = $element.closest('div.panel');
        hpanel.remove();
      }

    }
  };
};
