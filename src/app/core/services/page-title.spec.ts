import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {xosCore} from '../index';
import {IXosPageTitleService} from './page-title';
import IWindowService = angular.IWindowService;

let service: IXosPageTitleService, $window: IWindowService;

const MockStyleConfig = {
  projectName: 'CORD'
};

describe('The PageTitle service', () => {

  beforeEach(() => {
    angular.module(xosCore)
      .constant('StyleConfig', MockStyleConfig);
    angular.mock.module(xosCore);
  });

  beforeEach(angular.mock.inject((
    PageTitle: IXosPageTitleService,
    _$window_: IWindowService
  ) => {
    service = PageTitle;
    $window = _$window_;
  }));

  it('should get the page title', () => {
    $window.document.title = 'test';
    expect(service.get()).toEqual('test');
  });

  it('should set a page title', () => {
    service.set('sample');
    expect($window.document.title).toEqual(`${MockStyleConfig.projectName} - sample`);
  });

  it('should convert dots to >', () => {
    service.set('core.sample.bread.crumb');
    expect($window.document.title).toEqual(`${MockStyleConfig.projectName} - core > sample > bread > crumb`);
  });
});
