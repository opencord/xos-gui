import './public-safety-stat.scss';
import {IXosAppConfig} from '../../../../../index';

class MCordPublicSafetyCtrl {
  static $inject = ['$log', '$scope', '$stateParams', '$interval', '$http', 'AppConfig'];

  public enabled: boolean;
  public interval: any;
  public probs: string;
  public labels: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'].map((t: any, i: number) => {
    t = new Date();
    t.setSeconds(t.getSeconds() + (10 * i));
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
  });
  public series = ['Upstream', 'Downstream'];
  public data;
  public base_voip_data = [
    // [65, 59, 80, 81, 56, 55, 40],
    // [28, 48, 40, 19, 86, 27, 90],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];
  public base_ps_data = [
    [28, 48, 40, 56, 86, 27, 12],
    [35, 49, 20, 71, 36, 65, 33]
  ];

  // public datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  public options = {
    animation: {
      duration: 0
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            mix: 0,
            max: 120,
            stepSize: 20
          }
        }
      ]
    }
  };

  constructor (
    private $log: ng.ILogService,
    private $scope: ng.IScope,
    private $stateParams: ng.ui.IStateParamsService,
    private $interval: ng.IIntervalService,
    private $http: ng.IHttpService,
    private AppConfig: IXosAppConfig
  ) {
    this.AppConfig.apiEndpoint = this.AppConfig.apiEndpoint.replace(':3000/api', '');
  }

  $onInit() {
    if (this.probs === 'voip') {
      this.data = this.base_voip_data;
    }
    else {
      this.$scope.$watch(() => this.enabled, (val) => {
        // if (val) {
        //   this.data = this.base_ps_data;
        // }
        // else {
          this.data = [
            [0, 1, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0],
          ];
        // }
      });
    }
    this.interval = this.$interval(() => {
      this.updateChart();
    }, 10 * 100);
  }

  private updateChart() {
    // Update label if animation is disabled
    // this.labels.shift();
    // const t = new Date;
    // const date = `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
    // this.labels.push(date);
    if (this.enabled) {
      this.getData()
        .then((res) => {
          this.data[0].push(res.data[0].up.bps);
          this.data[1].push(res.data[0].down.bps);
        });
    }
    else {
      delete this.interval;
      const firstData = this.data[0][0];
      const secondData = this.data[1][0];
      this.data[0].push(firstData);
      this.data[1].push(secondData);
    }
    this.data[0].shift();
    this.data[1].shift();
  }

  private getData() {
    return this.$http.get(`${this.AppConfig.apiEndpoint}/cookies/api/v1/statscookie/1/`);
  }
}

// TODO add ability to have title in xosForm

export const MCordPublicSafety: ng.IComponentOptions = {
  template: require('./public-safety-stat.html'),
  controllerAs: 'vm',
  controller: MCordPublicSafetyCtrl,
  bindings: {
    enabled: '=',
    probs: '@'
  }
};
