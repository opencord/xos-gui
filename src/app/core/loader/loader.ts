import {IXosModelDiscovererService} from '../../datasources/helpers/model-discoverer.service';
import {IXosOnboarder} from '../../extender/services/onboard.service';
import {IXosAuthService} from '../../datasources/rest/auth.rest';
class LoaderCtrl {
  static $inject = [
    '$log',
    '$rootScope',
    '$location',
    '$timeout',
    '$state',
    'AuthService',
    'XosConfig',
    'XosModelDiscoverer',
    `XosOnboarder`
  ];

  constructor (
    private $log: ng.ILogService,
    private $rootScope: ng.IScope,
    private $location: ng.ILocationService,
    private $timeout: ng.ITimeoutService,
    private $state: ng.ui.IStateService,
    private XosAuthService: IXosAuthService,
    private XosConfig: any,
    private XosModelDiscoverer: IXosModelDiscovererService,
    private XosOnboarder: IXosOnboarder
  ) {

    this.run();
  }

  public run() {
    if (this.XosModelDiscoverer.areModelsLoaded()) {
      this.moveOnTo(this.XosConfig.lastVisitedUrl);
    }
    else if (!this.XosAuthService.isAuthenticated()) {
      this.$state.go('xos.login');
    }
    else {
      this.XosModelDiscoverer.discover()
      // NOTE loading XOS Models
        .then((res) => {
          if (res) {
            this.$log.info('[XosLoader] All models loaded');
          }
          else {
            this.$log.info('[XosLoader] Failed to load some models, moving on.');
          }
          return this.XosOnboarder.onboard();
        })
        // NOTE loading GUI Extensions
        .then(() => {
          this.moveOnTo(this.XosConfig.lastVisitedUrl);
        })
        .finally(() => {
          // NOTE it is in a timeout as the searchService is loaded after that
          this.$timeout(() => {
            this.$rootScope.$emit('xos.core.modelSetup');
          }, 500);
        });
    }
  }

  public moveOnTo(url: string) {
    this.$log.info(`[XosLoader] Redirecting to: ${url}`);
    switch (url) {
      case '':
      case '/':
      case '/loader':
      case '/login':
        this.$location.path('/dashboard');
        break;
      default:
        this.$timeout(() => {
          this.$location.path(url);
        }, 500);
        break;
    }
  }
}

export const xosLoader: angular.IComponentOptions = {
  template: `
    <div class="loader"></div>
  `,
  controllerAs: 'vm',
  controller: LoaderCtrl
};
