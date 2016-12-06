/// <reference path="../../../../typings/index.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/rest/auth.service';

@Component({
  selector: 'xos-logout',
  template: `
    <button *ngIf="show" (click)="logout()">Logout</button>
    `,
  providers: [AuthService],
})
export class LogoutComponent implements OnInit {
  public show: boolean = false;
  constructor(private AuthService: AuthService, private router: Router) {
  }

  ngOnInit() {
    if (this.AuthService.isAuthenticated()) {
      this.show = true;
    }
  }

  logout() {
    this.AuthService.logout()
      .subscribe(
        () => {
          this.router.navigate(['/login']);
        }
      );
  }
}

