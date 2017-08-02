import {IXosModelRelation} from '../../views/crud/crud';
export interface IXosState extends angular.ui.IState {
  data: {
    model: string,
    relations?: IXosModelRelation[]
  };
};

export interface IXosRuntimeStatesService {
  addState(name: string, state: ng.ui.IState): void;
}

export function XosRuntimeStates($stateProvider: ng.ui.IStateProvider): ng.IServiceProvider {
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
