/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import './xran.scss';
import * as $ from 'jquery';
import {IXRanSvg} from './xran.svg';

class MCordXranController {

  static $inject = [
    '$http',
    '$q',
    'XRanSvg',
    '$uibModal'
  ];

  public config = {
    association: 'signal',
    logic: false
  };

  public gauges = {
    left: 90,
    right: 0
  };

  public resources = {
    left: [100],
    right: [100]
  };

  constructor (
    private $http: ng.IHttpService,
    private $q: ng.IQService,
    private XRanSvg: IXRanSvg,
    private uibModal: any
  ) {
    const svg = $('svg#xran');
    XRanSvg.render(svg);

    $('body').on('keydown', (e) => {
      const t = e.target.tagName.toLowerCase();
      if(e.key === 'c') {
        this.showConfigModal();
      }
    });
  }

  public setAssociation(type: string) {
    this.config.association = type;
    switch (type) {
      case 'signal':
        this.sendHandoffReq(this.getXranCfg().enodeb1)
        this.gauges.left = 90;
        this.gauges.right = 0;
        this.XRanSvg.moveLink(3, 1, 0);
        break;
      case 'load':
        this.sendHandoffReq(this.getXranCfg().enodeb2) // TODO add then
        this.gauges.left = 61;
        this.gauges.right = 43;
        this.XRanSvg.moveLink(3, 0, 1);
        break;
    }
  }

  public setLogic(active: boolean) {
    this.config.logic = active;
    if (active) {
      this.sendPolicyReq('shared') // TODO add then
      this.XRanSvg.setBarHeight(50, 50);
    }
    else {
      this.sendPolicyReq('full') // TODO add then
      this.XRanSvg.setBarHeight(100, 100);
    }
  }

  private sendHandoffReq(id: any) {
    const onosIp = this.getXranCfg().onosAddress;
    const d = this.$q.defer();

    console.log(`Sending handoff request to: ${`${onosIp}/onos/xran/links/${id}`}`);

    this.$http.patch(`http://${onosIp}/onos/xran/links/${id}`, {type:"serving/primary"})
      .then(res => {
        console.info(res);
        d.resolve(res);
      })
      .catch(e => {
        console.error(e);
      });
    return d.promise;
  }

  private sendPolicyReq(type: 'full' | 'shared') {
    let start =0, end;
    if (type === 'full') {
      end = 99;
    }
    else {
      end = 49;
    }

    const onosIp = this.getXranCfg().onosAddress;
    const d = this.$q.defer();
    const id_left = this.getXranCfg().enodeb1;
    const id_right = this.getXranCfg().enodeb1;
    this.$q.all([
      this.$http.patch(`http://${onosIp}/onos/xran/links/${id_left}`, {RRMConf:{start_prb_dl: start, end_prb_dl: end}}),
      this.$http.patch(`http://${onosIp}/onos/xran/links/${id_right}`, {RRMConf:{start_prb_dl: start, end_prb_dl: end}})
    ])
      .then(res => {
        console.info(res);
        d.resolve(res);
      })
      .catch(e => {
        console.error(e);
      });
    return d.promise;
  }

  private getXranCfg(): any {
    return JSON.parse(window.localStorage.getItem('xran-cfg')) || {};
  }

  private showConfigModal(): void {
    const self = this;
    const modalInstance = this.uibModal.open({
      templateUrl: 'onosModal.html',
      controller: function($uibModalInstance, McordEpcData) {
        this.xranCfg = self.getXranCfg();
        this.config = {
          fields: {
            onosAddress: {
              label: 'ONOS Address',
              type: 'text'
            },
            refresRate: {
              label: 'Refres Rate (s)',
              type: 'number'
            },
            enodeb1: {
              label: 'CELL ECI (left)',
              type: 'string'
            },
            enodeb2: {
              label: 'CELL ECI (left)',
              type: 'string'
            }
          },
          actions: [
            {
              label: 'Save',
              class: 'success',
              icon: 'check',
              cb: (model) => {
                window.localStorage.setItem('xran-cfg', JSON.stringify(model));
                $uibModalInstance.close();
              }
            },
            {
              label: 'Cancel',
              class: 'danger',
              icon: 'remove',
              cb: (model) => {
                $uibModalInstance.dismiss('cancel');
              }
            }
          ]
        };
      },
      controllerAs: '$ctrl',
      size: 'sm',
    });
  }
}

export const mcordXran: angular.IComponentOptions = {
  template: require('./xran.component.html'),
  controller: MCordXranController,
  controllerAs: 'vm'
};