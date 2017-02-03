import {IXosAppConfig} from '../../../../index';
import {IXosMonitoringSlice} from '../dashboard/monitoring-dashboard';
export interface IXosMonitoringApiService {
  selectedService: string | null;
  selectedSlice: IXosMonitoringSlice;
  selectedResource: string | null;
  selectedResources: string | null;
  getMappings(): ng.IPromise<any>;
  getMeters(params: any): ng.IPromise<any>;
  getStats(options: any): ng.IPromise<any>;
  getSamples(name: string, limit?: number): ng.IPromise<any>;
}

export class XosMonitoringApi implements IXosMonitoringApiService {

  static $inject = ['$http', '$q', 'AppConfig'];

  // hold dashboard status (opened service, slice, resource)
  public selectedService = null;
  public selectedSlice = null;
  public selectedResource = null;
  public selectedResources = null;

  constructor(
    private $http: ng.IHttpService,
    private $q: ng.IQService,
    private AppConfig: IXosAppConfig
  ) {

  }

  public getMappings = () => {
    let deferred = this.$q.defer();

    this.$http.get(`${this.AppConfig.apiEndpoint}/tenant/monitoring/dashboard/xos-slice-service-mapping/`)
      .then((res) => {
        deferred.resolve(res.data);
      })
      .catch((e) => {
        deferred.reject(e);
      });

    return deferred.promise;
  };

    public getMeters = (params) => {
      let deferred = this.$q.defer();

      this.$http.get(`${this.AppConfig.apiEndpoint}/tenant/monitoring/dashboard/meters/`, {params: params})
      // this.$http.get('../meters_mock.json', {cache: true})
        .then((res) => {
          deferred.resolve(res.data);
        })
        .catch((e) => {
          deferred.reject(e);
        });

      return deferred.promise;
    };

    public getSamples = (name, limit = 10) => {
      let deferred = this.$q.defer();

      this.$http.get(`${this.AppConfig.apiEndpoint}/tenant/monitoring/dashboard/metersamples/`, {params: {meter: name, limit: limit}})
        .then((res) => {
          deferred.resolve(res.data);
        })
        .catch((e) => {
          deferred.reject(e);
        });

      return deferred.promise;
    };

      public getStats = (options) => {
      let deferred = this.$q.defer();

      this.$http.get(`${this.AppConfig.apiEndpoint}/tenant/monitoring/dashboard/meterstatistics/`, {cache: true, params: options})
      // this.$http.get('../stats_mock.son', {cache: true})
        .then((res) => {
          deferred.resolve(res.data);
        })
        .catch((e) => {
          deferred.reject(e);
        });

      return deferred.promise;
    };
};
