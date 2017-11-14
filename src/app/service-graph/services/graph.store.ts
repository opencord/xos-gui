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
import {IXosBaseModel, IXosSgLink, IXosSgNode} from '../interfaces';


export interface IXosGraphStore {
  get(): Observable<Graph>;
  nodesFromGraph(graph: Graph): IXosSgNode[];
  linksFromGraph(graph: Graph): IXosSgLink[];
  toggleServiceInstances(): Graph;
}

export class XosGraphStore implements IXosGraphStore {
  static $inject = [
    '$log',
    'XosModelStore',
    'XosDebouncer'
  ];

  // state
  private serviceInstanceShown: boolean = false;

  // graphs
  private serviceGraph: any;
  private ServiceGraphSubject: BehaviorSubject<any>;

  // datastore
  private ServiceSubscription: Subscription;
  private ServiceDependencySubscription: Subscription;
  private ServiceInstanceSubscription: Subscription;
  private ServiceInstanceLinkSubscription: Subscription;

  // debounced
  private efficientNext = this.XosDebouncer.debounce(this.callNext, 500, this, false);

  constructor (
    private $log: ng.ILogService,
    private XosModelStore: IXosModelStoreService,
    private XosDebouncer: IXosDebouncer
  ) {
    this.$log.info('[XosGraphStore] Setup');

    this.serviceGraph = new Graph();
    this.ServiceGraphSubject = new BehaviorSubject(this.serviceGraph);

    this.loadData();
  }

  $onDestroy() {
    this.ServiceSubscription.unsubscribe();
    this.ServiceDependencySubscription.unsubscribe();
  }

  public nodesFromGraph(graph: Graph): IXosSgNode[] {
    return _.map(graph.nodes(), (n: string) => {
      const nodeData = graph.node(n);
      return {
        id: n,
        type: this.getModelType(nodeData),
        data: nodeData
      };
    });
  }

  public linksFromGraph(graph: Graph): IXosSgLink[] {
    const nodes = this.nodesFromGraph(graph);

    // NOTE we'll need some intelligence here to differentiate between:
    // - ServiceDependency
    // - ServiceInstanceLinks
    // - Owners

    return _.map(graph.edges(), l => {
      const link = graph.edge(l);
      const linkType = this.getModelType(link);

      // FIXME consider ownership links
      let sourceId, targetId;

      switch (linkType) {
        case 'servicedependency':
          sourceId = this.getServiceId(link.subscriber_service_id);
          targetId = this.getServiceId(link.provider_service_id);
          break;
        case 'serviceinstancelink':
          sourceId = this.getServiceInstanceId(link.subscriber_service_instance_id);
          targetId = this.getServiceInstanceId(link.provider_service_instance_id);
          break;
        case 'ownership':
          sourceId = this.getServiceId(link.service);
          targetId = this.getServiceInstanceId(link.service_instance);
      }

      // NOTE help while debugging
      if (!sourceId || !targetId) {
        this.$log.warn(`Link ${l.v}-${l.w} has missing source or target:`, l, link);
      }

      return {
        id: `${l.v}-${l.w}`,
        type: this.getModelType(link),
        source: _.findIndex(nodes, {id: sourceId}),
        target: _.findIndex(nodes, {id: targetId}),
        data: link
      };
    });
  }

  public toggleServiceInstances(): Graph {
    if (this.serviceInstanceShown) {
      // NOTE remove subscriptions
      this.ServiceInstanceSubscription.unsubscribe();
      this.ServiceInstanceLinkSubscription.unsubscribe();

      // remove nodes from the graph
      this.removeElementsFromGraph('serviceinstance'); // NOTE links are automatically removed by the graph library
    }
    else {
      // NOTE subscribe to ServiceInstance and ServiceInstanceLink observables
      this.loadServiceInstances();
      this.loadServiceInstanceLinks();
    }
    this.serviceInstanceShown = !this.serviceInstanceShown;
    return this.serviceGraph;
  }

  public get(): Observable<Graph> {
    return this.ServiceGraphSubject.asObservable();
  }

  private loadData() {
    this.loadServices();
    this.loadServiceDependencies();
  }

  // graph operations
  private addNode(node: IXosBaseModel) {
    const nodeId = this.getNodeId(node);
    this.serviceGraph.setNode(nodeId, node);

    const nodeType = this.getModelType(node);
    if (nodeType === 'serviceinstance') {
      // NOTE adding owner link
      this.addOwnershipEdge({
        service: node.owner_id,
        service_instance: node.id,
        type: 'ownership'
      });
    }
  }

  private addEdge(link: IXosBaseModel) {
    const linkType = this.getModelType(link);
    if (linkType === 'servicedependency') {
      const sourceId = this.getServiceId(link.subscriber_service_id);
      const targetId = this.getServiceId(link.provider_service_id);
      this.serviceGraph.setEdge(sourceId, targetId, link);
    }
    if (linkType === 'serviceinstancelink') {
      // NOTE serviceinstancelink can point also to services, networks, ...
      const sourceId = this.getServiceInstanceId(link.provider_service_instance_id);
      if (angular.isDefined(link.subscriber_service_instance_id)) {
        const targetId = this.getServiceInstanceId(link.subscriber_service_instance_id);
        this.serviceGraph.setEdge(sourceId, targetId, link);
      }
    }
  }

  private addOwnershipEdge(link: any) {
    const sourceId = this.getServiceInstanceId(link.service_instance);
    const targetId = this.getServiceId(link.service);
    this.serviceGraph.setEdge(sourceId, targetId, link);
  }

  private removeElementsFromGraph(type: string) {
    _.forEach(this.serviceGraph.nodes(), (n: string) => {
      const node = this.serviceGraph.node(n);
      const nodeType = this.getModelType(node);
      if (nodeType === type) {
        this.serviceGraph.removeNode(n);
      }
    });
    // NOTE update the observable
    this.efficientNext(this.ServiceGraphSubject, this.serviceGraph);
  }

  // helpers
  private getModelType(node: IXosBaseModel): string {
    if (node.type) {
      // NOTE we'll add "ownership" links
      return node.type;
    }
    return node.class_names.split(',')[0].toLowerCase();
  }

  private getServiceId(id: number): string {
    return `service~${id}`;
  }

  private getServiceInstanceId(id: number): string {
    return `serviceinstance~${id}`;
  }

  private getNodeId(node: IXosBaseModel): string {

    const nodeType = this.getModelType(node);
    switch (nodeType) {
      case 'service':
        return this.getServiceId(node.id);
      case 'serviceinstance':
        return this.getServiceInstanceId(node.id);
    }
  }

  // data loaders
  private loadServices() {
    this.ServiceSubscription = this.XosModelStore.query('Service', '/core/services')
      .subscribe(
        (res) => {
          if (res.length > 0) {
            _.forEach(res, n => {
              this.addNode(n);
            });
            this.efficientNext(this.ServiceGraphSubject, this.serviceGraph);
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
              this.addEdge(l);
            });
            this.efficientNext(this.ServiceGraphSubject, this.serviceGraph);
          }
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] Service Observable: `, err);
        }
      );
  }

  private loadServiceInstances() {
    this.ServiceInstanceSubscription = this.XosModelStore.query('ServiceInstance', '/core/serviceinstances')
      .subscribe(
        (res) => {
          if (res.length > 0) {
            _.forEach(res, n => {
              this.addNode(n);
            });
            this.efficientNext(this.ServiceGraphSubject, this.serviceGraph);
          }
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] ServiceInstance Observable: `, err);
        }
      );
  }

  private loadServiceInstanceLinks() {
    this.ServiceInstanceLinkSubscription = this.XosModelStore.query('ServiceInstanceLink', '/core/serviceinstancelinks')
      .subscribe(
        (res) => {
          if (res.length > 0) {
            _.forEach(res, l => {
              this.addEdge(l);
            });
            this.efficientNext(this.ServiceGraphSubject, this.serviceGraph);
          }
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] ServiceInstanceLinks Observable: `, err);
        }
      );
  }

  private callNext(subject: BehaviorSubject<any>, data: any) {
    subject.next(data);
  }
}
