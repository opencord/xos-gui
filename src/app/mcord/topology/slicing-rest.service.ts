import {IXosAppConfig} from '../../../index';
import IQService = angular.IQService;
export interface IMCordSlicingRestService {
  updateUe(ueId: number, profileId: number): ng.IPromise<any>;
}

export class MCordSlicingRest implements IMCordSlicingRestService {
  static $inject = ['$http', '$q', 'AppConfig'];

  constructor(
    private $http: ng.IHttpService,
    private $q: IQService,
    private AppConfig: IXosAppConfig
  ) {

  }

  public updateUe(ueId: number, profileId: number): ng.IPromise<any> {
    const d = this.$q.defer();
    this.$http.post(`${this.AppConfig.apiEndpoint}/service/progran/connect`, {imsi: ueId, profile: profileId})
      .then(res => {
        d.resolve(res);
      })
      .catch(err => {
        d.reject(err);
      });

    return d.promise;
  }
}
