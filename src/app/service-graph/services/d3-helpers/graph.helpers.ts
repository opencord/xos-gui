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
