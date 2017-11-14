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
import {Graph} from 'graphlib';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {IXosDebouncer} from '../../core/services/helpers/debounce.helper';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';


export interface IXosGraphStore {
  get(): Observable<any>;
  nodesFromGraph(graph): any[];
}

export class XosGraphStore implements IXosGraphStore {
  static $inject = [
    '$log',
    'XosModelStore',
    'XosDebouncer'
  ];

  // graphs
  private serviceGraph: any;
  private ServiceGraphSubject: BehaviorSubject<any>;

  // datastore
  private ServiceSubscription: Subscription;
  private ServiceDependencySubscription: Subscription;

  constructor (
    private $log: ng.ILogService,
    private XosModelStore: IXosModelStoreService,
    private XosDebouncer: IXosDebouncer
  ) {
    this.$log.info('[XosGraphStore] Setup');

    this.serviceGraph = new Graph();
    this.ServiceGraphSubject = new BehaviorSubject(this.serviceGraph)

    this.loadData();
  }

  public nodesFromGraph(graph) {
    return _.map(graph.nodes(), n => {
      return {
        id: n,
        data: graph.node(n)
      };
    });
  }

  public get() {
    return this.ServiceGraphSubject.asObservable();
  }

  private loadData() {
    this.loadServices();
    // this.loadServiceDependencies();
  }

  private addNode(nodeId: string, node: any) {
    this.serviceGraph.setNode(nodeId, node);
  }

  private addEdge(linkId: string, sourceId: string, targetId: string, link: any) {
    this.serviceGraph.setEdge(sourceId, targetId, link);
  }

  private getServiceNodeId(id: string): string {
    return `service~${id}`;
  }

  // data loaders
  private loadServices() {
    this.ServiceSubscription = this.XosModelStore.query('Service', '/core/services')
      .subscribe(
        (res) => {
          if (res.length > 0) {
            _.forEach(res, n => {
              const nodeId = this.getServiceNodeId(n.id);
              this.addNode(nodeId, n);
            });
            this.ServiceGraphSubject.next(this.serviceGraph);
          }
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] Service Observable: `, err);
        }
      );
  }

  private loadServiceDependencies() {
    this.ServiceDependencySubscription = this.XosModelStore.query('ServiceDependency', '/core/servicedependencys')
      .subscribe(
        (res) => {
          if (res.length > 0) {
            _.forEach(res, l => {
              const linkId = `servicedependency~${l.subscriber_service_id}~${l.provider_service_id}`;
              const sourceId = this.getServiceNodeId(l.subscriber_service_id);
              const targetId = this.getServiceNodeId(l.provider_service_id);
              this.addEdge(linkId, sourceId, targetId, l);
            });
            this.ServiceGraphSubject.next(this.serviceGraph);
          }
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] Service Observable: `, err);
        }
      );
  }
}
