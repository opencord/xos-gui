angular.module('app')
  .constant('AppConfig', {
    apiEndpoint: 'http://localhost:8888/api',
    websocketClient: 'http://localhost:8888'
  });

// note use ssh -L 8888:192.168.121.129:3000 svavilap@128.104.222.198 to tunnel the api proxy