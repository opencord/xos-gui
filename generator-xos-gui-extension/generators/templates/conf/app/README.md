# XOS-GUI Config

### Note: The configurations defined in this folder are for development only, they are most likely to be overridden by a volume mount defined in `service-profile`

## App Config

This configuration will specify the REST API base URL and the WebSocket address.

```
angular.module('app')
  .constant('AppConfig', {
    apiEndpoint: '/xos/api',
    websocketClient: '/'
  });

```

## Style Config

This configuration will contain branding information, such as title, logo and navigation items.

```
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
            state: 'xos.core.slices'
        },
        {
            label: 'Instances',
            state: 'xos.core.instances'
        },
        {
            label: 'Nodes',
            state: 'xos.core.nodes'
        }
    ]
});
```