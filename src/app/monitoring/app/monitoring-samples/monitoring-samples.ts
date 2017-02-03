import * as _ from 'lodash';
import './monitoring-samples.scss';
import {IXosMonitoringApiService} from '../services/montoring-api';
import {IXosMonitoringMeter} from '../dashboard/monitoring-dashboard';

class MonitoringSamplesComponent {
  static $inject = ['$stateParams', '$interval', 'XosMonitoringApi'];
  public loader: boolean = true;
  public name: string;
  public tenant: string;
  public error: string;
  public chartColors = [
    '#286090',
    '#F7464A',
    '#46BFBD',
    '#FDB45C',
    '#97BBCD',
    '#4D5360',
    '#8c4f9f'
  ];
  public chart = {
    series: [],
    labels: [],
    data: [],
    options: {
      legend: {
        display: true
      }
    }
  };
  // Chart.defaults.global.colours = this.chartColors;
  public chartType = 'line';
  public chartMeters = [];
  public samplesList = [];
  public sampleLabels = [];
  private pieStats = [
    'broadview.pt.packet-trace-lag-resolution',
    'broadview.pt.packet-trace-ecmp-resolution'
  ];
  private isApie: boolean = false;

  private refreshInterval: number = 60 * 1000;

  constructor (
    private $stateParams: ng.ui.IStateParamsService,
    private $interval: ng.IIntervalService,
    private XosMonitoringApi: IXosMonitoringApiService
  ) {
    if (this.$stateParams['name'] && this.$stateParams['tenant']) {
      this.name = $stateParams['name'];
      // TODO rename tenant in resource_id
      this.tenant = $stateParams['tenant'];

      if (this.pieStats.indexOf(this.name) > -1) {
        this.isApie = true;
        this.chartType = 'pie';
        this.refreshInterval = 10 * 1000;
      }
    }
    else {
      throw new Error('Missing Name and Tenant Params!');
    }

    this.$interval(() => {
      this.showSamples();
    }, this.refreshInterval);
    this.showSamples();
  }

  /**
   * Goes trough the array and format date to be used as labels
   *
   * @param Array data
   * @returns Array a list of labels
   */

  public getLabels(data: any[]) {
    return data.reduce((list, item) => {
      let date = new Date(item.timestamp);
      list.push(`${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}:${date.getSeconds()}`);
      return list;
    }, []);
  };

  /**
   * Goes trough the array and return a flat array of values
   *
   * @param Array data
   * @returns Array a list of values
   */

  public getData(data: any[]) {
    return data.reduce((list, item) => {
      list.push(item.volume);
      return list;
    }, []);
  };

  /**
   * Add a samples to the chart
   *
   * @param string resource_id
   */

  public addMeterToChart(resource_id: string) {
    const resourcePos = _.findIndex(this.chartMeters, m => m.resource_id === resource_id);
    // if this meter is not yet rendered
    if (resourcePos < 0) {
      this.chart['data'].push(this.getData(_.sortBy(this.samplesList[resource_id], 'timestamp')));
      this.chart['labels'] = this.getLabels(_.sortBy(this.samplesList[resource_id], 'timestamp'));
      this.chart['series'].push(resource_id);
      this.chartMeters.push(this.samplesList[resource_id][0]); // use the 0 as are all samples for the same resource and I need the name
      _.remove(this.sampleLabels, {id: resource_id});
    }
    else {
      this.chart['data'][resourcePos] = this.getData(_.sortBy(this.samplesList[resource_id], 'timestamp'));
      this.chart['labels'] = this.getLabels(_.sortBy(this.samplesList[resource_id], 'timestamp'));
      this.chart['series'][resourcePos] = resource_id;
    }
  }

  public removeFromChart(meter: IXosMonitoringMeter) {
    this.chart.data.splice(this.chart.series.indexOf(meter.resource_id), 1);
    this.chart.series.splice(this.chart.series.indexOf(meter.resource_id), 1);
    this.chartMeters.splice(_.findIndex(this.chartMeters, {resource_id: meter.resource_id}), 1);
    this.sampleLabels.push({
      id: meter.resource_id,
      name: meter.resource_name || meter.resource_id
    });
  };

  /**
   * Format samples to create a list of labels and ids
   */

  public formatSamplesLabels(samples: IXosMonitoringMeter[]) {
    return _.uniq(samples, 'resource_id')
      .reduce((labels, item) => {
        labels.push({
          id: item.resource_id,
          name: item.resource_name || item.resource_id
        });

        return labels;
      }, []);
  }

  /**
   * Format data series in pie chart val
   */

  public formatPieChartData(samples: IXosMonitoringMeter[]) {

    this.chart['labels'] = samples[0].metadata['lag-members'].replace(/\[|\]|'| /g, '').split(',');
    this.chart.options = {
      legend: {
        display: true
      }
    };
    samples = _.groupBy(samples, i => i.metadata['dst-lag-member']);

    // TODO show percentage in pie
    // Chart.defaults.global.tooltipTemplate = '<%if (label){%><%=label%>: <%}%><%= value %>%';

    let data = _.reduce(this.chart.labels, (data, item) => {
      let length = samples[item] ? samples[item].length : 0;
      data.push(length);
      return data;
    }, []);

    let total = _.reduce(data, (d, t) => d + t);

    let percent = _.map(data, d => Math.round((d / total) * 100));

    this.chart['data'] = percent;
  };


  /**
   * Load the samples and format data
   */

  public showSamples() {
    let p;
    if (this.isApie) {
      p = this.XosMonitoringApi.getSamples(this.name, 30);
    }
    else {
      p = this.XosMonitoringApi.getSamples(this.name);
    }

    p.then(res => {

      // rename things in UI
      res.map(m => {
        m.resource_name = m.resource_name.replace('mysite_onos_vbng', 'ONOS_FABRIC');
        m.resource_name = m.resource_name.replace('mysite_onos_volt', 'ONOS_CORD');
        m.resource_name = m.resource_name.replace('mysite_vbng', 'mysite_vRouter');
        return m;
      });
      // end rename things in UI

      // if I have to draw a pie skip the rest
      if (this.isApie) {
        this.formatPieChartData(res);
        return;
      }

      // setup data for visualization
      this.samplesList = _.groupBy(res, 'resource_id');
      this.sampleLabels = this.formatSamplesLabels(res);

      // add current meter to chart
      this.addMeterToChart(this.tenant);

    })
      .catch(err => {
        this.error = err.data.detail;
      })
      .finally(() => {
        this.loader = false;
      });
  };
}

export const xosMonitoringSamplesComponent: angular.IComponentOptions = {
  template: require('./monitoring-samples.html'),
  controllerAs: 'vm',
  controller: MonitoringSamplesComponent,
};
