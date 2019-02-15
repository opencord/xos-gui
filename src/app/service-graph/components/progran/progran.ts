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

import {IXosModelStoreService} from '../../../datasources/stores/model.store';

class ProgranCtrl {
  static $inject = [
    '$log',
    '$scope',
    'XosModelStore'
  ];

  public slices: any;

  constructor (
    private $log: ng.ILogService,
    private $scope: ng.IScope,
    private XosModelStore: IXosModelStoreService
  ) {
    this.$log.info('[Progran] Component setup');

    this.loadData();
  }

  public loadData() {
    const slicesSubscription = this.XosModelStore.query('ProgranServiceInstances', '/progran/progranserviceinstances')
    .subscribe(
      (res) => {
        this.slices = res;
        this.$log.info('[Progran]', res);
      },
      (err) => {
        this.$log.error(`[Progran] ProgranService Observable: `, err);
      }
    )
  }

  public speedUp(slice, field) {
    this.$log.info(`[Progran] Speeding up slice ${slice.name}`)
    slice[field] = slice[field] + 5;
    slice.$save();
  }

  public speedDown(slice, field) {
    this.$log.info(`[Progran] Speeding down slice ${slice.name}`)
    slice[field] = slice[field] - 5;
    slice.$save();
  }
}

export const Progran: angular.IComponentOptions = {
  template: require('./progran.component.html'),
  controllerAs: 'vm',
  controller: ProgranCtrl,
};
