import './header.scss';
import {StyleConfig} from '../../config/style.config';
import {IWSEvent} from '../../datasources/websocket/global';
import {IStoreService} from '../../datasources/stores/synchronizer.store';

export interface INotification extends IWSEvent {
  viewed?: boolean;
}

class HeaderController {
  static $inject = ['$scope', 'SynchronizerStore'];
  public title: string;
  public notifications: INotification[] = [];
  public newNotifications: INotification[] = [];

  constructor(
    private $scope: angular.IScope,
    private syncStore: IStoreService
  ) {
    this.title = StyleConfig.projectName;

    this.syncStore.query()
      .subscribe(
        (event: IWSEvent) => {
          $scope.$evalAsync(() => {
            this.notifications.unshift(event);
            this.newNotifications = this.getNewNotifications(this.notifications);
          });
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
