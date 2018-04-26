
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
import './loader.scss';

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

  public loader: boolean = true;
  public error: string;

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
      this.$log.debug(`[XosLoader] Models are already loaded, moving to: ${this.XosConfig.lastVisitedUrl}`);
      this.moveOnTo(this.XosConfig.lastVisitedUrl);
    }
    else if (!this.XosAuthService.isAuthenticated()) {
      this.$log.debug(`[XosLoader] Not authenticated, send to login`);
      this.$state.go('xos.login');
    }
    else {
      // NOTE loading XOS Models
      this.XosModelDiscoverer.discover()
        .then((res) => {
          this.$log.info('[XosLoader] res: ' + res, res, typeof res);
          if (res === 'chameleon') {
            this.loader = false;
            this.error = 'chameleon';
            return 'chameleon';
          }
          else if (res) {
            this.$log.info('[XosLoader] All models loaded');
            // NOTE loading GUI Extensions
            this.XosOnboarder.onboard();
            return true;
          }
          else {
            this.$log.info('[XosLoader] Failed to load some models, moving on.');
            return true;
          }
        })
        .then((res) => {
          if (res === true) {
            this.moveOnTo(this.XosConfig.lastVisitedUrl);
          }
          // NOTE otherwise stay here since we're printing some error messages
        })
        .catch(() => {
          // XosModelDiscoverer.discover reject only in case of authentication error
          this.XosAuthService.clearUser();
          this.moveOnTo('/login');

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
    <div ng-show="vm.loader" class="loader"></div>
    <div class="row" ng-show="vm.error == 'chameleon'">
      <div class="col-sm-6 col-sm-offset-3">
        <div class="alert alert-danger">
          <div class="row">
            <div class="col-xs-2">
              <i class="fa fa-exclamation-triangle"></i>
            </div>
            <div class="col-xs-10">
              <strong>Cannot load models definition.</strong><br>
              Please check that the Chameleon container is running
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  controllerAs: 'vm',
  controller: LoaderCtrl
};
