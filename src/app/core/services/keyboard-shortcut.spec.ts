
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


import * as angular from 'angular';
import 'angular-mocks';
import {IXosKeyboardShortcutService, XosKeyboardShortcut, IXosKeyboardShortcutBinding} from './keyboard-shortcut';
import {IXosSidePanelService} from '../side-panel/side-panel.service';

let service: IXosKeyboardShortcutService;
let $log: ng.ILogService;
let $transitions: any;
let XosSidePanel: IXosSidePanelService;
let logSpy: any;

const baseGlobalModifiers: IXosKeyboardShortcutBinding[] = [
  {
    key: 'a',
    cb: 'cb'
  },
  {
    key: 'a',
    cb: 'modified',
    modifiers: ['alt']
  },
  {
    key: 'a',
    cb: 'modified',
    modifiers: ['meta']
  }
];

const baseLocalModifiers: IXosKeyboardShortcutBinding[] = [
  {
    key: 'b',
    cb: 'cb'
  },
  {
    key: 'b',
    cb: 'modified',
    modifiers: ['meta', 'alt']
  }
];

describe('The XosKeyboardShortcut service', () => {

  beforeEach(() => {
    angular.module('leyBinding', ['ui.router'])
      .service('XosKeyboardShortcut', XosKeyboardShortcut)
      .value('XosSidePanel', {

      });
    angular.mock.module('leyBinding');

    angular.mock.inject((
      _$log_: ng.ILogService,
      _$transitions_: any,
      _XosSidePanel_: IXosSidePanelService
    ) => {
      $log = _$log_;
      $transitions = _$transitions_;
      XosSidePanel = _XosSidePanel_;
      logSpy = spyOn($log, 'warn');
    });

    service = new XosKeyboardShortcut($log, $transitions, XosSidePanel);
  });

  it('should have a setup method', () => {
    expect(service.setup).toBeDefined();
  });

  describe('the addActiveModifierKey method', () => {
    beforeEach(() => {
      service['activeModifiers'] = [];
    });
    it('should add an active modifier', () => {
      service['addActiveModifierKey']('shift');
      expect(service['activeModifiers']).toEqual(['shift']);
    });

    it('should not add a modifier twice', () => {
      service['addActiveModifierKey']('shift');
      service['addActiveModifierKey']('shift');
      expect(service['activeModifiers']).toEqual(['shift']);
    });
  });

  describe('the removeActiveModifierKey method', () => {
    beforeEach(() => {
      service['activeModifiers'] = ['shift', 'meta'];
    });
    it('should remove an active modifier', () => {
      service['removeActiveModifierKey']('shift');
      expect(service['activeModifiers']).toEqual(['meta']);
    });
  });

  describe('the findBindedShortcut method', () => {
    beforeEach(() => {
      service['activeModifiers'] = [];
      service['keyMapping']['global'] = baseGlobalModifiers;
      service['keyMapping']['view'] = baseLocalModifiers;
    });

    it('should find a global keybinding', () => {
      const binding = service['findBindedShortcut']('a');
      expect(binding).toEqual({key: 'a', cb: 'cb'});
    });

    it('should find a global keybinding with modifiers', () => {
      service['activeModifiers'] = ['meta'];
      const binding = service['findBindedShortcut']('a');
      expect(binding).toEqual({key: 'a', cb: 'modified', modifiers: ['meta']});
    });

    it('should find a view keybinding', () => {
      const binding = service['findBindedShortcut']('b');
      expect(binding).toEqual({key: 'b', cb: 'cb'});
    });

    it('should find a view keybinding with modifiers', () => {
      service['activeModifiers'] = ['meta', 'alt'];
      const binding = service['findBindedShortcut']('b');
      expect(binding).toEqual({key: 'b', cb: 'modified', modifiers: ['meta', 'alt']});
    });

    it('should not care about binding key case', () => {
      const binding = service['findBindedShortcut']('A');
      expect(binding).toEqual({key: 'a', cb: 'cb'});
    });
  });

  describe('the registerKeyBinding method', () => {

    const binding = {
      key: 'B',
      cb: 'callback'
    };

    beforeEach(() => {
      service['keyMapping'] = {
        global: [
          {
            key: 'a',
            cb: 'cb',
            modifiers: undefined
          }
        ],
        view: []
      };
    });

    it('should add a new global keybinding', () => {
      service['registerKeyBinding'](binding, 'global');
      expect(service['keyMapping']['global'].length).toBe(2);
      expect(service['keyMapping']['global'][1].key).toBe('b');
    });

    it('should add a new view keybinding', () => {
      service['registerKeyBinding'](binding);
      expect(service['keyMapping']['view'].length).toBe(1);
      expect(service['keyMapping']['view'][0].key).toBe('b');
    });

    it('should not add binding that is not registered as "global" or "view"', () => {
      function errorFunctionWrapper() {
        service['registerKeyBinding']({
          key: 'z',
          cb: 'cb'
        }, 'something');
      }
      expect(errorFunctionWrapper).toThrow(new Error('[XosKeyboardShortcut] A shortcut can be registered with scope "global" or "view" only'));
    });

    it('should not add binding that has an already registered key', () => {
      service['registerKeyBinding']({
        key: 'A',
        cb: 'cb'
      }, 'global');
      expect(logSpy).toHaveBeenCalledWith('[XosKeyboardShortcut] A shortcut for key "a" has already been registered');
    });
  });
});
