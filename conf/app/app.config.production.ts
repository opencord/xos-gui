/// <reference path="../../../typings/index.d.ts"/>

export interface IAppConfig {
    apiEndpoint: string;
    websocketClient: string;
}

export const AppConfig: IAppConfig = {
    apiEndpoint: 'http://xos-rest-gw:3000/api',
    websocketClient: 'http://xos-rest-gw:3000/socket.io/socket.io.js'
};
