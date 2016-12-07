import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule}    from '@angular/http';
import {FormsModule}   from '@angular/forms';
import {CookieService} from 'angular2-cookie/services/cookies.service';

import {routing, RootComponent} from './routes';

// registering components
import {HelloComponent} from './hello';
import {LoginComponent} from './views/login/login.component';
import {LogoutComponent} from './components/logout/logout.component';

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
    HelloComponent,
    LoginComponent,
    LogoutComponent,
    ProtectedDirective
  ],
  providers: [
    CookieService,
    AuthService,
    XosHttp,
    InstanceService,
    SliceService,
    GlobalEvent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
