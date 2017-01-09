export interface IXosAlertConfig {
  type: string;
  closeBtn?: boolean;
  autoHide?: number;
}

class AlertCtrl {

  static $inject = ['$timeout'];

  public config: any;
  public show: boolean;
  public dismiss: () => void;

  constructor (
    private $timeout: ng.ITimeoutService
  ) {

  }

  $onInit() {
    if (!angular.isDefined(this.config)) {
      throw new Error('[xosAlert] Please provide a configuration via the "config" attribute');
    }

    // default the value to true
    this.show = this.show !== false;

    this.dismiss = () => {
      this.show = false;
    };

    console.log(this.config);
    if (this.config.autoHide) {

      let to = this.$timeout(() => {
        this.dismiss();
        this.$timeout.cancel(to);
      }, this.config.autoHide);
    }
  }
}

export const xosAlert: angular.IComponentOptions = {
  template: require('./alert.html'),
  controllerAs: 'vm',
  controller: AlertCtrl,
  transclude: true,
  bindings: {
    config: '=',
    show: '=',
  }
};
