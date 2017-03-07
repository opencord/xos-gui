import * as THREE from 'three';
import {IAxis} from '../interfaces';
import MeshLambertMaterial = THREE.MeshLambertMaterial;
import Mesh = THREE.Mesh;
export interface IXosLinkService {
  getLinkMesh(source: IAxis, target: IAxis): Mesh;
}

export class XosLinkService implements IXosLinkService {

  private linkRadius: number = 10;
  private linkMaterial: MeshLambertMaterial = new THREE.MeshLambertMaterial( { color: '#ff0000', wireframe: false });

  public getLinkMesh(source: IAxis, target: IAxis): Mesh {

    const cil = new THREE.CylinderGeometry(
      this.linkRadius,
      this.linkRadius,
      source.x - target.x // NOTE this will not work, calculate both ways and in 3d space
    );

    const cilMesh = new THREE.Mesh( cil, this.linkMaterial);

    // NOTE calculate 3d rotation
    cilMesh.rotation.z = (90 * Math.PI) / 180;

    // NOTE calculate position
    cilMesh.position.x = source.x;
    return cilMesh;
  }
}
