interface ISvgMarker {
  id: string;
  width: number;
  height: number;
  refX: number;
  refY: number;
  viewBox: string;
  path: string; // svg path
}

export interface IXosServiceGraphConfig {
  force: {
    linkDistance: number;
    charge: number;
    gravity: number;
  };
  node: {
    padding: number;
    radius: number;
  };
  markers: ISvgMarker[];
}

export const XosServiceGraphConfig: IXosServiceGraphConfig = {
  force: {
    linkDistance: 160,
    charge: -60,
    gravity: 0.01
  },
  node: {
    padding: 10,
    radius: 2
  },
  markers: [
    {
      id: 'arrow',
      width: 10,
      height: 10,
      refX: -80,
      refY: 0,
      viewBox: '0 -5 10 10',
      path: 'M10,-5L0,0L10,5'
    }
  ]
};
