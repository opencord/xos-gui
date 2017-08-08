
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


import {IXosStyleConfig} from '../../../index';
export interface IXosPageTitleService {
  get(): string;
  set(title: string): void;
  formatStateName(stateName: string): string;
}

export class PageTitle {
  static $inject = ['$window', '$transitions', 'StyleConfig'];
  constructor(
    private $window: angular.IWindowService,
    private $transitions: any, // missing definition
    private StyleConfig: IXosStyleConfig
  ) {
    this.$transitions.onSuccess({ to: '**' }, (transtion) => {
      this.set(transtion.$to().name);
    });
  }

  get() {
    return this.$window.document.title;
  }

  set(title: string) {
    this.$window.document.title = `${this.StyleConfig.projectName} - ${this.formatStateName(title)}`;
  }

  private formatStateName(stateName: string): string {
    // TODO pluralize and capitalize first letter only
    return stateName.replace('xos.', '').split('.').join(' > ');
  }
}

