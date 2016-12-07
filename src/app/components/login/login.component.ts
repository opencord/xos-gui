/// <reference path="../../../../typings/index.d.ts"/>
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {IAuthRequest, IAuthResponse} from '../../interfaces/auth.interface';
import {StyleConfig} from '../../config/style.config';
import {AuthService} from '../../services/rest/auth.service';

import {AppConfig} from '../../config/app.config';

export class Auth {
  constructor(
    public username,
    public password
  ){
  }
}

@Component({
  selector: 'xos-login',
  template: require('./login.html'),
  providers: [AuthService],
})
export class LoginComponent {
  public auth:IAuthRequest;
  public brandName;
  constructor(private AuthService: AuthService, private router:Router) {
    this.auth = new Auth('', '');
    this.brandName = StyleConfig.projectName;
  }

  onSubmit(auth:IAuthRequest){
    this.AuthService.login(auth)
      .subscribe(
        (user:IAuthResponse) => {
          this.router.navigate(['/']);
        }
      )
  }
}

