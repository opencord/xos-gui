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

import {TypeState} from 'typestate';
import {IXosGraphStore} from './graph.store';

export interface IXosGraphStateMachine {
  states: GraphStates;
  go(state: GraphStates): void;
  getCurrentState(): number;
}

export enum GraphStates {
  Services,
  ServiceInstances,
  Instances,
  Networks
}

export class XosGraphStateMachine {
  static $inject = [
    '$log',
    '$rootScope',
    'XosGraphStore'
  ];

  private graphStateMachine: TypeState.FiniteStateMachine<GraphStates>;

  constructor(
    private $log: ng.ILogService,
    private $scope: ng.IRootScopeService,
    private XosGraphStore: IXosGraphStore
  ) {
    this.$log.info(`[XosGraphStateMachine] Creating Graph StateMachine`);

    this.graphStateMachine = new TypeState.FiniteStateMachine<GraphStates>(GraphStates.Services);

    // I want to be able to move between any state in the state machine
    this.graphStateMachine.fromAny(GraphStates).toAny(GraphStates);

    this.graphStateMachine.onTransition = (from: GraphStates, to: GraphStates) => {
      this.$log.info(`[XosGraphStateMachine] From ${GraphStates[from]} to ${GraphStates[to]}`);

      const toName = GraphStates[to];

      switch (toName) {
        case 'Services':
          if (from > to) {
            this.removeNetworks();
            this.removeInstances();
            this.removeServiceInstances();
          }
          break;
        case 'ServiceInstances':
          if (from > to) {
            this.removeNetworks();
            this.removeInstances();
          }
          else {
            this.addServiceInstances();
          }
          break;
        case 'Instances':
          if (from > to) {
            this.removeNetworks();
          }
          else {
            this.addServiceInstances();
            this.addInstances();
          }
          break;
        case 'Networks':
          if (from > to) {
            // this will never happen
          }
          else {
            this.addServiceInstances();
            this.addInstances();
            this.addNetworks();
          }
          break;
      }
    };
  }

  public go(state: GraphStates) {
    this.graphStateMachine.go(state);

    this.$scope.$broadcast('xos.sg.stateChange', this.getCurrentState());
  }

  public getCurrentState(): number {
    return this.graphStateMachine.currentState;
  }

  private addServiceInstances() {
    // add service instances to the graph
    this.$log.debug(`[XosGraphStateMachine] Add ServiceInstances`);
    this.XosGraphStore.addServiceInstances();
  }

  private addInstances () {
    // add instances to the graph
    this.$log.debug(`[XosGraphStateMachine] Add Instances`);
    this.XosGraphStore.addInstances();
  }

  private addNetworks () {
    // add networks to the graph
    this.$log.debug(`[XosGraphStateMachine] Add Networks`);
    this.XosGraphStore.addNetworks();
  }

  private removeServiceInstances() {
    // remove service instances to the graph
    this.$log.debug(`[XosGraphStateMachine] Remove ServiceInstances`);
    this.XosGraphStore.removeServiceInstances();
  }

  private removeInstances () {
    // remove instances to the graph
    this.$log.debug(`[XosGraphStateMachine] Remove Instances`);
    this.XosGraphStore.removeInstances();
  }

  private removeNetworks () {
    // remove networks to the graph
    this.$log.debug(`[XosGraphStateMachine] Remove Networks`);
    this.XosGraphStore.removeNetworks();
  }
}
