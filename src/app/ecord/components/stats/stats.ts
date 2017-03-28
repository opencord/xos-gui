import './stats.scss';

class EcordStatsCtrl {

  static $inject = [
    '$interval'
  ];

  public labels = ["January", "February", "March", "April", "May", "June", "July"];
  public series = ['Series A', 'Series B'];
  public data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];

  public datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  public options = {
    animation: {
      duration: 0
    },
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };

  constructor(
    private $interval: ng.IIntervalService
  ) {
    this.$interval(() => {
      this.data[0].push(this.data[0].shift());
      this.data[1].push(this.data[1].shift());
    }, 1000)
  }
}

export const ecordStats: angular.IComponentOptions = {
  template: require('./stats.html'),
  controllerAs: 'vm',
  controller: EcordStatsCtrl
};