import * as $ from 'jquery';
import * as _ from 'lodash';

export interface IXosComponentInjectorService {
  injectComponent(target: string | JQuery, componentName: string, attributes?: any, transclude?: string, clean?: boolean): void;
  removeInjectedComponents(target: string | JQuery): void;
}

export class XosComponentInjector implements IXosComponentInjectorService {
  static $inject = ['$rootScope', '$compile'];

  constructor (
    private $rootScope: ng.IRootScopeService,
    private $compile: ng.ICompileService
  ) {
  }

  public injectComponent(target: string | JQuery, componentName: string, attributes?: any, transclude?: string, clean?: boolean) {
    let targetEl;
    if (angular.isString(target)) {
      targetEl = $(target);
    }
    else {
      targetEl = target;
    }

    const componentTagName = this.camelToSnakeCase(componentName);
    let scope = this.$rootScope.$new();
    let attr: string = '';

    if (clean) {
      this.removeInjectedComponents(target);
    }

    if (angular.isDefined(attributes) && angular.isObject(attributes)) {
      attr = this.stringifyAttributes(attributes);
      scope = angular.merge(scope, attributes);
    }

    const componentTag = `<${componentTagName} ${attr}>${transclude || ''}</${componentTagName}>`;
    const element = this.$compile(componentTag)(scope);

    targetEl.append(element);
  }

  public removeInjectedComponents(target: string | JQuery) {
    const targetEl = $(target);
    targetEl.html('');
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
