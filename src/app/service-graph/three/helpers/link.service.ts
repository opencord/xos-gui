import * as THREE from 'three';
import {IAxis} from '../interfaces';
import MeshLambertMaterial = THREE.MeshLambertMaterial;
import Mesh = THREE.Mesh;
import {XosGraphConfig} from '../config';
export interface IXosLinkService {
  getLinkMesh(source: IAxis, target: IAxis): Mesh;
}

export class XosLinkService implements IXosLinkService {

  static $inject = [
    '$log',
  ];

  constructor(
    private $log: ng.ILogService,
  ) {
  }

  private linkRadius: number = XosGraphConfig.links.radius;
  private linkMaterial: MeshLambertMaterial = new THREE.MeshLambertMaterial({color: XosGraphConfig.links.material.color, wireframe: XosGraphConfig.links.material.wireframe});

  public getLinkMesh(source: IAxis, target: IAxis): Mesh {

    // source have to be bottom left
    if (source.x > target.x) {
      const _target = angular.copy(target);
      const _source = angular.copy(source);
      source = _target;
      target = _source;
    }

    // length is an absolute value
    const length = source.x - target.x;

    this.$log.log(`[XosLinkService] Link start from and go to: `, source, target);
    this.$log.log(`[XosLinkService] Link has length: ${length}`);

    const cil = new THREE.CylinderGeometry(
      this.linkRadius,
      this.linkRadius,
      length // NOTE this will not work, calculate both ways and in 3d space
    );

    const cilMesh = new THREE.Mesh( cil, this.linkMaterial);

    // NOTE calculate 3d rotation
    cilMesh.rotation.z = (90 * Math.PI) / 180;

    // NOTE calculate position
    cilMesh.position.x = ((target.x - source.x) / 2) + source.x;
    return cilMesh;
  }
}
