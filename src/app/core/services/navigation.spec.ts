import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {xosCore} from '../index';
import {IXosNavigationService, IXosNavigationRoute} from './navigation';

let service: IXosNavigationService;

let defaultRoutes: IXosNavigationRoute[];

describe('The Navigation service', () => {

  beforeEach(angular.mock.module(xosCore));

  beforeEach(angular.mock.inject((
    NavigationService: IXosNavigationService,
  ) => {
    service = NavigationService;
    defaultRoutes = angular.copy(service.query());
  }));

  it('should return navigation routes', () => {
    expect(service.query()).toEqual(defaultRoutes);
  });

  it('should add a route', () => {
    const testRoutes: IXosNavigationRoute[] = [
      {label: 'TestState', state: 'xos.test'},
      {label: 'TestUrl', url: 'test'}
    ];
    service.add(testRoutes[0]);
    service.add(testRoutes[1]);
    const serviceRoutes = service.query();
    expect(serviceRoutes).toEqual(defaultRoutes.concat(testRoutes));
  });

  it('should add a child route', () => {
    const testRoute: IXosNavigationRoute = {
      label: 'TestState', state: 'xos.test', parent: 'xos.core'
    };
    service.add(testRoute);
    defaultRoutes[1].children = [testRoute];
    expect(service.query()).toEqual(defaultRoutes);
  });

  it('should not add route that have both url and state', () => {
    function wrapper() {
      service.add({
        label: 'Fail',
        url: 'f',
        state: 'f'
      });
    }
    expect(wrapper).toThrowError('[XosNavigation] You can\'t provide both state and url');
  });
});
