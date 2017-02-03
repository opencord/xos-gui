import {IXosMonitoringApiService} from '../services/montoring-api';
class MonitoringStatsComponent {
  static $inject = ['$scope' ,'XosMonitoringApi'];
  public loader: boolean;
  public stats: any;
  public error: string;
  public name: string;
  public tenant: string;

  constructor (
    private $scope: ng.IScope,
    private XosMonitoringApi: IXosMonitoringApiService
  ) {
    console.log('stats');
    this.$scope.$watch(() => this.name, (val) => {
      if (val) {
        this.getStats(this.tenant);
      }
    });
  }

  public getStats(tenant) {
    this.loader = true;
    this.XosMonitoringApi.getStats({tenant: tenant})
      .then(res => {
        res.map(m => {
          m.resource_name = m.resource_name.replace('mysite_onos_vbng', 'ONOS_FABRIC');
          m.resource_name = m.resource_name.replace('mysite_onos_volt', 'ONOS_CORD');
          m.resource_name = m.resource_name.replace('mysite_vbng', 'mysite_vRouter');
          return m;
        });
        this.stats = res;
      })
      .catch(err => {
        this.error = err.data;
      })
      .finally(() => {
        this.loader = false;
      });
  };
}

export const xosMonitoringStatsComponent: angular.IComponentOptions = {
  template: require('./monitoring-stats.html'),
  controllerAs: 'vm',
  controller: MonitoringStatsComponent
};