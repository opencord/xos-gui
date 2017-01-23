import * as $ from 'jquery';
import {IXosComponentInjectorService} from '../services/helpers/component-injector.helpers';

export interface IXosSidePanelService {
  open(): void;
  close(): void;
  injectComponent(componentName: string, attributes?: any, transclude?: string): void;
}

export class XosSidePanel implements IXosSidePanelService {
  static $inject = ['$rootScope', '$compile', 'XosComponentInjector'];
  public sidePanelElName = 'xos-side-panel';
  public sidePanelElClass = '.xos-side-panel';
  public sidePanelEl: JQuery;

  constructor (
    private $rootScope: ng.IRootScopeService,
    private $compile: ng.ICompileService,
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
    this.XosComponentInjector.injectComponent('#side-panel-container', componentName, attributes, transclude, true);
    this.open();
  }
}
