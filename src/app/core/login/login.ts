import {AuthService} from '../../datasources/rest/auth.rest';
import './login.scss';

import {IXosStyleConfig} from '../../../index';
import {IXosModelDiscovererService} from '../../datasources/helpers/model-discoverer.service';

class LoginCtrl {
  static $inject = ['$log', 'AuthService', '$state', 'XosModelDiscoverer', 'StyleConfig'];
  public loginStyle: any;
  public img: string;
  public showErrorMsg: boolean = false;
  public errorMsg: string;
  constructor(
    private $log: ng.ILogService,
    private authService: AuthService,
    private $state: angular.ui.IStateService,
    private XosModelDiscoverer: IXosModelDiscovererService,
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
        this.showErrorMsg = false;
        // after login set up models
        return this.XosModelDiscoverer.discover();
      })
      .then(() => {
        this.$state.go('xos.dashboard');
      })
      .catch(e => {
        this.$log.error(`[XosLogin] Error during login.`);
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
