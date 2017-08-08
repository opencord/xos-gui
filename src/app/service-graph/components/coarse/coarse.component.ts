
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


import './coarse.component.scss';
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as _ from 'lodash';
import {IXosServiceGraphStore} from '../../services/service-graph.store';
import {IXosServiceGraph, IXosServiceGraphNode, IXosServiceGraphLink} from '../../interfaces';
import {XosServiceGraphConfig as config} from '../../graph.config';
import {IXosDebouncer} from '../../../core/services/helpers/debounce.helper';
import {Subscription} from 'rxjs';
import {IXosGraphHelpers} from '../../services/d3-helpers/graph.helpers';
import {IXosServiceGraphReducer, IXosServiceGraphExtender} from '../../services/graph.extender';

class XosCoarseTenancyGraphCtrl {

  static $inject = [
    '$log',
    'XosServiceGraphStore',
    'XosDebouncer',
    'XosGraphHelpers',
    'XosServiceGraphExtender'
  ];

  public graph: IXosServiceGraph;

  private CoarseGraphSubscription: Subscription;
  private svg;
  private forceLayout;
  private linkGroup;
  private nodeGroup;
  private textSize = 20;
  private textOffset = this.textSize / 4;

  // debounced functions
  private renderGraph;

  constructor (
    private $log: ng.ILogService,
    private XosServiceGraphStore: IXosServiceGraphStore,
    private XosDebouncer: IXosDebouncer,
    private XosGraphHelpers: IXosGraphHelpers,
    private XosServiceGraphExtender: IXosServiceGraphExtender
  ) {

  }

  $onInit() {
    this.renderGraph = this.XosDebouncer.debounce(this._renderGraph, 500, this);

    this.CoarseGraphSubscription = this.XosServiceGraphStore.getCoarse()
      .subscribe(
        (graph: IXosServiceGraph) => {
          this.$log.debug(`[XosCoarseTenancyGraph] Coarse Event and render`, graph);

          // id there are no data, do nothing
          if (graph.nodes.length === 0) {
            return;
          }
          this.graph = graph;

          _.forEach(this.XosServiceGraphExtender.getCoarse(), (r: IXosServiceGraphReducer) => {
            graph = r.reducer(graph);
          });
          this.renderGraph();
        },
        err => {
          this.$log.error(`[XosCoarseTenancyGraph] Coarse Event error`, err);
        });

    this.handleSvg();
    this.setupForceLayout();

    $(window).on('resize', () => {
      this.setupForceLayout();
      this.renderGraph();
    });
  }

  $onDestroy() {
    this.CoarseGraphSubscription.unsubscribe();
  }

  private _renderGraph() {
    if (!angular.isDefined(this.graph) || !angular.isDefined(this.graph.nodes) || !angular.isDefined(this.graph.links)) {
      return;
    }
    this.addNodeLinksToForceLayout(this.graph);
    this.renderNodes(this.graph.nodes);
    this.renderLinks(this.graph.links);
  }

  private getSvgDimensions(): {width: number, height: number} {
    return {
      width: $('xos-coarse-tenancy-graph svg').width() || 0,
      height: $('xos-coarse-tenancy-graph svg').height() || 0
    };
  }

  private handleSvg() {
    this.svg = d3.select('svg');

    this.svg.append('svg:defs')
      .selectAll('marker')
      .data(config.markers)
      .enter()
      .append('svg:marker')
      .attr('id', d => d.id)
      .attr('viewBox', d => d.viewBox)
      .attr('refX', d => d.refX)
      .attr('refY', d => d.refY)
      .attr('markerWidth', d => d.width)
      .attr('markerHeight', d => d.height)
      .attr('orient', 'auto')
      .attr('class', d => `${d.id}-marker`)
      .append('svg:path')
      .attr('d', d => d.path);

    this.linkGroup = this.svg.append('g')
      .attr({
        class: 'link-group'
      });

    this.nodeGroup = this.svg.append('g')
      .attr({
        class: 'node-group'
      });
  }

  private collide(n: any) {
    const svgDim = this.getSvgDimensions();
    const x = Math.max(n.width / 2, Math.min(n.x, svgDim.width - (n.width / 2)));
    const y = Math.max(n.height / 2, Math.min(n.y, svgDim.height - (n.height / 2)));
    return `${x}, ${y}`;
  }

  private setupForceLayout() {

    let svgDim = this.getSvgDimensions();

    const tick = () => {

      this.nodeGroup.selectAll('g.node')
        .attr({
          transform: d => `translate(${this.collide(d)})`
        });

      this.linkGroup.selectAll('line')
        .attr({
          x1: l => l.source.x || 0,
          y1: l => l.source.y || 0,
          x2: l => l.target.x || 0,
          y2: l => l.target.y || 0,
        });
    };

    this.forceLayout = d3.layout.force()
      .size([svgDim.width, svgDim.height])
      .linkDistance(config.force.linkDistance)
      .charge(config.force.charge)
      .gravity(config.force.gravity)
      .on('tick', tick);
  }

  private addNodeLinksToForceLayout(data: IXosServiceGraph) {
    this.forceLayout
      .nodes(data.nodes)
      .links(data.links)
      .start();
  }

  private renderNodes(nodes: IXosServiceGraphNode[]) {
    const self = this;
    const node = this.nodeGroup
      .selectAll('g.node')
      .data(nodes, n => n.id);

    const svgDim = this.getSvgDimensions();
    const entering = node.enter()
      .append('g')
      .attr({
        id: n => n.id,
        class: n => `node ${this.XosGraphHelpers.parseElemClasses(n.d3Class)}`,
        transform: `translate(${svgDim.width / 2}, ${svgDim.height / 2})`
      })
      .call(this.forceLayout.drag)
      .on('mousedown', () => {
        d3.event.stopPropagation();
      })
      .on('mouseup', (d) => {
        d.fixed = true;
      });

    entering.append('rect')
      .attr({
        rx: config.node.radius,
        ry: config.node.radius
      });

    entering.append('text')
      .attr({
        'text-anchor': 'middle',
        'transform': `translate(0,${this.textOffset})`
      })
      .text(n => n.label);
      // .text(n => `${n.id} - ${n.label}`);

    const existing = node.selectAll('rect');

    // resize node > rect as contained text

    existing.each(function(d: any) {
      const textBBox = self.XosGraphHelpers.getSiblingTextBBox(this);
      const rect = d3.select(this);
      rect.attr({
        width: textBBox.width + config.node.padding,
        height: textBBox.height + config.node.padding,
        x: textBBox.x - (config.node.padding / 2),
        y: (textBBox.y + self.textOffset) - (config.node.padding / 2)
      });
      d.width = textBBox.width + config.node.padding;
      d.height = textBBox.height + config.node.padding;
    });

  }

  private renderLinks(links: IXosServiceGraphLink[]) {
    const link = this.linkGroup
      .selectAll('line')
      .data(links, l => l.id);

    const entering = link.enter();

    // TODO read classes from graph links

    entering.append('line')
      .attr({
        id: n => n.id,
        class: l => `link ${this.XosGraphHelpers.parseElemClasses(l.d3Class)}`,
        'marker-start': 'url(#arrow)'
      });
  }
}

export const XosCoarseTenancyGraph: angular.IComponentOptions = {
  template: require('./coarse.component.html'),
  controllerAs: 'vm',
  controller: XosCoarseTenancyGraphCtrl,
};
