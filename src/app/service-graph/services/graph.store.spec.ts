
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

import * as _ from 'lodash';
import * as angular from 'angular';
import 'angular-mocks';
import {IXosGraphStore, XosGraphStore} from './graph.store';
import {Subject} from 'rxjs/Subject';
import {Graph} from 'graphlib';
import {XosDebouncer} from '../../core/services/helpers/debounce.helper';

interface ITestXosGraphStore extends IXosGraphStore {

  // state
  serviceGraph: Graph;
  serviceInstanceShown: boolean;

  // private methods
  getNodeId: any;
  getModelType: any;
  addNode: any;
  addEdge: any;
  nodesFromGraph: any;
  toggleServiceInstances: any;

  // observables
  ServiceInstanceSubscription: any;
  ServiceInstanceLinkSubscription: any;
}

let service: ITestXosGraphStore;

let scope: ng.IRootScopeService;

const services = [
  {
    id: 1,
    class_names: 'Service,XOSBase',
    name: 'Service 1'
  },
  {
    id: 2,
    class_names: 'Service,XOSBase',
    name: 'Service 2'
  }
];

const servicedependencies = [
  {
    id: 1,
    class_names: 'ServiceDependency,XOSBase',
    provider_service_id: 2,
    subscriber_service_id: 1
  }
];

const serviceInstances = [
  {
    id: 1,
    class_names: 'ServiceInstance,XOSBase',
    name: 'ServiceInstance 1',
    owner_id: 1
  },
  {
    id: 2,
    class_names: 'ServiceInstance,XOSBase',
    name: 'ServiceInstance 2',
    owner_id: 2
  }
];

const serviceInstanceLinks = [
  {
    id: 1,
    class_names: 'ServiceInstanceLink,XOSBase',
    provider_service_instance_id: 1,
    subscriber_service_instance_id: 2,
  }
];

const subject_services = new Subject();
const subject_servicedependency = new Subject();
const subject_serviceinstances = new Subject();
const subject_serviceinstancelinks = new Subject();

let MockModelStore = {
  query: jasmine.createSpy('XosModelStore.query')
    .and.callFake((model) => {
      if (model === 'Service') {
        return subject_services.asObservable();
      }
      else if (model === 'ServiceDependency') {
        return subject_servicedependency.asObservable();
      }
      else if (model === 'ServiceInstance') {
        return subject_serviceinstances.asObservable();
      }
      else if (model === 'ServiceInstanceLink') {
        return subject_serviceinstancelinks.asObservable();
      }
    })
};


describe('The XosGraphStore service', () => {

  beforeEach(() => {
    angular.module('XosGraphStore', [])
      .service('XosGraphStore', XosGraphStore)
      .value('XosModelStore', MockModelStore)
      .service('XosDebouncer', XosDebouncer);

    angular.mock.module('XosGraphStore');
  });

  beforeEach(angular.mock.inject((XosGraphStore: ITestXosGraphStore,
                                  $rootScope: ng.IRootScopeService,
                                  _$q_: ng.IQService) => {

    service = XosGraphStore;
    scope = $rootScope;

  }));

  it('should load services and service-dependency and add nodes to the graph', (done) => {
    let event = 0;
    service.get().subscribe(
      (graph: Graph) => {
        if (event === 1) {
          expect(graph.nodes().length).toBe(services.length);
          expect(graph.nodes()).toEqual(['service~1', 'service~2']);
          expect(graph.edges().length).toBe(servicedependencies.length);
          expect(graph.edges()).toEqual([{v: 'service~1', w: 'service~2'}]);
          done();
        }
        else {
          event = event + 1;
        }
      }
    );
    subject_services.next(services);
    subject_servicedependency.next(servicedependencies);
    scope.$apply();
  });

  describe(`the getModelType`, () => {
    it('should return the node type', () => {
      const res = service.getModelType(services[0]);
      expect(res).toBe('service');
    });

    it('should return the node type', () => {
      const res = service.getModelType(serviceInstances[0]);
      expect(res).toBe('serviceinstance');
    });
  });

  describe('the getNodeId method', () => {
    it('should return the id for a Service', () => {
      const res = service.getNodeId(services[0]);
      expect(res).toBe(`service~1`);
    });

    it('should return the id for a ServiceInstance', () => {
      const res = service.getNodeId(serviceInstances[0]);
      expect(res).toBe(`serviceinstance~1`);
    });
  });

  describe('the addNode method', () => {

    beforeEach(() => {
      spyOn(service.serviceGraph, 'setNode');
      spyOn(service.serviceGraph, 'setEdge');
    });

    it(`should a service to the graph`, () => {
      service.addNode(services[0]);
      expect(service.serviceGraph.setNode).toHaveBeenCalledWith('service~1', services[0]);
    });

    it('should add a service instance to the graph', () => {
      service.addNode(serviceInstances[0]);
      expect(service.serviceGraph.setNode).toHaveBeenCalledWith('serviceinstance~1', serviceInstances[0]);
    });

    it('should add an "ownership" edge to the graph', () => {
      service.addNode(serviceInstances[0]);
      expect(service.serviceGraph.setEdge).toHaveBeenCalledWith('serviceinstance~1', 'service~1', {service: 1, service_instance: 1, type: 'ownership'});
    });
  });

  describe('the addEdge method', () => {

    beforeEach(() => {
      spyOn(service.serviceGraph, 'setEdge');
    });

    it('should add a ServiceDependency to the graph', () => {
      service.addEdge(servicedependencies[0]);
      expect(service.serviceGraph.setEdge).toHaveBeenCalledWith('service~1', 'service~2', servicedependencies[0]);
    });

    it('should add a ServiceInstanceLink to the graph', () => {
      service.addEdge(serviceInstanceLinks[0]);
      expect(service.serviceGraph.setEdge).toHaveBeenCalledWith('serviceinstance~1', 'serviceinstance~2', serviceInstanceLinks[0]);
    });
  });

  describe('the nodesFromGraph and linksFromGraph methods', () => {
    let graph: Graph;

    beforeEach(() => {
      graph = new Graph();
      services.forEach(s => {
        graph.setNode(`service~${s.id}`, s);
      });

      servicedependencies.forEach(sd => {
        graph.setEdge('service~1', 'service~2', sd);
      });
    });

    it('should add id and type to the nodes', () => {
      const nodes = service.nodesFromGraph(graph);
      expect(nodes[0].id).toBe('service~1');
      expect(nodes[0].type).toBe('service');
      expect(nodes[0].data).toBeDefined();
    });

    it('should add id and type to the links', () => {
      const links = service.linksFromGraph(graph);
      expect(links[0].id).toBe('service~1-service~2');
      expect(links[0].type).toBe('servicedependency');
      expect(links[0].data).toBeDefined();
    });

    it('should handle ownership links', () => {
      graph.setNode(`serviceinstance~1`, serviceInstances[0]);
      graph.setEdge('service~1', 'serviceinstance~1', {type: 'ownership', service: 1, service_instance: 1});
      const links = service.linksFromGraph(graph);
      expect(links[1].source).toBe(0);
      expect(links[1].target).toBe(2);
    });

    it('should handle serviceinstancelink links', () => {
      graph.setNode(`serviceinstance~1`, serviceInstances[0]);
      graph.setNode(`serviceinstance~2`, serviceInstances[1]);
      graph.setEdge('serviceinstance~1', 'serviceinstance~2', serviceInstanceLinks[0]);
      const links = service.linksFromGraph(graph);
      const targetLink = _.find(links, {id: `serviceinstance~1-serviceinstance~2`});
      expect(targetLink).toBeDefined();
      expect(targetLink.source).toBe(3);
      expect(targetLink.target).toBe(2);
    });
  });

  describe(`the toggleServiceInstances method`, () => {
    describe('when they are disabled', () => {

      beforeEach(() => {
        MockModelStore.query.calls.reset();
      });

      it('should fetch them', () => {
        service.toggleServiceInstances();
        expect(service.serviceInstanceShown).toBeTruthy();
        expect(MockModelStore.query).toHaveBeenCalledWith(`ServiceInstance`, '/core/serviceinstances');
        expect(MockModelStore.query).toHaveBeenCalledWith(`ServiceInstanceLink`, '/core/serviceinstancelinks');
        expect(service.ServiceInstanceSubscription).toBeDefined();
        expect(service.ServiceInstanceLinkSubscription).toBeDefined();
      });
    });

    describe('when they are enabled', () => {
      beforeEach(() => {
        service.ServiceInstanceSubscription = {
          unsubscribe: jasmine.createSpy('ServiceInstanceSubscription')
        };
        service.ServiceInstanceLinkSubscription = {
          unsubscribe: jasmine.createSpy('ServiceInstanceLinkSubscription')
        };
        service.serviceInstanceShown = true;
      });

      it('should cancel subscriptions', () => {
        service.toggleServiceInstances();
        expect(service.serviceInstanceShown).toBeFalsy();
        expect(service.ServiceInstanceSubscription.unsubscribe).toHaveBeenCalled();
        expect(service.ServiceInstanceLinkSubscription.unsubscribe).toHaveBeenCalled();
      });

      describe('and loaded in the graph', () => {
        beforeEach(() => {
          service.serviceGraph = new Graph();

          services.forEach(s => {
            service.addNode(s);
          });

          serviceInstances.forEach(si => {
            service.addNode(si);
          });

          serviceInstanceLinks.forEach(sil => {
            service.addEdge(sil);
          });
        });
        it('should remove ServiceInstance and related nodes/edges from the graph', () => {
          let filteredGraph = service.toggleServiceInstances();
          expect(service.serviceInstanceShown).toBeFalsy();
          expect(filteredGraph.nodes().length).toBe(2);
          expect(filteredGraph.edges().length).toBe(0);
          expect(service.serviceGraph.nodes().length).toBe(2);
          expect(service.serviceGraph.edges().length).toBe(0);
        });
      });
    });
  });
});
