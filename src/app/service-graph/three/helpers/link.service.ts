import * as THREE from 'three';
import {IAxis} from '../interfaces';
import MeshLambertMaterial = THREE.MeshLambertMaterial;
import Mesh = THREE.Mesh;
export interface IXosLinkService {
  getLinkMesh(source: IAxis, target: IAxis): Mesh;
}

export class XosLinkService implements IXosLinkService {

  private linkRadius: number = 10;
  private linkMaterial: MeshLambertMaterial = new THREE.MeshLambertMaterial( { color: 0x24262d, wireframe: false });

  public getLinkMesh(source: IAxis, target: IAxis): Mesh {

    const cil = new THREE.CylinderGeometry(
      this.linkRadius,
      this.linkRadius,
      source.x - target.x // NOTE this will not work, calculate both ways and in 3d space
    );

    const cilMesh = new THREE.Mesh( cil, this.linkMaterial);

    // NOTE calculate 3d rotation
    cilMesh.rotation.z = (90 * Math.PI) / 180;
    return cilMesh;

    // const line_geometry = new THREE.Geometry();
    // line_geometry.vertices.push(new THREE.Vector3( source.x || 0,  source.y || 0, source.y || 0 ));
    // line_geometry.vertices.push(new THREE.Vector3( target.x || 0,  target.y || 0, target.y || 0 ));
    // const line = new THREE.Line(line_geometry, new THREE.LineBasicMaterial({color: 0xff0000}));
    // return line;
  }
}
