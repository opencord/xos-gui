
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


/**
 * LUNA - Responsive Admin Theme
 *
 */
/* tslint:disable */

import * as $ from 'jquery';
import {IXosKeyboardShortcutService} from '../../core/services/keyboard-shortcut';

export interface IXosNavHandlerService {
  minimalize: () => void;
}

export class XosNavHandlerService implements IXosNavHandlerService {

  static $inject = ['XosKeyboardShortcut'];

  constructor(
    private XosKeyboardShortcut: IXosKeyboardShortcutService
  ) {
    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'n',
      description: 'Toggle Navigation',
      cb: this.minimalize,
    }, 'global');
  }

  public minimalize() {
    $("body").toggleClass("nav-toggle");
  }

}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
export function minimalizaMenu() {
  return {
    restrict: 'EA',
    template: '<div class="left-nav-toggle"><a href ng-click="minimalize()"><i class="stroke-hamburgermenu"></i> </a>',
    controller: function ($scope, XosNavHandler: IXosNavHandlerService) {
      $scope.minimalize = function () {
        XosNavHandler.minimalize();
      };
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
