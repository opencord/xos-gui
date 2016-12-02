/// <reference path="../../typings/index.d.ts"/>
import {Component} from '@angular/core';
import {AppConfig} from './config/app.config';
import {StyleConfig} from './config/style.config';

@Component({
  selector: 'fountain-app',
  template: require('./hello.html')
})
export class HelloComponent {
  public hello: string;

  constructor() {
    this.hello = `Hello ${StyleConfig.projectName}!`;
  }
}
