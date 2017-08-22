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

const formatLinks = (src: string, dst: string) => {
  const source = _.find(epcGraphData.nodes, {id: src});
  const target = _.find(epcGraphData.nodes, {id: dst});

  const sourceId = _.findIndex(epcGraphData.nodes, {id: src});
  const targetId = _.findIndex(epcGraphData.nodes, {id: dst});

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

export interface IEpcData {
  setup(): void;
  get(): IEpcGraphData
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
  }

  public get(): IEpcGraphData {
    return JSON.parse(window.localStorage.getItem('epc-graph'));
  }
}
