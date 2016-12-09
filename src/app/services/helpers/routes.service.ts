import { XosCrudComponent } from './../../views/crud/crud.component';
import { CoreService } from './../rest/core.service';
import { Routes, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class RoutesService {
    constructor(
      private router: Router,
      private coreService: CoreService,
    ) {
      // this.coreService.getCoreEndpoints()
      // .subscribe(
      //   (endpoints) => {
      //     _.forEach(Object.keys(endpoints), (e: string) => {
      //       this.router.config.push({
      //         path: `core/${e}`,
      //         data: {
      //           name: e
      //         },
      //         component: XosCrudComponent
      //       });
      //     });
      //     this.router.resetConfig(this.router.config);
      //     console.log('added core routes');
      //     console.log(this.getRoutes());
      //   }
      // );
    }

    public getRoutes = (): Routes => this.router.config;
}
