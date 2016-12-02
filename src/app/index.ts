import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule}    from '@angular/http';
import {FormsModule}   from '@angular/forms';
import {CookieService} from 'angular2-cookie/services/cookies.service';

import {routing, RootComponent} from './routes';

import {HelloComponent} from './hello';
import {LoginComponent} from './components/login/login.component';
import {ProtectedDirective} from './directives/protected.directive';

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
    ProtectedDirective
  ],
  providers: [CookieService],
  bootstrap: [RootComponent]
})
export class AppModule {}
