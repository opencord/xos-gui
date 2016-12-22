import './header.scss';
import {StyleConfig} from '../../config/style.config';
import {IWSEvent} from '../../datasources/websocket/global';
import {IStoreService} from '../../datasources/stores/synchronizer.store';
import {IXosAuthService} from '../../datasources/rest/auth.rest';

export interface INotification extends IWSEvent {
  viewed?: boolean;
}

class HeaderController {
  static $inject = ['$scope', 'AuthService', 'SynchronizerStore', 'toastr', 'toastrConfig'];
  public notifications: INotification[] = [];
  public newNotifications: INotification[] = [];
  public version: string;
  public userEmail: string;

  constructor(
    private $scope: angular.IScope,
    private authService: IXosAuthService,
    private syncStore: IStoreService,
    private toastr: ng.toastr.IToastrService,
    private toastrConfig: ng.toastr.IToastrConfig
  ) {
    this.version = require('../../../../package.json').version;
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

    this.userEmail = this.authService.getUser().email;

    this.syncStore.query()
      .subscribe(
        (event: IWSEvent) => {
          $scope.$evalAsync(() => {
            let toastrMsg: string;
            let toastrLevel: string;
            if (event.msg.object.backend_status.indexOf('0') > -1) {
              toastrMsg = 'Synchronization started for:';
              toastrLevel = 'info';
            }
            else if (event.msg.object.backend_status.indexOf('1') > -1) {
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
            // this.notifications.unshift(event);
            // this.newNotifications = this.getNewNotifications(this.notifications);
          });
        }
      );
  }

  public getLogo(): string {
    return require(`../../images/brand/${StyleConfig.logo}`);
  }

  // TODO display a list of notification in the template (if it make sense)
  // public viewNotification = (notification: INotification) => {
  //   notification.viewed = true;
  //   this.newNotifications = this.getNewNotifications(this.notifications);
  // };
  //
  // private getNewNotifications = (notifications: INotification[]) => {
  //   return this.notifications.filter((n: INotification) => {
  //     return !n.viewed;
  //   });
  // };
}

export const xosHeader: angular.IComponentOptions = {
  template: require('./header.html'),
  controllerAs: 'vm',
  controller: HeaderController
};
