/// <reference path="../../typings/index.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {StyleConfig} from './config/style.config';
import {CoreService} from './services/rest/core.service';

@Component({
  selector: 'xos-app',
  template: require('./hello.html'),
  providers: [CoreService],
})
export class HelloComponent implements OnInit {

  // declare class properties
  public hello: string;
  public endpoints: any[];

  constructor(private coreService: CoreService) {
    this.hello = `Hello ${StyleConfig.projectName}!`;
    this.endpoints = [];
  }

  ngOnInit() {
    console.log('on init');
    this.coreService.getCoreEndpoints()
      .subscribe(
        endpoints => {
          this.endpoints = endpoints;
        },
        err => console.log
      );
  }
}
