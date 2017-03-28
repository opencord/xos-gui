import * as $ from 'jquery';
import * as _ from 'lodash';

export interface IECordGraphReducer {
  setup(): void;
}

export class ECordGraphReducer implements IECordGraphReducer {

  static $inject = [
    'XosServiceGraphExtender'
  ];

  private nodes: any[] = [
    {
      id: 'service~1',
      label: 'VNoD global',
      type: 'service'
    }
  ];

  private links: any[] = [
  ];

  constructor(
    private XosServiceGraphExtender: any
  ) {

  }

  public setup() {
    this.XosServiceGraphExtender.register('coarse', 'ecord-local', (graph: any): any => {
      graph.nodes = this.positionCoarseNodes(this.nodes);
      return {
        nodes: graph.nodes,
        links: this.links
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
    const hStep = this.getSvgDimensions('xos-coarse-tenancy-graph').width / 2;
    const vStep = this.getSvgDimensions('xos-coarse-tenancy-graph').heigth / 2;

    nodes[0].x = hStep;
    nodes[0].y = vStep;
    nodes[0].fixed = true;

    return nodes;
  }
}
