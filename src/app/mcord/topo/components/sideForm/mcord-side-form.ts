class MCordSideFormCtrl {
  static $inject = ['$log', '$element', 'MCordSlices', 'MCordTopoHelpers', 'MCordTopoForm'];

  public ngModel: any;
  public name: string;
  private config: any;

  $onInit() {
  }
}

// TODO add ability to have title in xosForm

export const MCordSideForm: ng.IComponentOptions = {
  template: `
<h3 style="margin-bottom: 20px">{{vm.name}}</h3>
<xos-form config="vm.config" ng-model="vm.ngModel"></xos-form>
<div ng-if="vm.name === 'PS'">
    <mcord-public-safety></mcord-public-safety>
</div>
  `,
  controllerAs: 'vm',
  controller: MCordSideFormCtrl,
  bindings: {
    ngModel: '=',
    config: '=',
    name: '='
  }
};
