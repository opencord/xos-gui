
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


import './validation.scss';

class ValidationCtrl {

  static $inject = [];

  public config: any;

  $onInit() {
    this.config = {
      type: 'danger'
    };
  }
}

export const xosValidation: angular.IComponentOptions = {
  template: require('./validation.html'),
  controllerAs: 'vm',
  controller: ValidationCtrl,
  transclude: true,
  bindings: {
    field: '=',
    form: '='
  }
};
