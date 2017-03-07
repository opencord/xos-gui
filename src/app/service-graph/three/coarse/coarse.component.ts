import './coarse.component.scss';
import * as $ from 'jquery';
import * as THREE from 'three';
import * as _ from 'lodash';
import { MeshText2D} from 'three-text2d';
const OrbitControls = require('three-orbit-controls')(THREE);
import {IXosServiceGraphStore} from '../../services/graph.store';
import {IXosDebouncer} from '../../../core/services/helpers/debounce.helper';
import {IXosCameraService} from '../helpers/camera.service';
import {IXosNodeService} from '../helpers/node.service';
import {IXosLinkService} from '../helpers/link.service';
import WebGLRenderer = THREE.WebGLRenderer;
import Scene = THREE.Scene;
import Camera = THREE.Camera;
import DirectionalLight = THREE.DirectionalLight;
import {Subscription} from 'rxjs';
import {IGraphPositionerService} from '../services/positioner';
import IOrbitControls = THREE.OrbitControls;
import {min} from 'rxjs/operator/min';


class XosCoarseTenancyGraphCtrl {

  static $inject = [
    '$log',
    'XosServiceGraphStore',
    'GraphPositionerService',
    'XosDebouncer',
    'XosCameraService',
    'XosNodeService',
    'XosLinkService'
  ];

  private GraphSubscription: Subscription;

  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: Camera;
  private labels: MeshText2D[] = [];
  private directionalLight: DirectionalLight;
  private orbitControls: IOrbitControls;

  constructor (
    private $log: ng.ILogService,
    private XosServiceGraphStore: IXosServiceGraphStore,
    private GraphPositionerService: IGraphPositionerService,
    private XosDebouncer: IXosDebouncer,
    private XosCameraService: IXosCameraService,
    private XosNodeService: IXosNodeService,
    private XosLinkService: IXosLinkService
  ) {

  }

  $onInit() {
    this.createScene();

    this.GraphSubscription = this.XosServiceGraphStore.getGraphData()
      .subscribe(
        (res) => {
          // id there are no data, do nothing
          if (res.services.length === 0 && res.tenants.length === 0) {
            return;
          }

          // removing non-coarse tenants
          res.tenants = res.tenants.filter(t => t.kind === 'coarse');

          let graph = this.GraphPositionerService.position(res);

          this.renderServices(graph.nodes);
          this.renderLinks(graph.links);

          this.pointCameraToCenter(graph.nodes);

          this.renderer.render( this.scene, this.camera );

          this.$log.debug(`[XosCoarseTenancyGraph] Coarse Event and render`, res);
        },
        err => {
          this.$log.error(`[XosCoarseTenancyGraph] Coarse Event error`, err);
        });

    this.renderer.render( this.scene, this.camera );

  }

  $onDestroy() {
  }

  private createScene() {
    this.scene = new THREE.Scene();
    const el = $('xos-coarse-tenancy-graph');

    this.camera = this.XosCameraService.setup(el.width(), el.height(), 800);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor( 0x000000, 0 );
    this.renderer.setSize( el.width(), el.height() );

    // setup orbit controls
    this.orbitControls = new OrbitControls(this.camera, el[0]);

    this.orbitControls.addEventListener( 'change', () => {
      this.labels.forEach(l => {
        l.lookAt(this.camera.position);
      });
      this.directionalLight.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      this.renderer.render( this.scene, this.camera );
    });

    el.append( this.renderer.domElement );

    this.addLight();
  }

  private addLight() {
    const light = new THREE.AmbientLight( 0x404040, 1.0 ); // soft white light
    this.scene.add( light );
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.directionalLight.position.set(0.0, 0.0, 10.0);
    this.scene.add(this.directionalLight);
  }

  private renderServices(services) {
    services.forEach(s => {
      const mesh = this.XosNodeService.getNodeMeshes(s.name, s.position);
      this.scene.add(mesh.node);
      this.scene.add(mesh.label);
      this.labels.push(mesh.label);
    });
  }

  private renderLinks(links) {
    links.forEach(l => {
      const link = this.XosLinkService.getLinkMesh(l.source, l.target);
      this.scene.add(link);
    });
  }

  private pointCameraToCenter(nodes) {
    const maxX = _.maxBy(nodes, n => n.position.x).position.x + 200;
    const maxY = _.maxBy(nodes, n => n.position.y).position.y + 200;
    const maxZ = _.maxBy(nodes, n => n.position.z).position.z;
    console.log(maxX, maxY, maxZ);

    const minX = _.minBy(nodes, n => n.position.x).position.x;
    const minY = _.minBy(nodes, n => n.position.y).position.y;
    const minZ = _.minBy(nodes, n => n.position.z).position.z - 200;
    console.log(minX, minY, minZ);

    const x = (maxX - minX) / 2;
    const y = (maxY - minY) / 2;
    const z = (maxZ - minZ) / 2;

    console.log(x, y, z);

    this.orbitControls.target.set(x, y, z);
    this.camera.position.set(x - 100, y, 1000);
  }
}

export const XosCoarseTenancyGraph: angular.IComponentOptions = {
  template: require('./coarse.component.html'),
  controllerAs: 'vm',
  controller: XosCoarseTenancyGraphCtrl,
};
