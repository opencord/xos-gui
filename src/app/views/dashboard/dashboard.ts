
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


import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {IXosAuthService} from '../../datasources/rest/auth.rest';
import {Subscription} from 'rxjs/Subscription';


class DashboardController {
  static $inject = [
    '$log',
    '$scope',
    '$state',
    'XosModelStore',
    'AuthService'
  ];

  public nodes: number;
  public slices: number;
  public instances: number;

  private nodeSubscription: Subscription;
  private sliceSubscription: Subscription;
  private instanceSubscription: Subscription;

  constructor(
    private $log: ng.ILogService,
    private $scope: ng.IScope,
    private $state: ng.ui.IStateService,
    private store: IXosModelStoreService,
    private auth: IXosAuthService
  ) {

    this.$log.info(`[XosDashboardView] Setup`);

    if (!this.auth.isAuthenticated()) {
      this.$state.go('login');
    }
    else {
      this.nodeSubscription = this.store.query('Node')
        .subscribe((event) => {
          this.$scope.$evalAsync(() => {
            this.nodes = event.length;
          });
        });
      this.instanceSubscription = this.store.query('Instance')
        .subscribe((event) => {
          this.$scope.$evalAsync(() => {
            this.instances = event.length;
          });
        });
      this.sliceSubscription = this.store.query('Slice')
        .subscribe((event) => {
          this.$scope.$evalAsync(() => {
            this.slices = event.length;
          });
        });
      this.instances = 0;
      this.nodes = 0;
      this.slices = 0;
    }
  }

  $onDestroy () {
    this.nodeSubscription.unsubscribe();
    this.instanceSubscription.unsubscribe();
    this.sliceSubscription.unsubscribe();
  }
}

export const xosDashboard: angular.IComponentOptions = {
  template: require('./dashboard.html'),
  controllerAs: 'vm',
  controller: DashboardController
};
