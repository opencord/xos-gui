import {IMCordSlices, IMCordNode, IMcordLink, IMCordRelatedNode} from '../mocks/slices.mock';
import * as _ from 'lodash';
import {MCordTopoConfig} from './mcord-topo.config';
import {IMCordD3Node, IMcordD3Link} from '../components/mcord-topo.component';

export interface IMCordTopoHelpersService {
  getLongestSlice(slices: IMCordSlices): number;
  getPositionedNodes(slices: IMCordSlices, svgDimension: {width: number, heigth: number}, expandedSlice: string): IMCordD3Node[];
  getLinks(slices: IMCordSlices, expandedSlice: string): IMcordD3Link[];
}

export class MCordTopoHelpers implements IMCordTopoHelpersService {

  private upstreamNode: IMCordD3Node;

  public getLongestSlice(slices: IMCordSlices): number {
    let max: number = 0;
    _.forEach(Object.keys(slices), (s: string) => {
      const sliceDataPlaneNodes: IMCordNode[] = slices[s].nodes.filter((n: IMCordNode) => n.plane === 'data');
      if (sliceDataPlaneNodes.length > max) {
        max = sliceDataPlaneNodes.length;
      }
    });
    return max + 1;
  }

  public getRelatedNodePosition(relatedNodes: IMCordRelatedNode[], slices: IMCordSlices): IMCordD3Node[] {
    return _.map(relatedNodes, (n) => {
      const relatedNode: IMCordD3Node = this.getNodeById(n.relateTo, slices);
      n.x = relatedNode.x + n.relativePos.x;
      n.y = relatedNode.y + n.relativePos.y;
      n.transform = `translate(${n.x}, ${n.y})`;
      return n;
    });
  }

  public getPositionedNodes(slices: IMCordSlices, svgDimension: {width: number, heigth: number}, expandedSlice: string): IMCordD3Node[] {
    let nodes: IMCordD3Node[] = [];
    Object.keys(slices).forEach((s, j) => {
      const vPos = this.getSliceVPos(j + 1, Object.keys(slices).length, svgDimension.heigth);
      _.forEach(slices[s].nodes, (n: IMCordD3Node, i) => {
        n.y = vPos;
        n.x = this.getNodeHPos(n, svgDimension.width);
        // n.x = this.getNodeHPos(i, slices[s].nodes.length, svgDimension.width);
        n.transform = `translate(${n.x}, ${n.y})`;
        // n.fixed = true;
        n.sliceId = s;
        nodes.push(n);
      });

      if (
        angular.isDefined(expandedSlice) &&
        angular.isDefined(slices[s].extended) &&
        angular.isDefined(slices[s].extended.nodes)
      ) {
        nodes = nodes.concat(this.getRelatedNodePosition(slices[s].extended.nodes, slices));
      }
    });

    nodes.unshift(this.getUpstream(slices, svgDimension));
    return nodes;
  }

  public getLinks(slices: IMCordSlices, expandedSlice): IMcordD3Link[] {
    let links: IMcordLink[] = [];
    Object.keys(slices).forEach(s => {
      links = links.concat(slices[s].links);

      if (
        angular.isDefined(expandedSlice) &&
        angular.isDefined(slices[s].extended) &&
        angular.isDefined(slices[s].extended.links)
      ) {
        links = links.concat(slices[s].extended.links);
      }
    });

    return _.map(links, (l) => {
      const link = angular.copy(l);
      link.source = this.getNodeById(l.source, slices);
      link.target = this.getNodeById(l.target, slices);
      return link;
    });
  }

  private getNodeById(id: number, slices: IMCordSlices): IMCordD3Node {

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
      // if is not in the base slice, look in the extended property
      // TODO make recursion
      if (!angular.isDefined(node) && angular.isDefined(slices[s].extended)) {
        _.forEach(slices[s].extended.nodes, (n: IMCordD3Node, i) => {
          if (n.id === id) {
            node = n;
          }
        });
      }
    });
    return node;
  }

  private getUpstream(slices: IMCordSlices, svgDimension: {width: number, heigth: number}): IMCordD3Node {
    const upstream: IMCordD3Node = {
      id: 1,
      name: 'vRouter',
      fixed: true,
      x: this.getNodeHPos({type: 'upstream'}, svgDimension.width),
      // x: this.getNodeHPos(this.getLongestSlice(slices) + 1, this.getLongestSlice(slices) + 1, svgDimension.width),
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

  // TODO check me
  // private getNodeHPos(nodeIndex: number, nodesLength: number, width: number): number {
  //   const availableWidth: number = width - (MCordTopoConfig.margin * 2);
  //   const step = availableWidth / (nodesLength);
  //   return (nodeIndex * step) + MCordTopoConfig.margin;
  // }

  // NOTE this position nodes based on their type
  private getNodeHPos(node: IMCordD3Node | any, width: number): number {

    if (node.name === 'Joseph') {
      node.y = node.y - 40;
    }

    if (node.name === 'Girish') {
      node.y = node.y + 40;
    }

    let elPos = MCordTopoConfig.nodeOrder.indexOf(node.type) + 1;
    let x = (width / MCordTopoConfig.nodeOrder.length) * elPos;
    x = x - (width / (MCordTopoConfig.nodeOrder.length * 2));
    return x;
  }
}
