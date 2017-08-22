/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import './xran.scss';
import * as $ from 'jquery';
import {IXRanSvg} from './xran.svg';

class MCordXranController {

  static $inject = [
    'XRanSvg'
  ];

  public config = {
    association: 'signal',
    logic: false
  };

  public gauges = {
    left: 90,
    right: 0
  };

  public resources = {
    left: [100],
    right: [100]
  };

  constructor (
    private XRanSvg: IXRanSvg
  ) {
    const svg = $('svg#xran');
    XRanSvg.render(svg);
  }

  public setAssociation(type: string) {
    this.config.association = type;
    switch (type) {
      case 'signal':
        this.gauges.left = 90;
        this.gauges.right = 0;
        this.XRanSvg.moveLink(3, 1, 0);
        break;
      case 'load':
        this.gauges.left = 61;
        this.gauges.right = 43;
        this.XRanSvg.moveLink(3, 0, 1);
        break;
    }
  }

  public setLogic(active: boolean) {
    this.config.logic = active;
    if (active) {
      this.XRanSvg.setBarHeight(50, 50);
    }
    else {
      this.XRanSvg.setBarHeight(100, 100);
    }
  }
}

export const mcordXran: angular.IComponentOptions = {
  template: require('./xran.component.html'),
  controller: MCordXranController,
  controllerAs: 'vm'
};