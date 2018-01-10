
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

import './graph-legend.component.scss';

import * as d3 from 'd3';
import {IXosServiceGraphIcons} from '../../services/d3-helpers/graph-icons.service';

interface ILegendElement {
  label: string;
  icon: string;
}

class XosServiceGraphLegendCtrl {

  static $inject = [
    '$log',
    '$timeout',
    'XosServiceGraphIcons'
  ];

  private svg;

  private duration: number = 500;

  private legendElements: ILegendElement[] = [
    {
      label: 'Services',
      icon: 'service'
    },
    {
      label: 'ServiceInstances',
      icon: 'serviceinstance'
    },
    {
      label: 'Instances',
      icon: 'instance'
    },
    {
      label: 'Networks',
      icon: 'network'
    }
  ];

  constructor(
    private $log: ng.ILogService,
    private $timeout: ng.ITimeoutService,
    private XosServiceGraphIcons: IXosServiceGraphIcons
  ) {
    this.$log.debug('[XosServiceGraphLegend] Setup');
    $timeout(() => {
      // NOTE we need to wait for the component to be rendered before drawing
      this.setupSvg();
      this.render();
    }, 500);
  }

  private setupSvg() {
    this.svg = d3.select('xos-service-graph-legend svg');
  }

  private render() {
    const step = 50;

    const elements = this.svg.selectAll('g')
      .data(this.legendElements);

    const entering = elements.enter()
      .append('g')
      .attr({
        class: d => `${d.icon}`,
        transform: (d: ILegendElement, i: number) => `translate(50, ${step * (i + 1)})`
      });

    entering
      .append('path')
      .attr({
        d: d => this.XosServiceGraphIcons.get(d.icon).path,
        transform: d => this.XosServiceGraphIcons.get(d.icon).transform,
        class: 'icon',
        opacity: 0
      })
      .transition()
      .duration(this.duration)
      .delay((d, i) => i * (this.duration / 2))
      .attr({
        opacity: 1
      });

    entering
      .append('text')
      .text(d => d.label.toUpperCase())
      .attr({
        'text-anchor': 'left',
        'alignment-baseline': 'bottom',
        'font-size': 15,
        x: 50,
        y: 20,
        opacity: 0
      })
      .transition()
      .duration(this.duration)
      .delay((d, i) => i * (this.duration / 2))
      .attr({
        opacity: 1
      });
  }
}

export const XosServiceGraphLegend: angular.IComponentOptions = {
  template: `
  <h1>Legend</h1>
  <svg></svg>
  `,
  controllerAs: 'vm',
  controller: XosServiceGraphLegendCtrl,
};
