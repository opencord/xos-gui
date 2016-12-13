import {AuthService} from '../../rest/auth.rest';

class LoginCtrl {
  static $inject = ['AuthService', '$state'];

  /** @ngInject */
  constructor(
    private authService: AuthService,
    private $state: angular.ui.IStateService
  ) {
  }

  public login(username: string, password: string) {
    this.authService.login({
      username: username,
      password: password
    })
      .then(res => {
        console.log(res);
        this.$state.go('app');
      })
      .catch(e => console.error);
  }
}

export const xosLogin: angular.IComponentOptions = {
  template: require('./login.html'),
  controllerAs: 'vm',
  controller: LoginCtrl
};
