import * as d3 from 'd3';
import * as $ from 'jquery';
import './mcord-topo.scss';
import {IMcordSlicesService} from '../services/mcord-slices.service';
import {IMCordTopoHelpersService, MCordTopoHelpers} from '../services/mcord-topo.helpers';
import {IMCordSlices, IMCordNode} from '../mocks/slices.mock';
import {MCordTopoConfig, MCordTopoIcons} from '../services/mcord-topo.config';
import {IMCordTopoFormService} from '../services/mcord-topo-form.service';
import {IXosKeyboardShortcutService} from '../../../core/services/keyboard-shortcut';

export interface IMCordD3Node extends IMCordNode {
  x: number;
  y: number;
  fixed?: boolean;
  transform: string;
  sliceId?: string;
  path?: string;
}

export interface IMcordD3Link {
  id: number;
  plane: string;
  source: IMCordD3Node;
  target: IMCordD3Node;
  path?: string;
}

class MCordTopoCtrl {
  static $inject = ['$log', '$timeout', '$element', '$stateParams', '$state', '$location', 'MCordSlices', 'MCordTopoHelpers', 'MCordTopoForm', 'XosKeyboardShortcut'];

  public expandedSlice: string[];
  private duration: number = 500;
  private svg;
  private nodes: IMCordD3Node[];
  private links: IMcordD3Link[];
  private nodeGroup;
  private linkGroup;
  private sliceGroup;
  private dragLine;
  private dragStartNode;
  private dragEndNode;

  private highLightPath: string | null; // hosting info to higlight path (based on name, hardcoded for demo purposes)
  // private selectedLink;
  private t = d3.transition().duration(this.duration);

  constructor(
    private $log: ng.ILogService,
    private $timeout: ng.ITimeoutService,
    private $element: ng.IRootElementService,
    private $stateParams: ng.ui.IStateParamsService,
    private $state: ng.ui.IStateService,
    private $location: ng.ILocationService,
    private MCordSlices: IMcordSlicesService,
    private MCordTopoHelpers: IMCordTopoHelpersService,
    private MCordTopoForm: IMCordTopoFormService,
    private XosKeyboardShortcut: IXosKeyboardShortcutService
  ) {

    // adding shortcuts to navigate topology view
    this.XosKeyboardShortcut.registerKeyBinding({
      key: 't',
      description: 'View full topology',
      cb: () => {
        this.$state.go('xos.mcord.topo', {sliceId: ''});
      },
    }, 'view');

    this.XosKeyboardShortcut.registerKeyBinding({
      key: '1',
      description: 'View Public Safety slice',
      cb: () => {
        this.$state.go('xos.mcord.topo', {sliceId: 1});
      },
    }, 'view');

    this.XosKeyboardShortcut.registerKeyBinding({
      key: '3',
      description: 'View RAN slicing',
      cb: () => {
        this.$state.go('xos.mcord.topo', {sliceId: '3,4'});
      },
    }, 'view');

    this.XosKeyboardShortcut.registerKeyBinding({
      key: '2',
      description: 'View Disaggregated MME Slice',
      cb: () => {
        this.$state.go('xos.mcord.topo', {sliceId: 2});
      },
    }, 'view');

    this.XosKeyboardShortcut.registerKeyBinding({
      key: '4',
      description: 'View RAN slicing',
      cb: () => {
        this.$state.go('xos.mcord.topo', {sliceId: '3,4'});
      },
    }, 'view');

    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'r',
      description: 'Highlight Regular LTE path',
      cb: () => {
        if (this.expandedSlice[0] !== '2') {
          return;
        }
        if (this.highLightPath /*&& this.highLightPath === 'Regular LTE'*/) {
          this.clearAllHighlights();
          return;
        }
        this.highlightPath({name: 'Regular LTE'});
        this.highlightNodes({name: 'Regular LTE'});
      },
    }, 'view');

    this.XosKeyboardShortcut.registerKeyBinding({
      key: 'i',
      description: 'Highlight IoT path',
      cb: () => {
        if (this.expandedSlice[0] !== '2') {
          return;
        }
        if (this.highLightPath /*&& this.highLightPath === 'IoT'*/) {
          this.clearAllHighlights();
          return;
        }
        this.highlightPath({name: 'IoT'});
        this.highlightNodes({name: 'IoT'});
      },
    }, 'view');

  }

  $onInit() {
    this.$log.info('[MCordTopo] Start');

    // draw slices
    this.handleSvg(this.$element[0]);
    if (!angular.isDefined(this.$stateParams['sliceId'])) {
      this.showAllSlices();
    }
    else {
      this.$log.debug('[MCordTopo] Displaying slice:', this.$stateParams['sliceId']);
      this.expandedSlice = this.$stateParams['sliceId'].split(',');
      this.viewSliceDetails(this.expandedSlice);
    }

    const efficientResize = this.debounce(this.resize, 250);

    $(window).on('resize', () => {
      efficientResize();
    });

    // NOTE testing link update based on murat response
    // this.$timeout(() => {
    //   this.MCordTopoHelpers.updateLink({
    //     id: 311,
    //     name: 'Murat',
    //     plane: 'data',
    //     sliceId: '4',
    //     type: 'ue',
    //     x: 0,
    //     y: 0,
    //     transform: ''
    //   }, {
    //     id: 410,
    //     name: 'RAN Slice',
    //     plane: 'data',
    //     sliceId: '4',
    //     type: 'profile',
    //     x: 0,
    //     y: 0,
    //     transform: ''
    //   }, this.links);
    //   if (this.expandedSlice) {
    //     this.viewSliceDetails(this.expandedSlice);
    //     return;
    //   }
    //   this.showAllSlices();
    // }, 500);
  }

  public returnToGlobal() {
    delete this.expandedSlice;
    this.$location.search({});
    this.showAllSlices();
  }

  private renderSlices(slices: any) {
    const svgDim = this.getSvgDimensions();
    this.nodes = this.MCordTopoHelpers.getPositionedNodes(slices, svgDim, this.expandedSlice);
    this.links = this.MCordTopoHelpers.getLinks(slices, this.expandedSlice);
    this.draw(this.nodes, this.links);
  }

  private viewSliceDetails(sliceIds: string[]) {
    this.MCordSlices.query()
      .then((slices: IMCordSlices) => {
        // keep only the given slice
        const currentSlice = {};
        sliceIds.forEach(id => {
          currentSlice[id] = slices[id];
        });
        // redraw charts
        this.renderSlices(currentSlice);
      });
  }

  private showAllSlices() {
    this.MCordSlices.query()
      .then((slices: IMCordSlices) => {
        // console.log(slices[2].links, slices[3].links);
        this.renderSlices(slices);
      });
  }

  private handleSvg(el: Element) {

    d3.select(el).select('svg').remove();
    d3.select(el).select('.form-container').remove();

    this.svg = d3.select(el)
      .append('svg')
      .attr('id', 'mcord-topo')
      .style('width', `${el.clientWidth}px`)
      .style('height', `${el.clientHeight}px`);

    this.sliceGroup = this.svg.append('g')
      .attr({
        class: 'slice-group'
      });

    this.linkGroup = this.svg.append('g')
      .attr({
        class: 'link-group'
      });

    this.nodeGroup = this.svg.append('g')
      .attr({
        class: 'node-group'
      });

    // line displayed when dragging nodes
    this.dragLine = this.svg.append('svg:path')
      .attr('class', 'dragline hidden')
      .attr('d', 'M0,0L0,0');
    const self = this;
    this.svg
      .on('mousemove', function() {
        if (!self.dragStartNode) {
          return;
        }

        self.dragLine.attr('d', 'M' + self.dragStartNode.x + ',' + self.dragStartNode.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
      })
      .on('mouseup', () => {
        if (!this.dragStartNode || !this.dragEndNode) {
          this.resetDragInfo();
          return;
        }

        this.$log.info(`Drag ends from: ${this.dragStartNode.name} ${this.dragEndNode.id} to ${this.dragEndNode.name} ${this.dragStartNode.id}`);
        this.dragLine.classed('hidden', true);
        this.MCordTopoHelpers.updateLink(this.dragStartNode, this.dragEndNode, this.links);
        this.resetDragInfo();
        // redraw
        if (this.expandedSlice) {
          this.viewSliceDetails(this.expandedSlice);
          return;
        }
        this.showAllSlices();
      });
  };

  private getSvgDimensions(): {width: number, heigth: number} {
    return {
      width: $('svg#mcord-topo').width(),
      heigth: $('svg#mcord-topo').height()
    };
  }

  private addIconsToNodes(nodes: any) {
    const ues = nodes.filter(n => n.type === 'ue');
    ues.append('path')
      .attr({
        d: MCordTopoIcons.mobile,
        class: 'icon',
        transform: `translate(-40, -12.5), scale(0.5)`
      });

    const profiles = nodes.filter(n => n.type === 'profile');
    profiles.append('path')
      .attr({
        d: MCordTopoIcons.profile,
        class: 'icon',
        transform: `translate(-40, -12.5), scale(0.5)`
      });

    const rru = nodes.filter(n => n.type === 'ran-ru');
    rru.append('path')
      .attr({
        d: MCordTopoIcons.rru,
        class: 'icon',
        transform: `translate(-40, -12.5), scale(0.5)`
      });

    const rcu = nodes.filter(n => n.type === 'ran-cu');
    rcu.append('path')
      .attr({
        d: MCordTopoIcons.rcu,
        class: 'icon',
        transform: `translate(-40, -12.5), scale(0.5)`
      });

    const sgw = nodes.filter(n => n.type === 'sgw');
    sgw.append('path')
      .attr({
        d: MCordTopoIcons.sgw,
        class: 'icon',
        transform: `translate(-40, -12.5), scale(0.5)`
      });

    const pgw = nodes.filter(n => n.type === 'pgw');
    pgw.append('path')
      .attr({
        d: MCordTopoIcons.pgw,
        class: 'icon',
        transform: `translate(-40, -12.5), scale(0.5)`
      });

    const mme = nodes.filter(n => n.type === 'mme');
    mme.append('path')
      .attr({
        d: MCordTopoIcons.mme,
        class: 'icon',
        transform: `translate(-40, -12.5), scale(0.5)`
      });

    const upstream = nodes.filter(n => n.type === 'upstream');
    upstream.append('path')
      .attr({
        d: MCordTopoIcons.upstream,
        class: 'icon',
        transform: `translate(-45, -10), scale(1)`
      });

    const cookie = nodes.filter(n => n.type === 'cookie');
    cookie.append('path')
      .attr({
        d: MCordTopoIcons.publicSafety,
        class: 'icon',
        transform: `translate(-40, -8), scale(2)`
      });
  };

  private addEventToNodes(nodes: any) {
    this.addEventToDataPlaneNodes(nodes.filter(n => n.plane.indexOf('data') > -1));
    this.addEventToControlPlaneNodes(nodes.filter(n => n.plane.indexOf('control') > -1));
  }

  private addEventToDataPlaneNodes(nodes: any) {
    nodes.on('click', (n) => {
      // show slice details
      if (!angular.isDefined(this.expandedSlice) && angular.isDefined(n.sliceId)) {
        this.expandedSlice = [n.sliceId];
        this.viewSliceDetails([n.sliceId]);
        this.$location.search({sliceId: n.sliceId});
      }

      // custom behavior on expanded slice
      if (angular.isDefined(this.expandedSlice)) {
        this.highlightPath(n);
        this.highlightNodes(n);
      }
    });

    // dragging lines
    nodes
      .on('mousedown', (n) => {
        // save a reference to dragStart
        this.dragStartNode = n;
        this.$log.info(`Start drag form: ${n.name} ${n.id}`);
        this.dragLine
          .classed('hidden', false)
          .attr('d', 'M' + this.dragStartNode.x + ',' + this.dragStartNode.y + 'L' + this.dragStartNode.x + ',' + this.dragStartNode.y);
      })
      .on('mouseover', (n) => {
        if (this.dragStartNode) {
          this.dragEndNode = n;
        }
      });
  }

  private addEventToControlPlaneNodes(nodes: any) {
    nodes.on('click', (n) => {
      if (n.name === 'Cookies') {
        return this.MCordTopoForm.showCookieForm(n);
      }
      this.MCordTopoForm.showForm(n);
    });
  }

  private resetDragInfo() {
    // reset drag nodes
    this.dragStartNode = null;
    this.dragEndNode = null;

    // hide dragLine
    this.dragLine
      .classed('hidden', true);
  };

  private draw(nodes: IMCordD3Node[], links: IMcordD3Link[]) {
    this.$log.debug('[MCordTopo] Draw graph');
    const svgDim = this.getSvgDimensions();

    d3.layout.force()
      .nodes(nodes)
      .links(links)
      .charge(-1060)
      .gravity(0.1)
      .linkDistance(200)
      .size([svgDim.width, svgDim.heigth]);

    const d3Nodes = this.nodeGroup.selectAll('.node-container')
      .data(nodes, d => {
        return d.id;
      });

    // remove exiting nodes
    d3Nodes
      .exit()
      .transition(this.t)
      .attr({
        opacity: 0,
        class: 'remove'
      })
      .remove();

    // insert new nodes
    d3Nodes
      .enter()
      .append('g')
      .attr({
        id: d => d.id,
        class: 'node-container',
        transform: d => d.transform,
        opacity: 0
      });

    // update nodes
    d3Nodes
      .transition(this.t)
      .ease('linear')
      .attr({
        transform: d => d.transform,
        opacity: 1
      });

    // TODO investigate why rect are not updated
    this.nodeGroup.selectAll('rect').remove();
    d3Nodes.append('rect')
      .attr({
        id: d => d.id,
        class: d => `node ${d.plane} ${d.type} ${d.selected ? 'selected' : ''}`,
        width: MCordTopoConfig.node.width,
        height: MCordTopoConfig.node.height,
        x: -(MCordTopoConfig.node.width / 2),
        y: -(MCordTopoConfig.node.height / 2),
        rx: d => d.plane.indexOf('logic') > -1 ? '20px' : 0,
        ry: d => d.plane.indexOf('logic') > -1 ? '20px' : 0,
      });

    // TODO investigate why text are not updated
    this.nodeGroup.selectAll('text').remove();
    d3Nodes.append('text')
      .attr({
        'text-anchor': 'left',
        'alignment-baseline': 'middle',
        x: -20
      })
      .text(d => `${d.name}`);
      // .text(d => `${d.id} ${d.name}`);

    // scale node > rect size to fit text content
    d3Nodes
      .each(function () {
        const node = d3.select(this);
        const box = node.node().getBBox();

        node.select('rect').attr({
          width: box.width + 10,
        });
      });

    // TODO investigate why icons are not updated
    this.nodeGroup.selectAll('path').remove();
    this.addIconsToNodes(d3Nodes);
    this.addEventToNodes(d3Nodes);
    this.drawSlicesBox();

    // the value of updated links doesn't get updated but duplicated if I don't remove links upfront
    // investigate why
    // this.linkGroup.selectAll('.link-container').remove();

    const d3Links = this.linkGroup.selectAll('.link-container')
      .data(links, d => d.id);

    // remove exiting links
    d3Links
      .exit()
      .transition(this.t)
      .attr({
        opacity: 0
      })
      .remove();

    d3Links
      .enter()
      .insert('g')
      .attr({
        class: 'link-container',
        opacity: 0,
        id: d => d.id
      })
      .insert('line')
      .attr('class', d => `link ${d.plane} ${d.source.id}->${d.target.id}`)
      .on('click', function(link: any) {
        // selectedLink = link;

        // deselect all other d3Links
        // d3.selectAll('.link').classed('selected', false);

        // d3.select(this).classed('selected', true);
      });

    d3Links
      .transition(this.t)
      .attr({
        opacity: 1
      });

    this.svg.selectAll('.link')
      .transition(this.t)
      .ease('linear')
      .attr({
        x1: d => d.source.x,
        y1: d => d.source.y,
        x2: d => d.target.x,
        y2: d => d.target.y
      });

    // highlight path
    this.highlightPath({name: this.highLightPath});
    this.highlightNodes({name: this.highLightPath});
  }

  private clearLinkHighlights(jqueryContext: string) {
    $('.link', jqueryContext).removeClass('highlight');
    $('.link', jqueryContext).removeClass('iot');
    $('.link', jqueryContext).removeClass('regular');
  };

  private clearNodekHighlights(jqueryContext: string) {
    $('.node', jqueryContext).removeClass('highlight');
    $('.node', jqueryContext).removeClass('iot');
    $('.node', jqueryContext).removeClass('regular');
  };

  private clearAllHighlights() {
    delete this.highLightPath;
    const self = this;
    this.linkGroup.selectAll('.link-container').each(function(l: IMcordD3Link) {
      self.clearLinkHighlights(this);
    });

    this.nodeGroup.selectAll('.node-container').each(function(l: IMCordD3Node) {
      self.clearNodekHighlights(this);
    });
  }

  private highlightNodes(node: IMCordD3Node | any) {
    const self = this;
    console.log(node.name);
    if (node.name !== 'IoT' && node.name !== 'Regular LTE') {
      return;
    }
    console.log(node.name);
    this.nodeGroup.selectAll('.node-container').each(function(n: IMCordD3Node) {

      // self.clearLinkHighlights(this);

      if (n.path === 'both' || self.highLightPath === n.path) {
        console.log('aaaa');
        $('.node', this).addClass('highlight');
        $('.node', this).addClass(node.name.toLowerCase());
      }
    });
  }

  private highlightPath(node: IMCordD3Node | any) {
    const self = this;
    if (node.name !== 'IoT' && node.name !== 'Regular LTE') {
      return;
    }
    this.highLightPath = node.name;

    this.linkGroup.selectAll('.link-container').each(function(l: IMcordD3Link) {

      self.clearLinkHighlights(this);

      if (l.path === 'both' || self.highLightPath === l.path) {
        $('.link', this).addClass('highlight');
        $('.link', this).addClass(node.name.toLowerCase());
      }
    });

    // remove highligts
    // this.$timeout(() => {
    //   this.clearAllHighlights();
    // }, 1100);
  };

  // NOTE this may be a global utility
  private debounce(func: any, wait: number, immediate?: boolean) {
    var timeout, self = this;
    return function() {
      var context = self, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      };
    };
  };

  private resize() {
    this.$log.info('[MCordTopo] Resize');
    this.handleSvg(this.$element[0]);
    if (this.expandedSlice) {
      this.viewSliceDetails(this.expandedSlice);
      return;
    }
    this.showAllSlices();
  };

  private drawSlicesBox() {
    this.sliceGroup.selectAll('rect').remove();

    if (this.expandedSlice && this.expandedSlice.length > 0) {
      return;
    }

    const svgSize = this.getSvgDimensions();

    const sliceBoxXPos = 0;

    for (let i = 1; i < 5; i++) {
      const sliceBoxVPos = this.MCordTopoHelpers.getSliceVPos(i, 4, svgSize.heigth);
      const sliceContainer = this.sliceGroup.append('g')
        .attr({
          transform: `translate(${sliceBoxXPos}, ${sliceBoxVPos})`
        });

      sliceContainer.append('rect')
        .attr({
          class: d => `slice-group`,
          width: () => {
            // if is a normal slice is last - internet and cookie
            let elPos = MCordTopoConfig.nodeOrder.length - 2;
            if (i === 1) {
              // else just - internet
              elPos = MCordTopoConfig.nodeOrder.length - 1;
            }
            return (svgSize.width / MCordTopoConfig.nodeOrder.length) * elPos;
          },
          height: () => {
            if (i === 2) {
              return (MCordTopoConfig.node.height * 3) + (MCordTopoConfig.margin / 2);
            }
            return MCordTopoConfig.node.height + (MCordTopoConfig.margin / 2);
          },
          y: () => {
            if (i === 2) {
              return -(((MCordTopoConfig.node.height * 3) + (MCordTopoConfig.margin / 2)) / 2);
            }
            return -((MCordTopoConfig.node.height + (MCordTopoConfig.margin / 2)) / 2);
          },
        });
      sliceContainer
        .append('text')
        .text(`Slice ${i}`)
        .attr({
          y: () => {
            let y;
            if (i === 2) {
              y = -(((MCordTopoConfig.node.height * 3) + (MCordTopoConfig.margin / 2)) / 2);
            }
            else {
              y = -((MCordTopoConfig.node.height + (MCordTopoConfig.margin / 2)) / 2);
            }
            return y - 5;
          },
        });
    }
  };
}

export const MCordTopo: ng.IComponentOptions = {
  template: require('./mcord-topo.html'),
  controllerAs: 'vm',
  controller: MCordTopoCtrl
};
