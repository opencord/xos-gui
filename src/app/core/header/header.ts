import './header.scss';
import {StyleConfig} from '../../config/style.config';
import {IStoreService} from '../../datasources/stores/slices.store';
import {IWSEvent} from '../../datasources/websocket/global';

class HeaderController {
  static $inject = ['SynchronizerStore'];
  public title: string;
  public notifications: IWSEvent[] = [];

  constructor(
    private syncStore: IStoreService
  ) {
    this.title = StyleConfig.projectName;

    this.syncStore.query()
      .subscribe(
        (event: IWSEvent) => {
          console.log(event);
          this.notifications.push(event);
        }
      );
  }
}

export const xosHeader: angular.IComponentOptions = {
  template: require('./header.html'),
  controllerAs: 'vm',
  controller: HeaderController
};
