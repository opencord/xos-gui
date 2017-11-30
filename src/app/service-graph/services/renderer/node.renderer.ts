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
import * as _ from 'lodash';
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
      })
      .call(this.drag);

    this.renderServiceNodes(entering.filter('.service'));
    this.renderServiceInstanceNodes(entering.filter('.serviceinstance'));

    node.exit().remove();
  }

  private renderServiceNodes(nodes: d3.selection) {

    nodes
      .append('rect')
      .attr({
        rx: config.node.radius,
        ry: config.node.radius
      });

    nodes
      .append('path')
      .attr({
        d: this.XosServiceGraphIcons.get('service').path,
        transform: this.XosServiceGraphIcons.get('service').transform,
        class: 'icon'
      });

    this.positionServiceNodeGroup(nodes);
    this.handleLabels(nodes);
  }

  private renderServiceInstanceNodes(nodes: d3.selection) {
    nodes.append('rect')
      .attr({
        width: 40,
        height: 40,
        x: -20,
        y: -20,
        transform: `rotate(45)`
      });

    nodes
      .append('path')
      .attr({
        d: this.XosServiceGraphIcons.get('serviceinstance').path,
        class: 'icon'
      });

    this.positionServiceInstanceNodeGroup(nodes);
    this.handleLabels(nodes); // eventually improve, padding top is wrong
  }

  private positionServiceNodeGroup(nodes: d3.selection) {
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

  private positionServiceInstanceNodeGroup(nodes: d3.selection) {
    const self = this;
    nodes.each(function (d: IXosSgNode) {
      const node = d3.select(this);
      const rect = node.select('rect');
      const icon = node.select('path');
      const bbox = self.XosGraphHelpers.getSiblingIconBBox(rect.node());
      const size = _.max([bbox.width, bbox.height]); // NOTE we need it to be a square
      rect
        .attr({
          width: size + config.node.padding,
          height: size + config.node.padding,
          x: - (config.node.padding / 2),
          y: - (config.node.padding / 2),
          transform: `rotate(45), translate(${-bbox.width / 2}, ${-bbox.height / 2})`
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

      // group to contain label text and wrapper
      const label = nodes.append('g')
        .attr({
          class: 'label'
        });

      // setting up the wrapper
      label
        .append('rect')
        .attr({
          class: 'label-wrapper',
          rx: config.node.radius,
          ry: config.node.radius
        });

      // adding text
      label
        .append('text')
        .text(n => this.getNodeLabel(n))
        .attr({
          'opacity': 0,
          'text-anchor': 'left',
          'alignment-baseline': 'bottom',
          'font-size': config.node.text,
          y: config.node.text * 0.78
        })
        .transition()
        .duration(config.duration)
        .attr({
          opacity: 1
        });

      // resize and position label
      label.each(function() {
        const text = d3.select(this).select('text').node();
        const rect = d3.select(this).select('rect');
        const iconRect = d3.select(this.parentNode).select('rect').node();
        const icon = self.XosGraphHelpers.getBBox(iconRect);
        const bbox = self.XosGraphHelpers.getBBox(text);

        // scale the rectangle around the label to fit the text
        rect
          .attr({
            width: bbox.width + config.node.padding,
            height: config.node.text - 2 + config.node.padding,
            x: -(config.node.padding / 2),
            y: -(config.node.padding / 2),
          });

        // translate the lable group to the correct position
        d3.select(this)
          .attr({
            transform: function() {
              const label = self.XosGraphHelpers.getBBox(this);
              const x = - (label.width - config.node.padding) / 2;
              const y = (icon.height / 2) + config.node.padding;
              return `translate(${x}, ${y})`;
            }
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
    // return n.data.name ? n.data.name.toUpperCase() + ` - ${n.data.id}` : n.data.id;
  }
}
