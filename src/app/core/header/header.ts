import './header.scss';
import {StyleConfig} from '../../config/style.config';
import {IStoreService} from '../../datasources/stores/slices.store';
import {IWSEvent} from '../../datasources/websocket/global';

interface INotification extends IWSEvent {
  viewed?: boolean;
}

class HeaderController {
  static $inject = ['SynchronizerStore'];
  public title: string;
  public notifications: INotification[] = [];
  public newNotifications: INotification[] = [];

  constructor(
    private syncStore: IStoreService
  ) {
    this.title = StyleConfig.projectName;

    this.syncStore.query()
      .subscribe(
        (event: IWSEvent) => {
          this.notifications.unshift(event);
          this.newNotifications = this.getNewNotifications(this.notifications);
        }
      );
  }

  public viewNotification = (notification: INotification) => {
    notification.viewed = true;
    this.newNotifications = this.getNewNotifications(this.notifications);
  };

  private getNewNotifications = (notifications: INotification[]) => {
    return this.notifications.filter((n: INotification) => {
      return !n.viewed;
    });
  };
}

export const xosHeader: angular.IComponentOptions = {
  template: require('./header.html'),
  controllerAs: 'vm',
  controller: HeaderController
};
