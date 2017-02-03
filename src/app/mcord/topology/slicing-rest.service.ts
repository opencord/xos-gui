import {IXosAppConfig} from '../../../index';
import IQService = angular.IQService;
export interface IMCordSlicingRestService {
  updateUe(ueId: number, profileId: number): ng.IPromise<any>;
  updatePS(): ng.IPromise<any>;
}

const cookieData = {
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
    }
  },
  cookie_descriptor: {
    id: 1,
    key: 'malakas'
  }
};

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

  public updatePS(): ng.IPromise<any> {
    const d = this.$q.defer();
    this.$http.post(`yannis/shapecookie/`, cookieData)
      .then(res => {
        d.resolve(res);
      })
      .catch(err => {
        d.reject(err);
      });
    return d.promise;
  }
}
