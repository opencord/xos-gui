import {AuthService} from '../../datasources/rest/auth.rest';

class LoginCtrl {
  static $inject = ['AuthService', '$state'];

  /** @ngInject */
  constructor(
    private authService: AuthService,
    private $state: angular.ui.IStateService
  ) {
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
}

export const xosLogin: angular.IComponentOptions = {
  template: require('./login.html'),
  controllerAs: 'vm',
  controller: LoginCtrl
};
