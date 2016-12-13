import {AppConfig} from '../config/app.config';
import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;
export interface AuthRequestData {
  username: string;
  password: string;
}

export interface AuthResponseData extends IHttpPromiseCallbackArg<any>{
  data: {
    user: string;
    xoscsrftoken: string;
    xossessionid: string;
  }
}
export class AuthService {


  /** @ngInject */
  constructor(
    private $http: angular.IHttpService,
    private $q: angular.IQService,
    private $cookies: angular.cookies.ICookiesService
  ) {
  }

  public login(data: AuthRequestData): Promise<any> {
    const d = this.$q.defer();
    this.$http.post(`${AppConfig.apiEndpoint}/utility/login/`, data)
      .then((res: AuthResponseData) => {
        this.$cookies.put('xoscsrftoken', res.data.xoscsrftoken);
        this.$cookies.put('xossessionid', res.data.xossessionid);
        this.$cookies.put('xosuser', res.data.user);
        res.data.user = JSON.parse(res.data.user);
        d.resolve(res.data)
      })
      .catch(e => {
        d.reject(e);
      });
    return d.promise;
  }
}
