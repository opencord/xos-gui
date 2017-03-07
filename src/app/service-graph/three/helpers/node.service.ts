import * as THREE from 'three';
import Mesh = THREE.Mesh;
import BoxGeometry = THREE.BoxGeometry;
import MeshLambertMaterial = THREE.MeshLambertMaterial;
import {IAxis} from '../interfaces';
import {IXosLabelService} from './label.service';
import {MeshText2D} from 'three-text2d';

export interface IXosServiceMesh {
  node: Mesh;
  label: MeshText2D;
}

export interface IXosNodeService {
  getNodeMeshes(name: string, position?: IAxis, rotation?: IAxis): IXosServiceMesh;
}

export class XosNodeService implements IXosNodeService {

  static $inject = [
    'XosLabelService'
  ];

  private serviceCubeSize: number = 200;

  private serviceGeometry: BoxGeometry = new THREE.BoxGeometry( this.serviceCubeSize, this.serviceCubeSize, this.serviceCubeSize );
  private serviceMaterial: MeshLambertMaterial;

  constructor(
    private XosLabelService: IXosLabelService
  ) {
    // NOTE allow `wireframe` to change this with a key (to debug)
    this.serviceMaterial = new THREE.MeshLambertMaterial( { color: '#f6a821', wireframe: false } );
  }

  public getNodeMeshes(name: string, position?: IAxis, rotation?: IAxis): IXosServiceMesh {
    const node: Mesh = new THREE.Mesh( this.serviceGeometry, this.serviceMaterial);
    if (position) {
      node.position.x = position.x || 0;
      node.position.y = position.y || 0;
      node.position.z = position.z || 0;
    }
    if (rotation) {
      node.rotation.x = rotation.x || 0;
      node.rotation.y = rotation.y || 0;
      node.rotation.z = rotation.z || 0;
    }

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
