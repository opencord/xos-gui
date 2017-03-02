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
  onInput?: boolean;
}

export class XosKeyboardShortcut implements IXosKeyboardShortcutService {
  static $inject = ['$log', '$transitions', 'XosSidePanel'];
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

  /* tslint:disable */
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
    },
    {
      key: 'Escape',
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
      if (this.allowedModifiers.indexOf(e.key) > -1) {
        this.removeActiveModifierKey(e.key);
        return;
      }
    });
  }

  public registerKeyBinding(binding: IXosKeyboardShortcutBinding, target: string = 'view'): void {
    // NOTE check for already taken binding (by key)
    // NOTE check target is either 'view' or 'global'
    this.$log.debug(`[XosKeyboardShortcut] Registering binding for key: ${binding.key}`);
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
      if (_.difference(target.modifiers, this.activeModifiers).length > 0) {
        // do not match
        return;
      };
    }
    return target;
  }

}
