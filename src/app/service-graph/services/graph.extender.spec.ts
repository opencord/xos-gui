import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {IXosServiceGraphExtender, XosServiceGraphExtender} from './graph.extender';

let service: IXosServiceGraphExtender, registerSpy;

const reducer = (graph) => {
  return graph;
};

describe('The XosServiceGraphExtender service', () => {

  beforeEach(() => {
    angular.module('xosServiceGraphExtender', [])
      .service('XosServiceGraphExtender', XosServiceGraphExtender);

    angular.mock.module('xosServiceGraphExtender');
  });

  beforeEach(angular.mock.inject((
    XosServiceGraphExtender: IXosServiceGraphExtender,
  ) => {
    service = XosServiceGraphExtender;

    registerSpy = spyOn(service, 'register').and.callThrough();
  }));

  it('should register a reducer for the coarse service graph', () => {
    service.register('coarse', 'testCoarse', reducer);
    expect(registerSpy).toHaveBeenCalled();
    const coarseReducers = service.getCoarse();
    expect(coarseReducers).toHaveLength(1);
    expect(coarseReducers[0].name).toEqual('testCoarse');
    expect(typeof coarseReducers[0].reducer).toEqual('function');
  });

  it('should register a reducer for the fine-grained service graph', () => {
    service.register('finegrained', 'testFinegrained', reducer);
    expect(registerSpy).toHaveBeenCalled();
    const coarseReducers = service.getFinegrained();
    expect(coarseReducers).toHaveLength(1);
    expect(coarseReducers[0].name).toEqual('testFinegrained');
    expect(typeof coarseReducers[0].reducer).toEqual('function');
  });

});
