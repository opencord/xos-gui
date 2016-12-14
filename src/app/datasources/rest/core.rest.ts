import {AppConfig} from '../../config/app.config';
export class CoreRest {

  /** @ngInject */
  constructor(
    private $http: angular.IHttpService,
    private $q: angular.IQService
  ) {
  }

  public query(): Promise<any> {
    const d = this.$q.defer();
    this.$http.get(`${AppConfig.apiEndpoint}/core/`)
      .then(res => d.resolve(res.data))
      .catch(d.reject);
    return d.promise;
  }
}
