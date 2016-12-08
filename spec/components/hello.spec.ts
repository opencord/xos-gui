/// <reference path="../../typings/index.d.ts"/>

import {Router} from '@angular/router';
import {HelloComponent} from '../../src/app/hello';
import {LogoutComponent} from '../../src/app/components/logout/logout.component';
import {StyleConfig} from '../../src/app/config/style.config';
import { Http, BaseRequestOptions } from '@angular/http';
import {CookieService} from 'angular2-cookie/services/cookies.service';
import {XosHttp} from '../../src/app/services/rest/xoshttp.service';
import {InstanceStore} from '../../src/app/services/stores/instance.store';
import {GlobalEvent} from '../../src/app/services/websockets/websocket.global';
import {AuthService} from '../../src/app/services/rest/auth.service';
import {InstanceService} from '../../src/app/services/rest/instance.service';
import {SliceService} from '../../src/app/services/rest/slices.service';
import {TestBed, async} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

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
        InstanceService,
        SliceService
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
