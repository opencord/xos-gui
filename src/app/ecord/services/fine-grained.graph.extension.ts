import * as $ from 'jquery';
import * as _ from 'lodash';

export interface IECordFineGrainedGraphReducer {
  setup(): void;
}

export class ECordFineGrainedGraphReducer implements IECordFineGrainedGraphReducer {

  static $inject = [
    'XosServiceGraphExtender'
  ];

  private nodes: any[] = [
    {
      id: 'subscriber~1',
      label: 'Big Bear Bank - MP Branch',
      type: 'subscriber'
    },
    {
      id: 'tenant~1',
      label: '',
      type: 'tenant'
    },
    {
      id: 'service~1',
      label: 'vEntEdge',
      type: 'service'
    },
    {
      id: 'tenant~2',
      label: '',
      type: 'tenant'
    },
    {
      id: 'service~2',
      label: 'vEntGateway',
      type: 'service'
    },
    {
      id: 'tenant~3',
      label: '',
      type: 'tenant'
    },
    {
      id: 'service~3',
      label: 'vRouter',
      type: 'service'
    },
    {
      id: 'tenant~4',
      label: '',
      type: 'tenant'
    },
    {
      id: 'network~1',
      label: 'Internet',
      type: 'network'
    },
    {
      id: 'tenant~5',
      label: '',
      type: 'tenant'
    },
    {
      id: 'service~4',
      label: 'vNetOnDemand',
      type: 'service'
    },
    {
      id: 'tenant~6',
      label: '',
      type: 'tenant'
    },
    {
      id: 'network~2',
      label: 'MPLS VPN',
      type: 'network'
    },
  ];

  private links: any[] = [
    {
      id: 'service~1-tenant~1',
      source: 2,
      target: 1
    },
    {
      id: 'tenant~1-subscriber~1',
      source: 1,
      target: 0
    },
    {
      id: 'service~2-tenant~2',
      source: 4,
      target: 3
    },
    {
      id: 'tenant~2-tenant~1',
      source: 3,
      target: 1
    },
    {
      id: 'service~3-tenant~3',
      source: 6,
      target: 5
    },
    {
      id: 'tenant~3-tenant~2',
      source: 5,
      target: 3
    },
    {
      id: 'network~1-tenant~4',
      source: 8,
      target: 7
    },
    {
      id: 'tenant~4-tenant~3',
      source: 7,
      target: 5
    },
    {
      id: 'service~4-tenant~5',
      source: 10,
      target: 9
    },
    {
      id: 'tenant~5-tenant~1',
      source: 9,
      target: 1
    },
    {
      id: 'network~2-tenant~6',
      source: 12,
      target: 11
    },
    {
      id: 'tenant~6-tenant~5',
      source: 11,
      target: 9
    }
  ];

  constructor(
    private XosServiceGraphExtender: any
  ) {

  }

  public setup() {
    this.XosServiceGraphExtender.register('finegrained', 'ecord-local', (): any => {
      const nodes = this.positionFineGrainedNodes(this.nodes);
      return {
        nodes,
        links: this.links
      };
    });

    this.XosServiceGraphExtender.register('coarse', 'ecord-local', (graph: any): any => {
      graph.nodes = this.positionCoarseNodes(graph.nodes);
      console.log(graph);
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

  private positionFineGrainedNodes(nodes: any[]): any[] {

    // getting distance between nodes
    const hStep = this.getSvgDimensions('xos-fine-grained-tenancy-graph').width / 7;
    const vStep = this.getSvgDimensions('xos-fine-grained-tenancy-graph').heigth / 5;

    // subscriber
    nodes[0].x = hStep * 1;
    nodes[0].y = vStep * 2;

    // enterprise network
    nodes[12].x = hStep * 6;
    nodes[12].y = vStep * 2;

    // public network
    nodes[8].x = hStep * 6;
    nodes[8].y = vStep * 3;

    // vee
    nodes[2].x = hStep * 2;
    nodes[2].y = vStep * 1;

    // vnodlocal
    nodes[10].x = hStep * 3;
    nodes[10].y = vStep * 1;

    // veg
    nodes[4].x = hStep * 3;
    nodes[4].y = vStep * 4;

    // vrouter
    nodes[6].x = hStep * 4;
    nodes[6].y = vStep * 4;

    // tenants (fast)
    nodes[1].x = hStep * 2;
    nodes[1].y = vStep * 2;

    nodes[9].x = hStep * 3;
    nodes[9].y = vStep * 2;

    nodes[11].x = hStep * 5;
    nodes[11].y = vStep * 2;

    // tenants (slow)
    nodes[3].x = hStep * 3;
    nodes[3].y = vStep * 3;

    nodes[5].x = hStep * 4;
    nodes[5].y = vStep * 3;

    nodes[7].x = hStep * 5;
    nodes[7].y = vStep * 3;

    nodes = nodes.map(n => {
      n.fixed = true;
      return n;
    });

    return nodes;
  }

  private positionCoarseNodes(nodes: any[]): any[] {
    // getting distance between nodes
    const hStep = this.getSvgDimensions('xos-coarse-tenancy-graph').width / 4;
    const vStep = this.getSvgDimensions('xos-coarse-tenancy-graph').heigth / 3;

    const vee = _.find(nodes, {label: 'vee'});
    if (vee) {
      vee.x = hStep * 1;
      vee.y = vStep * 1;
      vee.fixed = true;
    }

    const vnodlocal = _.find(nodes, {label: 'vnodlocal'});
    if (vnodlocal) {
      vnodlocal.x = hStep * 2;
      vnodlocal.y = vStep * 1;
      vnodlocal.fixed = true;
    }

    const veg = _.find(nodes, {label: 'veg'});
    if (veg) {
      veg.x = hStep * 2;
      veg.y = vStep * 2;
      veg.fixed = true;
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
      oc.y = (vStep * 2) + (vStep / 2);
      oc.fixed = true;
    }

    const of = _.find(nodes, {label: 'ONOS_Fabric'});
    if (of) {
      of.x = (hStep * 2) + (hStep / 2);
      of.y = (vStep * 2) + (vStep / 2);
      of.fixed = true;
    }

    return nodes;
  }
}
