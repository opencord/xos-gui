import * as THREE from 'three';
import PerspectiveCamera = THREE.PerspectiveCamera;
export interface IXosCameraService {
  setup(width: number, height: number, depth: number): PerspectiveCamera;
}

export class XosCameraService implements IXosCameraService {
  public setup(width: number, height: number, depth: number) {
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );
    camera.position.z = depth;
    return camera;
  }
}
