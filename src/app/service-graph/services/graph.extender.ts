
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


import {IXosServiceGraph} from '../interfaces';

export interface IXosServiceGraphReducers {
  coarse: IXosServiceGraphReducer[];
  finegrained: IXosServiceGraphReducer[];
}

export interface IXosServiceGraphReducer {
  name: string;
  reducer: IXosServiceGraphReducerFn;
}

export interface IXosServiceGraphReducerFn {
  (graph: IXosServiceGraph): IXosServiceGraph;
}

export interface IXosServiceGraphExtender {
  register(type: 'coarse' | 'finegrained', name: string, reducer: IXosServiceGraphReducerFn): boolean;
  getCoarse(): IXosServiceGraphReducer[];
  getFinegrained(): IXosServiceGraphReducer[];
}

export class XosServiceGraphExtender implements IXosServiceGraphExtender {

  static $inject = ['$log'];

  private reducers: IXosServiceGraphReducers = {
    coarse: [],
    finegrained: []
  };

  constructor (
    private $log: ng.ILogService
  ) {
  }

  public getCoarse(): IXosServiceGraphReducer[] {
    return this.reducers.coarse;
  }

  public getFinegrained(): IXosServiceGraphReducer[] {
    return this.reducers.finegrained;
  }

  // NOTE
  // as now extender support:
  // - nodes property: x, y, d3Class (applied to the group element)
  // - links propery: d3Class (applied to the line element, there's no group for now)
  public register(type: 'coarse' | 'finegrained', name: string, reducer: IXosServiceGraphReducerFn): boolean {
    this.$log.debug(`[XosServiceGraphExtender] Registering ${name} reducer in ${type} list`);
    this.reducers[type].push({
      name,
      reducer
    });
    return false;
  }
}
