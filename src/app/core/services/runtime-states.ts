import {IXosState} from '../../../index';
export interface IRuntimeStatesService {
  addState(name: string, state: ng.ui.IState): void;
}

export function RuntimeStates($stateProvider: ng.ui.IStateProvider): ng.IServiceProvider {
  this.$get = function($state: ng.ui.IStateService) {
    return {
      addState: function(name: string, state: IXosState) {
        // prevent to add multiple time the same state
        if (!$state.get(name)) {
          $stateProvider.state(name, state);
        }
      }
    };
  };
  return this;
}
