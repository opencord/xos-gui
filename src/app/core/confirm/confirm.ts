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

import './confirm.scss';

export interface IXosConfirmConfig {
  header?: string;
  text?: string;
  actions: IXosConfirmConfigAction[];
}

export interface IXosConfirmConfigAction {
  label?: string;
  cb: Function;
  icon?: string;
  class?: string;
}

class ConfirmCtrl {

  static $inject = ['XosConfirm'];

  public resolve;
  public config: IXosConfirmConfig;

  constructor(
    private XosConfirm: any
  ) {

  }

  public $onInit() {
    this.config = this.resolve.config;
  }

  public close(cb: Function) {
    this.XosConfirm.close(cb);
  }

  public dismiss() {
    this.XosConfirm.dismiss();
  }

}

export const xosConfirm: angular.IComponentOptions = {
  template: require('./confirm.html'),
  controllerAs: 'vm',
  controller: ConfirmCtrl,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
};
