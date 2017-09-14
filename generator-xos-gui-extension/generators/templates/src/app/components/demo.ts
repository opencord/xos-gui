
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


class DemoComponent {
  static $inject = ['XosSidePanel', 'XosKeyboardShortcut'];

  constructor(
    private XosSidePanel: any,
    private XosKeyboardShortcut: any
  ) {
    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'v',
      description: 'Alert popup',
      cb: () => {
        alert('This binding is provided by the extension <%= name %>');
      },
    }, 'view');
  }

  togglePanel() {
    this.XosSidePanel.toggleComponent('xosAlert', {config: {type: 'info'}, show: true}, 'This content is being toggled by the extension <%= name %>');
  }

}

export const xosDemoComponent: angular.IComponentOptions = {
  template: require('./demo.html'),
  controllerAs: 'vm',
  controller: DemoComponent
};
