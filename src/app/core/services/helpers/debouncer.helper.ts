export interface IXosDebouncer {
  debounce(func: any, wait: number, immediate?: boolean): void;
}

export class XosDebouncer implements IXosDebouncer {
  static $inject = ['$log', '$timeout'];

  constructor (
    private $log: ng.ILogService,
    private $timeout: ng.ITimeoutService
  ) {

  }

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
      self.$timeout.cancel(timeout);
      timeout = self.$timeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }
}
