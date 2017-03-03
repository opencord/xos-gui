import './coarse.component.scss';
import * as d3 from 'd3';
import * as $ from 'jquery';
import {IXosServiceGraphStore} from '../../services/graph.store';
import {IXosServiceGraph, IXosServiceGraphNode, IXosServiceGraphLink} from '../../interfaces';
import {XosServiceGraphConfig as config} from '../../graph.config';

class XosCoarseTenancyGraphCtrl {

  static $inject = ['$log', 'XosServiceGraphStore'];

  public graph: IXosServiceGraph;

  private svg;
  private forceLayout;
  private linkGroup;
  private nodeGroup;

  constructor (
    private $log: ng.ILogService,
    private XosServiceGraphStore: IXosServiceGraphStore
  ) {

    this.XosServiceGraphStore.getCoarse()
      .subscribe((res: IXosServiceGraph) => {
        // id there are no data, do nothing
        if (!res.nodes || res.nodes.length === 0 || !res.links || res.links.length === 0) {
          return;
        }
        this.graph = res;
        this.setupForceLayout(res);
        this.renderNodes(res.nodes);
        this.renderLinks(res.links);
        this.forceLayout.start();
      });

    this.handleSvg();
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

  private setupForceLayout(data: IXosServiceGraph) {

    const tick = () => {
      this.nodeGroup.selectAll('g.node')
        .attr({
          transform: d => `translate(${d.x}, ${d.y})`
        });

      this.linkGroup.selectAll('line')
        .attr({
          x1: l => l.source.x,
          y1: l => l.source.y,
          x2: l => l.target.x,
          y2: l => l.target.y,
        });
    };
    const svgDim = this.getSvgDimensions();
    this.forceLayout = d3.layout.force()
      .size([svgDim.width, svgDim.heigth])
      .nodes(data.nodes)
      .links(data.links)
      .linkDistance(config.force.linkDistance)
      .charge(config.force.charge)
      .gravity(config.force.gravity)
      .on('tick', tick);
  }

  private getSiblingTextBBox(contex: any /* D3 this */) {
    return d3.select(contex.parentNode).select('text').node().getBBox();
  }

  private renderNodes(nodes: IXosServiceGraphNode[]) {
    const self = this;
    const node = this.nodeGroup
      .selectAll('rect')
      .data(nodes);

    const entering = node.enter()
      .append('g')
      .attr({
        class: 'node',
      })
      .call(this.forceLayout.drag)
      .on('mousedown', () => { d3.event.stopPropagation(); })
      .on('mouseup', (d) => { d.fixed = true; });

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
      .selectAll('rect')
      .data(links);

    const entering = link.enter()
      .append('g')
      .attr({
        class: 'link',
      });

    entering.append('line')
      .attr('marker-start', 'url(#arrow)');
  }
}

export const XosCoarseTenancyGraph: angular.IComponentOptions = {
  template: require('./coarse.component.html'),
  controllerAs: 'vm',
  controller: XosCoarseTenancyGraphCtrl,
};
