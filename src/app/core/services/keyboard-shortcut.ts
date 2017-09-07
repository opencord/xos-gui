
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
import * as _ from 'lodash';
import {IXosSidePanelService} from '../side-panel/side-panel.service';

export interface IXosKeyboardShortcutService {
  keyMapping: IXosKeyboardShortcutMap;
  registerKeyBinding(binding: IXosKeyboardShortcutBinding, target?: string);
  setup(): void;
}

export interface IXosKeyboardShortcutMap {
  global: IXosKeyboardShortcutBinding[];
  view: IXosKeyboardShortcutBinding[];
}

export interface IXosKeyboardShortcutBinding {
  key: string;
  cb: any;
  modifiers?: string[];
  label?: string;
  description?: string;
  onInput?: boolean;
}

export class XosKeyboardShortcut implements IXosKeyboardShortcutService {
  static $inject = ['$log', '$transitions', 'XosSidePanel'];
  public keyMapping: IXosKeyboardShortcutMap = {
    global: [],
    view: []
  };
  public allowedModifiers: string[] = ['meta', 'alt', 'shift', 'control'];
  public activeModifiers: string[] = [];

  private toggleKeyBindingPanel = (): void => {
    if (!this.isPanelOpen) {
      this.XosSidePanel.injectComponent('xosKeyBindingPanel');
      this.isPanelOpen = true;
    }
    else {
      this.XosSidePanel.removeInjectedComponents();
      this.isPanelOpen = false;
    }
  };

  /* tslint:disable */
  public baseBindings: IXosKeyboardShortcutBinding[] = [
    {
      key: 'slash',
      label: '/',
      description: 'Toggle Shortcut Panel',
      cb: this.toggleKeyBindingPanel,
    },
    {
      key: 'esc',
      label: 'Esc',
      cb: (event) => {
        // NOTE removing focus from input elements on Esc
        event.target.blur();
      },
      onInput: true
    }
  ];
  /* tslint:enable */

  private isPanelOpen: boolean;

  constructor(
    private $log: ng.ILogService,
    $transitions: any,
    private XosSidePanel: IXosSidePanelService
  ) {
    this.keyMapping.global = this.keyMapping.global.concat(this.baseBindings);

    $transitions.onStart({ to: '**' }, (transtion) => {
      // delete view keys before that a new view is loaded
        this.$log.debug(`[XosKeyboardShortcut] Deleting view keys`);
        this.keyMapping.view = [];
    });
  }


  public setup(): void {
    this.$log.info(`[XosKeyboardShortcut] Setup`);
    $('body').on('keydown', (e) => {

      const pressedKey = this.whatKey(e.which);
      if (!pressedKey) {
        return;
      }

      if (this.allowedModifiers.indexOf(e.key.toLowerCase()) > -1) {
        this.addActiveModifierKey(e.key.toLowerCase());
        return;
      }

      // NOTE e.key change if we are using some modifiers (eg: Alt) while getting the value from the keyCode works
      const binding = this.findBindedShortcut(pressedKey);
      if (angular.isDefined(binding) && angular.isFunction(binding.cb)) {
        // NOTE disable binding if they come from an input or textarea
        // if not different specified
        const t = e.target.tagName.toLowerCase();
        if ((t === 'input' || t === 'textarea') && !binding.onInput) {
          return;
        }
        binding.cb(e);
        e.preventDefault();
      }
    });

    $('body').on('keyup', (e) => {
      if (this.allowedModifiers.indexOf(e.key.toLowerCase()) > -1) {
        this.removeActiveModifierKey(e.key.toLowerCase());
        return;
      }
    });
  }

  public registerKeyBinding(binding: IXosKeyboardShortcutBinding, target: string = 'view'): void {

    if (target !== 'global' && target !== 'view') {
      throw new Error('[XosKeyboardShortcut] A shortcut can be registered with scope "global" or "view" only');
    }

    binding.key = binding.key.toLowerCase();
    if (_.find(this.keyMapping.global, {key: binding.key, modifiers: binding.modifiers}) || _.find(this.keyMapping.view, {key: binding.key, modifiers: binding.modifiers})) {
      this.$log.warn(`[XosKeyboardShortcut] A shortcut for key "${binding.key}" has already been registered`);
      return;
    }

    this.$log.debug(`[XosKeyboardShortcut] Registering binding for key: ${binding.key}`);
    this.keyMapping[target].push(binding);
  }

  private addActiveModifierKey(key: string) {
    if (this.activeModifiers.indexOf(key) === -1) {
      this.activeModifiers.push(key);
    }
  }

  private removeActiveModifierKey(key: string) {
    _.remove(this.activeModifiers, k => k === key);
  }

  private findBindedShortcut(key: string): IXosKeyboardShortcutBinding {
    const globalTargets =  _.filter(this.keyMapping.global, {key: key.toLowerCase()});

    const localTargets = _.filter(this.keyMapping.view, {key: key.toLowerCase()});

    let targets = globalTargets.concat(localTargets);

    if (targets.length === 0) {
      return;
    }

    // NOTE remove targets that does not match modifiers
    targets = _.filter(targets, (t: IXosKeyboardShortcutBinding) => {
      if (this.activeModifiers.length === 0) {
        return true;
      }
      else if (t.modifiers && _.difference(t.modifiers, this.activeModifiers).length === 0) {
        return true;
      }
      return false;
    });

    return targets[0];
  }

  private whatKey(code: number) {
    switch (code) {
      case 8: return 'delete';
      case 9: return 'tab';
      case 13: return 'enter';
      case 16: return 'shift';
      case 17: return 'control';
      case 18: return 'alt';
      case 27: return 'esc';
      case 32: return 'space';
      case 37: return 'leftArrow';
      case 38: return 'upArrow';
      case 39: return 'rightArrow';
      case 40: return 'downArrow';
      case 91: return 'meta';
      case 186: return 'semicolon';
      case 187: return 'equals';
      case 188: return 'comma';
      case 189: return 'dash';
      case 190: return 'dot';
      case 191: return 'slash';
      case 192: return 'backQuote';
      case 219: return 'openBracket';
      case 220: return 'backSlash';
      case 221: return 'closeBracket';
      case 222: return 'quote';
      default:
        if ((code >= 48 && code <= 57) ||
          (code >= 65 && code <= 90)) {
          return String.fromCharCode(code);
        } else if (code >= 112 && code <= 123) {
          return 'F' + (code - 111);
        }
        return null;
  }
}

}
