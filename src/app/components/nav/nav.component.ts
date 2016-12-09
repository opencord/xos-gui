
import { RoutesService } from './../../services/helpers/routes.service';
import { Routes } from '@angular/router';
import {Component} from '@angular/core';
@Component({
    selector: 'xos-nav',
    template: `
        <ul>
            <li *ngFor="let route of routes">
                <a [href]="route.path">{{route.data.name}}</a>
            </li>
        </ul>
    `
})
export class XosNavComponent {
    public routes: Routes;

    constructor(
        private routesService: RoutesService
    ) {
        this.routes = this.routesService.getRoutes();
        console.log(this.routes);
    }
}
