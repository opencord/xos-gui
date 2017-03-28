import './stats.scss';
import {IMicrosemiStats, IMicrosemiChartData, IMicrosemiStatsFormat, IMicrosemiStatsData} from './stat-service';
import * as _ from 'lodash';

class EcordStatsCtrl {

  static $inject = [
    '$interval',
    '$stateParams',
    'MicrosemiStats'
  ];

  public labels = ["January", "February", "March", "April", "May", "June", "July"];
  public series = ['Series A', 'Series B'];
  public data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];

  public options = {
    animation: {
      duration: 0
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero:true,
            fontColor: "#fff",
          }
        }
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero:true,
            fontColor: "#fff",
          }
        }
      ]
    }
  };

  public lineOptions = {
    animation: {
      duration: 0
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero:true,
            callback: val => `${Math.round(val * 1000) / 1000} ms`,
            fontColor: "#fff",
          }
        }
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero:true,
            fontColor: "#fff",
          }
        }
      ]
    }
  };

  public lineChart = {
    series: ['Jitter Average', 'Jitter Max', 'Jitter Min', 'Delay Average', 'Delay Max', 'Delay Min'],
    labels: [],
    data: [],
    dataset: [
      {fill: false, borderColor: '#c55d01'},
      {fill: false, borderColor: '#ffa500'},
      {fill: false, borderColor: '#8b0000'},
      {fill: false, borderColor: '#6f6db9'},
      {fill: false, borderColor: '#add8e6'},
      {fill: false, borderColor: '#00008b'}
    ]
  };

  public delayBin = {
    series: ['Current Delay Bin'],
    labels: ['0 - 10 ms', '10 - 20 ms', '20 - 37 ms', '> 37 ms'],
    data: [],
    dataset: {
      borderColor: '#00008b',
      backgroundColor: '#6f6db9'
    }
  };

  public jitterBin = {
    series: ['Current Jitter Bin'],
    labels: ['0 - 3 ms', '3 - 8 ms', '8 - 100 ms', '> 100 ms'],
    data: [],
    dataset: {
      borderColor: '#c55d01',
      backgroundColor: '#ffa500'
    }
  };

  constructor(
    private $interval: ng.IIntervalService,
    private $stateParams: ng.ui.IStateParamsService,
    private MicrosemiStats: IMicrosemiStats
  ) {
    this.MicrosemiStats.get(this.$stateParams.maName, this.$stateParams.mepId, this.$stateParams.dmId || 1)
      .then((res: IMicrosemiStatsData) => {
        console.log(res);
        const data = res['data'];
        const line = this.parseDataForLine(data);
        this.lineChart.labels = line.labels;
        this.lineChart.data = line.data;

        const delay = this.parseDelayBin(data);
        // this.delayBin.labels = delay.labels;
        this.delayBin.data = delay.data;
        console.log(delay.data);

        const jitter = this.parseJitterBin(data);
        // this.jitterBin.labels = jitter.labels;
        this.jitterBin.data = jitter.data;

      });
  }

  private getNumericVal(val: string): number {
    if (!val) {
      return 0;
    }
    val = val.replace('PT', '');
    val = val.replace('S', '');
    return parseFloat(val) * 1000;
  }

  private formatDate(string: string): string {
    const date = new Date(string);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  private parseDelayBin(stats: IMicrosemiStatsData) {
    const labels: number[] = [];
    const data: number[] = [];
    _.forEach(stats.dm.current.frameDelayTwoWayBins.bins, (bin) => {
      labels.push(this.getNumericVal(bin.lowerLimit));
      data.push(bin.count);
    });
    return {
      labels,
      data
    }
  }

  private parseJitterBin(stats: IMicrosemiStatsData) {
    const labels: number[] = [];
    const data: number[] = [];
    _.forEach(stats.dm.current.interFrameDelayVariationTwoWayBins.bins, (bin) => {
      labels.push(this.getNumericVal(bin.lowerLimit));
      data.push(bin.count);
    });
    return {
      labels,
      data
    }
  }

  private parseDataForLine(data: IMicrosemiStatsData): IMicrosemiChartData {
    let stats = angular.copy(data.dm.historic);
    stats.unshift(data.dm.current);

    const jitterAvg: number[] = [];
    const jitterMax: number[] = [];
    const jitterMin: number[] = [];
    const delayAvg: number[] = [];
    const delayMax: number[] = [];
    const delayMin: number[] = [];
    const labels: string[] = [];
    _.forEach(stats, (s: IMicrosemiStatsFormat) => {
      const j_avg = this.getNumericVal(s.interFrameDelayVariationTwoWayAvg);
      const j_max = this.getNumericVal(s.interFrameDelayVariationTwoWayMax);
      const j_min = this.getNumericVal(s.interFrameDelayVariationTwoWayMin);
      const d_avg = this.getNumericVal(s.frameDelayTwoWayAvg);
      const d_max = this.getNumericVal(s.frameDelayTwoWayMax);
      const d_min = this.getNumericVal(s.frameDelayTwoWayMin);
      jitterAvg.push(j_avg);
      jitterMax.push(j_max);
      jitterMin.push(j_min);
      delayAvg.push(d_avg);
      delayMax.push(d_max);
      delayMin.push(d_min);
      labels.push(s.endTime ? this.formatDate(s.endTime) : 'current');
    });

    return {
      labels: labels.reverse(),
      data: [
        jitterAvg.reverse(),
        jitterMax.reverse(),
        jitterMin.reverse(),
        delayAvg.reverse(),
        delayMax.reverse(),
        delayMin.reverse(),
      ]
    };
  }
}

export const ecordStats: angular.IComponentOptions = {
  template: require('./stats.html'),
  controllerAs: 'vm',
  controller: EcordStatsCtrl
};