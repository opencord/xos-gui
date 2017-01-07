import {IMCordSlices, IMcordNode, IMcordLink} from '../mocks/slices.mock';
import * as _ from 'lodash';
import {MCordTopoConfig} from './mcord-topo.config';
import {IMCordD3Node, IMcordD3Link} from '../components/mcord-topo.component';

export interface IMCordTopoHelpersService {
  getLongestSlice(slices: IMCordSlices): number;
  getPositionedNodes(slices: IMCordSlices, svgDimension: {width: number, heigth: number}): IMCordD3Node[];
  getLinks(slices: IMCordSlices): IMcordD3Link[]
}

export class MCordTopoHelpers implements IMCordTopoHelpersService {

  private upstreamNode: IMCordD3Node;

  public getLongestSlice(slices: IMCordSlices): number {
    let max: number = 0;
    _.forEach(Object.keys(slices), (s: string) => {
      const sliceDataPlaneNodes: IMcordNode[] = slices[s].nodes.filter((n: IMcordNode) => n.plane === 'data');
      if (sliceDataPlaneNodes.length > max) {
        max = sliceDataPlaneNodes.length;
      }
    });
    return max + 1;
  }

  public getPositionedNodes(slices: IMCordSlices, svgDimension: {width: number, heigth: number}): IMCordD3Node[] {
    let nodes: IMCordD3Node[] = [];
    Object.keys(slices).forEach((s, j) => {
      const vPos = this.getSliceVPos(j + 1, Object.keys(slices).length, svgDimension.heigth);
      _.forEach(slices[s].nodes, (n: IMCordD3Node, i) => {
        n.y = vPos;
        n.x = this.getNodeHPos(i, slices[s].nodes.length, svgDimension.width);
        n.transform = `translate(${n.x}, ${n.y})`;
        n.fixed = true;
        n.sliceId = s;
        nodes.push(n);
      });
    });
    nodes.unshift(this.getUpstream(slices, svgDimension));
    return nodes;
  }

  public getLinks(slices: IMCordSlices): IMcordD3Link[] {
    let links: IMcordLink[] = [];
    Object.keys(slices).forEach(s => {
      links = links.concat(slices[s].links);
    });

    return _.map(links, (l) => {
      const link = angular.copy(l);
      link.source = this.getNodeById(l.source, slices);
      link.target = this.getNodeById(l.target, slices);
      return link;
    });
  }

  private getNodeById(id: number, slices: IMCordSlices): IMCordD3Node {

    // if (angular.isObject(id)) {
    //   /* tslint-disable */
    //   return id;
    //   /* tslint-enable */
    // }

    // if I'm looking for vRouter
    if (id === 1) {
      return this.upstreamNode;
    }

    let node: IMCordD3Node = undefined;
    Object.keys(slices).forEach(s => {
      _.forEach(slices[s].nodes, (n: IMCordD3Node, i) => {
        if (n.id === id) {
          node = n;
        }
      });
    });
    return node;
  }

  private getUpstream(slices: IMCordSlices, svgDimension: {width: number, heigth: number}): IMCordD3Node {
    const upstream: IMCordD3Node = {
      id: 1,
      name: 'vRouter',
      fixed: true,
      x: this.getNodeHPos(this.getLongestSlice(slices) + 1, this.getLongestSlice(slices) + 1, svgDimension.width),
      y: this.getSliceVPos(1, 1, svgDimension.heigth),
      transform: '',
      type: 'upstream',
      plane: 'data'
    };

    upstream.transform = `translate(${upstream.x}, ${upstream.y})`;

    // NOTE storing the upstram node for later use is not so elegant
    this.upstreamNode = upstream;
    return upstream;
  }

  private getSliceVPos(sliceId: number, slicesLength: number, height: number): number {
    const availableHeight: number = height - (MCordTopoConfig.margin * 2);

    const step = availableHeight / (slicesLength + 1);

    return ((sliceId) * step) + MCordTopoConfig.margin;
  }

  // TODO checkme
  private getNodeHPos(nodeIndex: number, nodesLength: number, width: number): number {
    const availableWidth: number = width - (MCordTopoConfig.margin * 2);
    const step = availableWidth / (nodesLength);
    return (nodeIndex * step) + MCordTopoConfig.margin;
  }
}
