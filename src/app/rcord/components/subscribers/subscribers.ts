import {IXosModelStoreService} from '../../../datasources/stores/model.store';
import * as _ from 'lodash';

class RcordSubscriberCtrl {

  static $inject = [
    '$log',
    'XosModelStore'
  ];

  public SubscriberSubscription;
  public subscribers;

  constructor (
    private $log: ng.ILogService,
    private XosModelStore: IXosModelStoreService
  ) {
    this.SubscriberSubscription = this.XosModelStore.query('CordSubscriberRoot', '/volt/cordsubscriberroots')
      .subscribe(
        (res) => {
          this.subscribers = res;
        },
        (err) => {
          this.$log.error(`[XosServiceGraphStore] Subscriber Observable: `, err);
        }
      );
  }

  public setStatus(subId: number, status: string) {
    const sub = _.find(this.subscribers, {id: subId});
    if (!sub) {
      return;
    }
    sub.status = status;
    sub.$save();
  }
}

export const rcordSubscriber: ng.IComponentOptions = {
  template: require('./subscribers.html'),
  controllerAs: 'vm',
  controller: RcordSubscriberCtrl
};