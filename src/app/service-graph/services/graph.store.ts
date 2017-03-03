import * as _ from 'lodash';
import {Observable, BehaviorSubject} from 'rxjs';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {
  IXosServiceGraph, IXosServiceModel, IXosTenantModel, IXosCoarseGraphData,
  IXosServiceGraphNode, IXosServiceGraphLink
} from '../interfaces';
import {IXosDebouncer} from '../../core/services/helpers/debounce.helper';
export interface IXosServiceGraphStore {
  get(): Observable<IXosServiceGraph>;
  getCoarse(): Observable<IXosServiceGraph>;
}

export class XosServiceGraphStore implements IXosServiceGraphStore {
  static $inject = [
    '$log',
    'XosModelStore',
    'XosDebouncer'
  ];

  // graph data store
  private graphData: BehaviorSubject<IXosCoarseGraphData> = new BehaviorSubject({
    services: [],
    tenants: []
  });

  // reprentations of the graph as D3 requires
  private d3CoarseGraph = new BehaviorSubject({});
  private d3FineGrainedGraph = new BehaviorSubject({});

  // storing locally reference to the data model
  private services;
  private tenants;

  // debounced functions
  private handleData;

  // datastore
  private ServiceObservable: Observable<any>;
  private TenantObservable: Observable<any>;

  constructor (
    private $log: ng.ILogService,
    private XosModelStore: IXosModelStoreService,
    private XosDebouncer: IXosDebouncer
  ) {

    this.$log.info(`[XosServiceGraphStore] Setup`);

    // we want to have a quiet period of 500ms from the last event before doing anything
    this.handleData = this.XosDebouncer.debounce(this._handleData, 500, this, false);

    this.ServiceObservable = this.XosModelStore.query('Service', '/core/services');
    this.TenantObservable = this.XosModelStore.query('Tenant', '/core/tenants');

    // observe models and populate graphData
    this.ServiceObservable
      .subscribe(
        (res) => {
          this.combineData(res, 'services');
        },
        (err) => {
          this.$log.error(err);
        }
      );

    this.TenantObservable
      .subscribe(
        (res) => {
          this.combineData(res, 'tenants');
        },
        (err) => {
          this.$log.error(err);
        }
      );

    // observe graphData and build Coarse or FineGrained graphs (based on who's subscribed)
    this.graphData
      .subscribe(
        (res: IXosCoarseGraphData) => {
          if (this.d3CoarseGraph.observers.length > 0) {
            this.graphDataToCoarseGraph(res);
          }
          if (this.d3FineGrainedGraph.observers.length > 0) {
            // TODO graphDataToFineGrainedGraph
          }
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

  private combineData(data: any, type: 'services'|'tenants') {
    switch (type) {
      case 'services':
        this.services = data;
        break;
      case 'tenants':
        this.tenants = data;
        break;
    }
    this.handleData(this.services, this.tenants);
  }

  private _handleData(services: IXosServiceModel[], tenants: IXosTenantModel[]) {
    this.graphData.next({
      services: this.services,
      tenants: this.tenants
    });
  }

  private graphDataToCoarseGraph(data: IXosCoarseGraphData) {

    const links: IXosServiceGraphLink[] = _.chain(data.tenants)
      .filter((t: IXosTenantModel) => t.kind === 'coarse')
      .map((t: IXosTenantModel) => {
        return {
          id: t.id,
          source: t.provider_service_id,
          target: t.subscriber_service_id,
          model: t
        };
      })
      .value();

    // NOTE show all services anyway or find only the node that have links pointing to it
    const nodes: IXosServiceGraphNode[] = _.map(data.services, (s: IXosServiceModel) => {
      return {
        id: s.id,
        label: s.name,
        model: s
      };
    });

    // TODO call next on this.d3CoarseGraph
    this.d3CoarseGraph.next({
      nodes: nodes,
      links: links
    });
  }

}
