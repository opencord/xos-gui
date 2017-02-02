import * as angular from 'angular';
import 'angular-mocks';
import 'angular-resource';
import {Subject} from 'rxjs';
import {XosOnboarder, IXosOnboarder} from './onboard.service';
import {IWSEventService} from '../../datasources/websocket/global';

let service, $ocLazyLoad, $timeout;

const subject = new Subject();

const MockWs: IWSEventService = {
  list() {
    return subject.asObservable();
  }
};

const MockPromise = {
  then: (cb) => {
    cb('done');
    return MockPromise;
  },
  catch: (cb) => {
    cb('err');
    return MockPromise;
  }
};

const MockLoad = {
  load: () => {
    return MockPromise;
  }
};

const MockModelStore = {
  query: () => {
    return {
      subscribe: () => {
        return;
      }
    };
  }
};

describe('The XosOnboarder service', () => {

  beforeEach(() => {

    angular
      .module('XosOnboarder', [])
      .value('WebSocket', MockWs)
      .value('$ocLazyLoad', MockLoad)
      .value('ModelStore', MockModelStore)
      .service('XosOnboarder', XosOnboarder);

    angular.mock.module('XosOnboarder');
  });

  beforeEach(angular.mock.inject((
    XosOnboarder: IXosOnboarder,
    _$ocLazyLoad_: any,
    _$timeout_: ng.ITimeoutService
  ) => {
    $ocLazyLoad = _$ocLazyLoad_;
    spyOn($ocLazyLoad, 'load').and.callThrough();
    service = XosOnboarder;
    $timeout = _$timeout_;
  }));

  describe('when receive an event', () => {
    it('should use $ocLazyLoad to add modules to the app', () => {
      subject.next({
        model: 'XOSComponent',
        msg: {
          app: 'sample',
          object: {
            extra: '["vendor.js", "app.js"]',
            name: 'sample app'
          }
        }
      });
      $timeout.flush();
      expect($ocLazyLoad.load).toHaveBeenCalledWith('vendor.js');
      expect($ocLazyLoad.load).toHaveBeenCalledWith('app.js');
    });
  });
});
