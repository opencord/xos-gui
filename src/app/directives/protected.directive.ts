/**
 * Created by teone on 12/5/16.
 */
import {Directive, OnDestroy} from '@angular/core';
import {AuthService} from '../services/rest/auth.service';
import {Router} from '@angular/router';

@Directive({
  selector: '[xos-protected]',
  providers: [AuthService]
})
export class ProtectedDirective implements OnDestroy {
  private sub:any = null;

  constructor(private authService:AuthService, private router:Router) {
    console.log('protected directive');
    if (!authService.isAuthenticated()) {
      console.log('redirect');
      this.router.navigate(['/login']);
    }

    // this.sub = this.authService.subscribe((val) => {
    //   if (!val.authenticated) {
    //     this.router.navigate(['LoggedoutPage']); // tells them they've been logged out (somehow)
    //   }
    // });
  }

  ngOnDestroy() {
    // if (this.sub != null) {
    //   this.sub.unsubscribe();
    // }
  }
}
