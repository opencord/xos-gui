export interface IXosServiceModel {
  id: number;
  d3Id?: string;
  backend_status: string;
  kind: string;
  name: string;
  service_specific_attributes: string; // this is json stringified
}

export interface IXosTenantModel {
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
  tenants: IXosTenantModel[];
}

export interface IXosFineGrainedGraphData extends IXosCoarseGraphData {
  subscribers: IXosServiceModel[];
  networks: IXosTenantModel[];
}

export interface IXosServiceGraphNodeBadge {
  type: 'info'|'success'|'warning'|'danger';
  text: string;
}

export interface IXosServiceGraphNode {
  id: number | string;
  label: string;
  x?: number;
  y?: number;
  px?: number;
  py?: number;
  badge?: IXosServiceGraphNodeBadge;
  model: IXosServiceModel;
  type: 'service' | 'tenant' | 'network' | 'subscriber';
}

export interface IXosServiceGraphLink {
  id: number | string;
  source: number;
  target: number;
  model: IXosTenantModel;
}

export interface IXosServiceGraph {
  nodes: IXosServiceGraphNode[];
  links: IXosServiceGraphLink[];
}
