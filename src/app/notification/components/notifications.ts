
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

import './notifications.scss';
import {IXosNotifications, IXosNotificationStoreService} from '../services/notification-store';
import {Subscription} from 'rxjs';

class XosNotifications {

  static $inject = [
    '$log',
    'XosNotificationStore'
  ];

  public notifs: IXosNotifications;

  private notificationStoreSubscription: Subscription;

  public constructor (
    private $log: ng.ILogService,
    private XosNotificationStore: IXosNotificationStoreService
  ) {

  }

  // store length of the notifications
  // create a notifications array

  $onInit() {
    this.notificationStoreSubscription = this.XosNotificationStore.get()
      .subscribe((res: IXosNotifications) => {
        this.notifs = res;
      },
        (err) => {
        this.$log.error(`[XOSNotifications]: `, err);
      });
  }

}

export const xosNotifications: angular.IComponentOptions = {
  template: require('./notifications.html'),
  controllerAs: 'vm',
  controller: XosNotifications,
};
