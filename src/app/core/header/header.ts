import {StyleConfig} from '../../config/style.config';

class HeaderController {
  public title: string;

  constructor() {
    this.title = StyleConfig.projectName;
  }
}

export const xosHeader: angular.IComponentOptions = {
  template: require('./header.html'),
  controllerAs: 'vm',
  controller: HeaderController
};
