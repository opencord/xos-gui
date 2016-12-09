import { SliceResolver, SliceStore } from './services/stores/slice.store';
import { RoutesService } from './services/helpers/routes.service';
import { XosCrudComponent } from './views/crud/crud.component';

import { CoreService } from './services/rest/core.service';
import { XosAppComponent } from './xos-app';
/// <reference path="../../typings/index.d.ts"/>

import { Component, OnInit } from '@angular/core';
import {RouterModule, Routes, Router} from '@angular/router';
import {LoginComponent} from './views/login/login.component';

@Component({
  selector: 'xos-root',
  template: `
    <xos-nav></xos-nav>
    <router-outlet></router-outlet>
  `,
  providers: [CoreService, RoutesService, CoreService]
})
export class RootComponent implements OnInit {
  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    this.router.config.push(
      {
        path: 'login',
        component: LoginComponent,
        data: {
          name: 'Login'
        }
      },
      {
        path: 'core/slices',
        component: XosCrudComponent,
        data: {
          name: 'Slices',
          tableCfg: {
            columns: [
              {
                label: 'Name',
                prop: 'name'
              },
              {
                label: 'Default Isolation',
                prop: 'default_isolation'
              }
            ]
          },
          observable: 'SliceStore'
        },
        resolve: {
          obervable: SliceResolver
        }
      }
    );

    this.router.resetConfig(this.router.config);
  }
}

export const routes: Routes = [
  {
      path: '',
      component: XosAppComponent,
      data: {
        name: 'Home'
      }
  }
];

export const routing = RouterModule.forRoot(routes);
