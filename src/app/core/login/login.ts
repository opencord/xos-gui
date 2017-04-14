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
        this.errorMsg = `Something went wrong, please try again.`;
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
