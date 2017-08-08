
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
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import {
  IXosServiceGraph, IXosServiceInstanceGraphData, IXosServiceGraphNode
} from '../interfaces';
import {IXosDebouncer} from '../../core/services/helpers/debounce.helper';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {IXosServiceGraphStore} from './service-graph.store';

export interface IXosServiceInstanceGraphStore {
  get(): Observable<IXosServiceGraph>;
}

export class XosServiceInstanceGraphStore implements IXosServiceInstanceGraphStore {
  static $inject = [
    '$log',
    'XosServiceGraphStore',
    'XosModelStore',
    'XosDebouncer'
  ];

  private CoarseGraphSubscription: Subscription;
  private ServiceInstanceSubscription: Subscription;
  private ServiceInstanceLinkSubscription: Subscription;
  private NetworkSubscription: Subscription;

  // debounced functions
  private handleData;


  // FIXME this is declared also in ServiceGraphStore
  private emptyGraph: IXosServiceGraph = {
    nodes: [],
    links: []
  };

  // graph data store
  private graphData: BehaviorSubject<IXosServiceInstanceGraphData> = new BehaviorSubject({
    serviceGraph: this.emptyGraph,
    serviceInstances: [],
    serviceInstanceLinks: [],
    networks: []
  });

  private d3ServiceInstanceGraph = new BehaviorSubject(this.emptyGraph);

  private serviceGraph: IXosServiceGraph = this.emptyGraph;
  private serviceInstances: any[] = [];
  private serviceInstanceLinks: any[] = [];
  private networks: any[] = [];

  constructor (
    private $log: ng.ILogService,
    private XosServiceGraphStore: IXosServiceGraphStore,
    private XosModelStore: IXosModelStoreService,
    private XosDebouncer: IXosDebouncer
  ) {
    this.$log.info(`[XosServiceInstanceGraphStore] Setup`);

    // we want to have a quiet period of 500ms from the last event before doing anything
    this.handleData = this.XosDebouncer.debounce(this._handleData, 500, this, false);

    this.CoarseGraphSubscription = this.XosServiceGraphStore.getCoarse()
      .subscribe(
        (graph: IXosServiceGraph) => {
          this.combineData(graph, 'serviceGraph');
        }
      );

    this.ServiceInstanceSubscription = this.XosModelStore.query('ServiceInstance', '/core/serviceinstances')
      .subscribe(
        (res) => {
          this.combineData(res, 'serviceInstance');
        },
        (err) => {
          this.$log.error(`[XosServiceInstanceGraphStore] Service Observable: `, err);
        }
      );

    this.ServiceInstanceLinkSubscription = this.XosModelStore.query('ServiceInstanceLink', '/core/serviceinstancelinks')
      .subscribe(
        (res) => {
          this.combineData(res, 'serviceInstanceLink');
        },
        (err) => {
          this.$log.error(`[XosServiceInstanceGraphStore] Service Observable: `, err);
        }
      );

    this.NetworkSubscription = this.XosModelStore.query('Network', '/core/networks')
      .subscribe(
        (res) => {
          this.combineData(res, 'networks');
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] graphData Observable: `, err);
        }
      );

    // observe graphData and build ServiceInstance graph
    this.graphData
      .subscribe(
        (res: IXosServiceInstanceGraphData) => {
          this.$log.debug(`[XosServiceInstanceGraphStore] New graph data received`, res);

          this.graphDataToD3(res);
        },
        (err) => {
          this.$log.error(`[XosServiceInstanceGraphStore] graphData Observable: `, err);
        }
      );
  }

  public get(): Observable<IXosServiceGraph> {
    return this.d3ServiceInstanceGraph;
  }

  // called by all the observables, combine the data in a globla graph observable
  private combineData(data: any, type: 'serviceGraph' | 'serviceInstance' | 'serviceInstanceLink' | 'serviceInterface' | 'networks') {
    switch (type) {
      case 'serviceGraph':
        this.serviceGraph = angular.copy(data);
        break;
      case 'serviceInstance':
        this.serviceInstances = data;
        break;
      case 'serviceInstanceLink':
        this.serviceInstanceLinks = data;
        break;
      case 'networks':
        this.networks = data;
        break;
    }
    this.handleData();
  }

  private _handleData() {
    this.graphData.next({
      serviceGraph: this.serviceGraph,
      serviceInstances: this.serviceInstances,
      serviceInstanceLinks: this.serviceInstanceLinks,
      networks: this.networks
    });
  }

  private getNodeType(n: any) {
    return n.class_names.split(',')[0].toLowerCase();
  }

  private getNodeLabel(n: any) {
    if (this.getNodeType(n) === 'serviceinstance') {
      return n.name ? n.name : n.id;
    }
    return n.humanReadableName ? n.humanReadableName : n.name;
  }

  private d3Id(type: string, id: number) {
    return `${type.toLowerCase()}~${id}`;
  }

  private toD3Node(n: any): IXosServiceGraphNode {
    return {
      id: this.d3Id(this.getNodeType(n), n.id),
      label: this.getNodeLabel(n),
      model: n,
      type: this.getNodeType(n)
    };
  }

  private getServiceInstanceIndexById(l: any, nodes: any[], where: 'source' | 'target'): string {
    if (where === 'source') {
      return _.find(nodes, {id: `serviceinstance~${l.provider_service_instance_id}`});
    }
    else {
      if (l.subscriber_service_id) {
        return _.find(nodes, {id: `service~${l.subscriber_service_id}`});
      }
      else if (l.subscriber_network_id) {
        return _.find(nodes, {id: `network~${l.subscriber_network_id}`});
      }
      else if (l.subscriber_service_instance_id) {
        return _.find(nodes, {id: `serviceinstance~${l.subscriber_service_instance_id}`});
      }
    }
  }

  private getOwnerById(id: number, nodes: any[]): any {
    return _.find(nodes, {id: `service~${id}`});
  }

  private graphDataToD3(data: IXosServiceInstanceGraphData) {
    try {
      // get all the nodes
      let nodes = _.chain(data.serviceGraph.nodes)
        .map(n => {
          // HACK we are receiving node as d3 models
          return n.model;
        })
        .map(n => {
          return this.toD3Node(n);
        })
        .value();

      data.serviceInstances = _.chain(data.serviceInstances)
        .map(n => {
          return this.toD3Node(n);
        })
        .value();
      nodes = nodes.concat(data.serviceInstances);

      data.networks = _.chain(data.networks)
        .filter(n => {
          const subscriber = _.findIndex(data.serviceInstanceLinks, {subscriber_network_id: n.id});
          return subscriber > -1;
        })
        .map(n => {
          return this.toD3Node(n);
        })
        .value();
      nodes = nodes.concat(data.networks);

      let links = data.serviceGraph.links;

      // create the links starting from the coarse ones
      links = _.reduce(data.serviceInstanceLinks, (links, l) => {
        let link =  {
          id: `service_instance_link~${l.id}`,
          source: this.getServiceInstanceIndexById(l, nodes, 'source'),
          target: this.getServiceInstanceIndexById(l, nodes, 'target'),
          model: l,
          d3Class: 'service-instance'
        };
        links.push(link);
        return links;
      }, data.serviceGraph.links);

      const linksToService = _.reduce(data.serviceInstances, (links, n) => {
        if (angular.isDefined(n.model.owner_id)) {
          let link =  {
            id: `owner~${n.id}`,
            source: n,
            target: this.getOwnerById(n.model.owner_id, nodes),
            model: n,
            d3Class: 'owner'
          };
          links.push(link);
        }
        return links;
      }, []);

      links = links.concat(linksToService);

      let graph: IXosServiceGraph = {
        nodes,
        links
      };

      this.d3ServiceInstanceGraph.next(graph);
    } catch (e) {
      this.d3ServiceInstanceGraph.error(e);
    }
  }
}
