
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
import {XosServiceGraphConfig as config} from '../../graph.config';

export interface Id3BBox {
  x?: number;
  y?: number;
  width: number;
  height: number;
}

export interface IXosGraphHelpers {
  parseElemClasses (classes: string): string;
  getBBox(context: any): Id3BBox;
  getSiblingTextBBox(contex: any /* D3 this */): Id3BBox;
  getSiblingIconBBox(contex: any /* D3 this */): Id3BBox;
  getSiblingBBox(contex: any): Id3BBox;
}

export class XosGraphHelpers implements IXosGraphHelpers {
  public parseElemClasses (classes: string): string {
    return angular.isDefined(classes) ? classes.split(' ')
      .map(c => `ext-${c}`)
      .join(' ') : '';
  }

  public getBBox(context: any): Id3BBox {
    return d3.select(context).node().getBBox();
  }

  public getSiblingTextBBox(contex: any): Id3BBox {
    const text: d3.Selection<any> = d3.select(contex.parentNode).select('text');
    return text.empty() ? {width: 0, height: 0} : text.node().getBBox();
  }

  public getSiblingIconBBox(contex: any): Id3BBox {
    return d3.select(contex.parentNode).select('path').node().getBBox();
  }

  public getSiblingBBox(contex: any): Id3BBox {
    // NOTE consider that inside a node we can have 1 text and 1 icon
    const textBBox: Id3BBox = this.getSiblingTextBBox(contex);
    const iconBBox: Id3BBox = this.getSiblingIconBBox(contex);

    return {
      width: iconBBox.width + (textBBox.width ? config.node.padding + textBBox.width : 0),
      height: iconBBox.height
    };
  }
}
