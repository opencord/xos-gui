export interface IXosDebouncer {
  debounce(func: any, wait: number, immediate?: boolean): any;
}

export class XosDebouncer implements IXosDebouncer {
  static $inject = ['$log'];

  constructor (
    private $log: ng.ILogService
  ) {

  }

  // wait for 'wait' ms without actions to call the function
  // if 'immediate' call it immediatly then wait for 'wait'
  // NOTE that we cannot use $timeout service to debounce functions as it trigger infiniteDigest Exception
  public debounce(func: any, wait: number, immediate?: boolean) {
    let timeout;
    const self = this;
    return function() {
      const context = self;
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
