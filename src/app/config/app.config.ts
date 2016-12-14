/// <reference path="../../../typings/index.d.ts"/>

export interface IAppConfig {
    apiEndpoint: string;
    websocketClient: string;
}

export const AppConfig: IAppConfig = {
    apiEndpoint: 'http://xos.dev:3000/api',
    websocketClient: 'http://xos.dev:3000'
};
