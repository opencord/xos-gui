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

// NOTE this component will render the hidden model fields for debug purposes

import {IXosConfigHelpersService} from '../services/helpers/config.helpers';
export class XosDebugModelController {
  static $inject = [
    'ConfigHelpers'
  ];

  public debugFields: string[];

  constructor(
    private ConfigHelpers: IXosConfigHelpersService
  ) {

  }

  $onInit() {
    this.debugFields = this.ConfigHelpers.form_excluded_fields;
  }

  public toLabel(string: string): string {
    return this.ConfigHelpers.toLabel(string);
  }

  // NOTE each field has his own format, so make it human readable
  public parseField(fieldName: string, value: any): any {
    switch (fieldName) {
      case 'created':
      case 'updated':
      case 'enacted':
      case 'policed':
        return new Date(parseInt(value, 10) * 1000).toString();
      case 'backend_register':
        return JSON.parse(value);
      case 'policy_status':
      case 'backend_status':
        return value
          .split(' // ')
          .join('\n');
      default:
        return value;
    }
  }
}

export const xosDebugModel: angular.IComponentOptions = {
  template: require('./debug-model.html'),
    controllerAs: 'vm',
    controller: XosDebugModelController,
    bindings: {
      ngModel: '=',
    }
};
