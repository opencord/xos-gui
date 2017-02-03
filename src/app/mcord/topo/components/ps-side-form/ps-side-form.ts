import './ps-side-form.scss';
import {IXosFeedback} from '../../../../core/form/form';
import {IXosAppConfig} from '../../../../../index';
import {IMcordCookieService} from '../ps-stats/cookie.service';

const psData = {
  settings: {
    down: {
      rate: 400000,
      loss: {
        percentage: 0.0,
        correlation: 0.0
      },
      delay: {
        delay: 15,
        jitter: 0,
        correlation: 0.0
      },
      corruption: {
        percentage: 0.0,
        correlation: 0.0
      },
      reorder: {
        percentage: 0.0,
        correlation: 0.0,
        gap: 0
      }
    },
    up: {
      rate: 200000,
      loss: {
        percentage: 0.0,
        correlation: 0.0
      },
      delay: {
        delay: 10,
        jitter: 0,
        correlation: 0.0
      },
      corruption: {
        percentage: 0.0,
        correlation: 0.0
      },
      reorder: {
        percentage: 0.0,
        correlation: 0.0,
        gap: 0
      }
    },
  },
  cookie_descriptor: {
    id: 1,
    key: 'malakas'
  }
};

class MCordPublicSafetyFormCtrl {
  static $inject = ['$log', '$http', '$rootScope', 'AppConfig', 'MCordCookieService'];

  private apiEndpoint: string;
  public xposeEnabled: boolean = false;

  constructor(
    private $log: ng.ILogService,
    private $http: ng.IHttpService,
    private $rootScope: ng.IScope,
    private AppConfig: IXosAppConfig,
    private MCordCookieService: IMcordCookieService
  ) {
    this.apiEndpoint = this.AppConfig.apiEndpoint.replace(':3000', '').replace('/api', '');
  }

  $onInit() {
    this.$log.debug(`[MCordPublicSafetyForm] loaded`);

    this.MCordCookieService.getCookieStatus()
      .then(res => {
        if (res === true) {
          this.xposeEnabled = true;
        }
        else {
          this.xposeEnabled = false;
        }
      })
      .catch(err => {
        this.$log.error(err);
      });
  }

  public toggleXpose() {

    let p;
    if (!this.xposeEnabled) {
      p = this.$http.post(`${this.apiEndpoint}/cookies/api/v1/shapecookie/`, psData);
    }
    else {
      // p = this.$http.delete(`${this.apiEndpoint}/cookies/api/v1/shapecookie/`, psData.cookie_descriptor.id);
      p = this.$http({
        method: 'DELETE',
        url: `${this.apiEndpoint}/cookies/api/v1/shapecookie/`,
        data: {
          id: psData.cookie_descriptor.id
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    p.then(() => {
        this.$log.log('success');
        this.xposeEnabled = !this.xposeEnabled;
        this.$rootScope.$emit('network.cookies.status', this.xposeEnabled);
      })
      .catch(() => {
        this.$log.log('err');
      });
  }
}

export const MCordPublicSafetyForm: ng.IComponentOptions = {
  template: require('./ps-side-form.html'),
  controllerAs: 'vm',
  controller: MCordPublicSafetyFormCtrl,
};
