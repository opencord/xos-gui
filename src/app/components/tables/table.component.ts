import { Observable } from 'rxjs/Rx';
/// <reference path="../../../../typings/index.d.ts"/>
import { IXosTableConfig } from './../../interfaces/xos-components/table.interface';
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'xos-table',
  template: require('./table.component.html'),
})
export class XosTableComponent implements OnInit {

  public _config;
  public _data;

  @Input() config: IXosTableConfig;
  @Input() data: Observable<any>;


  ngOnInit() {

    if (!this.config) {
      throw new Error('[XosTable]: You must pass a configuration');
    }

    this._config = this.config;
    this.data.subscribe(
      (items: any[]) => {
        this._data = items;
      }
    );
  }
}

