
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
import IHttpPromise = angular.IHttpPromise;

interface IXosServiceStatus {
  name: string;
  state: 'load' | 'unload' | 'present';
  version: string;
}

interface IXosServiceStatusResponse {
  model_output: string;
  model_status: number;
  services: IXosServiceStatus[];
}

class XosServiceStatusController {

  static $inject = [
    '$log',
    '$http',
    '$interval',
    'AppConfig'
  ];

  public services: IXosServiceStatus[] = [];
  public error: boolean;
  public loaded: boolean = false;

  constructor (
    private $log: angular.ILogService,
    private $http: angular.IHttpService,
    private $interval: ng.IIntervalService,
    private AppConfig: IXosAppConfig,
  ) {
    this.$interval(() => {
      this.getServiceStatus()
        .then(res => {
          this.services = res.data.services;
          this.loaded = true;
        })
        .catch(e => {
          this.error = true;
          this.$log.error(`[XosServiceStatus] Cannot read status from the backend`, e);
        });
    }, 10 * 1000);
  }

  private getServiceStatus(): IHttpPromise<IXosServiceStatusResponse> {
    return this.$http.get(`${this.AppConfig.apiEndpoint}/dynamicload/load_status`);
  }
}

export const xosServiceStatus: angular.IComponentOptions = {
  template: require('./service-status.html'),
  controllerAs: 'vm',
  controller: XosServiceStatusController,
};
