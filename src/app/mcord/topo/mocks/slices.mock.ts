export interface IMcordNode {
  id: number;
  name: string;
  type: string;
  plane: 'data' | 'control';
  model_id?: number; // remove me??
  model?: any;
}

export interface IMcordLink {
  id: number;
  source: number;
  target: number;
  plane: 'data' | 'control';
}

export interface IMCordSlice {
  nodes: IMcordNode[];
  links: IMcordLink[];
}

export interface IMCordSlices {
  1: IMCordSlice;
  2: IMCordSlice;
}

// TODO
// [ ] create "extended" property to hold nodes and links part of the slice details

export const MCordSlicesData: IMCordSlices = {
  1: {
    nodes: [
      {id: 211, name: 'Murat', type: 'ue', model_id: 1, plane: 'data', model: {id: 123}},
      {id: 210, name: 'Ran Slice', type: 'profile', model_id: 1, plane: 'data', model: {start: '2016-01-01T08:00:00.000Z', end: '2016-12-01T08:00:00.000Z'}},
      {id: 21, name: 'RRU', type: 'ran-ru', model_id: 1, plane: 'data'},
      {id: 22, name: 'BBU', type: 'ran-cu', model_id: 1, plane: 'data'},
      {id: 23, name: 'SGW', type: 'sgw', model_id: 1, plane: 'data'},
      {id: 24, name: 'PGW', type: 'pgw', model_id: 1, plane: 'data'},

      // {id: 25, name: 'RRU', type: 'ran-ru', model_id: 1, plane: 'control', model: {DlSchedType: shedType, DlSchedType_opt: schedTypeOpts, DlAllocRBRate: 30, UlSchedType: shedType, UlSchedType_opt: schedTypeOpts, UlAllocRBRate: 30}},
      // {id: 26, name: 'BBU', type: 'ran-cu', model_id: 1, plane: 'control', model: {AdmissionControl: 0,HandHover: 10}},
      // {id: 27, name: 'SGW', type: 'sgw', model_id: 1, plane: 'control'},
      // {id: 28, name: 'PGW', type: 'pgw', model_id: 1, plane: 'control', model: {brand: 'Quortus'}},
      // {id: 29, name: 'MME', type: 'mme', model_id: 1, plane: 'control'},


    ],
    links: [
      {id: 1, source: 24, target: 1, plane: 'data'},

      {id: 2, source: 21, target: 22, plane: 'data'},
      {id: 3, source: 22, target: 23, plane: 'data'},
      {id: 4, source: 23, target: 24, plane: 'data'},

      // {id: 5, source: 21, target: 25, plane: 'control'},
      // {id: 6, source: 22, target: 26, plane: 'control'},
      // {id: 7, source: 23, target: 27, plane: 'control'},
      // {id: 8, source: 24, target: 28, plane: 'control'},
      // {id: 9, source: 25, target: 26, plane: 'control'},
      // {id: 10, source: 26, target: 29, plane: 'control'},
      // {id: 11, source: 27, target: 28, plane: 'control'},
      // {id: 12, source: 27, target: 29, plane: 'control'},

      {id: 13, source: 210, target: 21, plane: 'data'},

      {id: 14, source: 211, target: 210, plane: 'data'},
    ]
  },
  2: {
    nodes: [
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

      {id: 27, source: 310, target: 31, plane: 'data'},
    ]
  }
};
