/// <reference path="../../../typings/index.d.ts"/>

export interface IAppConfig {
    apiEndpoint: string;
    websocketClient: string;
}

export const AppConfig: IAppConfig = {
    apiEndpoint: '/api',
    websocketClient: ''
};
