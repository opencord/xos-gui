angular.module('app')
  .constant('StyleConfig', {
    projectName: 'M-CORD',
    favicon: 'cord-favicon.png',
    background: 'mcord-bg.jpg',
    payoff: 'Your way toward 5G',
    logo: 'cord-logo.png',
    routes: [
      {
        label: 'Slices',
        state: 'xos.core.slices'
      },
      {
        label: 'Instances',
        state: 'xos.core.instances'
      },
      {
        label: 'Nodes',
        state: 'xos.core.nodes'
      },
      {
        label: 'Users',
        state: 'xos.core.users'
      },
      {
        label: 'Services',
        state: 'xos.mcord.services',
        // parent: 'xos.mcord'
      },
      {
        label: 'MCORD',
        state: 'xos.mcord'
      },
      {
        label: 'Global Topology',
        state: 'xos.mcord.topo',
        params: {sliceId: ''},
        parent: 'xos.mcord'
      },
      {
        label: 'Public Safety',
        state: 'xos.mcord.topo',
        params: {sliceId: 1},
        parent: 'xos.mcord'
      },
      {
        label: 'RAN Slicing',
        state: 'xos.mcord.topo',
        params: {sliceId: '3,4'},
        parent: 'xos.mcord'
      },
      {
        label: 'Connectionless GW',
        state: 'xos.mcord.topo',
        params: {sliceId: 2},
        parent: 'xos.mcord'
      },
    ]
  });

