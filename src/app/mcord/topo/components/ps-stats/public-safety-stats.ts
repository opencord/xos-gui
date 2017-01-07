import './public-safety-stat.scss';

class MCordPublicSafetyCtrl {
  static $inject = ['$log', '$element', 'MCordSlices', 'MCordTopoHelpers', 'MCordTopoForm'];

  public labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public series = ['Series A', 'Series B'];
  public data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  public onClick = function (points, evt) {
    console.log(points, evt);
  };
  public datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  public options = {
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

  $onInit() {

  }
}

// TODO add ability to have title in xosForm

export const MCordPublicSafety: ng.IComponentOptions = {
  template: require('./public-safety-stat.html'),
  controllerAs: 'vm',
  controller: MCordPublicSafetyCtrl,
};
