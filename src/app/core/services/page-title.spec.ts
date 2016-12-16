import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {xosCore} from '../index';
import {IXosPageTitleService} from './page-title';
import IWindowService = angular.IWindowService;
import {StyleConfig} from '../../config/style.config';

let service: IXosPageTitleService, $window: IWindowService;
describe('The PageTitle service', () => {

  beforeEach(angular.mock.module(xosCore));

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
    expect($window.document.title).toEqual(`${StyleConfig.projectName} - sample`);
  });
});
