
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


import {Subscription, Observable, BehaviorSubject} from 'rxjs';
import {IXosModelStoreService} from '../../datasources/stores/model.store';

export interface IXosNotificationStoreService {
  get(): Observable<IXosNotifications>;
}

export interface IXosNotifications {
  notifications: any[];
}

export class XosNotificationStore implements IXosNotificationStoreService {

  static $inject = [
    '$log',
    'XosModelStore',
  ];

  private NotificationSubscription : Subscription;

  private notifs: IXosNotifications = {
    notifications: []
  };
  private notifsSubject = new BehaviorSubject(this.notifs);

  public constructor (
    private $log: ng.ILogService,
    private XosModelStore: IXosModelStoreService,
  ) {
    this.NotificationSubscription = this.XosModelStore.query('XOSNotification', 'core/xosnotifications')
      .subscribe(
        res => {
          this.notifsSubject.next(
            {
              notifications: res,
            }
          );
        },
        (err) => {
          this.$log.error(`[XOSNotificationStore] notification Observable: `, err);
        }
      );
  }

  public get() {
      return this.notifsSubject.asObservable();
  }

}
