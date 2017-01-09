require('./validation.scss');

class ValidationCtrl {

  static $inject = [];

  public config: any;

  constructor (
  ) {

  }

  $onInit() {
    console.log('validation');
    this.config = {
      type: 'danger'
    };
  }
}

export const xosValidation: angular.IComponentOptions = {
  template: require('./validation.html'),
  controllerAs: 'vm',
  controller: ValidationCtrl,
  transclude: true,
  bindings: {
    field: '=',
    form: '='
  }
};
