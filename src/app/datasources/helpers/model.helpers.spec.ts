import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';

import {IXosModelHelpersService, ModelHelpers} from './model.helpers';

let service: IXosModelHelpersService;
describe('The ModelHelpers service', () => {

  beforeEach(() => {
    angular
      .module('test', [])
      .service('ModelHelpers', ModelHelpers);

    angular.mock.module('test');
  });

  beforeEach(angular.mock.inject((
    ModelHelpers: IXosModelHelpersService,
  ) => {
    service = ModelHelpers;
  }));

  it('should convert a core model name in an URL', () => {
    expect(service.urlFromCoreModel('Slice')).toBe('/core/slices');
  });

});
