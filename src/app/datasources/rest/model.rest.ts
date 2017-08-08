
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


import {IXosAppConfig} from '../../../index';
export interface IXosResourceService {
  getResource(url: string): ng.resource.IResourceClass<any>;
}

export class ModelRest implements IXosResourceService {
  static $inject = ['$resource', 'AppConfig'];

  /** @ngInject */
  constructor(
    private $resource: ng.resource.IResourceService,
    private AppConfig: IXosAppConfig
  ) {

  }

  public getResource(url: string): ng.resource.IResourceClass<ng.resource.IResource<any>> {
    const resource: angular.resource.IResourceClass<any> = this.$resource(`${this.AppConfig.apiEndpoint}${url}/:id/`, {id: '@id'}, {
      update: { method: 'PUT' },
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: (res) => {
          // FIXME chameleon return everything inside "items"
          return res.items ? res.items : res;
        }
      }
    });

    resource.prototype.$save = function() {
      if (this.id) {
        return this.$update();
      } else {
        return resource.save(this).$promise;
      }
    };

    return resource;
  }
}
