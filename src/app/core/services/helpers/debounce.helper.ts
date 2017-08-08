
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


export interface IXosDebouncer {
  debounce(func: any, wait: number, context: any, immediate?: boolean): any;
}

export class XosDebouncer implements IXosDebouncer {
  static $inject = ['$log'];

  constructor (
    private $log: ng.ILogService
  ) {

  }

  // wait for 'wait' ms without actions to call the function
  // if 'immediate' call it immediately then wait for 'wait'
  // NOTE that we cannot use $timeout service to debounce functions as it trigger infiniteDigest Exception
  public debounce(func: any, wait: number, context: any, immediate?: boolean) {
    let timeout;
    return function() {
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }
}
