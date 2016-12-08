import { Observable } from 'rxjs/Rx';
import { IXosTableConfig } from './interfaces/xos-components/table.interface';
/// <reference path="../../typings/index.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {StyleConfig} from './config/style.config';
import {ISlice} from './interfaces/models.interface';
import {SliceStore} from './services/stores/slice.store';

@Component({
  selector: 'xos-app',
  template: require('./hello.html'),
  providers: [SliceStore],
})
export class HelloComponent implements OnInit {

  // declare class properties
  public hello: string;
  public slices: ISlice[];
  public data: Observable<any>;

  public cfg: IXosTableConfig = {
    columns: [
      {
        label: 'Name',
        prop: 'name'
      },
      {
        label: 'Default Isolation',
        prop: 'default_isolation'
      }
    ]
  };

  constructor(
    private sliceStore: SliceStore
  ) {
    this.hello = `Hello ${StyleConfig.projectName}!`;
    this.slices = [];
  }

  ngOnInit() {
    console.log('on init');
    this.data = this.sliceStore.query();
  }
}
