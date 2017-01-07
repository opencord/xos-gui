import {MCordSlicingRest} from './topology/slicing-rest.service';
import {MCordTopo} from './topo/components/mcord-topo.component';
import {MCordSlices} from './topo/services/mcord-slices.service';
import {MCordTopoHelpers} from './topo/services/mcord-topo.helpers';
import {MCordTopoForm} from './topo/services/mcord-topo-form.service';

// TODO create separate module
angular
  .module('app')
  .config(function($stateProvider: angular.ui.IStateProvider) {
    $stateProvider
      .state('xos.mcord', {
        url: 'mcord',
        parent: 'xos',
        abstract: true,
        template: '<div ui-view=></div>'
      })
      .state('xos.mcord.topology', {
        url: '/topology-bk',
        template: '<slicing-topo></slicing-topo>'
      })
      .state('xos.mcord.topo', {
        url: '/topology',
        template: '<mcord-topo></mcord-topo>'
      });
  })
  .service('MCordSlicingRest', MCordSlicingRest) // remove me
  .component('mcordTopo', MCordTopo)
  .service('MCordSlices', MCordSlices)
  .service('MCordTopoHelpers', MCordTopoHelpers)
  .service('MCordTopoForm', MCordTopoForm);

// remove me
import './topology/slicing-services';
import './topology/slicing-directive';
