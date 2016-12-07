/**
 * Created by teone on 12/5/16.
 */
import {Directive, OnDestroy} from '@angular/core';
import {AuthService} from '../services/rest/auth.service';
import {Router} from '@angular/router';

@Directive({
  selector: '[xosProtected]',
  providers: [AuthService]
})
export class ProtectedDirective implements OnDestroy {

  constructor(private authService: AuthService, private router: Router) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    // TODO listen for logout
  }

  ngOnDestroy() {
    // if (this.sub != null) {
    //   this.sub.unsubscribe();
    // }
  }
}
