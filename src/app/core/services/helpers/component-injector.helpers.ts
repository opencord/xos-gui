
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


import * as $ from 'jquery';
import * as _ from 'lodash';

export interface IXosComponentInjectorService {
  injectedComponents: IXosInjectedComponent[];
  injectComponent(target: string | JQuery, componentName: string, attributes?: any, transclude?: string, clean?: boolean): void;
  removeInjectedComponents(target: string | JQuery): void;
}

export interface IXosInjectedComponent {
  targetEl: string;
  componentName: string;
  attributes?: any;
  transclude?: string;
  clean?: boolean;
}

export class XosComponentInjector implements IXosComponentInjectorService {
  static $inject = ['$rootScope', '$compile', '$transitions', '$log', '$timeout'];

  public injectedComponents: IXosInjectedComponent[] = [];

  constructor (
    private $rootScope: ng.IRootScopeService,
    private $compile: ng.ICompileService,
    private $transitions: any,
    private $log: ng.ILogService,
    private $timeout: ng.ITimeoutService
  ) {
    $transitions.onFinish({ to: '**' }, (transtion) => {
      // wait for route transition to complete
      transtion.promise.then(t => {
        _.forEach(this.injectedComponents, (component: IXosInjectedComponent) => {
          const container = $(component.targetEl);
          // if we have the container, re-attach the component
          if (container.length > 0) {
            this.injectComponent(
              container,
              component.componentName,
              component.attributes,
              component.transclude,
              component.clean
            );
          }
        });
      });
    });
  }

  public injectComponent(target: string | JQuery, componentName: string, attributes?: any, transclude?: string, clean?: boolean) {
    let targetEl;
    if (angular.isString(target)) {

      if (target.indexOf('#') === -1) {
        this.$log.warn(`[XosComponentInjector] Target element should be identified by an ID, you passed: ${target}`);
      }

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
      // we cannot use angular.merge as it cast Resource to Objects
      _.forEach(Object.keys(attributes), (k: string) => {
        scope[k] = attributes[k];
      });
    }

    const componentTag = `<${componentTagName} ${attr}>${transclude || ''}</${componentTagName}>`;
    const element = this.$compile(componentTag)(scope);

    this.$timeout(function() {
      scope.$apply();
    });

    targetEl.append(element);

    // store a reference for the element
    this.storeInjectedComponent({
      targetEl: angular.isString(target) ? target : '#' + targetEl.attr('id'),
      componentName: componentName,
      attributes: attributes,
      transclude: transclude,
      clean: clean,
    });
  }

  public removeInjectedComponents(target: string | JQuery) {
    const targetEl = $(target);
    targetEl.html('');
  }

  private isComponendStored(component: IXosInjectedComponent) {
    return _.find(this.injectedComponents, (c: IXosInjectedComponent) => {
      return c.targetEl === component.targetEl
        && c.componentName === component.componentName
        && _.isEqual(c.attributes, component.attributes)
        && c.transclude === component.transclude
        && c.clean === component.clean;
    });
  }

  private storeInjectedComponent(component: IXosInjectedComponent) {
    const isAlreadyStored = this.isComponendStored(component);
    if (!isAlreadyStored) {
      this.injectedComponents.push(component);
    }
  }

  private stringifyAttributes(attributes: any): string {
    return _.reduce(Object.keys(attributes), (string: string, a: string) => {
      string += `${this.camelToSnakeCase(a)}="${a}"`;
      return string;
    }, '');
  }

  private camelToSnakeCase(name: string): string {
    return name.split(/(?=[A-Z])/).map(w => w.toLowerCase()).join('-');
  };
}
