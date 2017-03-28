import './ecord-topology.component.scss';
import * as $ from 'jquery';
import * as _ from 'lodash';
import {IXosSidePanelService} from '../../../core/side-panel/side-panel.service';
import {IXosModelStoreService} from '../../../datasources/stores/model.store';
// import {IXosSidePanelService} from '../../../../../../../../../xos-gui/src/app/core/side-panel/side-panel.service';
// import {IXosFormCfg} from '../../../../../../../../../xos-gui/src/app/core/form/form';

const mapStyles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#9ce1fc"},{"visibility":"on"}]}];

const uniFormCfg: any = {
  actions: [
    {
      label: 'Save',
      icon: 'ok',
      class: 'success',
      cb: (item, form) => {
        console.log(item, form);
      }
    }
  ],
  inputs: [
    {
      name: 'type',
      label: 'Type:',
      type: 'select',
      validators: [],
      options: [
        {id: 1, label: 'Leaf'},
        {id: 2, label: 'Root'}
      ]
    },
    {
      name: 'vlan',
      label: 'VLANs:',
      type: 'text',
      validators: []
    },
    {
      name: 'capacity',
      label: 'Capacity:',
      type: 'number',
      validators: []
    },
    {
      name: 'bwpcfgcir',
      label: 'Committed Information Rate:',
      type: 'number',
      validators: []
    },
    {
      name: 'bwpcfgcbs',
      label: 'Committed Burst Size:',
      type: 'number',
      validators: []
    },
    {
      name: 'bwpcfgcir',
      label: 'Excess Information Reate:',
      type: 'bwpcfgeir',
      validators: []
    },
    {
      name: 'bwpcfgebs',
      label: 'Excess Burst Size:',
      type: 'number',
      validators: []
    }
  ],
  formName: 'ecordUniForm'
}

interface IEcordConnection {
  path: [number[]]
}

// NOTE Implement in a Class??
function EcordTopology(
  $log: ng.ILogService,
  NgMap: angular.map.INgMap,
  XosSidePanel: IXosSidePanelService,
  XosModelStore: IXosModelStoreService
) {
  // static $inject = [
  //   'NgMap'
  // ];

  // constructor(
  //   private NgMap: angular.map.INgMap
  // ) {
  // }

  const self = this;
  this.mapStyles = mapStyles;
  this.map;

  XosModelStore.query('UserNetworkInterface', '/metronetwork/usernetworkinterfaces')
    .subscribe(
      (res) => {
        res = _.map(res, (uni) => {
          let co = {
            model: uni
          };
          co['position']= JSON.parse(uni.latlng);
          co['name'] = uni.name;
          return co;
        });
        this.cos = res;
        console.log(`EcordTopology`, res);
      },
      err => {
        $log.error(`[EcordTopology] UserNetworkInterface observable error: `, err);
      }
    );

  this.connections = [];
  this.startPoint = null;
  this.endPoint = null;

  // XosSidePanel.injectComponent('ecordLineSideForm', {ngModel: {}});

  NgMap.getMap()
    .then((map: google.maps.Map) => {
      this.map = map;
      const bounds = new google.maps.LatLngBounds();
      this.cos.forEach(c => {
        const latlng = new google.maps.LatLng(c.position[0], c.position[1]);
        bounds.extend(latlng)
      });
      map.fitBounds(bounds);
      map.setCenter(bounds.getCenter());
    });

  $(window).on('keydown', (e) => {
    this.pressedKey = e.key;
  });

  $(window).on('keyup', (e) => {
    this.pressedKey = null;
  });

  this.markerClick = function (marker, co) {

    if (self.pressedKey && self.pressedKey === 'Alt') {
      XosSidePanel.injectComponent('xosForm', {config: uniFormCfg, ngModel: co.model});
      return;
    }

    const position = [marker.latLng.lat(), marker.latLng.lng()];

    // marker.setIcon('images/co_selected.png');

    if (!self.startPoint) {
      self.startPoint = position;
    }
    else {
      self.endPoint = position;
      self.addLine(self.startPoint, self.endPoint);
      delete self.startPoint;
      delete self.endPoint;
    }
  };

  this.addLine = (start, end) => {
    this.connections.push({
      path: [start, end],
      model: {
        id: this.connections.length + 1,
        type: 'line',
        status: 0 // 0 in progress, 1 done
      }, //define the line
    });
  };

  this.lineClick = function(e, line) {
    XosSidePanel.injectComponent('ecordLineSideForm', {ngModel: line.model});
  };

  this.getLineColor = (status, idx) => {
    if (this.map.shapes && this.map.shapes[idx]) {
      if (parseInt(status, 10) === 1) {
        this.map.shapes[idx].setOptions({strokeColor: 'green'});
      }
    }
    return parseInt(status, 10) === 1 ? 'green' : 'orange';
  }
}

export const ecordTopology: angular.IComponentOptions = {
  template: require('./ecord-topo.component.html'),
  controllerAs: 'vm',
  controller: EcordTopology
};
