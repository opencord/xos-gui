import {IXosState} from '../../../index';
export interface IRuntimeStatesService {
  addState(name: string, state: angular.ui.IState): void;
}

export function RuntimeStates($stateProvider: angular.ui.IStateProvider): angular.IServiceProvider {
  this.$get = function($state: angular.ui.IStateService) { // for example
    return {
      addState: function(name: string, state: IXosState) {
        $stateProvider.state(name, state);
      }
    };
  };
  return this;
}
