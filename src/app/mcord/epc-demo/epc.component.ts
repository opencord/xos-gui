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

import './epc.component.scss';
import {IEpcData, IEpcGraphData, EpcData} from './data';
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as _ from 'lodash';
import {graphConfig} from './graph-config';

class MCordEpcController {

  static $inject = [
    '$log',
    'McordEpcData',
    '$uibModal'
  ];

  public graphData: IEpcGraphData;

  public svg;
  public linkGroup;
  public nodeGroup;
  public forceLayout;
  public defs;
  public uibModal;
  public McordEpcData;

  private dragStartNode;
  private dragEndNode;
  private dragLine;

  private selectedLink;

  constructor(
    $log: ng.ILogService,
    McordEpcData: IEpcData,
    uibModal: any
  ) {
    $log.log('[MCORD-EPC] Component Setup');

    $('body').on('keydown', (e) => {
      console.log(e.key);
      if(e.key === 'c') {
        this.showConfigModal();
      }
      if (e.key === 'Backspace' && this.selectedLink) {
        console.log(this.selectedLink);
        McordEpcData.removeLink(this.selectedLink.model.id);
        this.selectedLink.line.remove();
        delete this.selectedLink;
      }
    });

    this.graphData = McordEpcData.get();
    this.uibModal = uibModal;
    this.McordEpcData = McordEpcData;

    this.svg = d3.select('#mcord-epc');
    this.loadDefs();
    this.calculateNodePosition();
    this.forceLayout = d3.layout.force()
      .size([$('#mcord-epc').width(), $('#mcord-epc').height()])
      .linkDistance(200)
      .nodes(this.graphData.nodes)
      .links(this.graphData.links)
      .on('tick', this.tickFn)
      .start();

    this.dragLine = this.svg.append('svg:path')
      .attr('class', 'dragline hidden')
      .attr('d', 'M0,0L0,0');

    this.linkGroup = this.svg.append('g')
      .attr({
        class: 'link-group'
      });

    this.nodeGroup = this.svg.append('g')
      .attr({
        class: 'node-group'
      });
    this.renderNodes(this.graphData.nodes);
    this.renderLinks(this.graphData.links);
    // DRAG
    const self = this;
    this.svg
      .on('mousemove', function() {
        if (!self.dragStartNode) {
          return;
        }

        self.dragLine.attr('d', 'M' + self.dragStartNode.x + ',' + self.dragStartNode.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
      })
      .on('mouseup', () => {
        if (!self.dragStartNode || !self.dragEndNode) {
          self.resetDragInfo();
          return;
        }

        self.dragLine.classed('hidden', true);

        // save the new link
        McordEpcData.addLink(self.dragStartNode.id, self.dragEndNode.id);

        // reload saved data

        // redraw
        self.resetDragInfo();
        self.restartForceLayout();
      })
  }

  private restartForceLayout() {
    this.graphData = this.McordEpcData.get();
    this.calculateNodePosition();
    this.forceLayout.nodes(this.graphData.nodes);
    this.forceLayout.links(this.graphData.links);
    this.forceLayout.start();
    this.renderNodes(this.graphData.nodes);
    this.renderLinks(this.graphData.links);
  }

  private calculateNodePosition() {

    const step = ($('#mcord-epc').width() - (graphConfig.padding * 2)) / 3;

    const ueCount = _.countBy(this.graphData.nodes, {type: 'ue'}).true;
    const profileCount = _.countBy(this.graphData.nodes, {type: 'profile'}).true;
    const epcCount = _.countBy(this.graphData.nodes, {type: 'epc'}).true;
    const networkCount = _.countBy(this.graphData.nodes, {type: 'network'}).true;

    const ueVstep = ($('#mcord-epc').height() - (graphConfig.padding * 2)) / (ueCount + 1);
    const profileVstep = ($('#mcord-epc').height() - (graphConfig.padding * 2)) / (profileCount + 1);
    const epcVstep = ($('#mcord-epc').height() - (graphConfig.padding * 2)) / (epcCount + 1);
    const networkVstep = ($('#mcord-epc').height() - (graphConfig.padding * 2)) / (networkCount + 1);

    const ueNodes = this.graphData.nodes.filter(n => n.type == 'ue').map((n: any, i) => {
      n.x = graphConfig.padding;
      n.y = graphConfig.padding + ueVstep * (i + 1);
      n.fixed = true;
      return n;
    });

    const profileNodes = this.graphData.nodes.filter(n => n.type == 'profile').map((n: any, i) => {
      n.x = graphConfig.padding + (step * 1);
      n.y = graphConfig.padding + profileVstep * (i + 1);
      n.fixed = true;
      return n;
    });

    const epcNodes = this.graphData.nodes.filter(n => n.type == 'epc').map((n: any, i) => {
      n.x = graphConfig.padding + (step * 2);
      n.y = graphConfig.padding + epcVstep * (i + 1);
      n.fixed = true;
      return n;
    });

    const networkNodes = this.graphData.nodes.filter(n => n.type == 'network').map((n: any, i) => {
      n.x = graphConfig.padding + (step * 3);
      n.y = graphConfig.padding + networkVstep * (i + 1);
      n.fixed = true;
      return n;
    });

    this.graphData.nodes = ueNodes.concat(profileNodes).concat(epcNodes).concat(networkNodes);
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
      })
      // .call(this.forceLayout.drag)
      // .on('mouseup', (d) => {
      //   d.fixed = true;
      // })
      .on('click', (n) => {
        this.openModal(n);
      });

    exiting.remove();

    // dragging lines
    node
      .on('mousedown', (n) => {
        // save a reference to dragStart
        this.dragStartNode = n;
        this.dragLine
          .classed('hidden', false)
          .attr('d', 'M' + this.dragStartNode.x + ',' + this.dragStartNode.y + 'L' + this.dragStartNode.x + ',' + this.dragStartNode.y);
      })
      .on('mouseover', (n) => {
        if (this.dragStartNode) {
          this.dragEndNode = n;
        }
      });

    this.renderUeNodes(entering.filter('.ue'));
    this.renderProfileNodes(entering.filter('.profile'));
    this.renderEpcNodes(entering.filter('.epc'));
    this.renderNetworkNodes(entering.filter('.network'));
  }

  private renderUeNodes(nodes) {
    nodes.append('circle')
      .attr({
        r: graphConfig.ue.radius
      })
    nodes.append('text')
      .attr({
        'text-anchor': 'middle',
        'transform': `translate(0,${graphConfig.textOffset * 1.5})`
      })
      .text(n => n.label);
  }

  private renderProfileNodes(nodes) {
    nodes.append('rect')
      .attr({
        width: graphConfig.profile.width,
        height: graphConfig.profile.height,
        rx: graphConfig.profile.radius,
        ry: graphConfig.profile.radius,
        x: - (graphConfig.profile.width / 2),
        y: - (graphConfig.profile.height / 2)
      });
    nodes.append('text')
      .attr({
        'text-anchor': 'middle',
        'transform': `translate(0,${graphConfig.textOffset})`
      })
      .text(n => n.label);
  }
  private renderEpcNodes(nodes) {
    nodes.append('rect')
      .attr({
        width: graphConfig.epc.width,
        height: graphConfig.epc.height,
        x: - (graphConfig.epc.width / 2),
        y: - (graphConfig.epc.height / 2)
      });
    nodes.append('text')
      .attr({
        'text-anchor': 'middle',
        'transform': `translate(0,${graphConfig.textOffset})`
      })
      .text(n => n.label);
  }
  private renderNetworkNodes(nodes) {
    nodes.append('use')
      .attr({
        class: 'symbol-bg',
        'xlink:href': '#cloud_bg',
        width: graphConfig.internet.width,
        height: graphConfig.internet.height,
        transform: 'translate(' + -(graphConfig.internet.width/2) + ',' + -(graphConfig.internet.height/2) + ')'
      });

    nodes.append('use')
      .attr({
        class: 'symbol',
        'xlink:href': '#cloud',
        width: graphConfig.internet.width,
        height: graphConfig.internet.height,
        transform: 'translate(' + -(graphConfig.internet.width/2) + ',' + -(graphConfig.internet.height/2) + ')'
      });

    nodes.append('text')
      .attr({
        'text-anchor': 'middle',
        'transform': `translate(0,${graphConfig.textOffset})`
      })
      .text(n => n.label);

    const existing = nodes.selectAll('use');

    // resize node > rect as contained text
    // existing.each(function() {
    //   const textBBox = self.XosGraphHelpers.getSiblingTextBBox(this);
    //   const useElem = d3.select(this);
    //   const w = textBBox.width * 2;
    //   const h = w;
    //   const xoff = -(w / 2);
    //   const yoff = -(h / 2);
    //
    //   useElem.attr({
    //     width: w,
    //     height: h,
    //     transform: 'translate(' + xoff + ',' + yoff + ')'
    //   });
    // });
  }
  private renderLinks(links) {
    const self = this;
    const link = this.linkGroup
      .selectAll('line')
      .data(links, l => l.id);

    const entering = link.enter();
    const exiting = link.exit();

    entering.append('line')
      .attr({
        class: l => `link`,
      })
      .on('click', function(l) {
        console.log(l);
        self.clearSelectedLinks();
        d3.select(this).classed('selected', true);
        self.selectedLink = {
          model: l,
          line: this
        };
      });

    exiting.remove();
  }

  private clearSelectedLinks() {
    d3.selectAll('.link').each(function() {
      d3.select(this).classed('selected', false);
    });
  }

  private loadDefs() {
    this.defs = this.svg.append('defs');
    const cloud = {
      vbox: '0 0 303.8 185.8',
      path: `M88.6,44.3c31.7-45.5,102.1-66.7,135-3
             M37.8,142.9c-22.5,3.5-60.3-32.4-16.3-64.2
             M101.8,154.2c-15.6,59.7-121.4,18.8-77.3-13
             M194.6,150c-35.4,51.8-85.7,34.3-98.8-9.5
             M274.4,116.4c29.4,73.2-81.9,80.3-87.7,44.3
             M28.5,89.2C3.7,77.4,55.5,4.8,95.3,36.1
             M216.1,28.9C270.9-13,340.8,91,278.4,131.1`,
      bgpath: `M22,78.3C21.5,55.1,62.3,10.2,95.2,36
             h0c31.9-33.4,88.1-50.5,120.6-7.2l0.3,0.2
             C270.9-13,340.8,91,278.4,131.1v-0.5
             c10.5,59.8-86.4,63.7-91.8,30.1h-0.4
             c-30.2,33.6-67.6,24-84.6-6v-0.4
             c-15.6,59.7-121.4,18.8-77.3-13
             l-0.2-.2c-20.2-7.9-38.6-36.5-2.8-62.3Z`
    };

    this.defs.append('symbol')
      .attr({id: 'cloud', viewBox: cloud.vbox})
      .append('path').attr('d', cloud.path);

    this.defs.append('symbol')
      .attr({id: 'cloud_bg', viewBox: cloud.vbox})
      .append('path').attr('d', cloud.bgpath);
  }

  private openModal(node) {
    const modalInstance = this.uibModal.open({
        templateUrl: 'modelModal.html',
        controller: function($uibModalInstance, McordEpcData, model) {
          this.model = model;
          this.config = {
            exclude: ['x', 'y', 'px', 'py', 'weight', 'id', 'type', 'fixed', 'index'],
            order: McordEpcData.orderByType(model.type),
            fields: McordEpcData.fieldsByType(model.type),
            actions: [
              {
                label: 'Save',
                class: 'success',
                icon: 'check',
                cb: (model) => {
                  console.log('save model', model);
                  McordEpcData.updateNode(model.id, model);
                  $uibModalInstance.close(model);
                }
              },
              {
                label: 'Cancel',
                class: 'danger',
                icon: 'remove',
                cb: (model) => {
                  $uibModalInstance.dismiss('cancel');
                }
              }
            ]
          };
        },
        controllerAs: '$ctrl',
        size: 'sm',
        resolve: {
          model: () => {
            return node;
          }
        }
      });
  }


  // DRAG
  private resetDragInfo() {
    // reset drag nodes
    this.dragStartNode = null;
    this.dragEndNode = null;

    // hide dragLine
    this.dragLine
      .classed('hidden', true);
  };

  // Config Modal
  private showConfigModal(): void {
    console.log('show onos');
    this.uibModal.open({
      templateUrl: 'onosModal.html',
      controller: function($uibModalInstance, McordEpcData, onosCfg) {
        this.onosCfg = onosCfg || {};
        this.config = {
          fields: {
            onosAddress: {
              label: 'ONOS Address',
              type: 'text'
            }
          },
          actions: [
            {
              label: 'Save',
              class: 'success',
              icon: 'check',
              cb: (model) => {
                McordEpcData.setOnosCfg(model);
                $uibModalInstance.close();
              }
            },
            {
              label: 'Cancel',
              class: 'danger',
              icon: 'remove',
              cb: (model) => {
                $uibModalInstance.dismiss('cancel');
              }
            }
          ]
        };
      },
      controllerAs: '$ctrl',
      size: 'sm',
      resolve: {
        onosCfg: () => {
          return this.McordEpcData.getOnosCfg();
        }
      }
    });
  }
}

export const mcordEpc: angular.IComponentOptions = {
  template: require('./epc.component.html'),
  controller: MCordEpcController,
  controllerAs: 'vm'
};
