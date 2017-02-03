import './ps-side-form.scss';
import {IXosFeedback} from '../../../../core/form/form';
import {IXosAppConfig} from '../../../../../index';

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
  static $inject = ['$log', '$http', 'AppConfig'];

  public xposeEnabled: boolean = false;

  constructor(
    private $log: ng.ILogService,
    private $http: ng.IHttpService,
    private AppConfig: IXosAppConfig
  ) {
    this.AppConfig.apiEndpoint = this.AppConfig.apiEndpoint.replace(':3000/api', '');
  }

  $onInit() {
    this.$log.debug(`[MCordPublicSafetyForm] loaded`);
  }

  public toggleXpose() {
    let p;
    if (!this.xposeEnabled) {
      p = this.$http.post(`${this.AppConfig.apiEndpoint}/cookies/api/v1/shapecookie/`, psData);
    }
    else {
      // p = this.$http.delete(`${this.AppConfig.apiEndpoint}/cookies/api/v1/shapecookie/`, psData.cookie_descriptor.id);
      p = this.$http({
        method: 'DELETE',
        url: `${this.AppConfig.apiEndpoint}/cookies/api/v1/shapecookie/`,
        data: {X: psData.cookie_descriptor.id},
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    p.then(() => {
        this.$log.log('success');
        this.xposeEnabled = !this.xposeEnabled;
      })
      .catch(() => {
        this.$log.log('err');
        this.xposeEnabled = !this.xposeEnabled;
      });
  }
}

export const MCordPublicSafetyForm: ng.IComponentOptions = {
  template: require('./ps-side-form.html'),
  controllerAs: 'vm',
  controller: MCordPublicSafetyFormCtrl,
};
