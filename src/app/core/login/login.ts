import {AuthService} from '../../datasources/rest/auth.rest';
import {StyleConfig} from '../../config/style.config';
import './login.scss';
import {IXosModelSetupService} from '../services/helpers/model-setup.helpers';

class LoginCtrl {
  static $inject = ['AuthService', '$state', 'ModelSetup'];
  public loginStyle: any;
  public img: string;
  /** @ngInject */
  constructor(
    private authService: AuthService,
    private $state: angular.ui.IStateService,
    private ModelSetup: IXosModelSetupService
  ) {

    if (this.authService.isAuthenticated()) {
      this.$state.go('xos.dashboard');
    }

    this.img = this.getImg(StyleConfig.background);

    this.loginStyle = {
      'background-image': `url('${this.getImg(StyleConfig.background)}')`
    };
  }

  public login(username: string, password: string) {
    this.authService.login({
      username: username,
      password: password
    })
      .then(res => {
        // after login set up models
        return this.ModelSetup.setup();
      })
      .then(() => {
        this.$state.go('xos.dashboard');
      })
      .catch(e => {
        console.error(e);
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
