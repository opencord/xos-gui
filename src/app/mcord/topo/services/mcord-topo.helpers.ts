import {IMCordSlices, IMCordNode, IMcordLink, IMCordRelatedNode} from '../mocks/slices.mock';
import * as _ from 'lodash';
import {MCordTopoConfig} from './mcord-topo.config';
import {IMCordD3Node, IMcordD3Link} from '../components/mcord-topo.component';
import {IXosAppConfig} from '../../../../index';

export interface IMCordTopoHelpersService {
  getLongestSlice(slices: IMCordSlices): number;
  getPositionedNodes(slices: IMCordSlices, svgDimension: {width: number, heigth: number}, expandedSlice: string[]): IMCordD3Node[];
  getLinks(slices: IMCordSlices, expandedSlice: string[]): IMcordD3Link[];
  updateLink(start: IMCordD3Node, end: IMCordD3Node, links: IMcordD3Link[]): void;
  getSliceVPos(sliceId: number, slicesLength: number, height: number): number;
  getNodeById(id: number, slices: IMCordSlices): IMCordD3Node;
}

export class MCordTopoHelpers implements IMCordTopoHelpersService {

  static $inject = ['$log', '$http', '$q', 'AppConfig', 'MCordTopoData'];
  private upstreamNode: IMCordD3Node;

  // FIXME clear d3 cache, see not in component
  private updateCount = 0;

  constructor(
    private $log: ng.ILogService,
    private $http: ng.IHttpService,
    private $q: ng.IQService,
    private AppConfig: IXosAppConfig,
    private MCordTopoData: IMCordSlices
  ) {
  }

  public updateLink(start: IMCordD3Node, end: IMCordD3Node, links: IMcordD3Link[]): void {
    if (start.type === end.type) {
      return;
    }

    // remove the link that depart from the start node
    // NOTE double check that this is the only link
    const oldLink: IMcordD3Link = _.find(links, (l: IMcordD3Link) => l.source.id === start.id);
    this.$log.info(`Removing Link: ${oldLink.id}`);
    let linkToUpdate, nodeToUpdate;
    // update stored slice value
    _.forEach(Object.keys(this.MCordTopoData), k => {
      const slice = this.MCordTopoData[k];

      if (_.find(slice.nodes, n => n.id === start.id)) {
        nodeToUpdate = _.remove(slice.nodes, n => n.id === start.id);
      }

      if (_.find(slice.links, l => l.id === oldLink.id)) {
        linkToUpdate = _.remove(slice.links, l => l.id === oldLink.id);
      }
    });

    if (linkToUpdate && nodeToUpdate) {
      // update link and add to the proper slice
      // FIXME see update count
      linkToUpdate[0].id = `update-${this.updateCount}-${linkToUpdate[0].id}`;
      this.updateCount = this.updateCount++;
      linkToUpdate[0].target = end.id;
      // linkToUpdate.sliceId = end.sliceId;
      this.MCordTopoData[end.sliceId].links.unshift(linkToUpdate[0]);

      // update node and add to the proper slice
      this.MCordTopoData[end.sliceId].nodes.unshift(nodeToUpdate[0]);

      // sending request
      this.updateUe(start.id, end.id);
    }

  }

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

  public getRelatedNodePosition(relatedNodes: IMCordRelatedNode[], slices: IMCordSlices, expandedSlice?: string[]): IMCordD3Node[] {
    return _.map(relatedNodes, (n) => {
      const relatedNode: IMCordD3Node = this.getNodeById(n.relateTo, slices);
      n.x = relatedNode.x + n.relativePos.x;
      n.y = relatedNode.y + n.relativePos.y;

      // FIXME hack to move Connectionless Gateway further down when slice is expanded
      if (expandedSlice && expandedSlice[0] === '2') {
        n.y = n.y + 100;
      }

      n.transform = `translate(${n.x}, ${n.y})`;
      return n;
    });
  }

  public getPositionedNodes(slices: IMCordSlices, svgDimension: {width: number, heigth: number}, expandedSlice: string[]): IMCordD3Node[] {


    let nodes: IMCordD3Node[] = [];
    Object.keys(slices).forEach((s, j) => {
      const vPos = this.getSliceVPos(j + 1, Object.keys(slices).length, svgDimension.heigth);

      // position base nodes
      const baseNodes = _.filter(slices[s].nodes, n => !angular.isDefined(n.relateTo));
      _.forEach(baseNodes, (n: IMCordD3Node, i) => {
        n.y = vPos;
        n.x = this.getNodeHPos(n, svgDimension.width);
        // n.x = this.getNodeHPos(i, slices[s].nodes.length, svgDimension.width);
        n.transform = `translate(${n.x}, ${n.y})`;
        // n.fixed = true;
        n.sliceId = s;
        nodes.push(n);
      });

      // postion related nodes
      const relatedNodes = _.filter(slices[s].nodes, n => angular.isDefined(n.relateTo));

      nodes = nodes.concat(this.getRelatedNodePosition(relatedNodes, slices, expandedSlice));

      // if is expanded, add expansion
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

  public getLinks(slices: IMCordSlices, expandedSlice: string[]): IMcordD3Link[] {
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

  public getSliceVPos(sliceId: number, slicesLength: number, height: number): number {
    let availableHeight: number = height - (MCordTopoConfig.margin * 2);

    availableHeight = height;

    const step = availableHeight / (slicesLength + 1);

    return ((sliceId) * step) + MCordTopoConfig.margin;
  }

  public getNodeById(id: number, slices: IMCordSlices): IMCordD3Node {

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
      name: 'Internet',
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

  // TODO check me
  // private getNodeHPos(nodeIndex: number, nodesLength: number, width: number): number {
  //   const availableWidth: number = width - (MCordTopoConfig.margin * 2);
  //   const step = availableWidth / (nodesLength);
  //   return (nodeIndex * step) + MCordTopoConfig.margin;
  // }

  // NOTE this position nodes based on their type
  private getNodeHPos(node: IMCordD3Node | any, width: number): number {

    // FIXME properly calculate the position of multiple UEs on the same slice
    if (node.name === 'Regular LTE') {
      node.y = node.y - 40;
    }

    if (node.name === 'IoT') {
      node.y = node.y + 40;
    }

    let elPos = MCordTopoConfig.nodeOrder.indexOf(node.type) + 1;
    let x = (width / MCordTopoConfig.nodeOrder.length) * elPos;
    x = x - (width / (MCordTopoConfig.nodeOrder.length * 2));
    return x;
  }

  private updateUe(ueId: number, profileId: number): ng.IPromise<any> {
    const d = this.$q.defer();
    let profile: string;
    if (profileId === 310) {
      profile = 'slice1';
    }
    else {
      profile = 'slice2';
    }

    this.$http.put(`${this.AppConfig.apiEndpoint}/service/imsi/1/`, {imsi: '001010000000210', profile: profile, uiid: ueId})
      .then(res => {
        d.resolve(res);
        this.$log.info('UE Updated');
      })
      .catch(err => {
        d.reject(err);
      });
    return d.promise;
  }
}
