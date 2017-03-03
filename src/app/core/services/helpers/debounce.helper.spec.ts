import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {XosDebouncer, IXosDebouncer} from './debounce.helper';

let service: IXosDebouncer;

describe('The XosDebouncer service', () => {

  beforeEach(() => {
    angular
      .module('test', ['toastr'])
      .service('XosDebouncer', XosDebouncer);
    angular.mock.module('test');
  });

  beforeEach(angular.mock.inject((
    XosDebouncer: IXosDebouncer,
  ) => {
    service = XosDebouncer;
  }));

  it('should call a function only after it has not been called for 500ms', (done) => {
    const spy = jasmine.createSpy('fn');
    const efficientSpy = service.debounce(spy, 500, false);
    /* tslint:disable */
    efficientSpy();
    efficientSpy();
    /* tslint:enable */
    expect(spy).not.toHaveBeenCalled();
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 600);
  });
});

