
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


import {IWSEventService} from '../../datasources/websocket/global';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import * as _ from 'lodash';
import {Observable} from 'rxjs';

export interface IXosOnboarder {
  onboard(): ng.IPromise<boolean>;
}

export class XosOnboarder implements IXosOnboarder {
  static $inject = [
    '$timeout',
    '$log',
    '$q',
    'WebSocket',
    '$ocLazyLoad',
    'XosModelStore'
  ];

  constructor(
    private $timeout: ng.ITimeoutService,
    private $log: ng.ILogService,
    private $q: ng.IQService,
    private webSocket: IWSEventService,
    private $ocLazyLoad: any, // TODO add definition
    private XosModelStore: IXosModelStoreService
  ) {

  }

  public onboard(): ng.IPromise<boolean> {
    const d = this.$q.defer();

    this.$log.info('[XosOnboarder] Setup');

    // Load onboarded app
    const ComponentObservable: Observable<any> = this.XosModelStore.query('XOSGuiExtension');

    ComponentObservable.subscribe(
      (component) => {
        if (component.length === 0) {
          return d.resolve();
        }
        _.forEach(component, (c) => {
          this.$log.info(`[XosOnboarder] Loading files for app: ${c.name}`);
          const files = c.files.split(',').map(s => s.trim());
          this.loadFile(files)
            .then((res) => {
              this.$log.info(`[XosOnboarder] All files loaded for app: ${c.name}`);
              d.resolve();
            })
            .catch(e => {
              this.$log.info(`[XosOnboarder] Error while onboarding apps: `, e);
            });
        });
      }
    );
    return d.promise;
  }

  // NOTE files needs to be loaded in order, so async loop!
  private loadFile(files: string[], d?: ng.IDeferred<any>): ng.IPromise<string[]> {
    if (!angular.isDefined(d)) {
      d = this.$q.defer();
    }
    const file = files.shift();

    this.$log.info(`[XosOnboarder] Loading file: ${file}`);
    this.$ocLazyLoad.load(file)
      .then((res) => {
        this.$log.info(`[XosOnboarder] Loaded file: `, file);
        if (files.length > 0) {
          return this.loadFile(files, d);
        }
        return d.resolve(file);
      })
      .catch((err) => {
        this.$log.error(`[XosOnboarder] Failed to load file: `, err);
        d.reject(err);
      });

    return d.promise;
  }
}
