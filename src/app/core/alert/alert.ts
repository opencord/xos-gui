
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


export interface IXosAlertConfig {
  type: string;
  closeBtn?: boolean;
  autoHide?: number;
}

class AlertCtrl {

  static $inject = ['$timeout'];

  public config: IXosAlertConfig;
  public show: boolean;
  public dismiss: () => void;

  constructor (
    private $timeout: ng.ITimeoutService
  ) {

  }

  $onInit() {
    if (!angular.isDefined(this.config)) {
      throw new Error('[xosAlert] Please provide a configuration via the "config" attribute');
    }

    // default the value to true
    this.show = this.show !== false;

    this.dismiss = () => {
      this.show = false;
    };

    if (this.config.autoHide) {

      let to = this.$timeout(() => {
        this.dismiss();
        this.$timeout.cancel(to);
      }, this.config.autoHide);
    }
  }
}

export const xosAlert: angular.IComponentOptions = {
  template: require('./alert.html'),
  controllerAs: 'vm',
  controller: AlertCtrl,
  transclude: true,
  bindings: {
    config: '=',
    show: '=',
  }
};
