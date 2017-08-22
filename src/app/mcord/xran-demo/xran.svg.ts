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
import * as $ from 'jquery';
import {graphConfig, mcordIcons} from './graph-config';

let graph = {
  nodes: [
    {
      id: 0,
      label: 'eNodeB',
      type: 'enode',
      location: [1,1]
    },
    {
      id: 1,
      label: 'eNodeB',
      type: 'enode',
      location: [2,1]
    },
    {
      id: 2,
      label: 'ue',
      type: 'ue',
      location: [1,2]
    },
    {
      id: 3,
      label: 'ue',
      type: 'ue',
      location: [2,2]
    }
  ],
  links: [ // source and target are the ids
    {source: 2, target: 0},
    {source: 3, target: 0}
  ]
};

export interface IXRanSvg {
  render(svg: any): void;
  moveLink(source: number, originalTarget: number, newTarget: number): void;
  setBarHeight(leftBar: number, rightBar: number): void;
}

export class XRanSvg implements IXRanSvg {

  private svg;
  private svgEl;
  private forceLayout;
  public linkGroup;
  public nodeGroup;

  public setBarHeight(leftBar: number, rightBar: number): void {
    $('#leftBar').height(`${leftBar}%`);
    $('#rightBar').height(`${rightBar}%`);
  }

  public render(svg: any) {
    this.svgEl = svg;
    this.svg = d3.select(`#${svg.attr('id')}`);
    this.calculateNodePosition(svg, graph.nodes);
    this.formatLinks(graph);
    this.setupSvg(svg);
    console.log('render');
    this.renderGraph();
  }

  public moveLink(source: number, originalTarget: number, newTarget: number) {
    _.remove(graph.links, {id: `${source}~${originalTarget}`});
    graph.links.push(this.formatLink(source, newTarget, graph.nodes));
    this.renderGraph();
  }

  private calculateNodePosition(svg, nodes) {

    const width = svg.width();
    const height = svg.height();

    // we have 2 lines and 2 cols
    const hStep = width / 3;
    const vStep = height / 3;

    nodes = _.map(nodes, n => {
      n.x = hStep * n.location[0];
      n.y = vStep * n.location[1];
      n.fixed = true;
    });
  }

  private setupSvg(svg) {
    this.forceLayout = d3.layout.force()
      .size([svg.width(), svg.height()])
      .linkDistance(200)
      .on('tick', this.tickFn);

    this.linkGroup = this.svg.append('g')
      .attr({
        class: 'link-group'
      });

    this.nodeGroup = this.svg.append('g')
      .attr({
        class: 'node-group'
      });
  }

  private renderGraph() {
    this.forceLayout.nodes(graph.nodes);
    this.forceLayout.links(graph.links);
    this.renderNodes(graph.nodes);
    this.renderLinks(graph.links);
    this.forceLayout.start();
  }

  private renderNodes(nodes) {
    const node = this.nodeGroup
      .selectAll('g.node')
      .data(nodes, n => n.id);

    const exiting = node.exit();

    const entering = node.enter()
      .append('g')
      .attr({
        id: n => n.id,
        class: n => `node ${n.type}`
      });

    exiting.remove();

    this.renderUeNodes(entering.filter('.ue'));
    this.renderEnodebNodes(entering.filter('.enode'));
    this.addIconsToNodes(entering);
  }

  private renderLinks(links) {

    const link = this.linkGroup
      .selectAll('line')
      .data(links, l => l.id);

    const entering = link.enter();
    const exiting = link.exit();

    entering.append('line')
      .attr({
        class: l => `link`,
      });

    exiting.remove();
  }

  private renderUeNodes(nodes) {
    nodes.append('circle')
      .attr({
        r: graphConfig.ue.radius
      });
    // NOTE do we want text?
    // nodes.append('text')
    //   .attr({
    //     'text-anchor': 'middle',
    //     'transform': `translate(0, ${graphConfig.ue.radius * 2})`
    //   })
    //   .text(n => n.IMSI);
  }

  private renderEnodebNodes(nodes) {
    nodes.append('rect')
      .attr({
        width: graphConfig.enodeb.width,
        height: graphConfig.enodeb.height,
        rx: graphConfig.enodeb.radius,
        ry: graphConfig.enodeb.radius,
        x: - (graphConfig.enodeb.width / 2),
        y: - (graphConfig.enodeb.height / 2)
      });
    nodes.append('text')
      .attr({
        'text-anchor': 'middle',
        'transform': `translate(25,${graphConfig.textOffset})`
      })
      // .text(n => n.id);
      .text(n => n.label);
  }

  private addIconsToNodes(nodes: any) {
    const ues = nodes.filter(n => n.type === 'ue');
    ues.append('path')
      .attr({
        d: mcordIcons.mobile,
        class: 'icon',
        transform: `translate(-7, -12.5), scale(0.5)`
      });

    const rru = nodes.filter(n => n.type === 'enode');
    rru.append('path')
      .attr({
        d: mcordIcons.rru,
        class: 'icon',
        transform: `translate(-60, -20), scale(0.7)`
      });
  }

  private tickFn = () => {

    this.nodeGroup.selectAll('g.node')
      .attr({
        transform: d => `translate(${d.x}, ${d.y})`
      });

    this.linkGroup.selectAll('line')
      .attr({
        x1: l => l.source.x || 0,
        y1: l => l.source.y || 0,
        x2: l => l.target.x || 0,
        y2: l => l.target.y || 0,
      });
  };

  private formatLinks(graph) {
    graph.links = _.map(graph.links, l => {
      console.log(l.source);
      const src = angular.isNumber(l.source) ? l.source : l.source.id;
      const dst = angular.isNumber(l.target) ? l.target : l.target.id;
      return this.formatLink(src, dst, graph.nodes);
    })
  }

  private formatLink(src: number, dst: number, nodes) {
    const source = _.find(nodes, {id: src});
    const target = _.find(nodes, {id: dst});

    if (!source || !target) {
      console.info(`Cannot find node with id: ${src} or ${dst}`);
    }

    const sourceId = _.findIndex(nodes, {id: src});
    const targetId = _.findIndex(nodes, {id: dst});

    return {
      id: `${source.id}~${target.id}`,
      source: sourceId,
      target: targetId,
    }
  };
}