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

import * as d3 from 'd3';
import {IXosSgNode} from '../../interfaces';
import {XosServiceGraphConfig as config} from '../../graph.config';
import {IXosServiceGraphIcons} from '../d3-helpers/graph-icons.service';
import {IXosGraphHelpers} from '../d3-helpers/graph-elements.helpers';

export interface IXosNodeRenderer {
  renderNodes(forceLayout: d3.forceLayout, nodeContainer: d3.Selection, nodes: IXosSgNode[]): void;
}

export class XosNodeRenderer {

  static $inject = [
    'XosServiceGraphIcons',
    'XosGraphHelpers'
  ];

  private drag;

  constructor (
    private XosServiceGraphIcons: IXosServiceGraphIcons,
    private XosGraphHelpers: IXosGraphHelpers
  ) {}

  public renderNodes(forceLayout: any, nodeContainer: any, nodes: IXosSgNode[]): void {
    const self = this;

    this.drag = forceLayout.drag()
      .on('dragstart', (n: IXosSgNode) => {
        n.fixed =  true;
      });

    const node = nodeContainer
      .selectAll('g.node')
      .data(nodes, n => n.id);

    const entering = node.enter()
      .append('g')
      .attr({
        id: n => n.id,
        class: n => `node ${n.type} ${this.XosGraphHelpers.parseElemClasses(n.d3Class)}`,
      });

    node
      .call(this.drag);

    entering
      .append('rect')
      .attr({
        rx: config.node.radius,
        ry: config.node.radius
      });

    entering
      .append('path')
      .attr({
        d: this.XosServiceGraphIcons.get('service').path,
        transform: this.XosServiceGraphIcons.get('service').transform,
        class: 'icon'
      });


    this.positionNodeGroup(node);
    this.handleLabels(entering);
  }

  private positionNodeGroup(nodes: d3.selection) {
    const self = this;
    nodes.each(function (d: IXosSgNode) {
      const node = d3.select(this);
      const rect = node.select('rect');
      const icon = node.select('path');
      const bbox = self.XosGraphHelpers.getSiblingIconBBox(rect.node());

      rect
        .attr({
          width: bbox.width + config.node.padding,
          height: bbox.height + config.node.padding,
          x: - (config.node.padding / 2),
          y: - (config.node.padding / 2),
          transform: `translate(${-bbox.width / 2}, ${-bbox.height / 2})`
        });

      icon
        .attr({
          transform: `translate(${-bbox.width / 2}, ${-bbox.height / 2})`
        });
    });
  }

  private handleLabels(nodes: d3.selection) {
    const self = this;
    // if (this.userConfig.labels) {

      const label = nodes.append('g')
        .attr({
          class: 'label'
        });

      label
        .append('rect')
        .attr({
          class: 'label-wrapper',
        });

      label
        .append('text')
        .text(n => this.getNodeLabel(n))
        .attr({
          'opacity': 0,
          'text-anchor': 'left',
          'alignment-baseline': 'top',
          'transform': function() {
            const icon = self.XosGraphHelpers.getSiblingIconBBox(this.parentNode);
            const text = self.XosGraphHelpers.getBBox(this);
            return `translate(${- (text.width / 2)}, ${icon.height + (config.node.padding * 2)})`;
          }
        })
        .transition()
        .duration(config.duration)
        .attr({
          opacity: 1
        });

      label.each(function() {
        const text = d3.select(this).select('text').node();
        const rect = d3.select(this).select('rect');
        const icon = self.XosGraphHelpers.getSiblingIconBBox(this.parentNode);
        const bbox = self.XosGraphHelpers.getBBox(text);

        rect
          .attr({
            width: bbox.width + config.node.padding,
            height: bbox.height + config.node.padding,
            x: -(config.node.padding / 2),
            y: -(config.node.padding / 2),
            transform: `translate(${- (bbox.width / 2)}, ${icon.height + (config.node.padding * 2) - 20})`
          });
      });
    // }
    // else {
    //   node.selectAll('text')
    //     .transition()
    //     .duration(this.duration)
    //     .attr({
    //       opacity: 0
    //     })
    //     .remove();
    // }
  }

  private getNodeLabel(n: any): string {
    return n.data.name ? n.data.name.toUpperCase() : n.data.id;
  }
}
