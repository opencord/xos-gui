import {IXosServiceGraphStore} from '../../services/graph.store';
import './fine-grained.component.scss';
import * as d3 from 'd3';
import * as $ from 'jquery';
import {Subscription} from 'rxjs';
import {XosServiceGraphConfig as config} from '../../graph.config';
import {IXosDebouncer} from '../../../core/services/helpers/debounce.helper';
import {IXosServiceGraph, IXosServiceGraphLink, IXosServiceGraphNode} from '../../interfaces';

class XosFineGrainedTenancyGraphCtrl {
  static $inject = [
    '$log',
    'XosServiceGraphStore',
    'XosDebouncer'
  ];

  public graph: IXosServiceGraph;

  private GraphSubscription: Subscription;
  private svg;
  private forceLayout;
  private linkGroup;
  private nodeGroup;

  // debounced functions
  private renderGraph;

  constructor(
    private $log: ng.ILogService,
    private XosServiceGraphStore: IXosServiceGraphStore,
    private XosDebouncer: IXosDebouncer
  ) {

    this.handleSvg();
    this.setupForceLayout();
    this.renderGraph = this.XosDebouncer.debounce(this._renderGraph, 500, this);

    $(window).on('resize', () => {
      this.setupForceLayout();
      this.renderGraph();
    });

    this.GraphSubscription = this.XosServiceGraphStore.get()
      .subscribe(
        (graph) => {

          if (!graph.nodes || graph.nodes.length === 0 || !graph.links || graph.links.length === 0) {
            return;
          }

          this.$log.log(`[XosFineGrainedTenancyGraphCtrl] Data received: `, graph);
          this.graph = graph;
          this.renderGraph();
        },
        (err) => {
          this.$log.error(`[XosFineGrainedTenancyGraphCtrl] Error: `, err);
        }
      );
  }

  $onDestroy() {
    this.GraphSubscription.unsubscribe();
    this.XosServiceGraphStore.dispose();
  }

  private _renderGraph() {
    this.addNodeLinksToForceLayout(this.graph);
    this.renderNodes(this.graph.nodes);
    this.renderLinks(this.graph.links);
  }

  private getSvgDimensions(): {width: number, heigth: number} {
    return {
      width: $('xos-fine-grained-tenancy-graph svg').width(),
      heigth: $('xos-fine-grained-tenancy-graph svg').height()
    };
  }

  private handleSvg() {
    this.svg = d3.select('svg');

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

  private renderServiceNodes(nodes) {
    const self = this;
    nodes.append('rect')
    .attr({
      rx: config.node.radius,
      ry: config.node.radius
    });

    nodes.append('text')
      .attr({
        'text-anchor': 'middle'
      })
      .text(n => n.label);
    // .text(n => `${n.id} - ${n.label}`);

    const existing = nodes.selectAll('rect');

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

  private renderTenantNodes(nodes: any) {
    const self = this;
    nodes.append('rect');

    nodes.append('text')
      .attr({
        'text-anchor': 'middle'
      })
      .text(n => n.label);

    const existing = nodes.selectAll('rect');

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

  private renderNetworkNodes(nodes: any) {
    const self = this;
    nodes.append('circle');

    nodes.append('text')
      .attr({
        'text-anchor': 'middle'
      })
      .text(n => n.label);

    const existing = nodes.selectAll('circle');

    // resize node > rect as contained text
    existing.each(function() {
      const textBBox = self.getSiblingTextBBox(this);
      const rect = d3.select(this);
      rect.attr({
        r: (textBBox.width / 2) + config.node.padding,
        cy: textBBox.width / 4
      });
    });
  }

  private renderSubscriberNodes(nodes: any) {
    const self = this;
    nodes.append('rect');

    nodes.append('text')
      .attr({
        'text-anchor': 'middle'
      })
      .text(n => n.label);

    const existing = nodes.selectAll('rect');

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

  private renderNodes(nodes: IXosServiceGraphNode[]) {
    const node = this.nodeGroup
      .selectAll('g.node')
      .data(nodes, n => n.id);

    const svgDim = this.getSvgDimensions();
    node.enter()
      .append('g')
      .attr({
        class: n => `node ${n.type}`,
        transform: `translate(${svgDim.width / 2}, ${svgDim.heigth / 2})`
      })
      .call(this.forceLayout.drag)
      .on('mousedown', () => {
        d3.event.stopPropagation();
      })
      .on('mouseup', (d) => {
        d.fixed = true;
      });

    this.renderServiceNodes(node.filter('.service'));
    this.renderTenantNodes(node.filter('.tenant'));
    this.renderNetworkNodes(node.filter('.network'));
    this.renderSubscriberNodes(node.filter('.subscriber'));
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

export const XosFineGrainedTenancyGraph: angular.IComponentOptions = {
  template: require('./fine-grained.component.html'),
  controllerAs: 'vm',
  controller: XosFineGrainedTenancyGraphCtrl,
};
