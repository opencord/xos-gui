import './public-safety-stat.scss';

class MCordPublicSafetyCtrl {
  static $inject = ['$log', '$scope', '$stateParams'];

  public enabled: boolean;
  public labels: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'].map((t: any, i: number) => {
    t = new Date();
    t.setSeconds(t.getSeconds() + (10 * i));
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
  });
  public series = ['Upstream', 'Downstream'];
  public data;
  public base_voip_data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  public base_ps_data = [
    [28, 48, 40, 56, 86, 27, 12],
    [35, 49, 20, 71, 36, 65, 33]
  ];

  // public datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  public options = {
    scales: {
      yAxes: [
        // {
        //   id: 'y-axis-1',
        //   type: 'linear',
        //   display: true,
        //   position: 'left'
        // },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };

  constructor (
    private $log: ng.ILogService,
    private $scope: ng.IScope,
    private $stateParams: ng.ui.IStateParamsService
  ) {

  }

  $onInit() {
    this.$scope.$watch(() => this.enabled, (val) => {
      if (angular.isUndefined(val)) {
        this.data = this.base_voip_data;
      }
      else if (val) {
        this.data = this.base_ps_data;
      }
      else {
        this.data = [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
        ];
      }
    });
  }
}

// TODO add ability to have title in xosForm

export const MCordPublicSafety: ng.IComponentOptions = {
  template: require('./public-safety-stat.html'),
  controllerAs: 'vm',
  controller: MCordPublicSafetyCtrl,
  bindings: {
    enabled: '='
  }
};
