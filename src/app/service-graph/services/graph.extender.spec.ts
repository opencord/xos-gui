
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
