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
