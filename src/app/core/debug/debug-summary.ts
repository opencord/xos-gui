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

import {IXosDebugStatus, IXosDebugService} from './debug.service';

class XosDebugSummaryController {
  static $inject = ['$scope', 'XosDebug'];
  public debugStatus: IXosDebugStatus;

  constructor(
    private $scope: ng.IScope,
    private XosDebug: IXosDebugService
  ) {
    this.debugStatus = this.XosDebug.status;

    this.$scope.$on('xos.debug.status', (e, status: IXosDebugStatus) => {
      this.debugStatus = status;
      this.$scope.$apply();
    });
  }
}

export const xosDebugSummary: angular.IComponentOptions = {
  template: require('./debug-summary.html'),
  controllerAs: 'vm',
  controller: XosDebugSummaryController
};
