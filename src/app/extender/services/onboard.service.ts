import {IWSEventService, IWSEvent} from '../../datasources/websocket/global';

export interface IXosOnboarder {

}

export class XosOnboarder implements IXosOnboarder {
  static $inject = ['$timeout', '$log', '$q', 'WebSocket', '$ocLazyLoad'];

  constructor(
    private $timeout: ng.ITimeoutService,
    private $log: ng.ILogService,
    private $q: ng.IQService,
    private webSocket: IWSEventService,
    private $ocLazyLoad: any // TODO add definition
  ) {
    this.$log.info('[XosOnboarder] Setup');
    this.webSocket.list()
      .filter((e: IWSEvent) => {
        this.$log.log(e.model, e.msg.changed_fields, e.msg.object);

        if (e.model === 'XOSComponent' && e.msg.object.extra) {
          e.msg.object.extra = JSON.parse(e.msg.object.extra);
          return true;
        }
        return false;
      })
      .subscribe(
        (event) => {
          this.$timeout(() => {
            // NOTE we need the timeout because the event is triggered when the model is created,
            // XOS take around 15s to boot it
            this.loadFile(event.msg.object.extra)
              .then((res) => {
                this.$log.info(`[XosOnboarder] All files loaded for app: ${event.msg.object.name}`);
              });
          }, 20 * 1000);
        }
      );
  }

  // NOTE files needs to be loaded in order, so async loop!
  private loadFile(files: string[], d?: ng.IDeferred<any>): ng.IPromise<string[]> {
    if (!angular.isDefined(d)) {
      d = this.$q.defer();
    }
    const file = files.shift();
    this.$log.info(`[XosOnboarder] Loading file: ${file}`);
    this.$ocLazyLoad.load(file)
      .then((res) => {
        this.$log.info(`[XosOnboarder] Loaded file: `, file);
        if (files.length > 0) {
          return this.loadFile(files, d);
        }
        return d.resolve(file);
      })
      .catch((err) => {
        this.$log.error(`[XosOnboarder] Failed to load file: `, err);
        d.reject(err);
      });

    return d.promise;
  }
}
