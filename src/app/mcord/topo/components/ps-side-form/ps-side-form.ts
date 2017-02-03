import './ps-side-form.scss';

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
  static $inject = ['$log', '$http'];

  public xposeEnabled: boolean = false;

  constructor(
    private $log: ng.ILogService,
    private $http: ng.IHttpService
  ) {

  }

  $onInit() {
    this.$log.debug(`[MCordPublicSafetyForm] loaded`);
  }

  public toggleXpose() {
    let p;
    if (!this.xposeEnabled) {
      p = this.$http.post(`publicsafety/shapecookie`, psData);
    }
    else {
      p = this.$http.delete(`publicsafety/shapecookie/${psData.cookie_descriptor.id}`);
    }
    p.then(() => {
        console.log('success');
        this.xposeEnabled = !this.xposeEnabled;
      })
      .catch(() => {
        console.log('err');
        this.xposeEnabled = !this.xposeEnabled;
      });
  }
}

export const MCordPublicSafetyForm: ng.IComponentOptions = {
  template: require('./ps-side-form.html'),
  controllerAs: 'vm',
  controller: MCordPublicSafetyFormCtrl,
};
