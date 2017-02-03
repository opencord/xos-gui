import './ps-side-form.scss';

class MCordPublicSafetyFormCtrl {
  static $inject = ['$log', '$element', 'MCordSlices', 'MCordTopoHelpers', 'MCordTopoForm'];

  public xposeEnabled: boolean = false;

  constructor(
    private $log: ng.ILogService
  ) {

  }

  $onInit() {
    this.$log.debug(`[MCordPublicSafetyForm] loaded`);
  }

  public toggleXpose() {
    this.xposeEnabled = !this.xposeEnabled;
  }
}

export const MCordPublicSafetyForm: ng.IComponentOptions = {
  template: require('./ps-side-form.html'),
  controllerAs: 'vm',
  controller: MCordPublicSafetyFormCtrl,
};
