angular
  .module('app')
  .config(function($stateProvider: angular.ui.IStateProvider) {
    console.log('MCORD CFG');
    $stateProvider
      .state('xos.mcord', {
        url: 'mcord',
        parent: 'xos',
        abstract: true,
        template: '<div ui-view=></div>'
      })
      .state('xos.mcord.topology', {
        url: '/topology',
        template: '<slicing-topo></slicing-topo>'
      });
  });

import './topology/slicing-services';
import './topology/slicing-directive';