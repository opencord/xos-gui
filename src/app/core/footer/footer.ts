import {IXosStyleConfig} from '../../../index';
class FooterCtrl {

  static $inject = ['StyleConfig'];

  public brand: string;

  /** @ngInject */
  constructor(
    private StyleConfig: IXosStyleConfig
  ) {
    this.brand = this.StyleConfig.projectName;
  }
}

export const xosFooter: angular.IComponentOptions = {
  template: require('./footer.html'),
  controllerAs: 'vm',
  controller: FooterCtrl
};
