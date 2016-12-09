import { SliceResolver, SliceStore } from './services/stores/slice.store';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule}    from '@angular/http';
import {FormsModule}   from '@angular/forms';
import {CookieService} from 'angular2-cookie/services/cookies.service';

import {routing, RootComponent} from './routes';

// registering components
import {XosAppComponent} from './xos-app';
import {LoginComponent} from './views/login/login.component';
import {LogoutComponent} from './components/logout/logout.component';
import { XosCrudComponent } from './views/crud/crud.component';
import { XosTableComponent } from './components/tables/table.component';
import {XosNavComponent} from './components/nav/nav.component';

// registering directives
import {ProtectedDirective} from './directives/protected.directive';

// registering services
import {AuthService} from './services/rest/auth.service';
import {XosHttp} from './services/rest/xoshttp.service';
import {InstanceService} from './services/rest/instance.service';
import {GlobalEvent} from './services/websockets/websocket.global';
import {SliceService} from './services/rest/slices.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule
  ],
  declarations: [
    RootComponent,
    XosAppComponent,
    LoginComponent,
    LogoutComponent,
    XosTableComponent,
    ProtectedDirective,
    XosCrudComponent,
    XosNavComponent
  ],
  // component used in dynamic routes have to be added here
  entryComponents: [
    XosCrudComponent,
    LoginComponent
  ],
  providers: [
    CookieService,
    AuthService,
    XosHttp,
    InstanceService,
    SliceService,
    GlobalEvent,
    SliceResolver,
    SliceStore
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
