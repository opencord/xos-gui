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

  constructor(
    private sliceStore: SliceStore
  ) {
    this.hello = `Hello ${StyleConfig.projectName}!`;
    this.slices = [];
  }

  ngOnInit() {
    console.log('on init');
    this.sliceStore.query()
      .subscribe(
        (slices: ISlice[]) => {
          console.log(slices);
          this.slices = slices;
        },
        err => {
          console.warn(err);
        }
      );
  }
}
