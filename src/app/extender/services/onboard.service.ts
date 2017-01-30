import {IWSEventService} from '../../datasources/websocket/global';

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
      .filter((e) => {
        this.$log.log(e);
        // TODO define event format
        return e.msg['files'].length > 0;
      })
      .subscribe(
        (event) => {
          this.loadFile(event.msg['files'])
            .then((res) => {
              this.$log.info(`[XosOnboarder] All files loaded for app: ${event.msg['app']}`);
            });
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
