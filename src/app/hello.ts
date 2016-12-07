/// <reference path="../../typings/index.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {StyleConfig} from './config/style.config';
import {CoreService} from './services/rest/core.service';
import {InstanceStore} from './services/stores/instance.store';
import {IInstance} from './interfaces/instance.interface';

@Component({
  selector: 'xos-app',
  template: require('./hello.html'),
  providers: [CoreService, InstanceStore],
})
export class HelloComponent implements OnInit {

  // declare class properties
  public hello: string;
  public instances: IInstance[];

  constructor(
    private coreService: CoreService,
    private instanceStore: InstanceStore
  ) {
    this.hello = `Hello ${StyleConfig.projectName}!`;
    this.instances = [];
  }

  ngOnInit() {
    console.log('on init');
    this.instanceStore.query()
      .subscribe(
        instances => {
          console.log(instances);
          this.instances = instances;
        },
        err => {
          console.warn(err);
        }
      );
  }
}
