# XOS-GUI Config

### Note that the configurations defined in this folder are for development only, they are most likely to be overrided by a volume mount defined in `service-profile`

## App Config

This configuration will specifiy the rest API base url and the Websocket address.
Here is it's structure:

```
angular.module('app')
  .constant('AppConfig', {
    apiEndpoint: '/spa/api',
    websocketClient: '/'
  });

```

## Style Config

This configuration will contain branding information, such as title, logo and navigation items.
Here is it's structure:

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