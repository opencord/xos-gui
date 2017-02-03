import {IXosAppConfig} from '../../../../../index';
export interface  IMcordCookieService {
  getCookieStatus(): ng.IPromise<boolean>;
}

export class MCordCookieService implements IMcordCookieService {
  static $inject = ['$log', '$http', '$q', 'AppConfig'];
  private apiEndpoint: string;
  constructor(
    private $log: ng.ILogService,
    private $http: ng.IHttpService,
    private $q: ng.IQService,
    private AppConfig: IXosAppConfig
  ) {
    this.apiEndpoint = this.AppConfig.apiEndpoint.replace(':3000/api', '');
  }

  public getCookieStatus() {
    const d = this.$q.defer();
    this.$http.get(`${this.apiEndpoint}/cookies/api/v1/statscookie/1/`)
      .then(res => {
        if (res.data[0].up.bps >= 0) {
          // public safety app is active
          // this.xposeEnabled = true;
          d.resolve(true);
        }
        else {
          // this.xposeEnabled = false;
          d.resolve(false);
        }
      })
      .catch(err => {
        d.reject(err);
      });

    return d.promise;
  }
}
