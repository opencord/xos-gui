import './mcord-services.scss';

class MCordServicesCtrl {
  static $inject = ['$log', '$element', 'MCordSlices', 'MCordTopoHelpers', 'MCordTopoForm'];

  public services = {
    RAN: [
      {
        name: 'vPGWC',
        icon: 'pe-7s-lock',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab beatae dolores dolorum, ex explicabo impedit iste itaque, iusto magnam non quam rerum, similique unde. Accusamus alias, incidunt. Ipsa, ipsam, quis.'
      },
      {
        name: 'vSGW',
        icon: 'pe-7s-lock',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab beatae dolores dolorum, ex explicabo impedit iste itaque, iusto magnam non quam rerum, similique unde. Accusamus alias, incidunt. Ipsa, ipsam, quis.'
      },
      {
        name: 'vBBU',
        icon: 'pe-7s-lock',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab beatae dolores dolorum, ex explicabo impedit iste itaque, iusto magnam non quam rerum, similique unde. Accusamus alias, incidunt. Ipsa, ipsam, quis.'
      }
    ],
    EPC: [
      {
        name: 'vMME',
        icon: 'pe-7s-lock',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab beatae dolores dolorum, ex explicabo impedit iste itaque, iusto magnam non quam rerum, similique unde. Accusamus alias, incidunt. Ipsa, ipsam, quis.'
      },
    ]
  };

  public isCollapsed = {
    RAN: true,
    EPC: true
  };
}

export const MCordServices: ng.IComponentOptions = {
  template: require('./mcord-services.html'),
  controllerAs: 'vm',
  controller: MCordServicesCtrl,
};
