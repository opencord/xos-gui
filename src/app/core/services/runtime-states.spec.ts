import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {xosCore} from '../index';
import {IRuntimeStatesService} from './runtime-states';

let service: IRuntimeStatesService, $state: ng.ui.IStateService;

describe('The Navigation service', () => {

  beforeEach(angular.mock.module(xosCore));

  beforeEach(angular.mock.inject((
    RuntimeStates: IRuntimeStatesService,
    _$state_: ng.ui.IStateService
  ) => {
    service = RuntimeStates;
    $state = _$state_;
  }));

  it('should add a state', () => {
    service.addState('testState', {
      url: 'test-state',
      template: 'test-state'
    });

    expect($state.get('testState').url).toEqual('test-state');
    expect($state.get('testState').template).toEqual('test-state');
  });
});
