/// <reference path="../../typings/index.d.ts"/>

import {HelloComponent} from './hello';
import {LogoutComponent} from './components/logout/logout.component';
import {TestBed, async} from '@angular/core/testing';
import {StyleConfig} from './config/style.config';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import {CookieService} from 'angular2-cookie/services/cookies.service';
import {Router} from '@angular/router';
import {XosHttp} from './services/rest/xoshttp.service';
import {InstanceStore} from './services/stores/instance.store';
import {GlobalEvent} from './services/websockets/websocket.global';
import {AuthService} from './services/rest/auth.service';
import {InstanceService} from './services/rest/instance.service';

describe('hello component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelloComponent,
        LogoutComponent
      ],
      providers: [
        {
          provide: Http,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions,
        CookieService,
        {
          provide: Router,
          useClass: class { navigate = jasmine.createSpy('navigate'); }
        },
        XosHttp,
        InstanceStore,
        GlobalEvent,
        AuthService,
        InstanceService
      ]
    });
    TestBed.compileComponents();
  }));

  it('should render hello world', () => {
    const fixture = TestBed.createComponent(HelloComponent);
    fixture.detectChanges();
    const hello = fixture.nativeElement;
    expect(hello.querySelector('h1').textContent).toBe(`Hello ${StyleConfig.projectName}!`);
  });
});
