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
  x: number;
  y: number;
  fixed?: boolean;
}

export interface IXosSgNode extends Id3Element {
  id: string;
  data: IXosBaseModel; // this can be a Service, ServiceInstance or Instance

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
