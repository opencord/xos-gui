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

import {IXosKeyboardShortcutService, IXosKeyboardShortcutMap} from '../services/keyboard-shortcut';
import './key-binding-panel.scss';

class XosKeyBindingPanelController {
  static $inject = ['$scope', 'XosKeyboardShortcut'];
  public bindings: IXosKeyboardShortcutMap;

  constructor (
    private $scope: ng.IScope,
    private XosKeyboardShortcut: IXosKeyboardShortcutService
  ) {
    this.bindings = this.XosKeyboardShortcut.keyMapping;
  }
}

export const xosKeyBindingPanel: angular.IComponentOptions = {
  template: require('./key-binding-panel.html'),
  controllerAs: 'vm',
  controller: XosKeyBindingPanelController
};
