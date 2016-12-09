import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
@Component({
    selector: 'xos-crud',
    template: require('./crud.html')
})
export class XosCrudComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    console.log('XosCrudComponent');
  }

  ngOnInit() {
    console.log('XosCrudComponent');
    this.route.data.subscribe(
      data => {
        console.log(data);
        // TODO understand how to inject
      }
    );

    // import {this.route.data.}
  }
}
