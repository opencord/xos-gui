
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


import * as d3 from 'd3';

export interface Id3BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IXosGraphHelpers {
  parseElemClasses (classes: string): string;
  getSiblingTextBBox(contex: any /* D3 this */): Id3BBox;
}

export class XosGraphHelpers implements IXosGraphHelpers {
  public parseElemClasses (classes: string): string {
    return classes ? classes.split(' ')
      .map(c => `ext-${c}`)
      .join(' ') : '';
  }

  public getSiblingTextBBox(contex: any): Id3BBox {
    return d3.select(contex.parentNode).select('text').node().getBBox();
  }
}
