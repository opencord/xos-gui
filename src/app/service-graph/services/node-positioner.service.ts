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
import {IXosResourceService} from '../../datasources/rest/model.rest';
import {IXosSgNode} from '../interfaces';

export interface IXosNodePositioner {
  positionNodes(svg: {width: number, height: number}, nodes: any[]): ng.IPromise<IXosSgNode[]>;
}

export class XosNodePositioner implements IXosNodePositioner {
  static $inject = [
    '$log',
    '$q',
    'ModelRest'
  ];

  constructor (
    private $log: ng.ILogService,
    private $q: ng.IQService,
    private ModelRest: IXosResourceService,
  ) {
    this.$log.info('[XosNodePositioner] Setup');
  }

  public positionNodes(svg: {width: number, height: number}, nodes: any[]): ng.IPromise<IXosSgNode[]> {

    // TODO refactor naming in this loop to make it clearer
    const d =  this.$q.defer();

    this.getConstraints()
      .then(constraints => {
        const hStep = this.getHorizontalStep(svg.width, constraints);
        const positionConstraints = _.reduce(constraints, (all: any, c: string | string[], i: number) => {
          let pos: {x: number, y: number, fixed: boolean} = {
            x: svg.width / 2,
            y: svg.height / 2,
            fixed: true
          };
          // NOTE it's a single element, leave it in the middle
          if (angular.isString(c)) {
            pos.x = (i + 1) * hStep;
            all[c] = pos;
          }
          else {
            const verticalConstraints = c;
            const vStep = this.getVerticalStep(svg.height, verticalConstraints);
            _.forEach(verticalConstraints, (c: string, v: number) => {
              if (angular.isString(c)) {
                let p = angular.copy(pos);
                p.x = (i + 1) * hStep;
                p.y = (v + 1) * vStep;
                all[c] = p;
              }
            });
          }
          return all;
        }, {});

        d.resolve(_.map(nodes, n => {
          return angular.merge(n, positionConstraints[n.data.name]);
        }));
      })
      .catch(e => {
        this.$log.error(`[XosNodePositioner] Error retrieving constraints`, e);
      });

    return d.promise;
  }

  private getConstraints(): ng.IPromise<any[]> {
    const d = this.$q.defer();
    this.ModelRest.getResource('/core/servicegraphconstraints').query().$promise
      .then(res => {
        d.resolve(JSON.parse(res[0].constraints));
      })
      .catch(e => {
        d.reject(e);
      });
    return d.promise;
  }

  private getHorizontalStep(svgWidth: number, constraints: any[]) {
    return svgWidth / (constraints.length + 1);
  }

  private getVerticalStep(svgHeight: number, verticalConstraints: string[]) {
    // NOTE verticalConstraints represent the vertical part (the nested array)
    return svgHeight / (verticalConstraints.length + 1);
  }
}
