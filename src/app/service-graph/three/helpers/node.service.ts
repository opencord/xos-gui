import * as THREE from 'three';
import Mesh = THREE.Mesh;
import {IAxis} from '../interfaces';
import {IXosLabelService} from './label.service';
import {MeshText2D} from 'three-text2d';
import {XosGraphConfig} from '../config';
import SphereGeometry = THREE.SphereGeometry;
import MeshPhongMaterial = THREE.MeshPhongMaterial;

export interface IXosServiceMesh {
  node: Mesh;
  label: MeshText2D;
}

export interface IXosNodeService {
  getNodeMeshes(name: string, position?: IAxis, rotation?: IAxis): IXosServiceMesh;
}

export class XosNodeService implements IXosNodeService {

  static $inject = [
    '$log',
    'XosLabelService'
  ];

  private serviceCubeSize: number = XosGraphConfig.nodes.size;

  // private serviceGeometry: BoxGeometry = new THREE.BoxGeometry( this.serviceCubeSize, this.serviceCubeSize, this.serviceCubeSize );
  private serviceGeometry: SphereGeometry = new THREE.SphereGeometry(this.serviceCubeSize / 2, 50, 50);
  private serviceMaterial: MeshPhongMaterial;

  constructor(
    private $log: ng.ILogService,
    private XosLabelService: IXosLabelService
  ) {
    // NOTE allow `wireframe` to change this with a key (to debug)
    this.serviceMaterial = new THREE.MeshPhongMaterial({ color: XosGraphConfig.nodes.material.color, wireframe: XosGraphConfig.nodes.material.wireframe });
  }

  public getNodeMeshes(name: string, position?: IAxis, rotation?: IAxis): IXosServiceMesh {
    const node: Mesh = new THREE.Mesh( this.serviceGeometry, this.serviceMaterial);

    node.position.x = (position && position.x) ? position.x : 0;
    node.position.y = (position && position.y) ? position.y : 0;
    node.position.z = (position && position.z) ? position.z : 0;
    node.rotation.x = (rotation && rotation.x) ? rotation.x : 0;
    node.rotation.y = (rotation && rotation.y) ? rotation.y : 0;
    node.rotation.z = (rotation && rotation.z) ? rotation.z : 0;
    this.$log.log(`[XosNodeService] Node ${name} is on: `, node.position);

    const label = this.XosLabelService.getLabelMesh(name, {
      x: position.x || 0,
      y: (position.y || 0) + this.serviceCubeSize,
      z: position.z || 0
    });

    return {
      node,
      label
    };
  }
}
