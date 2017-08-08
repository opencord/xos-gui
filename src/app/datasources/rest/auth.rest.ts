
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;
import {IXosAppConfig} from '../../../index';
export interface IAuthRequestData {
  username: string;
  password: string;
}

export interface IAuthResponseData extends IHttpPromiseCallbackArg<any> {
  data: {
    sessionid: string;
  };
}

export interface IXosUser {
  id: number;
  email: string;
}

export interface IXosRestError {
  error: string;
  specific_error: string;
  fields: any;
}

export interface IXosAuthService {
  login(data: IAuthRequestData): Promise<any>;
  logout(): Promise<any>;
  getUser(): any; // NOTE how to define return user || false ???
  isAuthenticated(): boolean;
  clearUser(): void;
  handleUnauthenticatedRequest(error: IXosRestError | string): void;
}
export class AuthService {

  constructor(
    private $http: angular.IHttpService,
    private $q: angular.IQService,
    private $cookies: angular.cookies.ICookiesService,
    private AppConfig: IXosAppConfig,
    private $state: angular.ui.IStateService
  ) {
  }

  public login(data: IAuthRequestData): Promise<any> {
    const d = this.$q.defer();
    this.$http.post(`${this.AppConfig.apiEndpoint}/utility/login`, data)
      .then((res: IAuthResponseData) => {
        if (res.status >= 400) {
          return d.reject(res.data);
        }
        this.$cookies.put('sessionid', res.data.sessionid, {path: '/'});
        d.resolve(res.data);
      })
      .catch(e => {
        d.reject(e);
      });
    return d.promise;
  }

  public logout(): Promise<any> {
    const d = this.$q.defer();
    this.$http.post(`${this.AppConfig.apiEndpoint}/utility/logout`, {
      // xoscsrftoken: this.$cookies.get('xoscsrftoken'),
      // sessionid: this.$cookies.get('sessionid')
    })
      .then(() => {
        this.clearUser();
        d.resolve();
      })
      .catch(e => {
        d.reject(e);
      });
    return d.promise;
  }

  public clearUser(): void {
    // this.$cookies.remove('xoscsrftoken', {path: '/'});
    this.$cookies.remove('sessionid', {path: '/'});
    // this.$cookies.remove('xosuser', {path: '/'});
  }

  public getUser(): IXosUser {
    const user = this.$cookies.get('xosuser');
    if (angular.isDefined(user)) {
      return JSON.parse(user);
    }
    return;
  }

  public isAuthenticated(): boolean {
    // const token = this.$cookies.get('xoscsrftoken');
    const session = this.$cookies.get('sessionid');
    return angular.isDefined(session);
  }

  public handleUnauthenticatedRequest(res: IXosRestError | string): void {
    let err;
    if (angular.isString(res)) {
      try {
        err = JSON.parse(res);
      } catch (e) {
        // NOTE if it's not JSON it means that is not the error we're handling here
        return;
      }
    }

    if (angular.isObject(res)) {
      err = res;
    }

    if (err && err.error) {
      switch (err.error) {
        case 'XOSPermissionDenied':
          this.clearUser();
          this.$state.go('login');
          break;
      }
    }
  }
}
