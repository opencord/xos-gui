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
        parent: 'xos.mcord'
      },
      {
        label: 'Public Safety',
        state: 'xos.mcord.topodetail',
        params: {sliceId: 1},
        parent: 'xos.mcord'
      },
      {
        label: 'RAN',
        state: 'xos.mcord.topodetail',
        params: {sliceId: '2,3'},
        parent: 'xos.mcord'
      },
      {
        label: 'Connectionless GW',
        state: 'xos.mcord.topodetail',
        params: {sliceId: 4},
        parent: 'xos.mcord'
      },
    ]
  });

