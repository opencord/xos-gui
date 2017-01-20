import './side-panel.scss';
import {IXosSidePanelService} from './side-panel.service';

class XosSidePanelController {

  static $inject = ['XosSidePanel'];

  constructor (
    private XosSidePanel: IXosSidePanelService
  ) {}

  public close() {
    this.XosSidePanel.close();
  }

  public open() {
    this.XosSidePanel.open();
  }
}

export const xosSidePanel: angular.IComponentOptions = {
  template: require('./side-panel.html'),
  controllerAs: 'vm',
  controller: XosSidePanelController
};
