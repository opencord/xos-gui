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
import {IXosConfirm} from '../../core/confirm/confirm.service';

export interface IXosNodePositioner {
  positionNodes(svg: {width: number, height: number}, nodes: any[]): ng.IPromise<IXosSgNode[]>;
}

export class XosNodePositioner implements IXosNodePositioner {
  static $inject = [
    '$log',
    '$q',
    'ModelRest',
    'XosConfirm'
  ];

  constructor (
    private $log: ng.ILogService,
    private $q: ng.IQService,
    private ModelRest: IXosResourceService,
    private XosConfirm: IXosConfirm
  ) {
    this.$log.info('[XosNodePositioner] Setup');
  }

  public positionNodes(svg: {width: number, height: number}, nodes: IXosSgNode[]): ng.IPromise<IXosSgNode[]> {

    const d =  this.$q.defer();

    this.getConstraints()
      .then(constraints => {
        const hStep = this.getHorizontalStep(svg.width, constraints);
        const positionConstraints = _.reduce(constraints, (all: any, horizontalConstraint: string | string[], i: number) => {
          // NOTE it's a single element, leave it in the middle
          if (angular.isString(horizontalConstraint)) {
            all[horizontalConstraint] = {
              x: (i + 1) * hStep,
              y: svg.height / 2,
              fixed: true
            };
          }
          else {
            const verticalConstraints = horizontalConstraint;
            const vStep = this.getVerticalStep(svg.height, verticalConstraints);
            _.forEach(verticalConstraints, (verticalConstraint: string, v: number) => {
              if (angular.isString(verticalConstraint)) {
                all[verticalConstraint] = {
                  x: (i + 1) * hStep,
                  y: (v + 1) * vStep,
                  fixed: true
                };
              }
            });
          }
          return all;
        }, {});

        // find the nodes that don't have a position defined and put them at the top
        const allNodes = _.reduce(nodes, (all: string[], n: IXosSgNode) => {
          if (n.type === 'service') {
            all.push(n.data.name);
          }
          return all;
        }, []);
        const positionedNodes = Object.keys(positionConstraints);
        const unpositionedNodes = _.difference(allNodes, positionedNodes);

        _.forEach(unpositionedNodes, (node: string, i: number) => {
          const hStep = this.getHorizontalStep(svg.width, unpositionedNodes);
          positionConstraints[node] = {
            x: (i + 1) * hStep,
            y: svg.height - 50,
            fixed: true
          };
        });

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
        this.XosConfirm.open({
          header: 'Error in graph constraints config',
          text: `
            There was an error in the settings you provided as graph constraints. 
            Please check the declaration of the <code>"Graph Constraints"</code> model. <br/> 
            The error was: <br/><br/>
            <code>${e}</code>
            <br/><br/>
            Please fix it to see the graph.`,
          actions: []
        });
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
