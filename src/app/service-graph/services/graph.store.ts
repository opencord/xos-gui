import * as _ from 'lodash';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {
  IXosServiceGraph, IXosServiceModel, IXosTenantModel, IXosCoarseGraphData,
  IXosServiceGraphNode, IXosServiceGraphLink, IXosFineGrainedGraphData
} from '../interfaces';
import {IXosDebouncer} from '../../core/services/helpers/debounce.helper';
export interface IXosServiceGraphStore {
  get(): Observable<IXosServiceGraph>;
  getCoarse(): Observable<IXosServiceGraph>;
  dispose(): void;
}

export class XosServiceGraphStore implements IXosServiceGraphStore {
  static $inject = [
    '$log',
    'XosModelStore',
    'XosDebouncer'
  ];

  // graph data store
  // TODO check the right way for | interfaces
  private graphData: BehaviorSubject<any> = new BehaviorSubject({
    services: [],
    tenants: []
  });

  // representation of the graph as D3 requires
  private d3CoarseGraph = new BehaviorSubject({});
  private d3FineGrainedGraph = new BehaviorSubject({});

  // storing locally reference to the data model
  private services;
  private tenants;
  private subscribers;
  private networks;

  // debounced functions
  private handleData;

  // datastore
  private ServiceSubscription: Subscription;
  private TenantSubscription: Subscription;
  private SubscriberSubscription: Subscription;
  private NetworkSubscription: Subscription;

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

    this.TenantSubscription = this.XosModelStore.query('Tenant', '/core/tenants')
      .subscribe(
        (res) => {
          this.combineData(res, 'tenants');
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] Tenant Observable: `, err);
        }
      );

    this.SubscriberSubscription = this.XosModelStore.query('Subscriber', '/core/subscribers')
      .subscribe(
        (res) => {
          this.combineData(res, 'subscribers');
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] Subscriber Observable: `, err);
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

    // observe graphData and build Coarse or FineGrained graphs (based on who's subscribed)
    this.graphData
      .subscribe(
        (res: IXosFineGrainedGraphData) => {
          if (this.d3CoarseGraph.observers.length > 0) {
            this.graphDataToCoarseGraph(res);
          }
          if (this.d3FineGrainedGraph.observers.length > 0) {
            this.graphDataToFineGrainedGraph(res);
          }
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] graphData Observable: `, err);
        }
      );
  }

  public dispose() {
    // cancel subscriptions from observables
    this.ServiceSubscription.unsubscribe();
    this.TenantSubscription.unsubscribe();
  }

  public get() {
    return this.d3FineGrainedGraph.asObservable();
  }

  public getCoarse() {
    return this.d3CoarseGraph.asObservable();
  }

  private combineData(data: any, type: 'services'|'tenants'|'subscribers'|'networks') {
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
    }
    this.handleData(this.services, this.tenants);
  }

  private _handleData(services: IXosServiceModel[], tenants: IXosTenantModel[]) {
    this.graphData.next({
      services: this.services,
      tenants: this.tenants,
      subscribers: this.subscribers,
      networks: this.networks
    });
  }

  private getCoarseNodeIndexById(id: number, nodes: IXosServiceModel[]) {
    return _.findIndex(nodes, {id: id});
  }

  private graphDataToCoarseGraph(data: IXosCoarseGraphData) {
    // TODO find how to bind source/target by node ID and not by position in array (ask Simon?)
    const links: IXosServiceGraphLink[] = _.chain(data.tenants)
      .filter((t: IXosTenantModel) => t.kind === 'coarse')
      .map((t: IXosTenantModel) => {
        return {
          id: t.id,
          source: this.getCoarseNodeIndexById(t.provider_service_id, data.services),
          target: this.getCoarseNodeIndexById(t.subscriber_service_id, data.services),
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

    this.d3CoarseGraph.next({
      nodes: nodes,
      links: links
    });
  }

  private d3Id(model: any) {
    let type = model.class_names.split(',')[0];
    return `${type.toLowerCase()}~${model.id}`;
  }

  private getTargetId(tenant: IXosTenantModel) {

    const buildId = (type, id) => `${type.toLowerCase()}~${id}`;

    let targetId;
    if (tenant.subscriber_service_id) {
      targetId = buildId('service', tenant.subscriber_service_id);
    }
    else if (tenant.subscriber_tenant_id) {
      targetId = buildId('tenant', tenant.subscriber_tenant_id);
    }
    else if (tenant.subscriber_network_id) {
      targetId = buildId('network', tenant.subscriber_network_id);
    }
    else if (tenant.subscriber_root_id) {
      targetId = buildId('subscriber', tenant.subscriber_root_id);
    }
    return targetId;
  }

  private getSourceId(tenant: IXosTenantModel) {
    return `service~${tenant.provider_service_id}`;
  }

  private getFinegrainedNodeIndexByD3Id(id: string, nodes: IXosServiceModel[]) {
    return _.findIndex(nodes, {id: id});
  }

  private graphDataToFineGrainedGraph(data: IXosFineGrainedGraphData) {

    // NOTE removing data we do NOT want to show
    data.tenants = _.filter(data.tenants, t => t.kind !== 'coarse');
    data.networks = _.filter(data.networks, n => {
      const subscriber = _.findIndex(data.tenants, {subscriber_network_id: n.id});
      return subscriber > -1;
    });

    let nodes = _.reduce(Object.keys(data), (list: any[], k: string) => {
      return list.concat(data[k]);
    }, []);
    nodes = _.map(nodes, n => {
      n.d3Id = this.d3Id(n);
      return n;
    });

    // format in D3 sauce
    nodes = _.map(nodes, n => {
      let node: IXosServiceGraphNode = {
        id: n.d3Id,
        label: n.humanReadableName ? n.humanReadableName : n.name,
        model: n,
        type: n.class_names.split(',')[0].toLowerCase()
      };

      if (node.type === 'tenant') {
        node.label = `${n.id}`;
      }

      // if (node.type === 'network') {
      //   node.label = `${n.name} network`;
      // }

      return node;
    });

    const links = [];

    _.forEach(data.tenants, (tenant) => {
      const sourceId = this.getSourceId(tenant);
      const targetId = this.getTargetId(tenant);

      const sourceIndex = this.getFinegrainedNodeIndexByD3Id(sourceId, nodes);
      const targetIndex = this.getFinegrainedNodeIndexByD3Id(targetId, nodes);
      const tenantIndex = this.getFinegrainedNodeIndexByD3Id(tenant.d3Id, nodes);

      const tenantToProvider = {
        id: `${sourceId}_${tenant.d3Id}`,
        source: sourceIndex,
        target: tenantIndex,
        model: tenant
      };

      const tenantToSubcriber = {
        id: `${tenant.d3Id}_${targetId}`,
        source: tenantIndex,
        target: targetIndex,
        model: tenant
      };

      links.push(tenantToProvider);
      links.push(tenantToSubcriber);
    });

    if (nodes.length === 0 || links.length === 0) {
      return;
    }

    this.d3FineGrainedGraph.next({
      nodes: nodes,
      links: links
    });
  }

}
