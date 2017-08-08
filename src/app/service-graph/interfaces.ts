
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


interface Id3Element {
  d3Class?: string;
  d3Id?: string;
}

export interface IXosServiceModel {
  id: number;
  d3Id?: string;
  backend_status: string;
  kind: string;
  name: string;
  class_names: string;
  service_specific_attributes: string; // this is json stringified
}

export interface IXosTenantModel extends Id3Element {
  id: number;
  d3Id?: string;
  backend_status: string;
  kind: string;

  // source
  provider_service_id: number;

  // destination
  subscriber_service_id: number;
  subscriber_tenant_id: number;
  subscriber_root_id: number;
  subscriber_network_id: number;

  subscriber_user_id: number;

  // extra informations
  service_specific_id: string;
  service_specific_attribute: string;
  connect_method: string;

  // reverse of subscriber tenants
  subscribed_tenants_ids: number[];
}

export interface IXosCoarseGraphData {
  services: IXosServiceModel[];
  servicedependencies: any[];
}

// TODO outdated, remove
export interface IXosFineGrainedGraphData extends IXosCoarseGraphData {
  tenants: IXosTenantModel[];
  subscribers: any[];
  networks: any[];
}

export interface IXosServiceInstanceGraphData {
  serviceGraph: IXosServiceGraph;
  serviceInstances: any[];
  serviceInstanceLinks: any[];
  networks: any[];
}

export interface IXosServiceGraphNodeBadge {
  type: 'info'|'success'|'warning'|'danger';
  text: string;
}

export interface IXosServiceGraphNode extends Id3Element {
  id: number | string;
  label: string;
  x?: number;
  y?: number;
  px?: number;
  py?: number;
  width?: number;
  height?: number;
  fixed?: boolean;
  badge?: IXosServiceGraphNodeBadge; // TODO implement badges
  model: IXosServiceModel;
  type: 'service' | 'tenant' | 'network' | 'subscriber';
}

export interface IXosServiceGraphLink extends Id3Element {
  id: string;
  source: number;
  target: number;
  model: IXosTenantModel;
}

export interface IXosServiceGraph {
  nodes: IXosServiceGraphNode[];
  links: IXosServiceGraphLink[];
}
