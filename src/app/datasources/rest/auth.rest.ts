import {AppConfig} from '../../config/app.config';
import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;
export interface IAuthRequestData {
  username: string;
  password: string;
}

export interface IAuthResponseData extends IHttpPromiseCallbackArg<any> {
  data: {
    user: string;
    xoscsrftoken: string;
    xossessionid: string;
  };
}

export interface IXosAuthService {
  login(data: IAuthRequestData): Promise<any>;
  logout(): Promise<any>;
}
export class AuthService {

  constructor(
    private $http: angular.IHttpService,
    private $q: angular.IQService,
    private $cookies: angular.cookies.ICookiesService
  ) {
  }

  public login(data: IAuthRequestData): Promise<any> {
    const d = this.$q.defer();
    this.$http.post(`${AppConfig.apiEndpoint}/utility/login/`, data)
      .then((res: IAuthResponseData) => {
        this.$cookies.put('xoscsrftoken', res.data.xoscsrftoken);
        this.$cookies.put('xossessionid', res.data.xossessionid);
        this.$cookies.put('xosuser', res.data.user);
        res.data.user = JSON.parse(res.data.user);
        d.resolve(res.data);
      })
      .catch(e => {
        d.reject(e);
      });
    return d.promise;
  }

  public logout(): Promise<any> {
    const d = this.$q.defer();
    this.$http.post(`${AppConfig.apiEndpoint}/utility/login/`, {
      xoscsrftoken: this.$cookies.get('xoscsrftoken'),
      xossessionid: this.$cookies.get('xossessionid')
    })
      .then(() => {
        this.$cookies.remove('xoscsrftoken');
        this.$cookies.remove('xossessionid');
        this.$cookies.remove('xosuser');
        d.resolve();
      })
      .catch(e => {
        d.reject(e);
      });
    return d.promise;
  }
}
