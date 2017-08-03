import * as $ from 'jquery';
import {IXosComponentInjectorService} from '../services/helpers/component-injector.helpers';

export interface IXosSidePanelService {
  open(): void;
  close(): void;
  injectComponent(componentName: string, attributes?: any, transclude?: string): void;
  removeInjectedComponents(): void;
}

export class XosSidePanel implements IXosSidePanelService {
  static $inject = ['$rootScope', '$compile', '$timeout', 'XosComponentInjector'];
  public sidePanelElName = 'xos-side-panel';
  public sidePanelElClass = '.xos-side-panel';
  public sidePanelEl: JQuery;
  private hasComponentLoaded: boolean;

  constructor (
    private $rootScope: ng.IRootScopeService,
    private $compile: ng.ICompileService,
    private $timeout: ng.ITimeoutService,
    private XosComponentInjector: IXosComponentInjectorService
  ) {
    this.sidePanelEl = $(`${this.sidePanelElName} > ${this.sidePanelElClass}`);
  }

  public open() {
    $(`${this.sidePanelElName} > ${this.sidePanelElClass}`).addClass('open');
  };

  public close() {
    $(`${this.sidePanelElName} > ${this.sidePanelElClass}`).removeClass('open');
  };

  public injectComponent(componentName: string, attributes?: any, transclude?: string) {
    let timeout = 0;
    if (this.hasComponentLoaded) {
      this.removeInjectedComponents();
      timeout = 501; // wait for panel to close and remove component
    }
    this.$timeout(() => {
      this.XosComponentInjector.injectComponent('#side-panel-container', componentName, attributes, transclude, true);
      this.hasComponentLoaded = true;
      this.open();
    }, timeout);
  }

  public removeInjectedComponents() {
    this.close();
    this.$timeout(() => {
      this.XosComponentInjector.removeInjectedComponents('#side-panel-container');
      this.hasComponentLoaded = false;
    }, 500);
  }

  public toggleComponent(componentName: string, attributes?: any, transclude?: string) {
    this.componentToggle = !this.componentToggle;
    if (this.componentToggle) {
      this.XosComponentInjector.injectComponent('#side-panel-container', componentName, attributes, transclude, true);
      this.open();
    }
    else {
      this.removeInjectedComponents();
    }
  }
}
