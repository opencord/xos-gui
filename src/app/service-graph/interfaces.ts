interface Id3Element {
  x: number;
  y: number;
  fixed?: boolean;
}

export interface IXosSgNode extends Id3Element {
  id: string;
  data: any; // this can be a Service, ServiceInstance or Instance

  // do we need those?
  type: string;
  d3Class?: string;
}

export interface IXosSgLink {
  id: string;
  type: string;
  source: number;
  target: number;
  data: any; // this can be a ServiceDependency, ServiceInstanceLink or a representation of ServiceInstance.owner_id
}

export interface IXosSgConfig {
  labels: boolean;
}

export interface IXosBaseModel {
  id: number;
  class_names: string;
  name?: string;
  [x: string]: any; // allow extra properties
}

export interface IXosOwnershipLink {
  service: number;
  service_instance: number;
  type: 'ownership';
}
