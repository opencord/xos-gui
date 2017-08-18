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

import {IXosKeyboardShortcutService} from '../services/keyboard-shortcut';

export interface IXosDebugStatus {
  global: boolean;
  events: boolean;
  modelsTab: boolean;
}

export interface IXosDebugService {
  status: IXosDebugStatus;
  setupShortcuts(): void;
  toggleDebug(type: 'global' | 'events' | 'modelsTab'): void;
}

export class XosDebugService implements IXosDebugService {

  static $inject = ['$log', '$rootScope', 'XosKeyboardShortcut'];

  public status: IXosDebugStatus = {
    global: false,
    events: false,
    modelsTab: false
  };

  constructor (
    private $log: ng.ILogService,
    private $scope: ng.IScope,
    private XosKeyboardShortcut: IXosKeyboardShortcutService
  ) {
    const debug = window.localStorage.getItem('debug-global');
    this.status.global = (debug === 'true');

    const debugEvent = window.localStorage.getItem('debug-events');
    this.status.events = (debugEvent === 'true');

    const debugModelsTab = window.localStorage.getItem('debug-modelsTab');
    this.status.modelsTab = (debugModelsTab === 'true');
  }

  public setupShortcuts(): void {
    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'D',
      cb: () => this.toggleDebug('global'),
      description: 'Toggle debug messages in browser console'
    }, 'global');

    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'E',
      cb: () => this.toggleDebug('events'),
      description: 'Toggle debug messages for WS events in browser console'
    }, 'global');
  }

  public toggleDebug(type: 'global' | 'events' | 'modelsTab'): void {
    if (window.localStorage.getItem(`debug-${type}`) === 'true') {
      this.$log.info(`[XosDebug] Disabling ${type} debug`);
      window.localStorage.setItem(`debug-${type}`, 'false');
      this.status[type] = false;
    }
    else {
      this.$log.info(`[XosDebug] Enabling ${type} debug`);
      window.localStorage.setItem(`debug-${type}`, 'true');
      this.status[type] = true;
    }
    this.$scope.$broadcast('xos.debug.status', this.status);
  }
}
