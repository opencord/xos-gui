import {MCordSlicingRest} from './topology/slicing-rest.service';
import {MCordTopo} from './topo/components/mcord-topo.component';
import {MCordSlices} from './topo/services/mcord-slices.service';
import {MCordTopoHelpers} from './topo/services/mcord-topo.helpers';
import {MCordTopoForm} from './topo/services/mcord-topo-form.service';
import {MCordSideForm} from './topo/components/sideForm/mcord-side-form';
import {MCordSlicesData} from './topo/mocks/slices.mock';
import {MCordPublicSafety} from './topo/components/ps-stats/public-safety-stats';
import 'chart.js';
import 'angular-chart.js';
// remove me
import './topology/slicing-services';
import './topology/slicing-directive';
import {MCordServices} from './topo/components/mcord-services/mcord-services';

angular
  .module('mcord', ['chart.js'])
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
      })
      .state('xos.mcord.topodetail', {
        url: '/topology/:sliceId?',
        template: '<mcord-topo></mcord-topo>'
      })
      .state('xos.mcord.ps', {
        url: '/public-safety',
        template: '<mcord-public-safety></mcord-public-safety>'
      })
      .state('xos.mcord.services', {
        url: '/services',
        template: '<mcord-services></mcord-services>'
      });
  })
  .service('MCordSlicingRest', MCordSlicingRest) // remove me
  .value('MCordTopoData', MCordSlicesData)
  .component('mcordTopo', MCordTopo)
  .component('mcordSideForm', MCordSideForm)
  .component('mcordServices', MCordServices)
  .component('mcordPublicSafety', MCordPublicSafety)
  .service('MCordSlices', MCordSlices)
  .service('MCordTopoHelpers', MCordTopoHelpers)
  .service('MCordTopoForm', MCordTopoForm);

