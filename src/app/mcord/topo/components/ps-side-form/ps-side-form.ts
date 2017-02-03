import './ps-side-form.scss';

class MCordPublicSafetyFormCtrl {
  static $inject = ['$log', '$http'];

  public xposeEnabled: boolean = false;

  constructor(
    private $log: ng.ILogService,
    private $http: ng.IHttpService
  ) {

  }

  $onInit() {
    this.$log.debug(`[MCordPublicSafetyForm] loaded`);
  }

  public toggleXpose() {
    this.$http.post(`whateeverXpose`, {})
      .then(() => {
        console.log('success');
        this.xposeEnabled = !this.xposeEnabled;
      })
      .catch(() => {
        console.log('err');
        this.xposeEnabled = !this.xposeEnabled;
      });
  }
}

export const MCordPublicSafetyForm: ng.IComponentOptions = {
  template: require('./ps-side-form.html'),
  controllerAs: 'vm',
  controller: MCordPublicSafetyFormCtrl,
};
