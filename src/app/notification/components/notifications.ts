
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

import * as _ from 'lodash';

import './notifications.scss';
import {Subscription} from 'rxjs';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import * as moment from 'moment';

class XosNotifications {

  static $inject = [
    '$log',
    'XosModelStore'
  ];

  public notifications = [];
  public notificationSlice = [];
  public notifsLoaded = false;
  public currentPage = 0;
  private time = new Date();
  private offset = this.time.getTimezoneOffset();

  private NotificationSubscription: Subscription;

  public constructor (
    private $log: ng.ILogService,
    private XosModelStore: IXosModelStoreService
  ) {

  }

  $onInit() {
    this.NotificationSubscription = this.XosModelStore.query('XOSNotification', '/core/xosnotifications')
      .subscribe(
        res => {
          this.notifications = res;
          this.getNotifications(25, 0);
          this.notifsLoaded = true;
          this.$log.info(this.notificationSlice);
        },
        (err) => {
          this.$log.error(`[XosNotifications] notification Observable: `, err);
        }
      );
  }

  public goToPage = (n) => {
    this.currentPage = n;
    this.getNotifications(25, n);
  };

  public getNotifications(count: number, index: number) {

    // returns a reverse chronological chunk of notifications

    const length = this.notifications.length;
    this.notificationSlice = this.notifications.slice(length - (index + 1) * count, length - (index * count));
    this.notificationSlice = _.map(this.notificationSlice, (n) => {
      n.timeformat = this.formatTime(n.timestamp);
      return n;
    });

    return;
  }

  public getClass(code: number) {
    switch (code) {
      case 0:
        return 'alert-info';
      case 1:
        return 'alert-success';
      case 2:
        return 'alert-danger';
      default:
        return 'alert-info';
    }
  }

  public formatTime(timestamp: string) {
    return moment(timestamp).utcOffset(this.offset).format('MMMM Do YYYY, h:mm:ss a');
  }

}

export const xosNotifications: angular.IComponentOptions = {
  template: require('./notifications.html'),
  controllerAs: 'vm',
  controller: XosNotifications,
};
