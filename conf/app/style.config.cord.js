angular.module('app')
  .constant('StyleConfig', {
    projectName: 'CORD',
    favicon: 'cord-favicon.png',
    background: 'cord-bg.jpg',
    payoff: 'Your VNF orchestrator',
    logo: 'cord-logo.png',
    routes: [
        {
            label: 'Slices',
            state: 'xos.core.slice'
        },
        {
            label: 'Instances',
            state: 'xos.core.instance'
        },
        {
            label: 'Nodes',
            state: 'xos.core.node'
        }
    ]
});
