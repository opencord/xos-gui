import * as angular from 'angular';
import 'angular-mocks';
import 'angular-resource';
import {Subject} from 'rxjs';
import {XosOnboarder, IXosOnboarder} from './onboard.service';
import {IWSEventService} from '../../datasources/websocket/global';

let service, $ocLazyLoad;

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

describe('The XosOnboarder service', () => {

  beforeEach(() => {

    angular
      .module('XosOnboarder', [])
      .value('WebSocket', MockWs)
      .value('$ocLazyLoad', MockLoad)
      .service('XosOnboarder', XosOnboarder);

    angular.mock.module('XosOnboarder');
  });

  beforeEach(angular.mock.inject((
    XosOnboarder: IXosOnboarder,
    _$ocLazyLoad_: any
  ) => {
    $ocLazyLoad = _$ocLazyLoad_;
    spyOn($ocLazyLoad, 'load').and.callThrough();
    service = XosOnboarder;
  }));

  describe('when receive an event', () => {
    it('should use $ocLazyLoad to add modules to the app', () => {
      subject.next({
        msg: {
          app: 'sample',
          files: ['vendor.js', 'app.js']
        }
      });
      expect($ocLazyLoad.load).toHaveBeenCalledWith('vendor.js');
      expect($ocLazyLoad.load).toHaveBeenCalledWith('app.js');
    });
  });
});
