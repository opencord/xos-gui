import {IWSEventService, IWSEvent} from '../../datasources/websocket/global';
import {IXosModelStoreService} from '../../datasources/stores/model.store';
import * as _ from 'lodash';
import {Observable} from 'rxjs';

export interface IXosOnboarder {

}

export class XosOnboarder implements IXosOnboarder {
  static $inject = ['$timeout', '$log', '$q', 'WebSocket', '$ocLazyLoad', 'XosModelStore'];

  constructor(
    private $timeout: ng.ITimeoutService,
    private $log: ng.ILogService,
    private $q: ng.IQService,
    private webSocket: IWSEventService,
    private $ocLazyLoad: any, // TODO add definition
    private XosModelStore: IXosModelStoreService
  ) {
    this.$log.info('[XosOnboarder] Setup');

    // Listen for new app (we need a pause to allow the container to boot)
    this.webSocket.list()
      .filter((e: IWSEvent) => {
        if (e.model === 'XOSComponent' && e.msg.object.extra) {
          e.msg.object.extra = JSON.parse(e.msg.object.extra);
          return true;
        }
        return false;
      })
      .subscribe(
        (event) => {
          this.$timeout(() => {
            this.$log.info(`[XosOnboarder] Loading files for app: ${event.msg.object.name}`);
            // NOTE we need the timeout because the event is triggered when the model is created,
            // XOS take around 15s to boot it
            this.loadFile(event.msg.object.extra)
              .then((res) => {
                this.$log.info(`[XosOnboarder] All files loaded for app: ${event.msg.object.name}`);
              });
          }, 20 * 1000);
        }
      );

    // Load previously onboarded app (containers are already running, so we don't need to wait)
    let componentsLoaded = false;
    const ComponentObservable: Observable<any> = this.XosModelStore.query('XOSComponent');
    ComponentObservable.subscribe(
        (component) => {
          if (componentsLoaded) {
            // if we have already loaded the component present when we loaded the page
            // do nothing, we are intercepting WS to give the container time to boot
            return;
          }

          _.forEach(component, (c) => {
            if (c.extra) {
              this.$log.info(`[XosOnboarder] Loading files for app: ${c.name}`);
              let extra;
              try {
                extra = JSON.parse(c.extra);
              } catch (e) {
                extra = c.extra;
              }
              this.loadFile(extra)
                .then((res) => {
                  this.$log.info(`[XosOnboarder] All files loaded for app: ${c.name}`);
                });
            }
          });
          componentsLoaded = true;
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
