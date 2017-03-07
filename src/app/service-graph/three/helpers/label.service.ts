import {MeshText2D, textAlign} from 'three-text2d';
import {IAxis} from '../interfaces';
export interface IXosLabelService {
  getLabelMesh(label: string, position: IAxis): MeshText2D;
}

export class XosLabelService implements IXosLabelService {

  private labelDefaultColor: string = '#fff';

  public getLabelMesh(label: string, position: IAxis) {
    const mesh = new MeshText2D(label, { align: textAlign.center, font: '30px Arial', fillStyle: this.labelDefaultColor, antialias: true });
    mesh.position.set(position.x || 0, position.y || 0, position.z || 0);
    return mesh;
  }
}
