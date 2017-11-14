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

import './graph.component.scss';

import * as d3 from 'd3';
import * as $ from 'jquery';

import {IXosGraphStore} from '../../services/graph.store';
import {Subscription} from 'rxjs/Subscription';
import {XosServiceGraphConfig as config} from '../../graph.config';
import {IXosGraphHelpers} from '../../services/d3-helpers/graph-elements.helpers';
import {IXosServiceGraphIcons} from '../../services/d3-helpers/graph-icons.service';
import {IXosNodePositioner} from '../../services/node-positioner.service';
import {IXosNodeRenderer} from '../../services/renderer/node.renderer';
import {IXosSgNode} from '../../interfaces';

class XosServiceGraphCtrl {
  static $inject = [
    '$log',
    'XosGraphStore',
    'XosGraphHelpers',
    'XosServiceGraphIcons',
    'XosNodePositioner',
    'XosNodeRenderer'
  ];

  public loader: boolean = true;

  private GraphSubscription: Subscription;
  private graph: any; // this is the Graph instance

  private duration: number = 750;

  // graph element
  private svg;
  private linkGroup;
  private nodeGroup;
  private forceLayout;

  // d3 elements
  private drag: any;

  constructor (
    private $log: ng.ILogService,
    private XosGraphStore: IXosGraphStore,
    private XosGraphHelpers: IXosGraphHelpers,
    private XosServiceGraphIcons: IXosServiceGraphIcons,
    private XosNodePositioner: IXosNodePositioner,
    private XosNodeRenderer: IXosNodeRenderer
  ) {
    this.$log.info('[XosServiceGraph] Component setup');

    this.setupSvg();
    this.setupForceLayout();

    this.GraphSubscription = this.XosGraphStore.get()
      .subscribe(
        graph => {
          this.graph = graph;
          if (this.graph.nodes().length > 0) {
            this.loader = false;
            this.renderGraph(this.graph);
          }
        },
        error => {
          this.$log.error('[XosServiceGraph] XosGraphStore observable error: ', error);
        }
      );
  }

  $onDestroy() {
    this.GraphSubscription.unsubscribe();
  }

  private setupSvg() {
    this.svg = d3.select('xos-service-graph svg');

    this.linkGroup = this.svg.append('g')
      .attr({
        class: 'link-group'
      });

    this.nodeGroup = this.svg.append('g')
      .attr({
        class: 'node-group'
      });
  }

  private setupForceLayout() {
    this.$log.debug(`[XosServiceGraph] Setup Force Layout`);
    const tick = () => {
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

    const svgDim = this.getSvgDimensions();
    this.forceLayout =
      d3.layout.force()
      .size([svgDim.width, svgDim.height])
      .linkDistance(config.force.linkDistance)
      .on('tick', tick);
  }

  private getSvgDimensions(): {width: number, height: number} {
    return {
      width: $('xos-service-graph svg').width(),
      height: $('xos-service-graph svg').height()
    };
  }

  private renderGraph(graph: any) {
    let nodes: IXosSgNode[] = this.XosGraphStore.nodesFromGraph(graph);
    let links = this.XosGraphStore.linksFromGraph(graph);

    this.XosNodePositioner.positionNodes(this.getSvgDimensions(), nodes)
      .then((nodes: IXosSgNode[]) => {

        this.forceLayout
          .nodes(nodes)
          .links(links)
          .linkDistance(config.force.linkDistance)
          .charge(config.force.charge)
          .gravity(config.force.gravity)
          .start();

        // render nodes
        this.XosNodeRenderer.renderNodes(this.forceLayout, this.nodeGroup, nodes);
        this.renderLinks(links);
      });
  }

  private renderLinks(links: any[]) {
    const link = this.linkGroup
      .selectAll('line')
      .data(links, l => l.id);

    const entering = link.enter();

    entering.append('line')
      .attr({
        id: n => n.id,
      });
  }

}

export const XosServiceGraph: angular.IComponentOptions = {
  template: require('./graph.component.html'),
  controllerAs: 'vm',
  controller: XosServiceGraphCtrl,
};
