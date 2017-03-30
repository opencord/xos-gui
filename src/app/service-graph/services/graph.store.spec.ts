import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {IXosServiceGraphStore, XosServiceGraphStore} from './graph.store';
import {Subject} from 'rxjs';
import {XosDebouncer} from '../../core/services/helpers/debounce.helper';
import {IXosServiceGraph} from '../interfaces';
import {XosServiceGraphExtender, IXosServiceGraphExtender} from './graph.extender';

let service: IXosServiceGraphStore, extender: IXosServiceGraphExtender;

const subjects = {
  service: new Subject<any>(),
  tenant: new Subject<any>(),
  subscriber: new Subject<any>(),
  tenantroot: new Subject<any>(),
  network: new Subject<any>(),
  servicedependency: new Subject<any>()
};

// COARSE data
const coarseServices = [
  {
    id: 1,
    name: 'Service A',
    class_names: 'Service,PlCoreBase'
  },
  {
    id: 2,
    name: 'Service B',
    class_names: 'Service,PlCoreBase'
  }
];

const coarseTenants = [
  {
    id: 1,
    provider_service_id: 2,
    subscriber_service_id: 1,
    kind: 'coarse',
    class_names: 'Tenant,PlCoreBase'
  }
];

const mockModelStore = {
  query: (modelName: string) => {
    return subjects[modelName.toLowerCase()].asObservable();
  }
};

describe('The XosServiceGraphStore service', () => {

  beforeEach(() => {
    angular.module('xosServiceGraphStore', [])
      .service('XosServiceGraphStore', XosServiceGraphStore)
      .value('XosModelStore', mockModelStore)
      .service('XosServiceGraphExtender', XosServiceGraphExtender)
      .service('XosDebouncer', XosDebouncer);

    angular.mock.module('xosServiceGraphStore');
  });

  beforeEach(angular.mock.inject((
    XosServiceGraphStore: IXosServiceGraphStore,
    XosServiceGraphExtender: IXosServiceGraphExtender
  ) => {
    service = XosServiceGraphStore;
    extender = XosServiceGraphExtender;
  }));

  describe('when subscribing for the COARSE service graph', () => {
    beforeEach((done) => {
      subjects.service.next(coarseServices);
      subjects.servicedependency.next(coarseTenants);
      setTimeout(done, 500);
    });

    it('should return an observer for the Coarse Service Graph', (done) => {
      service.getCoarse()
        .subscribe(
          (res: IXosServiceGraph) => {
            expect(res.nodes.length).toBe(2);
            expect(res.nodes[0].d3Class).toBeUndefined();
            expect(res.links.length).toBe(1);
            expect(res.links[0].d3Class).toBeUndefined();
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    xdescribe('when a reducer is registered', () => {
      // NOTE the reducer appliance has been moved in the component
      beforeEach((done) => {
        extender.register('coarse', 'test', (graph: IXosServiceGraph) => {
          graph.nodes = graph.nodes.map(n => {
            n.d3Class = `testNode`;
            return n;
          });

          graph.links = graph.links.map(n => {
            n.d3Class = `testLink`;
            return n;
          });

          return graph;
        });

        // triggering another next cycle to apply the reducer
        subjects.service.next(coarseServices);
        subjects.tenant.next(coarseTenants);
        setTimeout(done, 500);
      });

      it('should transform the result', (done) => {
        service.getCoarse()
          .subscribe(
            (res: IXosServiceGraph) => {
              expect(res.nodes.length).toBe(2);
              expect(res.nodes[0].d3Class).toEqual('testNode');
              expect(res.links.length).toBe(1);
              expect(res.links[0].d3Class).toEqual('testLink');
              done();
            },
            (err) => {
              done(err);
            }
          );
      });
    });
  });

  describe('when subscribing for the Fine-grained service graph', () => {
    xit('should have a test', () => {
      expect(true).toBeTruthy();
    });
  });
});
