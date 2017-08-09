
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


import {IXosModelDiscovererService} from '../../datasources/helpers/model-discoverer.service';
import {IXosOnboarder} from '../../extender/services/onboard.service';
import {IXosAuthService} from '../../datasources/rest/auth.rest';
class LoaderCtrl {
  static $inject = [
    '$log',
    '$rootScope',
    '$location',
    '$timeout',
    '$state',
    'AuthService',
    'XosConfig',
    'XosModelDiscoverer',
    `XosOnboarder`
  ];

  constructor (
    private $log: ng.ILogService,
    private $rootScope: ng.IScope,
    private $location: ng.ILocationService,
    private $timeout: ng.ITimeoutService,
    private $state: ng.ui.IStateService,
    private XosAuthService: IXosAuthService,
    private XosConfig: any,
    private XosModelDiscoverer: IXosModelDiscovererService,
    private XosOnboarder: IXosOnboarder
  ) {

    this.run();
  }

  public run() {
    if (this.XosModelDiscoverer.areModelsLoaded()) {
      this.moveOnTo(this.XosConfig.lastVisitedUrl);
    }
    else if (!this.XosAuthService.isAuthenticated()) {
      this.$state.go('xos.login');
    }
    else {
      // NOTE loading XOS Models
      this.XosModelDiscoverer.discover()
        .then((res) => {
          if (res) {
            this.$log.info('[XosLoader] All models loaded');
          }
          else {
            this.$log.info('[XosLoader] Failed to load some models, moving on.');
          }
          // NOTE loading GUI Extensions
          return this.XosOnboarder.onboard();
        })
        .then(() => {
          this.moveOnTo(this.XosConfig.lastVisitedUrl);
        })
        .finally(() => {
          // NOTE it is in a timeout as the searchService is loaded after that
          this.$timeout(() => {
            this.$rootScope.$emit('xos.core.modelSetup');
          }, 500);
        });
    }
  }

  public moveOnTo(url: string) {
    this.$log.info(`[XosLoader] Redirecting to: ${url}`);
    switch (url) {
      case '':
      case '/':
      case '/loader':
      case '/login':
        this.$location.path('/dashboard');
        break;
      default:
        this.$timeout(() => {
          this.$location.path(url);
        }, 500);
        break;
    }
  }
}

export const xosLoader: angular.IComponentOptions = {
  template: `
    <div class="loader"></div>
  `,
  controllerAs: 'vm',
  controller: LoaderCtrl
};
