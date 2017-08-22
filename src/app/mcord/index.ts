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

angular.module('mcord', [
  'ui.bootstrap.modal',
  'angularjs-gauge'
])
  .component('mcordEpc', mcordEpc)
  .service('McordEpcData', EpcData)
  .component('mcordXran', mcordXran)
  .service('XRanSvg', XRanSvg)
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