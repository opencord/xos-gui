import {StyleConfig} from '../../config/style.config';

class FooterCtrl {
  public brand: string;

  /** @ngInject */
  constructor() {
    this.brand = StyleConfig.projectName;
  }
}

export const xosFooter: angular.IComponentOptions = {
  template: require('./footer.html'),
  controllerAs: 'vm',
  controller: FooterCtrl
};
