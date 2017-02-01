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
  description?: string;
}

export class XosKeyboardShortcut implements IXosKeyboardShortcutService {
  static $inject = ['$log', 'XosSidePanel'];
  public keyMapping: IXosKeyboardShortcutMap = {
    global: [],
    view: []
  };
  public allowedModifiers: string[] = ['Meta', 'Alt', 'Shift', 'Control'];
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

  public baseBindings: IXosKeyboardShortcutBinding[] = [
    {
      key: '?',
      description: 'Toggle Shortcut Panel',
      cb: this.toggleKeyBindingPanel,
    },
    {
      key: '/',
      description: 'Toggle Shortcut Panel',
      cb: this.toggleKeyBindingPanel,
    }
  ];

  private isPanelOpen: boolean;

  constructor(
    private $log: ng.ILogService,
    private XosSidePanel: IXosSidePanelService
  ) {
    this.keyMapping.global = this.keyMapping.global.concat(this.baseBindings);
  }


  public setup(): void {
    $('body').on('keydown', (e) => {

      // NOTE disable binding if they come from an input or textarea
      const t = e.target.tagName.toLowerCase();
      if (t === 'input' || t === 'textarea') {
        return;
      }

      let pressedKey = null;

      if (e.key.length === 1 && e.key.match(/[a-z]/i) || String.fromCharCode(e.keyCode).toLowerCase().match(/[a-z]/i)) {
        // alphabet letters found
        pressedKey = String.fromCharCode(e.keyCode).toLowerCase();
      }
      else {
        pressedKey = e.key;
      }

      if (this.allowedModifiers.indexOf(e.key) > -1) {
        this.addActiveModifierKey(e.key);
        return;
      }

      // NOTE e.key change if we are using some modifiers (eg: Alt) while getting the value from the keyCode works
      const binding = this.findBindedShortcut(pressedKey);
      if (angular.isDefined(binding) && angular.isFunction(binding.cb)) {
        binding.cb();
      }
    });

    $('body').on('keyup', (e) => {
      if (this.allowedModifiers.indexOf(e.key) > -1) {
        this.removeActiveModifierKey(e.key);
        return;
      }
    });
  }

  public registerKeyBinding(binding: IXosKeyboardShortcutBinding, target: string = 'view'): void {
    // NOTE check for already taken binding (by key)
    // NOTE check target is either 'view' or 'global'

    if (!_.find(this.keyMapping[target], {key: binding.key})) {
      this.keyMapping[target].push(binding);
    }
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
    // NOTE search for binding in the global map
    let target =  _.find(this.keyMapping.global, {key: key});

    // NOTE if it is not there look in the view map
    if (!angular.isDefined(target)) {
      target = _.find(this.keyMapping.view, {key: key});
    }


    if (target && target.modifiers) {
      // if not all the modifier keys for that binding are pressed
      console.log(key, _.difference(target.modifiers, this.activeModifiers));
      if (_.difference(target.modifiers, this.activeModifiers).length > 0) {
        // do not match
        return;
      };
    }
    return target;
  }

}
