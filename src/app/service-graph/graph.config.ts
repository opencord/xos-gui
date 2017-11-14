
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
  duration: number;
  force: {
    linkDistance: number;
    charge: number;
    gravity: number;
  };
  node: {
    padding: number;
    radius: number;
    text: number;
  };
  markers: ISvgMarker[];
}

export const XosServiceGraphConfig: IXosServiceGraphConfig = {
  duration: 750,
  force: {
    linkDistance: 80,
    charge: -60,
    gravity: 0.01
  },
  node: {
    padding: 10,
    radius: 2,
    text: 14
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
