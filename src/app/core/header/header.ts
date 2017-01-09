import './header.scss';
import {StyleConfig} from '../../config/style.config';
import {IWSEvent} from '../../datasources/websocket/global';
import {IStoreService} from '../../datasources/stores/synchronizer.store';
import {IXosAuthService} from '../../datasources/rest/auth.rest';
import {IXosNavigationService, IXosNavigationRoute} from '../services/navigation';
import {IStateService} from 'angular-ui-router';
import * as _ from 'lodash';
import * as $ from 'jquery';

export interface INotification extends IWSEvent {
  viewed?: boolean;
}

class HeaderController {
  static $inject = ['$scope', '$state', 'AuthService', 'SynchronizerStore', 'toastr', 'toastrConfig', 'NavigationService'];
  public notifications: INotification[] = [];
  public newNotifications: INotification[] = [];
  public version: string;
  public userEmail: string;
  public routeSelected: (route: IXosNavigationRoute) => void;
  public states: IXosNavigationRoute[];
  public query: string;

  constructor(
    private $scope: angular.IScope,
    private $state: IStateService,
    private authService: IXosAuthService,
    private syncStore: IStoreService,
    private toastr: ng.toastr.IToastrService,
    private toastrConfig: ng.toastr.IToastrConfig,
    private NavigationService: IXosNavigationService
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

    // TODO set a global event after routes have been loaded
    window.setTimeout(() => {
      this.states = this.NavigationService.query().reduce((list, state) => {
        // if it does not have child (otherwise it is abstract)
        if (!state.children || state.children.length === 0) {
          list.push(state);
        }
        // else push child
        if (state.children && state.children.length > 0) {
          state.children.forEach(c => {
            list.push(c);
          });
        }
        return list;
      }, []);
      this.states = _.uniqBy(this.states, 'state');
    }, 500);

    // listen for keypress
    $(document).on('keyup', (e) => {
      if (e.key === 'f') {
        $('.navbar-form input').focus();
      }
    });

    // redirect to selected page
    this.routeSelected = (item: IXosNavigationRoute) => {
      console.log(`go to: ${item.state}`);
      this.$state.go(item.state);
      this.query = null;
    };

    this.userEmail = this.authService.getUser() ? this.authService.getUser().email : '';

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
