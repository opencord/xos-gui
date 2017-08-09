
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import './header.scss';
import {IWSEvent} from '../../datasources/websocket/global';
import {IStoreService} from '../../datasources/stores/synchronizer.store';
import {IXosAuthService} from '../../datasources/rest/auth.rest';
import {IXosNavigationService, IXosNavigationRoute} from '../services/navigation';
import {IStateService} from 'angular-ui-router';
import * as $ from 'jquery';
import {IXosStyleConfig} from '../../../index';
import {IXosSearchService, IXosSearchResult} from '../../datasources/helpers/search.service';
import {IXosKeyboardShortcutService} from '../services/keyboard-shortcut';

export interface INotification extends IWSEvent {
  viewed?: boolean;
}

class HeaderController {
  static $inject = ['$scope', '$rootScope', '$state', 'AuthService', 'SynchronizerStore', 'toastr', 'toastrConfig', 'XosNavigationService', 'StyleConfig', 'SearchService', 'XosKeyboardShortcut'];
  public notifications: INotification[] = [];
  public newNotifications: INotification[] = [];
  public version: string;
  public userEmail: string;
  public routeSelected: (route: IXosSearchResult) => void;
  public states: IXosNavigationRoute[];
  public query: string;
  public search: (query: string) => any[];

  constructor(
    private $scope: angular.IScope,
    private $rootScope: ng.IScope,
    private $state: IStateService,
    private authService: IXosAuthService,
    private syncStore: IStoreService,
    private toastr: ng.toastr.IToastrService,
    private toastrConfig: ng.toastr.IToastrConfig,
    private NavigationService: IXosNavigationService,
    private StyleConfig: IXosStyleConfig,
    private SearchService: IXosSearchService,
    private XosKeyboardShortcut: IXosKeyboardShortcutService
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

    this.search = (query: string) => {
      return this.SearchService.search(query);
    };

    // listen for keypress
    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'F',
      description: 'Select search box',
      cb: () => {
        $('.navbar-form input').focus();
      },
    }, 'global');

    // redirect to selected page
    this.routeSelected = (item: IXosSearchResult) => {
      if (angular.isString(item.state)) {
        this.$state.go(item.state);
      }
      else {
        this.$state.go(item.state.name, item.state.params);
      }
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
    return require(`../../images/brand/${this.StyleConfig.logo}`);
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
