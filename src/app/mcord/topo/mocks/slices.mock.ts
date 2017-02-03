export interface IMCordNode {
  id: number;
  name: string;
  type: string;
  plane: string;
  model_id?: number; // remove me??
  model?: any;
  path?: string;
}

export interface IMCordRelatedNode extends IMCordNode {
  relateTo?: number;
  relativePos?: {
    x: number;
    y: number;
  };
}

export interface IMcordLink {
  id: number;
  source: number;
  target: number;
  plane: string;
  path?: string;
}

export interface IMCordSlice {
  nodes: IMCordNode[] | IMCordRelatedNode[];
  links: IMcordLink[];
  extended?: {
    nodes: IMCordRelatedNode[];
    links: IMcordLink[];
  };
}

export interface IMCordSlices {
  1: IMCordSlice;
  2: IMCordSlice;
  3: IMCordSlice;
  4: IMCordSlice;
}

const controlPlaneNodeY: number = -150;
const controlPlaneNodeX: number = 75;

export const MCordSlicesData: IMCordSlices = {
  1: {
    nodes: [
      {id: 211, name: 'Yiannis', type: 'ue', model_id: 1, plane: 'data physical'},
      {id: 210, name: 'RAN Slice', type: 'profile', model_id: 1, plane: 'data logic'},
      {id: 21, name: 'vRRU', type: 'ran-ru', model_id: 1, plane: 'data logic'},
      {id: 22, name: 'vBBU', type: 'ran-cu', model_id: 1, plane: 'data physical'},
      {id: 23, name: 'vSGW', type: 'sgw', model_id: 1, plane: 'data physical'},
      {id: 24, name: 'vPGW', type: 'pgw', model_id: 1, plane: 'data physical'},
      {id: 2424, name: 'Cookies', type: 'cookie', model_id: 1, plane: 'data physical'},
    ],
    links: [
      {id: 100, source: 2424, target: 1, plane: 'data'},
      {id: 1, source: 24, target: 2424, plane: 'data'},
      {id: 2, source: 21, target: 22, plane: 'data'},
      {id: 3, source: 22, target: 23, plane: 'data'},
      {id: 4, source: 23, target: 24, plane: 'data'},
      {id: 5, source: 210, target: 21, plane: 'data'},
      {id: 6, source: 211, target: 210, plane: 'data'},
    ],
    extended: {
      nodes: [
        {id: 2425, name: 'Cookies', type: 'cookie', model_id: 1, plane: 'control physical', relateTo: 2424, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 2101, name: 'RAN Slice', type: 'profile', model_id: 1, plane: 'control logic', relateTo: 210, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 25, name: 'vRRU', type: 'ran-ru', model_id: 1, plane: 'control logic', relateTo: 21, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 26, name: 'vBBU', type: 'ran-cu', model_id: 1, plane: 'control physical', relateTo: 22, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 27, name: 'vSGW', type: 'sgw', model_id: 1, plane: 'control physical', relateTo: 23, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 28, name: 'vPGW', type: 'pgw', model_id: 1, plane: 'control physical', relateTo: 24, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 29, name: 'MME', type: 'mme', model_id: 1, plane: 'control physical', relateTo: 23, relativePos: {x: 0, y: controlPlaneNodeY * 2}},
      ],
      links: [
        {id: 101, source: 2424, target: 2425, plane: 'control'},
        {id: 7, source: 210, target: 2101, plane: 'control'},
        {id: 8, source: 21, target: 25, plane: 'control'},
        {id: 9, source: 22, target: 26, plane: 'control'},
        {id: 10, source: 23, target: 27, plane: 'control'},
        {id: 11, source: 24, target: 28, plane: 'control'},
        {id: 12, source: 25, target: 26, plane: 'control'},
        {id: 13, source: 26, target: 29, plane: 'control'},
        {id: 14, source: 27, target: 28, plane: 'control'},
        {id: 15, source: 27, target: 29, plane: 'control'},
      ]
    }
  },
  3: {
    nodes: [
      {id: 311, name: 'Murat', type: 'ue', model_id: 1, plane: 'data physical'},
      {id: 310, name: 'RAN Slice', type: 'profile', model_id: 1, plane: 'data logic'},
      {id: 31, name: 'vRRU', type: 'ran-ru', model_id: 1, plane: 'data logic'},
      {id: 32, name: 'vBBU', type: 'ran-cu', model_id: 1, plane: 'data physical'},
      {id: 33, name: 'vSGW', type: 'sgw', model_id: 1, plane: 'data physical'},
      {id: 34, name: 'vPGW', type: 'pgw', model_id: 1, plane: 'data physical'},
    ],
    links: [
      {id: 20, source: 34, target: 1, plane: 'data'},
      {id: 21, source: 31, target: 32, plane: 'data'},
      {id: 22, source: 32, target: 33, plane: 'data'},
      {id: 23, source: 33, target: 34, plane: 'data'},
      {id: 24, source: 310, target: 31, plane: 'data'},
      {id: 25, source: 311, target: 310, plane: 'data'},
    ],
    extended: {
      nodes: [
        {id: 3101, name: 'RAN Slice', type: 'profile', model_id: 1, plane: 'control logic', relateTo: 310, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 35, name: 'vRRU', type: 'ran-ru', model_id: 1, plane: 'control logic', relateTo: 31, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 36, name: 'vBBU', type: 'ran-cu', model_id: 1, plane: 'control physical', relateTo: 32, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 37, name: 'vSGW', type: 'sgw', model_id: 1, plane: 'control physical', relateTo: 33, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 38, name: 'vPGW', type: 'pgw', model_id: 1, plane: 'control physical', relateTo: 34, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 39, name: 'MME', type: 'mme', model_id: 1, plane: 'control physical', relateTo: 33, relativePos: {x: 0, y: controlPlaneNodeY * 1.5}},
      ],
      links: [
        {id: 26, source: 310, target: 3101, plane: 'control'},
        {id: 27, source: 31, target: 35, plane: 'control'},
        {id: 28, source: 32, target: 36, plane: 'control'},
        {id: 29, source: 33, target: 37, plane: 'control'},
        {id: 30, source: 34, target: 38, plane: 'control'},
        {id: 31, source: 35, target: 36, plane: 'control'},
        {id: 32, source: 36, target: 39, plane: 'control'},
        {id: 33, source: 37, target: 38, plane: 'control'},
        {id: 34, source: 37, target: 39, plane: 'control'},
      ]
    }
  },
  4: {
    nodes: [
      {id: 410, name: 'RAN Slice', type: 'profile', model_id: 1, plane: 'data logic'},
      {id: 41, name: 'vRRU', type: 'ran-ru', model_id: 1, plane: 'data logic'},
      {id: 42, name: 'vBBU', type: 'ran-cu', model_id: 1, plane: 'data physical'},
      {id: 43, name: 'vSGW', type: 'sgw', model_id: 1, plane: 'data physical'},
      {id: 44, name: 'vPGW', type: 'pgw', model_id: 1, plane: 'data physical'},
    ],
    links: [
      {id: 40, source: 44, target: 1, plane: 'data'},
      {id: 41, source: 41, target: 42, plane: 'data'},
      {id: 42, source: 42, target: 43, plane: 'data'},
      {id: 43, source: 43, target: 44, plane: 'data'},
      {id: 44, source: 410, target: 41, plane: 'data'},
    ],
    extended: {
      nodes: [
        {id: 4101, name: 'RAN Slice', type: 'profile', model_id: 1, plane: 'control logic', relateTo: 410, relativePos: {x: 0, y: -controlPlaneNodeY}},
        {id: 45, name: 'vRRU', type: 'ran-ru', model_id: 1, plane: 'control logic', relateTo: 41, relativePos: {x: 0, y: -controlPlaneNodeY}},
        {id: 46, name: 'vBBU', type: 'ran-cu', model_id: 1, plane: 'control physical', relateTo: 42, relativePos: {x: 0, y: -controlPlaneNodeY}},
        {id: 47, name: 'vSGW', type: 'sgw', model_id: 1, plane: 'control physical', relateTo: 43, relativePos: {x: 0, y: -controlPlaneNodeY}},
        {id: 48, name: 'vPGW', type: 'pgw', model_id: 1, plane: 'control physical', relateTo: 44, relativePos: {x: 0, y: -controlPlaneNodeY}},
        {id: 49, name: 'MME', type: 'mme', model_id: 1, plane: 'control physical', relateTo: 43, relativePos: {x: 0, y: -controlPlaneNodeY * 1.5}},
      ],
      links: [
        {id: 45, source: 410, target: 4101, plane: 'control'},
        {id: 46, source: 41, target: 45, plane: 'control'},
        {id: 47, source: 42, target: 46, plane: 'control'},
        {id: 48, source: 43, target: 47, plane: 'control'},
        {id: 49, source: 44, target: 48, plane: 'control'},
        {id: 50, source: 45, target: 46, plane: 'control'},
        {id: 51, source: 46, target: 49, plane: 'control'},
        {id: 52, source: 47, target: 48, plane: 'control'},
        {id: 53, source: 47, target: 49, plane: 'control'},
      ]
    }
  },
  2: {
    nodes: [
      {id: 511, name: 'IoT', type: 'ue', model_id: 1, plane: 'data physical', model: {id: 123}, path: 'IoT'},
      {id: 512, name: 'Joseph', type: 'ue', model_id: 1, plane: 'data physical', model: {id: 123}, path: 'Joseph'},
      {id: 510, name: 'RAN Slice', type: 'profile', 'model_id': 1, plane: 'data logic', path: 'both'},
      {id: 51, name: 'vRRU', type: 'ran-ru', 'model_id': 1, plane: 'data logic', path: 'both'},
      {id: 52, name: 'vBBU', type: 'ran-cu', 'model_id': 1, plane: 'data physical', path: 'both'},
      {id: 53, name: 'vSGW', type: 'sgw', 'model_id': 1, plane: 'data physical', path: 'Joseph'},
      {id: 54, name: 'vPGW', type: 'pgw', 'model_id': 1, plane: 'data physical', path: 'Joseph'},
      // {id: 61, name: 'Connection less GW', type: 'mme', plane: 'data physical', relateTo: 52, relativePos: {x: controlPlaneNodeX, y: -controlPlaneNodeY * 0.75}},
    ],
    links: [
      {id: 60, source: 54, target: 1, plane: 'data', path: 'Joseph'},
      {id: 61, source: 51, target: 52, plane: 'data', path: 'both'},
      {id: 62, source: 52, target: 53, plane: 'data', path: 'Joseph'},
      {id: 63, source: 53, target: 54, plane: 'data', path: 'Joseph'},
      {id: 64, source: 510, target: 51, plane: 'data', path: 'both'},
      {id: 65, source: 511, target: 510, plane: 'data', path: 'IoT'},
      {id: 80, source: 512, target: 510, plane: 'data', path: 'Joseph'},
      // {id: 78, source: 52, target: 61, plane: 'data', path: 'IoT'},
      // {id: 79, source: 61, target: 1, plane: 'data', path: 'IoT'},
    ],
    extended: {
      nodes: [
        {id: 5101, name: 'RAN Slice', type: 'profile', plane: 'control logic', relateTo: 510, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 55, name: 'vRRU', type: 'ran-ru', plane: 'control logic', relateTo: 51, relativePos: {x: 0, y: controlPlaneNodeY}, path: 'Joseph'},
        {id: 56, name: 'vBBU', type: 'ran-cu', plane: 'control physical', relateTo: 52, relativePos: {x: 0, y: controlPlaneNodeY}, path: 'both'},
        {id: 57, name: 'vSGW', type: 'sgw', plane: 'control physical', relateTo: 53, relativePos: {x: 0, y: controlPlaneNodeY}, path: 'Joseph'},
        {id: 58, name: 'vPGW', type: 'pgw', plane: 'control physical', relateTo: 54, relativePos: {x: 0, y: controlPlaneNodeY}, path: 'Joseph'},
        {id: 59, name: 'MME Session', type: 'mme', plane: 'control physical', relateTo: 52, relativePos: {x: controlPlaneNodeX, y: controlPlaneNodeY * 2}, path: 'both'},
        {id: 60, name: 'MME Mobility', type: 'mme', plane: 'control physical', relateTo: 53, relativePos: {x: controlPlaneNodeX, y: controlPlaneNodeY * 2}, path: 'Joseph'},
        {id: 61, name: 'Connection less GW', type: 'mme', plane: 'data', relateTo: 52, relativePos: {x: controlPlaneNodeX, y: -controlPlaneNodeY * 2}, path: 'IoT'},
      ],
      links: [
        {id: 66, source: 510, target: 5101, plane: 'control'},
        {id: 67, source: 51, target: 55, plane: 'control', path: 'Joseph'},
        {id: 68, source: 52, target: 56, plane: 'control', path: 'IoT'},
        {id: 69, source: 53, target: 57, plane: 'control'},
        {id: 70, source: 54, target: 58, plane: 'control', path: 'Joseph'},
        {id: 71, source: 55, target: 56, plane: 'control', path: 'Joseph'},
        {id: 72, source: 56, target: 57, plane: 'control'},
        {id: 73, source: 57, target: 58, plane: 'control', path: 'Joseph'},
        {id: 74, source: 56, target: 59, plane: 'control', path: 'both'},
        {id: 75, source: 59, target: 60, plane: 'control', path: 'Joseph'},
        {id: 76, source: 60, target: 57, plane: 'control', path: 'Joseph'},
        {id: 77, source: 59, target: 61, plane: 'control', path: 'IoT'},
        {id: 78, source: 52, target: 61, plane: 'data', path: 'IoT'},
        {id: 79, source: 61, target: 1, plane: 'data', path: 'IoT'},
      ]
    }
  }
};
