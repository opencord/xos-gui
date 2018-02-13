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

import * as $ from 'jquery';
import {IXosKeyboardShortcutService} from '../../core/services/keyboard-shortcut';
import {IXosSidePanelService} from '../../core/side-panel/side-panel.service';
import {GraphStates, IXosGraphStateMachine} from './graph-state-machine';

export interface IXosGraphConfig {
  setupKeyboardShortcuts(): void;
  toggleFullscreen(): void;
}

export class XosGraphConfig {

  static $inject = [
    '$log',
    '$cookies',
    '$rootScope',
    '$timeout',
    'XosSidePanel',
    'XosKeyboardShortcut',
    'XosGraphStateMachine'
  ];

  constructor (
    private $log: ng.ILogService,
    private $cookies: ng.cookies.ICookiesService,
    private $rootScope: ng.IRootScopeService,
    private $timeout: ng.ITimeoutService,
    private XosSidePanel: IXosSidePanelService,
    private XosKeyboardShortcut: IXosKeyboardShortcutService,
    private XosGraphStateMachine: IXosGraphStateMachine
  ) {

  }

  public setupKeyboardShortcuts() {

    this.$log.info(`[XosGraphConfig] Setting up keyboard shortcuts`);

    // Setup keyboard shortcuts
    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'h',
      modifiers: ['shift'],
      cb: () => {
        this.XosSidePanel.toggleComponent('xosServiceGraphLegend');
      },
      label: 'h',
      description: 'Toggle Graph Legend'
    });

    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'f',
      modifiers: ['shift'],
      cb: () => {
        this.toggleFullscreen();
      },
      label: 'f',
      description: 'Toggle graph fullscreen'
    });

    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'c',
      modifiers: ['shift'],
      cb: () => {
        this.XosGraphStateMachine.go(GraphStates.Services);
      },
      label: 'c',
      description: 'Clean the Service graph'
    });

    this.XosKeyboardShortcut.registerKeyBinding({
      key: 's',
      modifiers: ['shift'],
      cb: () => {
        this.XosGraphStateMachine.go(GraphStates.ServiceInstances);
      },
      label: 's',
      description: 'Show ServiceInstances'
    });

    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'i',
      modifiers: ['shift'],
      cb: () => {
        this.XosGraphStateMachine.go(GraphStates.Instances);
      },
      label: 'i',
      description: 'Show Instances'
    });

    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'n',
      modifiers: ['shift'],
      cb: () => {
        this.XosGraphStateMachine.go(GraphStates.Networks);
      },
      label: 'n',
      description: 'Show Networks'
    });

  }

  public toggleFullscreen() {
    $('.graph-container').toggleClass('fullscreen');
    this.$timeout(() => {
      // NOTE wait for the CSS transition to complete before repositioning
      this.$rootScope.$broadcast('xos.sg.update');
    }, 500);
  }
}
