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
}

export interface IXosDebugService {
  status: IXosDebugStatus;
  setupShortcuts(): void;
  toggleGlobalDebug(): void;
  toggleEventDebug(): void;
}

export class XosDebugService implements IXosDebugService {

  static $inject = ['$log', '$rootScope', 'XosKeyboardShortcut'];

  public status: IXosDebugStatus = {
    global: false,
    events: false
  };

  constructor (
    private $log: ng.ILogService,
    private $scope: ng.IScope,
    private XosKeyboardShortcut: IXosKeyboardShortcutService
  ) {
    const debug = window.localStorage.getItem('debug');
    this.status.global = (debug === 'true');

    const debugEvent = window.localStorage.getItem('debug-event');
    this.status.events = (debugEvent === 'true');
  }

  public setupShortcuts(): void {
    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'D',
      cb: () => this.toggleGlobalDebug(),
      description: 'Toggle debug messages in browser console'
    }, 'global');

    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'E',
      cb: () => this.toggleEventDebug(),
      description: 'Toggle debug messages for WS events in browser console'
    }, 'global');
  }

  public toggleGlobalDebug(): void {
    if (window.localStorage.getItem('debug') === 'true') {
      this.$log.info(`[XosDebug] Disabling debug`);
      window.localStorage.setItem('debug', 'false');
      this.status.global = false;
    }
    else {
      window.localStorage.setItem('debug', 'true');
      this.$log.info(`[XosDebug] Enabling debug`);
      this.status.global = true;
    }
    this.$scope.$broadcast('xos.debug.status', this.status);
  }

  public toggleEventDebug(): void {
    if (window.localStorage.getItem('debug-event') === 'true') {
      this.$log.info(`[XosDebug] Disabling debug for WS events`);
      window.localStorage.setItem('debug-event', 'false');
      this.status.events = false;
    }
    else {
      window.localStorage.setItem('debug-event', 'true');
      this.$log.info(`[XosDebug] Enabling debug for WS events`);
      this.status.events = true;
    }
    this.$scope.$broadcast('xos.debug.status', this.status);
  }
}
