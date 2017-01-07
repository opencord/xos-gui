export interface IMCordNode {
  id: number;
  name: string;
  type: string;
  plane: 'data' | 'control';
  model_id?: number; // remove me??
  model?: any;
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
  plane: 'data' | 'control';
}

export interface IMCordSlice {
  nodes: IMCordNode[];
  links: IMcordLink[];
  extended?: {
    nodes: IMCordRelatedNode[];
    links: IMcordLink[];
  };
}

export interface IMCordSlices {
  1: IMCordSlice;
  2: IMCordSlice;
}

// TODO
// [ ] create "extended" property to hold nodes and links part of the slice details

const controlPlaneNodeY: number = -75;
const controlPlaneNodeX: number = 75;

export const MCordSlicesData: IMCordSlices = {
  1: {
    nodes: [
      {id: 211, name: 'Murat', type: 'ue', model_id: 1, plane: 'data', model: {id: 123}},
      {id: 210, name: 'Ran Slice', type: 'profile', model_id: 1, plane: 'data', model: {start: '2016-01-01T08:00:00.000Z', end: '2016-12-01T08:00:00.000Z'}},
      {id: 21, name: 'RRU', type: 'ran-ru', model_id: 1, plane: 'data'},
      {id: 22, name: 'BBU', type: 'ran-cu', model_id: 1, plane: 'data'},
      {id: 23, name: 'SGW', type: 'sgw', model_id: 1, plane: 'data'},
      {id: 24, name: 'PGW', type: 'pgw', model_id: 1, plane: 'data'},
    ],
    links: [
      {id: 1, source: 24, target: 1, plane: 'data'},
      {id: 2, source: 21, target: 22, plane: 'data'},
      {id: 3, source: 22, target: 23, plane: 'data'},
      {id: 4, source: 23, target: 24, plane: 'data'},
      {id: 13, source: 210, target: 21, plane: 'data'},
      {id: 14, source: 211, target: 210, plane: 'data'},
    ],
    extended: {
      nodes: [
        {id: 25, name: 'RRU', type: 'ran-ru', model_id: 1, plane: 'control', relateTo: 21, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 26, name: 'BBU', type: 'ran-cu', model_id: 1, plane: 'control', relateTo: 22, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 27, name: 'SGW', type: 'sgw', model_id: 1, plane: 'control', relateTo: 23, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 28, name: 'PGW', type: 'pgw', model_id: 1, plane: 'control', relateTo: 24, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 29, name: 'MME', type: 'mme', model_id: 1, plane: 'control', relateTo: 23, relativePos: {x: 0, y: controlPlaneNodeY * 2}},
      ],
      links: [
        {id: 5, source: 21, target: 25, plane: 'control'},
        {id: 6, source: 22, target: 26, plane: 'control'},
        {id: 7, source: 23, target: 27, plane: 'control'},
        {id: 8, source: 24, target: 28, plane: 'control'},
        {id: 9, source: 25, target: 26, plane: 'control'},
        {id: 10, source: 26, target: 29, plane: 'control'},
        {id: 11, source: 27, target: 28, plane: 'control'},
        {id: 12, source: 27, target: 29, plane: 'control'},
      ]
    }
  },
  2: {
    nodes: [
      {id: 311, name: 'Girish', type: 'ue', model_id: 1, plane: 'data', model: {id: 123}},
      // {id: 312, name: 'Joseph', type: 'ue', model_id: 1, plane: 'data', model: {id: 123}},
      {id: 310, name: 'Ran Slice', type: 'profile', 'model_id': 1, plane: 'data'},
      {id: 31, name: 'RRU', type: 'ran-ru', 'model_id': 1, plane: 'data'},
      {id: 32, name: 'BBU', type: 'ran-cu', 'model_id': 1, plane: 'data'},
      {id: 33, name: 'SGW', type: 'sgw', 'model_id': 1, plane: 'data'},
      {id: 34, name: 'PGW', type: 'pgw', 'model_id': 1, plane: 'data'},

      // {id: 35, name: 'RRU', type: 'ran-ru', 'model_id': 1, plane: 'control'},
      // {id: 36, name: 'BBU', type: 'ran-cu', 'model_id': 1, plane: 'control'},
      // {id: 37, name: 'SGW', type: 'sgw', 'model_id': 1, plane: 'control'},
      // {id: 38, name: 'PGW', type: 'pgw', 'model_id': 1, plane: 'control'},
      // {id: 39, name: 'MME', type: 'mme', 'model_id': 1, plane: 'control'},

    ],
    links: [
      {id: 15, source: 34, target: 1, plane: 'data'},

      {id: 16, source: 31, target: 32, plane: 'data'},
      {id: 17, source: 32, target: 33, plane: 'data'},
      {id: 18, source: 33, target: 34, plane: 'data'},

      // {id: 19, source: 31, target: 35, plane: 'control'},
      // {id: 20, source: 32, target: 36, plane: 'control'},
      // {id: 21, source: 33, target: 37, plane: 'control'},
      // {id: 22, source: 34, target: 38, plane: 'control'},
      // {id: 23, source: 35, target: 36, plane: 'control'},
      // {id: 24, source: 36, target: 39, plane: 'control'},
      // {id: 25, source: 37, target: 38, plane: 'control'},
      // {id: 26, source: 37, target: 39, plane: 'control'},

      {id: 19, source: 310, target: 31, plane: 'data'},
      {id: 20, source: 311, target: 310, plane: 'data'},
      // {id: 29, source: 312, target: 310, plane: 'data'},
    ],
    extended: {
      nodes: [
        {id: 35, name: 'RRU', type: 'ran-ru', model_id: 1, plane: 'control', relateTo: 31, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 36, name: 'BBU', type: 'ran-cu', model_id: 1, plane: 'control', relateTo: 32, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 37, name: 'SGW', type: 'sgw', model_id: 1, plane: 'control', relateTo: 33, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 38, name: 'PGW', type: 'pgw', model_id: 1, plane: 'control', relateTo: 34, relativePos: {x: 0, y: controlPlaneNodeY}},
        {id: 39, name: 'MME Session', type: 'mme', 'model_id': 1, plane: 'control', relateTo: 32, relativePos: {x: controlPlaneNodeX, y: controlPlaneNodeY * 2}},
        {id: 40, name: 'MME Mobility', type: 'mme', 'model_id': 1, plane: 'control', relateTo: 33, relativePos: {x: 0, y: controlPlaneNodeY * 2}},
        {id: 41, name: 'Connection less GW', type: 'mme', 'model_id': 1, plane: 'data', relateTo: 32, relativePos: {x: controlPlaneNodeX, y: -controlPlaneNodeY * 2}},
      ],
      links: [
        {id: 21, source: 31, target: 35, plane: 'control'},
        {id: 22, source: 32, target: 36, plane: 'control'},
        {id: 23, source: 33, target: 37, plane: 'control'},
        {id: 24, source: 34, target: 38, plane: 'control'},
        {id: 25, source: 35, target: 36, plane: 'control'},
        {id: 26, source: 36, target: 37, plane: 'control'},
        {id: 27, source: 37, target: 38, plane: 'control'},
        {id: 28, source: 36, target: 39, plane: 'control'},
        {id: 29, source: 39, target: 40, plane: 'control'},
        {id: 30, source: 40, target: 37, plane: 'control'},
        {id: 31, source: 39, target: 41, plane: 'control'},
        {id: 32, source: 32, target: 41, plane: 'data'},
        {id: 33, source: 41, target: 1, plane: 'data'},
      ]
    }
  }
};
