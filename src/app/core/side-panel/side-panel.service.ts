import * as $ from 'jquery';
import * as _ from 'lodash';

export interface IXosSidePanelService {
  open(): void;
  close(): void;
  injectComponent(componentName: string, attributes?: any, transclude?: string): void;
}

export class XosSidePanel implements IXosSidePanelService {
  static $inject = ['$rootScope', '$compile'];
  public sidePanelElName = 'xos-side-panel';
  public sidePanelElClass = '.xos-side-panel';
  public sidePanelEl: JQuery;

  constructor (
    private $rootScope: ng.IRootScopeService,
    private $compile: ng.ICompileService
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
    const componentTagName = this.camelToSnakeCase(componentName);
    let scope = this.$rootScope.$new();
    let attr: string = '';

    // NOTE add a flag to keep the loaded compoenents?
    this.removeInjectedComponents();

    if (angular.isDefined(attributes) && angular.isObject(attributes)) {
      attr = this.stringifyAttributes(attributes);
      scope = angular.merge(scope, attributes);
    }

    const componentTag = `<${componentTagName} ${attr}>${transclude || ''}</${componentTagName}>`;
    const element = this.$compile(componentTag)(scope);
    this.sidePanelEl.find('#side-panel-container').append(element);
    this.open();
  }

  public removeInjectedComponents() {
    this.sidePanelEl.find('#side-panel-container').html('');
  }

  private stringifyAttributes(attributes: any): string {
    return _.reduce(Object.keys(attributes), (string: string, a: string) => {
      string += `${a}="${a}"`;
      return string;
    }, '');
  }

  private camelToSnakeCase(name: string): string {
    return name.split(/(?=[A-Z])/).map(w => w.toLowerCase()).join('-');
  };
}
