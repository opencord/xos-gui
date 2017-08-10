
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
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {
  IXosServiceGraph, IXosServiceModel, IXosTenantModel, IXosCoarseGraphData,
  IXosServiceGraphNode, IXosServiceGraphLink, IXosFineGrainedGraphData
} from '../interfaces';
import {IXosDebouncer} from '../../core/services/helpers/debounce.helper';
export interface IXosServiceGraphStore {
  // TODO remove, moved in a new service
  get(): Observable<IXosServiceGraph>;
  // TODO rename in get()
  getCoarse(): Observable<IXosServiceGraph>;
}

export class XosServiceGraphStore implements IXosServiceGraphStore {
  static $inject = [
    '$log',
    'XosModelStore',
    'XosDebouncer'
  ];

  // graph data store
  private graphData: BehaviorSubject<IXosFineGrainedGraphData> = new BehaviorSubject({
    services: [],
    tenants: [],
    networks: [],
    subscribers: [],
    servicedependencies: []
  });

  private emptyGraph: IXosServiceGraph = {
    nodes: [],
    links: []
  };

  // representation of the graph as D3 requires
  private d3CoarseGraph = new BehaviorSubject(this.emptyGraph);
  private d3FineGrainedGraph = new BehaviorSubject(this.emptyGraph);

  // storing locally reference to the data model
  private services;
  private tenants;
  private subscribers;
  private networks;
  private servicedependencys;

  // debounced functions
  private handleData;

  // datastore
  private ServiceSubscription: Subscription;
  private NetworkSubscription: Subscription;
  private ServiceDependencySubscription: Subscription;

  constructor (
    private $log: ng.ILogService,
    private XosModelStore: IXosModelStoreService,
    private XosDebouncer: IXosDebouncer
  ) {

    this.$log.info(`[XosServiceGraphStore] Setup`);

    // we want to have a quiet period of 500ms from the last event before doing anything
    this.handleData = this.XosDebouncer.debounce(this._handleData, 500, this, false);

    // observe models and populate graphData
    this.ServiceSubscription = this.XosModelStore.query('Service', '/core/services')
      .subscribe(
        (res) => {
          this.combineData(res, 'services');
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] Service Observable: `, err);
        }
      );

    this.ServiceDependencySubscription = this.XosModelStore.query('ServiceDependency', '/core/servicedependencys')
      .subscribe(
        (res) => {
          this.combineData(res, 'servicedependencies');
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] Service Observable: `, err);
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

    // observe graphData and build Coarse and FineGrained graphs
    this.graphData
      .subscribe(
        (res: IXosFineGrainedGraphData) => {
          this.$log.debug(`[XosServiceGraphStore] New graph data received`, res);
          this.graphDataToCoarseGraph(res);
          // this.graphDataToFineGrainedGraph(res);
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] graphData Observable: `, err);
        }
      );
  }

  public get() {
    return this.d3FineGrainedGraph.asObservable();
  }

  public getCoarse() {
    return this.d3CoarseGraph.asObservable();
  }

  private combineData(data: any, type: 'services'|'tenants'|'subscribers'|'networks'|'servicedependencies') {
    switch (type) {
      case 'services':
        this.services = data;
        break;
      case 'tenants':
        this.tenants = data;
        break;
      case 'subscribers':
        this.subscribers = data;
        break;
      case 'networks':
        this.networks = data;
        break;
      case 'servicedependencies':
        this.servicedependencys = data;
        break;
    }
    this.handleData(this.services, this.tenants);
  }

  private _handleData(services: IXosServiceModel[], tenants: IXosTenantModel[]) {
    this.graphData.next({
      services: this.services,
      tenants: this.tenants,
      subscribers: this.subscribers,
      networks: this.networks,
      servicedependencies: this.servicedependencys
    });
  }

  private getNodeIndexById(id: number | string, nodes: IXosServiceModel[]) {
    return _.findIndex(nodes, {id: id});
  }

  private graphDataToCoarseGraph(data: IXosCoarseGraphData) {

    try {
      const links: IXosServiceGraphLink[] = _.chain(data.servicedependencies)
        .map((t: IXosTenantModel) => {
          return {
            id: t.id,
            source: this.getNodeIndexById(t.provider_service_id, data.services),
            target: this.getNodeIndexById(t.subscriber_service_id, data.services),
            model: t
          };
        })
        .value();

      const nodes: IXosServiceGraphNode[] = _.map(data.services, (s: IXosServiceModel) => {
        return {
          id: s.id,
          label: s.name,
          model: s
        };
      });

      let graph: IXosServiceGraph = {
        nodes,
        links
      };

      this.d3CoarseGraph.next(graph);
    } catch (e) {
      this.d3CoarseGraph.error(e);
    }
  }
}
