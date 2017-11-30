
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
import {IXosNodePositioner, XosNodePositioner} from './node-positioner.service';

let service: IXosNodePositioner;

let scope: ng.IRootScopeService;

let constraints: string = '';

let mockResource = {
  query: () => {
    return;
  }
};

const mockModelRest = {
  getResource: jasmine.createSpy('ModelRest.getResource')
    .and.returnValue(mockResource)
};

describe('The XosNodePositioner service', () => {

  beforeEach(() => {
    angular.module('XosNodePositioner', [])
      .service('XosNodePositioner', XosNodePositioner)
      .value('ModelRest', mockModelRest)
      .value('XosConfirm', {});

    angular.mock.module('XosNodePositioner');
  });

  beforeEach(angular.mock.inject((
    XosNodePositioner: IXosNodePositioner,
    $rootScope: ng.IRootScopeService,
    _$q_: ng.IQService) => {

    service = XosNodePositioner;
    scope = $rootScope;

    spyOn(mockResource, 'query').and.callFake(() => {
      const d = _$q_.defer();
      d.resolve([{constraints}]);
      return {$promise: d.promise};
    });
  }));

  it('should position the nodes on the svg', (done) => {
    const svg = {width: 300, height: 100};
    const nodes = [
      {data: {name: 'a'}},
      {data: {name: 'b'}}
    ];
    constraints = '["a", "b"]';
    service.positionNodes(svg, nodes)
      .then((positioned) => {
        expect(positioned[0].x).toBe(100);
        expect(positioned[0].y).toBe(50);
        expect(positioned[1].x).toBe(200);
        expect(positioned[1].y).toBe(50);
        done();
      });

    scope.$apply();
  });

  it('should position the nodes on the svg in vertical bundles', (done) => {
    const svg = {width: 300, height: 90};
    const nodes = [
      {data: {name: 'a'}},
      {data: {name: 'b'}},
      {data: {name: 'c'}}
    ];
    constraints = '["a", ["b", "c"]]';
    service.positionNodes(svg, nodes)
      .then((positioned) => {
        expect(positioned[0].x).toBe(100);
        expect(positioned[0].y).toBe(45);
        expect(positioned[1].x).toBe(200);
        expect(positioned[1].y).toBe(30);
        expect(positioned[2].x).toBe(200);
        expect(positioned[2].y).toBe(60);
        done();
      });

    scope.$apply();
  });

  it('should accept null as constraint to leave an empty space', (done) => {
    const svg = {width: 300, height: 90};
    const nodes = [
      {data: {name: 'a'}},
      {data: {name: 'b'}},
      {data: {name: 'c'}}
    ];
    constraints = '[[null, "a"], ["b", "c"]]';
    service.positionNodes(svg, nodes)
      .then((positioned) => {
        expect(positioned[0].x).toBe(100);
        expect(positioned[0].y).toBe(60);
        expect(positioned[1].x).toBe(200);
        expect(positioned[1].y).toBe(30);
        expect(positioned[2].x).toBe(200);
        expect(positioned[2].y).toBe(60);
        done();
      });

    scope.$apply();
  });

  it('should set unpositioned nodes at the top', (done) => {
    const svg = {width: 300, height: 200};
    const nodes = [
      {data: {name: 'a'}},
      {data: {name: 'b'}},
      {data: {name: 'c'}, type: 'service'},
      {data: {name: 'd'}, type: 'service'}
    ];
    constraints = '["a", "b"]';

    service.positionNodes(svg, nodes)
      .then((positioned) => {
        expect(positioned[0].x).toBe(100);
        expect(positioned[0].y).toBe(100);
        expect(positioned[1].x).toBe(200);
        expect(positioned[1].y).toBe(100);
        expect(positioned[2].x).toBe(100);
        expect(positioned[2].y).toBe(150);
        expect(positioned[3].x).toBe(200);
        expect(positioned[3].y).toBe(150);
        done();
      });

    scope.$apply();
  });
});
