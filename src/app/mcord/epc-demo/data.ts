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

import * as _ from 'lodash';
import * as $ from 'jquery';

const formatLinks = (src: string, dst: string, data = epcGraphData) => {
  const source = _.find(data.nodes, {id: src});
  const target = _.find(data.nodes, {id: dst});

  const sourceId = _.findIndex(data.nodes, {id: src});
  const targetId = _.findIndex(data.nodes, {id: dst});

  return {
    id: `${source.id}~${target.id}`,
    source: sourceId,
    target: targetId,
  }
};

export interface IEpcGraphData {
  nodes: any[],
  links: any[]
}

export const epcGraphData: IEpcGraphData = {
  nodes: [
    {
      id: 'ue-1',
      label: 'UE 1',
      type: 'ue'
    },
    {
      id: 'ue-2',
      label: 'UE 2',
      type: 'ue'
    },
    {
      id: 'ue-3',
      label: 'UE 3',
      type: 'ue'
    },
    {
      id: 'ue-4',
      label: 'UE 4',
      type: 'ue'
    },
    {
      id: 'profile-1',
      label: 'Profile 1',
      type: 'profile'
    },
    {
      id: 'profile-2',
      label: 'Profile 2',
      type: 'profile'
    },
    {
      id: 'profile-3',
      label: 'Profile 3',
      type: 'profile'
    },
    // {
    //   id: 'enodeb-1',
    //   label: 'ENodeB 1',
    //   type: 'enodeb'
    // },
    // {
    //   id: 'enodeb-2',
    //   label: 'ENodeB 2',
    //   type: 'enodeb'
    // },
    // {
    //   id: 'enodeb-3',
    //   label: 'ENodeB 3',
    //   type: 'enodeb'
    // },
    {
      id: 'epc-1',
      label: 'EPC 1',
      type: 'epc'
    },
    {
      id: 'epc-2',
      label: 'EPC 2',
      type: 'epc'
    },
    {
      id: 'epc-3',
      label: 'EPC 3',
      type: 'epc'
    },
    {
      id: 'network-1',
      label: 'Internet',
      type: 'network'
    }
  ],
  links: [] // defined below
};

epcGraphData.links = [
  formatLinks('ue-1', 'profile-1'),
  formatLinks('ue-2', 'profile-1'),
  formatLinks('ue-3', 'profile-2'),
  formatLinks('ue-4', 'profile-3'),
  formatLinks('profile-1', 'epc-1'),
  formatLinks('profile-2', 'epc-2'),
  formatLinks('profile-3', 'epc-3'),
  formatLinks('epc-1', 'network-1'),
  formatLinks('epc-2', 'network-1'),
  formatLinks('epc-3', 'network-1'),
];

const fieldOrderByType = {
  profile: [
    'label',
    'UlAllocRBRate',
    'DlAllocRBRate',
    'LinkAggregation',
    'DlWifiRate',
    'DlUeAllocRbRate',
    'SubsProfile'
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
    UlAllocRBRate: {
      label: 'UL RB allocation',
      type: 'number'
    },
    DlAllocRBRate: {
      label: 'DL RB allocation',
      type: 'number'
    },
    LinkAggregation: {
      label: 'Link Aggregation',
      type: 'boolean'
    },
    DlWifiRate: {
      label: 'Wifi Rate',
      type: 'number'
    },
    DlUeAllocRbRate: {
      label: 'DlUeAllocRbRate',
      type: 'number'
    },
    SubsProfile: {
      label: 'Substiture Profile',
      type: 'select',
      options: [{id: 1, label: 'Profile 1'}]
    }
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
  get(): IEpcGraphData;
  fieldsByType(type: string): any;
  orderByType(type: string): any;
  updateNode(id: string, model: any): any;
  addLink(src: string, dst: string): void;
  removeLink(id: string): void;
  getOnosCfg(): any;
  setOnosCfg(cfg: any): any;
}

export class EpcData implements IEpcData{
  constructor () {

  }

  public setup():void {
    const existingData = window.localStorage.getItem('epc-graph');
    if (!existingData) {
      // store the data only if they are not there
      window.localStorage.setItem('epc-graph', JSON.stringify(epcGraphData));
    }

    $('body').on('keydown', (e) => {
      if(e.key === 'r') {
        window.localStorage.removeItem('epc-graph');
        window.location.reload();
      }
    });
  }

  public get(): IEpcGraphData {
    return JSON.parse(window.localStorage.getItem('epc-graph'));
  }

  public updateNode(id: string, model: any): any {
    const data = this.get();
    data.nodes = _.unionBy([model], data.nodes, 'id');
    window.localStorage.setItem('epc-graph', JSON.stringify(data));
  }

  public fieldsByType(type: string): any {
    return formFieldsPerModelType[type] || {};
  }

  public orderByType(type: string): any {
    return fieldOrderByType[type] || undefined;
  }

  public addLink(src: string, dst: string): void {
    const data = this.get();
    const link = formatLinks(src, dst, data);
    data.links = _.unionBy([link], data.links, 'id');
    window.localStorage.setItem('epc-graph', JSON.stringify(data));
  }

  public removeLink(id: string): void {
    const data = this.get();
    _.remove(data.links, {id: id});
    window.localStorage.setItem('epc-graph', JSON.stringify(data));
  }

  public getOnosCfg(): any {
    return JSON.parse(window.localStorage.getItem('epc-onos-cfg'));
  }

  public setOnosCfg(cfg: any): any {
    window.localStorage.setItem('epc-onos-cfg', JSON.stringify(cfg))
  }
}
