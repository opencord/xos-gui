import {AuthService} from '../../datasources/rest/auth.rest';
import {StyleConfig} from '../../config/style.config';
import './login.scss';

class LoginCtrl {
  static $inject = ['AuthService', '$state'];
  public loginStyle: any;
  public img: string;
  /** @ngInject */
  constructor(
    private authService: AuthService,
    private $state: angular.ui.IStateService
  ) {
    this.img = this.getImg(StyleConfig.background);

    this.loginStyle = {
      'background-image': `url('${this.getImg(StyleConfig.background)}')`
    };
  }

  public login(username: string, password: string) {
    console.log(username, password);
    this.authService.login({
      username: username,
      password: password
    })
      .then(res => {
        this.$state.go('xos.dashboard');
      })
      .catch(e => console.error);
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
