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

import {IXosKeyboardShortcutService} from '../../core/services/keyboard-shortcut';
import {IXosSgConfig} from '../interfaces';

export interface IXosGraphConfig {
  getUserConfig(): IXosSgConfig;
}

export class XosGraphConfig {

  static $inject = [
    '$cookies',
    'XosKeyboardShortcut'
  ];

  private defaultUserConfig: IXosSgConfig = {
    labels: false
  };

  private userConfig: IXosSgConfig = this.defaultUserConfig;

  constructor (
    private $cookies: ng.cookies.ICookiesService,
    private XosKeyboardShortcut: IXosKeyboardShortcutService
  ) {
    this.userConfig = this.getUserConfig();

    // Setup keyboard shortcuts
    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'l',
      cb: () => {
        console.log('Define a toggle label function!');
      },
      label: 'l',
      description: 'Toggle labels'
    });
  }

  public getUserConfig(): IXosSgConfig {
    let config = this.$cookies.get('xos-service-graph-user-config');
    if (!config || config.length === 0) {
      this.$cookies.put('xos-service-graph-user-config', JSON.stringify(this.defaultUserConfig));
      config = this.$cookies.get('xos-service-graph-user-config');
    }
    return JSON.parse(config);
  }
}
