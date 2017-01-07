import './mcord-services.scss';

class MCordServicesCtrl {
  static $inject = ['$log', '$element', 'MCordSlices', 'MCordTopoHelpers', 'MCordTopoForm'];

  public services = {
    ran: [
      {
        name: 'Progran',
        icon: 'pe-7s-lock'
      }
    ]
  };
}

export const MCordServices: ng.IComponentOptions = {
  template: require('./mcord-services.html'),
  controllerAs: 'vm',
  controller: MCordServicesCtrl,
};
