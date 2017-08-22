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


// Example EPC Config:
//   - label: test
//     ip: 127.0.0.1
//   - label: second
//     ip: 127.0.0.2

import * as _ from 'lodash';
import * as $ from 'jquery';
import * as YAML from 'js-yaml';

export interface IEpcGraphData {
  nodes: any[],
  links: any[]
}

const networks: any[] = [
    {
      id: 'network-1',
      label: 'Internet',
      type: 'network'
    }
  ];

const fieldOrderByType = {
  profile: [
    'UlAllocRBRate',
    'DlAllocRBRate',
    // 'LinkAggregation',
    'DlWifiRate',
  ]
};

const formFieldsPerModelType = {
  ue: {
    imsi: {
      label: 'IMSI',
      type: 'text'
    }
  },
  profile: {
  },
  epc: {
    IPAddr: {
      label: 'MME Ip',
      type: 'text'
    }
  }
};

export interface IEpcData {
  setup(): void;
  loadData(): Promise<any>
  get(): IEpcGraphData;
  fieldsByType(type: string): any;
  orderByType(type: string): any;
  updateNode(id: string, model: any): any;
  addLink(src: string, dst: string): void;
  removeLink(id: string): void;
  getOnosCfg(): any;
  setOnosCfg(cfg: any): any;
  getEpcCfg(): any;
  setEpcCfg(cfg: any): any;
}

export class EpcData implements IEpcData{

  static $inject = [
    '$http',
    '$q'
  ];

  public excludedFields = ['x', 'y', 'px', 'py', 'weight', 'id', 'type', 'fixed', 'index', 'IMSIRuleArray', 'ProfileArray'];
  public epcGraphData: IEpcGraphData = {
    nodes: [],
    links: []
  };

  constructor (
    private $http: ng.IHttpService,
    private $q: ng.IQService
  ) {

  }

  public setup():void {

  }

  public get(): IEpcGraphData {
    return this.epcGraphData;
  }

  public updateNode(id: string, model: any): any {

    const onosIp = this.getOnosCfg().onosAddress;

    let progranUrl;
    switch (model.type) {
      case 'profile':
        progranUrl = '/onos/progran/profile';
        break;
      case 'ue':
        progranUrl = '/onos/progran/imsi';
        break;
    }

    if (!progranUrl) {
      console.warn(`Type ${model.type} does not have an associated request`);
    }

    const req = this.prepareReq(model);

    this.$http.post(`http://${onosIp}${progranUrl}`, req)
      .then(res => {
        const data = this.get();
        data.nodes = _.unionBy([model], data.nodes, 'id');
      })
      .catch(err => {
        console.error(err)
      });

  }

  public fieldsByType(type: string): any {
    return formFieldsPerModelType[type] || {};
  }

  public orderByType(type: string): any {
    return fieldOrderByType[type] || undefined;
  }

  public addLink(src: any, dst: any): void {

    const data = this.get();
    const link = this.formatLinks(src.id, dst.id, data);
    const onosIp = this.getOnosCfg().onosAddress;

    let progranUrl, req;
    if (src.type === 'enodeb') {
      progranUrl =  `/onos/progran/enodeb/${src.label}/profile`;
      req = {
        "ProfileArray" :[
          dst.label
        ]
      };
    }

    if (src.type === 'imsi') {
      // FIXME this return 405
      progranUrl =  `/onos/progran/profile/${dst.Name}/imsi`;
      req = {
        "IMSIRuleArray" : [
          src.IMSI
        ]
      }
    }

    if (src.type === 'profile') {

      if (!src.MMECfg || !src.MMECfg.IPAddr) {
        return
      }

      progranUrl =  `/onos/progran/profile`;
      req = src;
      src.MMECfg.IPAddr = dst.ip;
    }

    if (!progranUrl) {
      console.warn(`Add Link ${link.id} does not have an associated request`);
      return
    }

    this.$http.put(`http://${onosIp}${progranUrl}`, req)
      .then(res => {
        data.links = _.unionBy([link], data.links, 'id');
      })
      .catch(err => {
        console.error(err);
      });

  }

  public removeLink(link: any): void {
    const onosIp = this.getOnosCfg().onosAddress;
    let progranUrl;
    if (link.id.indexOf('ue') > -1) {
        progranUrl = `/api/profile/${link.target.label}/${link.source.imsi}`;
    }

    if (link.id.indexOf('enodeb') > -1) {
      progranUrl = `/api/enodeb/${link.source.label}/${link.target.label}`;
    }

    if (!progranUrl) {
      console.warn(`Remove Link ${link.id} does not have an associated request`);
    }
    this.$http.delete(`http://${onosIp}${progranUrl}`)
      .then(res => {
        const data = this.get();
        _.remove(data.links, {id: link.id});
        window.localStorage.setItem('epc-graph', JSON.stringify(data));
      })
      .catch(err => {
        console.error(err)
      });
  }

  public getOnosCfg(): any {
    return JSON.parse(window.localStorage.getItem('epc-onos-cfg'));
  }

  public setOnosCfg(cfg: any): any {
    window.localStorage.setItem('epc-onos-cfg', JSON.stringify(cfg))
  }

  public loadData(): Promise<any> {
    const onosIp = this.getOnosCfg().onosAddress;
    const d = this.$q.defer();
    this.$q.all({
      imsi: this.$http.get(`http://${onosIp}/onos/progran/imsi`),
      enodeb: this.$http.get(`http://${onosIp}/onos/progran/enodeb`),
      profile: this.$http.get(`http://${onosIp}/onos/progran/profile`)
    })
      .then(res => {
        let data = {};
        _.forEach(Object.keys(res), k => {
          data[k] = res[k].data;
        });

        data['imsi'] = data['imsi'].ImsiArray;
        data['profile'] = data['profile'].ProfileArray;
        data['enodeb'] = data['enodeb'].EnodeBArray;
        return this.parseProgranData(data);
      })
      .then(data => {
        d.resolve(data);
      })
      .catch(err => {
        d.reject(err);
      });
    return d.promise;
  }

  private parseProgranData(data: any): IEpcGraphData {
    const epcs = YAML.safeLoad(this.getEpcCfg()).map((e, i) => {
      e.id = `epc~${e.ip}`;
      e.type = 'epc';
      return e;
    });

    this.epcGraphData.nodes = [].concat(networks).concat(epcs);
    this.epcGraphData.links = [];
    // adding nodes
    _.forEach(Object.keys(data), k => {
      _.forEach(data[k], i => {
        i['type'] = k;
        switch (k) {
          case 'imsi':
            i['id'] = `${k}~${i.IMSI}`;
            break;
          case 'profile':
            i['id'] = `${k}~${i.Name}`;
            break;
          case 'enodeb':
            i['id'] = `${k}~${i.eNBId}`;
            break;
        }
        this.epcGraphData.nodes.push(i);
      });
    });

    // adding links
    _.forEach(this.epcGraphData.nodes, n => {
      switch (n.type) {
        case 'imsi':
          break;
        case 'epc':
          const dst = `network-1`;
          const l = this.formatLinks(n.id, dst);
          this.epcGraphData.links.push(l);
          break;
        case 'profile':
          // profile to imsi
          _.forEach(n.IMSIRuleArray, p => {
            const dst = `imsi~${p}`;
            const l = this.formatLinks(n.id, dst);
            this.epcGraphData.links.push(l);
          });

          // profile to epc
          if (n.MMECfg && n.MMECfg.IPAddr) {
            const dst = `epc~${n.MMECfg.IPAddr}`;
            const l = this.formatLinks(n.id, dst);
            this.epcGraphData.links.push(l);
          }
          break;
        case 'enodeb':
          _.forEach(n.ProfileArray, p => {
            const dst = `profile~${p}`;
            const l = this.formatLinks(n.id, dst);
            this.epcGraphData.links.push(l);
          });
          break;
      }
    })

    return this.epcGraphData;
  }

  private prepareReq(model: any): any {
    const req = {};
    _.forEach(Object.keys(model), (f) => {
      if (this.excludedFields.indexOf(f) === -1) {
        req[f] = model[f];
      }
    });
    return req;
  }

  private formatLinks(src: string, dst: string, data = this.epcGraphData) {
    const source = _.find(data.nodes, {id: src});
    const target = _.find(data.nodes, {id: dst});

    if (!source || !target) {
      console.info(`Cannot find node with id: ${src} or ${dst}`);
    }

    const sourceId = _.findIndex(data.nodes, {id: src});
    const targetId = _.findIndex(data.nodes, {id: dst});


    return {
      id: `${source.id}~${target.id}`,
      source: sourceId,
      target: targetId,
    }
  };

  public getEpcCfg(): any {
    return window.localStorage.getItem('epc-cfg');
  }

  public setEpcCfg(cfg: any): any {
    window.localStorage.setItem('epc-cfg', cfg)
  }
}
