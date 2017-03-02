import {Observable, BehaviorSubject} from 'rxjs';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import {IXosServiceGraph, IXosServiceModel, IXosTenantModel} from '../interfaces';
import {IXosDebouncer} from '../../core/services/helpers/debounce.helper';
export interface IXosServiceGraphStore {
  get(): Observable<IXosServiceGraph>;
}

export class XosServiceGraphStore implements IXosServiceGraphStore {
  static $inject = [
    '$log',
    'XosModelStore',
    'XosDebouncer'
  ];
  private d3Graph = new BehaviorSubject({});

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

    // we want to have a quiet period of 500ms from the last event before doing anything
    this.handleData = this.XosDebouncer.debounce(this._handleData, 500, false);

    this.ServiceObservable = this.XosModelStore.query('Service', '/core/services');
    this.TenantObservable = this.XosModelStore.query('Service', '/core/tenants');

    this.ServiceObservable
      .subscribe(
        (res) => {
          this.combineData(res, 'services');
        },
        (err) => {
          this.$log.error(err);
        }
      );

    this.ServiceObservable
      .subscribe(
        (res) => {
          this.combineData(res, 'tenants');
        },
        (err) => {
          this.$log.error(err);
        }
      );
  }

  public get() {
    return this.d3Graph.asObservable();
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
    this.$log.log(`XosServiceGraphStore`, services, tenants);
  }

}
