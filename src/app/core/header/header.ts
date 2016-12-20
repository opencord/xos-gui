import './header.scss';
import {StyleConfig} from '../../config/style.config';
import {IWSEvent} from '../../datasources/websocket/global';
import {IStoreService} from '../../datasources/stores/synchronizer.store';

export interface INotification extends IWSEvent {
  viewed?: boolean;
}

class HeaderController {
  static $inject = ['$scope', 'SynchronizerStore', 'toastr', 'toastrConfig'];
  public title: string;
  public notifications: INotification[] = [];
  public newNotifications: INotification[] = [];

  constructor(
    private $scope: angular.IScope,
    private syncStore: IStoreService,
    private toastr: ng.toastr.IToastrService,
    private toastrConfig: ng.toastr.IToastrConfig
  ) {

    angular.extend(this.toastrConfig, {
      newestOnTop: false,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      preventOpenDuplicates: false,
      progressBar: true,
      // autoDismiss: false,
      // closeButton: false,
      // timeOut: 0,
      // tapToDismiss: false
    });

    this.title = StyleConfig.projectName;

    this.syncStore.query()
      .subscribe(
        (event: IWSEvent) => {
          $scope.$evalAsync(() => {
            let toastrMsg: string;
            let toastrLevel: string;
            if (event.msg.object.backend_status.indexOf('1') > -1) {
              toastrMsg = 'Synchronization started for:';
              toastrLevel = 'info';
            }
            else if (event.msg.object.backend_status.indexOf('0') > -1) {
              toastrMsg = 'Synchronization succedeed for:';
              toastrLevel = 'success';
            }
            else if (event.msg.object.backend_status.indexOf('2') > -1) {
              toastrMsg = 'Synchronization failed for:';
              toastrLevel = 'error';
            }

            if (toastrLevel && toastrMsg) {
              this.toastr[toastrLevel](`${toastrMsg} ${event.msg.object.name}`, event.model);
            }
            this.notifications.unshift(event);
            this.newNotifications = this.getNewNotifications(this.notifications);
          });
        }
      );
  }

  // TODO display a list of notification in the template
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
