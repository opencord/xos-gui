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
import {graphConfig, mcordIcons} from './graph-config';


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

  private dragStartNode;
  private dragEndNode;
  private dragLine;

  private drag;
  private enableNodeDrag;

  private selectedLink;

  private isModalOpen = false;

  constructor(
    private $log: ng.ILogService,
    private McordEpcData: IEpcData,
    private uibModal: any
  ) {
    $log.log('[MCORD-EPC] Component Setup');

    $('body').on('keydown', (e) => {
      const t = e.target.tagName.toLowerCase();
      if (t === 'input' || t === 'textarea') {
        return;
      }
      if(e.key === 'c') {
        this.showConfigModal();
      }

      if(e.key === 'e') {
        this.showEpcModal();
      }

      if (e.key === 'Backspace' && this.selectedLink) {
        McordEpcData.removeLink(this.selectedLink.model);
        this.selectedLink.line.remove();
        delete this.selectedLink;
      }
      if (e.key === 'Alt') {
        this.enableNodeDrag = true;
      }
    });

    $('body').on('keyup', (e) => {
      if (e.key === 'Alt') {
        this.enableNodeDrag = false;
      }
    });

    this.setupSvg();
    this.setupData();

    window.setInterval(() => {
      if (this.isModalOpen) {
        return;
      }
      this.setupData()
    }, this.McordEpcData.getOnosCfg().refresRate * 1000);
  }

  private setupSvg() {
    this.svg = d3.select('#mcord-epc');
    this.loadDefs();
    this.forceLayout = d3.layout.force()
      .size([$('#mcord-epc').width(), $('#mcord-epc').height()])
      .linkDistance(200)
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
        self.McordEpcData.addLink(self.dragStartNode, self.dragEndNode);

        // reload saved data

        // redraw
        self.resetDragInfo();
        // self.restartForceLayout();
      })
  }

  private setupData() {
    this.McordEpcData.loadData()
      .then((res: IEpcGraphData) => {
        this.restartForceLayout(res);
      })
      .catch(err => {
        console.error(err);
      })
  }

  private restartForceLayout(data: IEpcGraphData) {
    this.graphData = data;
    this.calculateNodePosition();
    this.forceLayout.nodes(this.graphData.nodes);
    this.forceLayout.links(this.graphData.links);
    this.renderNodes(this.graphData.nodes);
    this.renderLinks(this.graphData.links);
    this.forceLayout.start();
  }

  private calculateNodePosition() {
    const step = ($('#mcord-epc').width() - (graphConfig.padding * 2)) / 4;

    const ueCount = _.countBy(this.graphData.nodes, {type: 'imsi'}).true;
    const profileCount = _.countBy(this.graphData.nodes, {type: 'profile'}).true;
    const enodeCount = _.countBy(this.graphData.nodes, {type: 'enodeb'}).true;
    const epcCount = _.countBy(this.graphData.nodes, {type: 'epc'}).true;
    const networkCount = _.countBy(this.graphData.nodes, {type: 'network'}).true;

    const ueVstep = ($('#mcord-epc').height() - (graphConfig.padding * 2)) / (ueCount + 1);
    const profileVstep = ($('#mcord-epc').height() - (graphConfig.padding * 2)) / (profileCount + 1);
    const enodeVstep = ($('#mcord-epc').height() - (graphConfig.padding * 2)) / (enodeCount + 1);
    const epcVstep = ($('#mcord-epc').height() - (graphConfig.padding * 2)) / (epcCount + 1);
    const networkVstep = ($('#mcord-epc').height() - (graphConfig.padding * 2)) / (networkCount + 1);

    let uePos = 0;
    let profilePos = 0;
    let enodebPos = 0;
    let epcPos = 0;
    let networkPos = 0;

    function positionUEs(n: any) {
      uePos = uePos + 1;
      n.x = graphConfig.padding;
      n.y = graphConfig.padding + ueVstep * uePos;
      n.fixed = true;
      return n;
    }

    function positionProfiles(n: any) {
      profilePos = profilePos + 1;
      n.x = graphConfig.padding + (step * 2);
      n.y = graphConfig.padding + profileVstep * profilePos;
      n.fixed = true;
      return n;
    }

    function positionEnodes(n: any) {
      enodebPos = enodebPos + 1;
      n.x = graphConfig.padding + (step * 1) + (step/2);
      n.y = graphConfig.padding + (profileVstep * enodebPos) + (profileVstep/2);
      n.fixed = true;
      return n;
    }

    function positionNetworks(n: any) {
      networkPos = networkPos + 1;
      n.x = graphConfig.padding + (step * 4);
      n.y = graphConfig.padding + networkVstep * networkPos;
      n.fixed = true;
      return n;
    }

    const epcNodes = this.graphData.nodes.filter(n => n.type == 'epc').map((n: any, i) => {
      n.x = graphConfig.padding + (step * 3);
      n.y = graphConfig.padding + epcVstep * (i + 1);
      n.fixed = true;
      return n;
    });

    this.graphData.nodes = _.map(this.graphData.nodes, n => {

      const manualPos = this.McordEpcData.getNodePos(n.id);
      console.log(manualPos);
      // if the node has been dragged somewhere,
      // use that pos
      if (manualPos && manualPos.x && manualPos.y) {
        n.fixed = true;
        n.x = manualPos.x;
        n.y = manualPos.y;
      }
      else {
        switch (n.type) {
          case 'imsi':
            n = positionUEs(n);
            break;
          case 'profile':
            n = positionProfiles(n);
            break;
          case 'enodeb':
            n = positionEnodes(n);
            break;
          case 'network':
            n = positionNetworks(n);
            break;
        }
      }

      return n;
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

  private addIconsToNodes(nodes: any) {
    const ues = nodes.filter(n => n.type === 'imsi');
    ues.append('path')
      .attr({
        d: mcordIcons.mobile,
        class: 'icon',
        transform: `translate(-7, -12.5), scale(0.5)`
      });

    const profiles = nodes.filter(n => n.type === 'profile');
    profiles.append('path')
      .attr({
        d: mcordIcons.profile,
        class: 'icon',
        transform: `translate(-50, -20), scale(0.7)`
      });

    const rru = nodes.filter(n => n.type === 'enodeb');
    rru.append('path')
      .attr({
        d: mcordIcons.rru,
        class: 'icon',
        transform: `translate(-60, -20), scale(0.7)`
      });
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
      })
      .call(this.customDrag())
      .on('click', (n) => {
        if(!this.drag) {
          this.openModal(n);
        }
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

    this.renderUeNodes(entering.filter('.imsi'));
    this.renderProfileNodes(entering.filter('.profile'));
    this.renderEnodebNodes(entering.filter('.enodeb'));
    this.renderEpcNodes(entering.filter('.epc'));
    this.renderNetworkNodes(entering.filter('.network'));

    this.addIconsToNodes(entering);
  }

  private renderUeNodes(nodes) {
    nodes.append('circle')
      .attr({
        r: graphConfig.ue.radius
      });
    nodes.append('text')
      .attr({
        'text-anchor': 'middle',
        'transform': `translate(0, ${graphConfig.ue.radius * 2})`
      })
      .text(n => n.IMSI);
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
        'transform': `translate(20,${graphConfig.textOffset})`
      })
      // .text(n => n.id);
      .text(n => n.Name.replace('Default', ''));
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
      .text(n => n.Description);
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
    this.isModalOpen = true;
    const modalInstance = this.uibModal.open({
        templateUrl: 'modelModal.html',
        controller: function($uibModalInstance, McordEpcData, model) {
          this.model = model;
          this.config = {
            exclude: McordEpcData.excludedFields,
            order: McordEpcData.orderByType(model.type),
            fields: McordEpcData.fieldsByType(model.type),
            actions: [
              {
                label: 'Save',
                class: 'success',
                icon: 'check',
                cb: (model) => {
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

    modalInstance.result
      .then(() => {
        this.isModalOpen = false;
      })
      .catch(() => {
        this.isModalOpen = false;
      });
  }


  // DRAG link
  private resetDragInfo() {
    // reset drag nodes
    this.dragStartNode = null;
    this.dragEndNode = null;

    // hide dragLine
    this.dragLine
      .classed('hidden', true);
  };

  // drag Node

  private customDrag() {

    const dragStart = (d, i) => {
      if(this.enableNodeDrag) {
        this.forceLayout.stop();
      }
      window.setTimeout(() => {
        this.drag = true;
      }, 100);
    };
    const dragMove = (d, i) => {
      if(this.enableNodeDrag) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        this.tickFn();
      }
    };
    const dragEnd = (d, i) => {
      window.setTimeout(() => {
        this.drag = false;
      }, 100);
      d.fixed = true;
      if(this.enableNodeDrag) {
        this.tickFn();
        this.McordEpcData.storeNodePos(d.id, d.x, d.y);
        this.forceLayout.resume();
      }
    };

    return d3.behavior.drag()
      .on("dragstart", dragStart)
      .on("drag", dragMove)
      .on("dragend", dragEnd);
  }


  // Config Modal
  private showConfigModal(): void {
    this.isModalOpen = true;
    const modalInstance = this.uibModal.open({
      templateUrl: 'onosModal.html',
      controller: function($uibModalInstance, McordEpcData, onosCfg) {
        this.onosCfg = onosCfg || {};
        this.config = {
          fields: {
            onosAddress: {
              label: 'ONOS Address',
              type: 'text'
            },
            refresRate: {
              label: 'Refres Rate (s)',
              type: 'number'
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
    modalInstance.result
      .then(() => {
        this.isModalOpen = false;
      })
      .catch(() => {
        this.isModalOpen = false;
      });
  }

  private showEpcModal(): void {
    this.isModalOpen = true;
    const modalInstance = this.uibModal.open({
      templateUrl: 'epcModal.html',
      controller: function($uibModalInstance, McordEpcData) {
        this.epcCfg = McordEpcData.getEpcCfg() || '';
        this.save = (cfg) => {
          McordEpcData.setEpcCfg(cfg);
          $uibModalInstance.close();
        };
      },
      controllerAs: '$ctrl',
      size: 'lg',
    });
    modalInstance.result
      .then(() => {
        this.isModalOpen = false;
      })
      .catch(() => {
        this.isModalOpen = false;
      });
  }
}

export const mcordEpc: angular.IComponentOptions = {
  template: require('./epc.component.html'),
  controller: MCordEpcController,
  controllerAs: 'vm'
};
