import {IWSEventService, IWSEvent} from '../../datasources/websocket/global';
export interface IXosOnboarder {

}

export class XosOnboarder implements IXosOnboarder{
  static $inject = ['$timeout', '$log', 'WebSocket', '$ocLazyLoad'];

  constructor(
    private $timeout: ng.ITimeoutService,
    private $log: ng.ILogService,
    private webSocket: IWSEventService,
    private $ocLazyLoad: any // TODO add definition
  ) {
    this.$log.info('[XosOnboarder] Setup');
    this.webSocket.list()
      .filter((e) => {
        this.$log.log(e);
        // TODO define event format
        return e.msg['files'].length > 0;
      })
      .subscribe(
        (event) => {
          this.$ocLazyLoad.load([
            event.msg['files'][0]
          ]);

          this.$timeout(() => {
            this.$ocLazyLoad.load([
              event.msg['files'][1]
            ]);
          }, 1000);
        }
      );
  }
}