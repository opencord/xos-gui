
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


import {AuthService} from '../../datasources/rest/auth.rest';
import './login.scss';

import {IXosStyleConfig} from '../../../index';

class LoginCtrl {
  static $inject = [
    '$log',
    'AuthService',
    '$state',
    'StyleConfig'
  ];

  public loginStyle: any;
  public img: string;
  public showErrorMsg: boolean = false;
  public errorMsg: string;
  constructor(
    private $log: ng.ILogService,
    private authService: AuthService,
    private $state: angular.ui.IStateService,
    private StyleConfig: IXosStyleConfig
  ) {

    if (this.authService.isAuthenticated()) {
      this.$state.go('xos.dashboard');
    }

    this.img = this.getImg(this.StyleConfig.background);

    this.loginStyle = {
      'background-image': `url('${this.getImg(this.StyleConfig.background)}')`
    };
  }

  public login(username: string, password: string) {
    this.authService.login({
      username: username,
      password: password
    })
      .then(res => {
        this.$state.go('loader');
      })
      .catch(e => {
        this.$log.error(`[XosLogin] Error during login.`, e);
        if (e.error === 'XOSNotAuthenticated') {
          this.errorMsg = `This combination of username/password cannot be authenticated`;
        }
        else {
          this.errorMsg = `Something went wrong, please try again.`;
        }
        this.showErrorMsg = true;
      });
  }

  private getImg(img: string) {
    return require(`../../images/brand/${img}`);
  }
}

export const xosLogin: angular.IComponentOptions = {
  template: require('./login.html'),
  controllerAs: 'vm',
  controller: LoginCtrl
};
