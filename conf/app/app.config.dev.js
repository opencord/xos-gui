angular.module('app')
  .constant('AppConfig', {
    apiEndpoint: 'http://xos.dev:9101/xosapi/v1',
    websocketClient: 'http://xos.dev:3000'
  });
