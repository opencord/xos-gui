import * as d3 from 'd3';
import * as $ from 'jquery';
import './mcord-topo.scss';
import {IMcordSlicesService} from '../services/mcord-slices.service';
import {IMCordTopoHelpersService} from '../services/mcord-topo.helpers';
import {IMCordSlices, IMCordNode} from '../mocks/slices.mock';
import {MCordTopoConfig, MCordTopoIcons} from '../services/mcord-topo.config';
import {IMCordTopoFormService} from '../services/mcord-topo-form.service';

export interface IMCordD3Node extends IMCordNode {
  x: number;
  y: number;
  fixed?: boolean;
  transform: string;
  sliceId?: string;
}

export interface IMcordD3Link {
  id: number;
  plane: string;
  source: IMCordD3Node;
  target: IMCordD3Node;
}

class MCordTopoCtrl {
  static $inject = ['$log', '$element', '$stateParams', '$location', 'MCordSlices', 'MCordTopoHelpers', 'MCordTopoForm'];

  public expandedSlice: string[];
  private duration: number = 500;
  private svg;
  private nodes: IMCordD3Node[];
  private links: IMcordD3Link[];
  private nodeGroup;
  private linkGroup;
  private dragLine;
  private dragStartNode;
  private dragEndNode;
  // private selectedLink;
  private t = d3.transition().duration(this.duration);

  constructor(
    private $log: ng.ILogService,
    private $element: ng.IRootElementService,
    private $stateParams: ng.ui.IStateParamsService,
    private $location: ng.ILocationService,
    private MCordSlices: IMcordSlicesService,
    private MCordTopoHelpers: IMCordTopoHelpersService,
    private MCordTopoForm: IMCordTopoFormService
  ) {
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
  }

  public returnToGlobal() {
    delete this.expandedSlice;
    this.$location.search({});
    this.showAllSlices();
  }

  private renderSlices(slices) {
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
        this.$log.info(`Drag ends form: ${this.dragStartNode.name} ${this.dragEndNode.id} to ${this.dragEndNode.name} ${this.dragStartNode.id}`);
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

  private addIconsToNodes(nodes) {
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

  private addEventToNodes(nodes) {
    this.addEventToDataPlaneNodes(nodes.filter(n => n.plane === 'data'));
    this.addEventToControlPlaneNodes(nodes.filter(n => n.plane === 'control'));
  }

  private addEventToDataPlaneNodes(nodes) {
    nodes.on('click', (n) => {
      // show slice details
      if (!angular.isDefined(this.expandedSlice) && angular.isDefined(n.sliceId)) {
        this.expandedSlice = [n.sliceId];
        this.viewSliceDetails([n.sliceId]);
        this.$location.search({sliceId: n.sliceId});
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

  private addEventToControlPlaneNodes(nodes) {
    nodes.on('click', (n) => {
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

    // console.log(d3Nodes, d3Nodes.enter(), d3Nodes.exit());

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

    d3Nodes.append('rect')
      .attr({
        class: d => `node ${d.plane} ${d.type} ${d.selected ? 'selected' : ''}`,
        width: MCordTopoConfig.node.width,
        height: MCordTopoConfig.node.height,
        x: -(MCordTopoConfig.node.width / 2),
        y: -(MCordTopoConfig.node.height / 2)
      });

    d3Nodes.append('text')
      .attr({
        'text-anchor': 'left',
        'alignment-baseline': 'middle',
        x: -20
      })
      .text(d => `${d.name}`);
      // .text(d => `${d.id} ${d.name}`);

    this.addIconsToNodes(d3Nodes);
    this.addEventToNodes(d3Nodes);

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
      });;

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
  }

  // handle page resize
  // $rootScope.$on('ui.nav.toggle', () => {
  //   $timeout(() => {
  //   resize();
  // }, 300);
  // });

  // NOTE this may be a global utility
  private debounce(func: any, wait: number, immediate?: boolean) {
    var timeout, self = this;
    return function() {
      var context = self, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
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
}

export const MCordTopo: ng.IComponentOptions = {
  template: require('./mcord-topo.html'),
  controllerAs: 'vm',
  controller: MCordTopoCtrl
};
