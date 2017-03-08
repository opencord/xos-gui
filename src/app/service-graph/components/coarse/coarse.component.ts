import './coarse.component.scss';
import * as d3 from 'd3';
import * as $ from 'jquery';
import {IXosServiceGraphStore} from '../../services/graph.store';
import {IXosServiceGraph, IXosServiceGraphNode, IXosServiceGraphLink} from '../../interfaces';
import {XosServiceGraphConfig as config} from '../../graph.config';
import {IXosDebouncer} from '../../../core/services/helpers/debounce.helper';
import {Subscription} from 'rxjs';

class XosCoarseTenancyGraphCtrl {

  static $inject = [
    '$log',
    'XosServiceGraphStore',
    'XosDebouncer'
  ];

  public graph: IXosServiceGraph;

  private CoarseGraphSubscription: Subscription;
  private svg;
  private forceLayout;
  private linkGroup;
  private nodeGroup;

  // debounced functions
  private renderGraph;

  constructor (
    private $log: ng.ILogService,
    private XosServiceGraphStore: IXosServiceGraphStore,
    private XosDebouncer: IXosDebouncer
  ) {

  }

  $onInit() {
    this.renderGraph = this.XosDebouncer.debounce(this._renderGraph, 500, this);

    this.CoarseGraphSubscription = this.XosServiceGraphStore.getCoarse()
      .subscribe(
        (res: IXosServiceGraph) => {

          // id there are no data, do nothing
          if (!res.nodes || res.nodes.length === 0 || !res.links || res.links.length === 0) {
            return;
          }
          this.$log.debug(`[XosCoarseTenancyGraph] Coarse Event and render`, res);
          this.graph = res;
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
    this.addNodeLinksToForceLayout(this.graph);
    this.renderNodes(this.graph.nodes);
    this.renderLinks(this.graph.links);
  }

  private getSvgDimensions(): {width: number, heigth: number} {
    return {
      width: $('xos-coarse-tenancy-graph svg').width(),
      heigth: $('xos-coarse-tenancy-graph svg').height()
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

  private setupForceLayout() {

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
    this.forceLayout = d3.layout.force()
      .size([svgDim.width, svgDim.heigth])
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

  private getSiblingTextBBox(contex: any /* D3 this */) {
    return d3.select(contex.parentNode).select('text').node().getBBox();
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
        class: 'node',
        transform: `translate(${svgDim.width / 2}, ${svgDim.heigth / 2})`
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
        'text-anchor': 'middle'
      })
      .text(n => n.label);
      // .text(n => `${n.id} - ${n.label}`);

    const existing = node.selectAll('rect');


    // resize node > rect as contained text
    existing.each(function() {
      const textBBox = self.getSiblingTextBBox(this);
      const rect = d3.select(this);
      rect.attr({
        width: textBBox.width + config.node.padding,
        height: textBBox.height + config.node.padding,
        x: textBBox.x - (config.node.padding / 2),
        y: textBBox.y - (config.node.padding / 2)
      });
    });
  }

  private renderLinks(links: IXosServiceGraphLink[]) {
    const link = this.linkGroup
      .selectAll('line')
      .data(links, l => l.id);

    const entering = link.enter();
      // NOTE do we need to have groups?
      // .append('g')
      // .attr({
      //   class: 'link',
      // });

    entering.append('line')
      .attr({
        class: 'link',
        'marker-start': 'url(#arrow)'
      });
  }
}

export const XosCoarseTenancyGraph: angular.IComponentOptions = {
  template: require('./coarse.component.html'),
  controllerAs: 'vm',
  controller: XosCoarseTenancyGraphCtrl,
};
