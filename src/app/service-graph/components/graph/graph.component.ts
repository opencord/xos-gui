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
import * as cola from 'webcola';

import {IXosGraphStore} from '../../services/graph.store';
import {Subscription} from 'rxjs/Subscription';
import {XosServiceGraphConfig as config} from '../../graph.config';
import {IXosGraphHelpers} from '../../services/d3-helpers/graph.helpers';
import {IXosServiceGraphIcons} from '../../services/d3-helpers/graph-icons.service';
import {IXosKeyboardShortcutService} from '../../../core/services/keyboard-shortcut';

interface IXosServiceGraphUserConfig {
  labels: boolean;
}

const defaultUserConfig: IXosServiceGraphUserConfig = {
  labels: false
};

class XosServiceGraphCtrl {
  static $inject = [
    '$log',
    '$cookies',
    'XosGraphStore',
    'XosGraphHelpers',
    'XosServiceGraphIcons',
    'XosKeyboardShortcut'
  ];

  public loader: boolean = true;

  private GraphSubscription: Subscription;
  private graph: any; // this is the Graph instance

  private userConfig: IXosServiceGraphUserConfig = this.getUserConfig();
  private duration: number = 750;

  // graph element
  private svg;
  private linkGroup;
  private nodeGroup;
  private forceLayout;

  constructor (
    private $log: ng.ILogService,
    private $cookies: ng.cookies.ICookiesService,
    private XosGraphStore: IXosGraphStore,
    private XosGraphHelpers: IXosGraphHelpers,
    private XosServiceGraphIcons: IXosServiceGraphIcons,
    private XosKeyboardShortcut: IXosKeyboardShortcutService
  ) {
    this.$log.info('[XosServiceGraph] Component setup');



    this.setupSvg();
    this.setupForceLayout();

    // Setup keyboard shortcuts
    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'l',
      cb: () => {
        this.toggleLabels();
      },
      label: 'l',
      description: 'Toggle labels'
    });

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
      console.log('tick')
      this.nodeGroup.selectAll('g.node')
        .attr({
          transform: d => {
            if (d.id === 'service~test') {
              console.log(d);
            }
            return `translate(${d.x}, ${d.y})`;
          }
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
      cola.d3adaptor(d3)
      // d3.layout.force()
      .size([svgDim.width, svgDim.height])
      // .avoidOverlaps(true)
      .linkDistance(config.force.linkDistance)
      .on('tick', tick);
  }

  private getSvgDimensions(): {width: number, height: number} {
    return {
      width: $('xos-service-graph svg').width(),
      height: $('xos-service-graph svg').height()
    };
  }

  private renderGraph(graph) {
    this.userConfig = this.getUserConfig();
    const nodes = this.XosGraphStore.nodesFromGraph(graph);

    this.forceLayout
      .nodes(nodes)
      .links(graph.edges())
      .constraints([])
      .start(10, 0, 0, 0, true);

    // render nodes
    this.renderNodes(nodes);
  }

  private renderNodes(nodes) {
    const self = this;
    const node = this.nodeGroup
      .selectAll('g.node')
      .data(nodes, n => n.id);

    const entering = node.enter()
      .append('g')
      .attr({
        id: n => n.id,
        class: n => `node ${n.type} ${this.XosGraphHelpers.parseElemClasses(n.d3Class)}`,
      });

    node
      .call(this.forceLayout.drag);

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

    if (this.userConfig.labels) {
      node.append('text')
        .attr({
          'opacity': 0,
          'text-anchor': 'left',
          'alignment-baseline': 'central',
          'transform': function() {
            const icon = self.XosGraphHelpers.getSiblingIconBBox(this);
            return `translate(${icon.width + config.node.padding}, ${icon.height / 2})`;
          }
        })
        .text(n => this.getNodeLabel(n))
        .transition()
        .duration(this.duration)
        .attr({
          opacity: 1
        });
    }
    else {
      node.selectAll('text')
        .transition()
        .duration(this.duration)
        .attr({
          opacity: 0
        })
        .remove();
    }

    const existing = node.selectAll('rect');
    existing.each(function() {
      let bbox;
      if (self.userConfig.labels) {
        bbox = self.XosGraphHelpers.getSiblingBBox(this);
      }
      else {
        bbox = self.XosGraphHelpers.getSiblingIconBBox(this);
      }
      const rect = d3.select(this);
      rect
        .transition()
        .duration(self.duration)
        .attr({
        width: bbox.width + config.node.padding,
        height: bbox.height + config.node.padding,
        x: - (config.node.padding / 2),
        y: - (config.node.padding / 2)
      });
    });
  }

  private getNodeLabel(n: any) {
    return n.data.name ? n.data.name.toUpperCase() : n.data.id;
  }

  private toggleLabels() {
    const config = this.getUserConfig();
    if (config.labels) {
      this.$log.debug('[XosServiceGraph] Remove labels');
      config.labels = false;
    }
    else {
      this.$log.debug('[XosServiceGraph] Add labels');
      config.labels = true;
    }
    this.$cookies.put('xos-service-graph-user-config', JSON.stringify(config));
    this.renderGraph(this.graph);
  }

  private getUserConfig(): IXosServiceGraphUserConfig {
    let config = this.$cookies.get('xos-service-graph-user-config');
    if (config.length === 0) {
      this.$cookies.put('xos-service-graph-user-config', JSON.stringify(defaultUserConfig));
      config = this.$cookies.get('xos-service-graph-user-config');
    }
    return JSON.parse(config);
  }
}

export const XosServiceGraph: angular.IComponentOptions = {
  template: require('./graph.component.html'),
  controllerAs: 'vm',
  controller: XosServiceGraphCtrl,
};