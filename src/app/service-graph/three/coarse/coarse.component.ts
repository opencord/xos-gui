import './coarse.component.scss';
import * as $ from 'jquery';
import * as THREE from 'three';
import { MeshText2D, textAlign } from 'three-text2d';
const OrbitControls = require('three-orbit-controls')(THREE);
import {IXosServiceGraphStore} from '../../services/graph.store';
import {IXosDebouncer} from '../../../core/services/helpers/debounce.helper';
import Mesh = THREE.Mesh;
import {IXosCameraService} from '../helpers/camera.service';
import {IXosNodeService, XosNodeService} from '../helpers/node.service';
import {IXosLinkService} from '../helpers/link.service';


class XosCoarseTenancyGraphCtrl {

  static $inject = [
    '$log',
    'XosServiceGraphStore',
    'XosDebouncer',
    'XosCameraService',
    'XosNodeService',
    'XosLinkService'
  ];


  // debounce functions


  constructor (
    private $log: ng.ILogService,
    private XosServiceGraphStore: IXosServiceGraphStore,
    private XosDebouncer: IXosDebouncer,
    private XosCameraService: IXosCameraService,
    private XosNodeService: IXosNodeService,
    private XosLinkService: IXosLinkService
  ) {

  }

  $onInit() {
    const scene = new THREE.Scene();
    const el = $('xos-coarse-tenancy-graph');

    const camera = this.XosCameraService.setup(el.width(), el.height(), 800);

    // renderer

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize( el.width(), el.height() );

    // cubes
    const services = [
      {
        label: 'vOLT',
        position: {
          x: -200
        }
      },
      {
        label: 'vSG',
        position: {
          x: 200
        }
      }
    ];

    const links = [
      {
        source: {x: -100},
        target: {x: 100}
      }
    ];

    const labels = [];

    services.forEach(s => {
      const mesh = this.XosNodeService.getNodeMeshes(s.label, s.position);
      scene.add(mesh.node);
      scene.add(mesh.label);
      labels.push(mesh.label);
    });

    links.forEach(l => {
      const link = this.XosLinkService.getLinkMesh(l.source, l.target);
      scene.add(link);
    });

    // lights
    const light = new THREE.AmbientLight( 0x404040, 1.0 ); // soft white light
    scene.add( light );
    // this light actually add shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(0.0, 0.0, 10.0);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera);
    controls.addEventListener( 'change', () => {
      labels.forEach(l => {
        l.lookAt(camera.position);
      });
      renderer.render( scene, camera );
    });

    el.append( renderer.domElement );
    renderer.render( scene, camera );
  }

  $onDestroy() {

  }

}

export const XosCoarseTenancyGraph: angular.IComponentOptions = {
  template: require('./coarse.component.html'),
  controllerAs: 'vm',
  controller: XosCoarseTenancyGraphCtrl,
};
