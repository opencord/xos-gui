import * as $ from 'jquery';
import * as _ from 'lodash';

export interface IRCordGraphReducer {
  setup(): void;
}

export class RCordGraphReducer implements IRCordGraphReducer {

  static $inject = [
    'XosServiceGraphExtender'
  ];

  constructor(
    private XosServiceGraphExtender: any
  ) {

  }

  public setup() {
    this.XosServiceGraphExtender.register('finegrained', 'ecord-local', (graph): any => {
      graph = this.positionFineGrainedNodes(graph);
      return graph;
    });

    this.XosServiceGraphExtender.register('coarse', 'ecord-local', (graph: any): any => {
      graph.nodes = this.positionCoarseNodes(graph.nodes);
      return {
        nodes: graph.nodes,
        links: graph.links
      };
    });
  }

  private getSvgDimensions(graph: string): {width: number, heigth: number} {
    return {
      width: $(`${graph} svg`).width(),
      heigth: $(`${graph} svg`).height()
    };
  }

  private positionCoarseNodes(nodes: any[]): any[] {
    // getting distance between nodes
    const hStep = this.getSvgDimensions('xos-coarse-tenancy-graph').width / 4;
    const vStep = this.getSvgDimensions('xos-coarse-tenancy-graph').heigth / 4;

    const vtr = _.find(nodes, {label: 'vtr'});
    if (vtr) {
      vtr.x = hStep * 2;
      vtr.y = vStep * 1;
      vtr.fixed = true;
    }

    const volt = _.find(nodes, {label: 'volt'});
    if (volt) {
      volt.x = hStep * 1;
      volt.y = vStep * 2;
      volt.fixed = true;
    }

    const vsg = _.find(nodes, {label: 'vsg'});
    if (vsg) {
      vsg.x = hStep * 2;
      vsg.y = vStep * 2;
      vsg.fixed = true;
    }

    const vrouter = _.find(nodes, {label: 'vrouter'});
    if (vrouter) {
      vrouter.x = hStep * 3;
      vrouter.y = vStep * 2;
      vrouter.fixed = true;
    }

    const oc = _.find(nodes, {label: 'ONOS_CORD'});
    if (oc) {
      oc.x = hStep + (hStep / 2);
      oc.y = vStep * 3;
      oc.fixed = true;
    }

    const of = _.find(nodes, {label: 'ONOS_Fabric'});
    if (of) {
      of.x = (hStep * 2) + (hStep / 2);
      of.y = vStep * 3;
      of.fixed = true;
    }

    return nodes;
  }

  private positionFineGrainedNodes(graph: any): any[] {

    let subscriberPosition = 0;
    let networkPosition = 0;

    const positionSubscriberNode = (node: any, hStep: number, vStep: number): any => {
      subscriberPosition = subscriberPosition + 1;
      node.x = hStep;
      node.y = vStep * (3 + subscriberPosition );
      node.fixed = true;
      return node;
    };

    const positionServiceNode = (node: any, hStep: number, vStep: number, vLength: number): any => {
      if (node.label === 'ONOS_Fabric') {
        node.x = hStep * 4;
        node.y = vStep;
      }
      if (node.label === 'volt' || node.label === 'vsg' || node.label === 'vrouter') {
        node.y = vStep * 3;
      }
      if (node.label === 'volt') {
        node.x = hStep * 2;
      }
      if (node.label === 'vsg') {
        node.x = hStep * 3;
      }
      if (node.label === 'vrouter') {
        node.x = hStep * 4;
      }
      if (node.label === 'ONOS_CORD' || node.label === 'vtr') {
        node.y = vStep * (vLength -1);
      }
      if (node.label === 'ONOS_CORD') {
        node.x = hStep * 2;
      }
      if (node.label === 'vtr') {
        node.x = hStep * 3;
      }

      node.fixed = true;
      return node;
    };

    const positionNetworkNode = (node: any, hStep: number, vStep: number): any => {
      networkPosition = networkPosition + 1;
      node.x = hStep * 5;
      node.y = vStep * (3 + networkPosition );
      node.fixed = true;
      return node;
    };

    const findSubscriberElementY = (nodes: any[], node: any): any => {
      if (node.model.subscriber_root_id) {
        console.log(node.model.subscriber_root_id);
        const subscriber = _.find(nodes, n => {
          return n.id === `tenantroot~${node.model.subscriber_root_id}`
        });
        debugger;
        // console.log(subscriber.y);
        return subscriber.y;
      }
    };

    const positionTenantNode = (nodes: any[], node: any, hStep: number, vStep: number): any => {
      if (node.model.kind === 'vOLT') {
        node.x = hStep * 2;
      }
      if (node.model.kind === 'vCPE') {
        node.x = hStep * 3;
      }
      if (node.model.kind === 'vROUTER') {
        node.x = hStep * 4;
      }

      return node;
    };

    let subscribers = _.filter(graph.nodes, n => n.type === 'subscriber' || n.type === 'tenantroot');

    const vLength = 5 + subscribers.length;

    const hStep = this.getSvgDimensions('xos-fine-grained-tenancy-graph').width / 6;
    const vStep = this.getSvgDimensions('xos-fine-grained-tenancy-graph').heigth / vLength;

    graph.nodes = _.map(graph.nodes, n => {
      if (n.type === 'subscriber' || n.type === 'tenantroot') {
        n = positionSubscriberNode(n, hStep, vStep);
      }
      if (n.type === 'service') {
        n = positionServiceNode(n, hStep, vStep, vLength);
      }
      if (n.type === 'network') {
        n = positionNetworkNode(n, hStep, vStep);
      }
      if (n.type === 'tenant') {
        n = positionTenantNode(graph.nodes, n, hStep, vStep);
      }
      // n.fixed = true;
      return n;
    });
    return graph;
  }
}
