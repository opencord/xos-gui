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
import * as pluralize from 'pluralize';
import {IXosModel} from './model-discoverer.service';

export interface IXosModeldefsCache {
  cache(modelDef: IXosModel): void;
  get(modelName: string): IXosModel;
  getApiUrlFromModel(model: IXosModel): string;
  serviceNameFromAppName(appName: string): string;
}

export class XosModeldefsCache implements IXosModeldefsCache {

  private xosModelDefs: IXosModel[] = [];

  public cache(modelDef: IXosModel): void {
    if (!_.find(this.xosModelDefs, m => m.name === modelDef.name)) {
      this.xosModelDefs.push(modelDef);
    }
  }

  public get(modelName: string): IXosModel|null {
    return _.find(this.xosModelDefs, m => m.name === modelName);
  }

  public serviceNameFromAppName(appName: string): string {
    return appName.replace('services.', '');
  }

  public getApiUrlFromModel(model: IXosModel): string {
    // FIXME move pluralize from config to a separate service
    if (model.app === 'core') {
      return `/core/${pluralize(model.name.toLowerCase())}`;
    }
    else {
      const serviceName = this.serviceNameFromAppName(model.app);
      return `/${serviceName}/${pluralize(model.name.toLowerCase())}`;
    }
  }
}
