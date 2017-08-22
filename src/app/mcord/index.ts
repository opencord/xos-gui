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

import 'angularjs-gauge';
import {mcordEpc} from './epc-demo/epc.component';
import {IRuntimeStatesService} from '../core/services/runtime-states';
import {IXosNavigationService} from '../core/services/navigation';
import {EpcData, IEpcData} from './epc-demo/data';
import {mcordXran} from './xran-demo/xran.component';
import {XRanSvg} from './xran-demo/xran.svg';

class Base64 {
    static keyStr = 'ABCDEFGHIJKLMNOP' +
      'QRSTUVWXYZabcdef' +
      'ghijklmnopqrstuv' +
      'wxyz0123456789+/' +
      '=';

    static encode(input) {
        var output = "";
        let chr1: any, chr2: any, chr3: any = "";
        let enc1: any, enc2: any, enc3: any, enc4: any = "";
        var i = 0;

        do {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }

          output = output +
            this.keyStr.charAt(enc1) +
            this.keyStr.charAt(enc2) +
            this.keyStr.charAt(enc3) +
            this.keyStr.charAt(enc4);
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
      }

      static decode(input) {
        let output = "";
        let chr1: any, chr2: any, chr3: any = "";
        let enc1: any, enc2: any, enc3: any, enc4: any = "";
        let i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        let base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
          alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
          enc1 = this.keyStr.indexOf(input.charAt(i++));
          enc2 = this.keyStr.indexOf(input.charAt(i++));
          enc3 = this.keyStr.indexOf(input.charAt(i++));
          enc4 = this.keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
          }

          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
      }
}

angular.module('mcord', [
  'ui.bootstrap.modal',
  'angularjs-gauge'
])
  .component('mcordEpc', mcordEpc)
  .service('McordEpcData', EpcData)
  .component('mcordXran', mcordXran)
  .service('XRanSvg', XRanSvg)
  .config(function($httpProvider) {
    console.log(Base64.encode('karaf' + ':' + 'karaf'));
    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('onos' + ':' + 'rocks');
  })
  .run((
    RuntimeStates: IRuntimeStatesService,
    NavigationService: IXosNavigationService,
    McordEpcData: IEpcData
  ) => {

    McordEpcData.setup();

    RuntimeStates.addState(`xos.mcord`, {
      abstract: true,
      template: '<div ui-view></div>'
    });

    RuntimeStates.addState(`xos.mcord.epc`, {
      url: 'epc',
      parent: 'xos.mcord',
      component: 'mcordEpc'
    });

    RuntimeStates.addState(`xos.mcord.xran`, {
      url: 'xran',
      parent: 'xos.mcord',
      component: 'mcordXran'
    });

    NavigationService.add({
      label: 'MCORD EPC',
      state: 'xos.mcord.epc'
    });

    NavigationService.add({
      label: 'MCORD XRAN',
      state: 'xos.mcord.xran'
    });
  });